import type { LiveComponent, LiveElement } from '@use-gpu/live';
import type { StorageSource, TextureSource } from '@use-gpu/core';
import type { Light, BoundLight } from './types';

import { provide, capture, yeet, signal, makeCapture, useCallback, useCapture, useMemo, useOne, useRef, useResource, incrementVersion } from '@use-gpu/live';
import {
  makeIdAllocator,
  makeUniformLayout, makeLayoutData, makeLayoutFiller,
  makeStorageBuffer, uploadBuffer, uploadBufferRange,
  makeAtlas, makeTexture, seq,
} from '@use-gpu/core';
import { mixBits53 } from '@use-gpu/state';
import { bindBundle, bundleToAttribute, bundleToAttributes, getBundleKey } from '@use-gpu/shader/wgsl';

import { LightContext, DEFAULT_LIGHT_CONTEXT } from '../../providers/light-provider';
import { useDeviceContext } from '../../providers/device-provider';
import { useBufferedSize } from '../../hooks/useBufferedSize';

import { Light as WGSLLight } from '@use-gpu/wgsl/use/types.wgsl';

export const SHADOW_PAGE = 4096;
export const SHADOW_FORMAT = "depth32float";

const LIGHT_ATTRIBUTE = bundleToAttribute(WGSLLight);
const LIGHT_LAYOUT = makeUniformLayout(LIGHT_ATTRIBUTE.members!);
const LIGHT_BYTE_OFFSET = 16;

const makeAtlasPage = () => makeAtlas(
  SHADOW_PAGE,
  SHADOW_PAGE,
  SHADOW_PAGE,
  SHADOW_PAGE,
);

export const LightCapture = makeCapture<null>('LightCapture');

export type UseLight = (l: Light) => void;

export type LightDataProps = {
  alloc?: number,
  render?: (
    useLight: (l: Light) => void,
  ) => LiveElement,
  then?: (
    env: LightEnv,
  ) => LiveElement,
};

export const LightData: LiveComponent<LightDataProps> = (props: LightDataProps) => {
  const {
    alloc = 1,
    render,
    then,
  } = props;

  const [ids, queue, changed, lights, maps, count] = useOne(() => [
    makeIdAllocator(0),
    [],
    new Set<number>,
    new Map<number, BoundLight>,
    new Map<number, BoundLight>,
    new Uint32Array(1),
  ]);

  const useLight = useCallback((light: Light) => {
    const id = useResource((dispose) => {
      const id = ids.obtain();
      dispose(() => {
        ids.release(id);
        lights.delete(id);
        maps.delete(id);
      });
      return id;
    });

    useCapture(LightCapture, null);

    queue.push({id, data: light});
    changed.add(id);
  });

  // Produce light/shadow sources
  const Resume = () => {    

    // Update light data in-place
    for (let {id, data} of queue) {
      const {shadow} = data;

      if (lights.has(id)) {
        if (shadow) {
          const {shadowMap, shadowUV, shadowDepth, shadowBias, shadowBlur} = lights.get(id);
          data = {id, shadowMap, shadowUV, shadowDepth, shadowBias, shadowBlur, ...data};
          lights.set(id, data);
          maps.set(id, data);
          continue;
        }
        else {
          if (maps.has(id)) maps.delete(id);
        }
      }
      
      data = {id, shadowMap: -1, ...data};
      if (shadow) {
        lights.set(id, data);
        maps.set(id, data);
      }
      else {
        lights.set(id, data);
      }
    }

    // Check if light / shadow configuration changed
    let lightKey = 0;
    let shadowKey = 0;
    for (const key of lights.keys()) lightKey = mixBits53(lightKey, key);
    for (const key of maps.keys()) {
      const {shadow} = maps.get(key);
      const {size: [w, h]} = shadow;
      shadowKey = mixBits53(mixBits53(mixBits53(shadowKey, key), w), h);
    }

    const lightCount = lights.size;
    const size = useBufferedSize(Math.max(alloc, lightCount + 1));
    const device = useDeviceContext();

    const prevDataRef = useRef(null);

    // Make light storage buffer
    const [storage, data, filler] = useMemo(() => {
      const data = makeLayoutData(LIGHT_LAYOUT, size);
      const buffer = makeStorageBuffer(device, data);

      const {current: prevData} = prevDataRef;
      if (prevData) {
        const prevArray = new Uint32Array(prevData);
        const array = new Uint32Array(data);
        const n = Math.min(prevArray.length, array.length);
        for (let i = 0; i < n; ++i) array[i] = prevArray[i];
      }

      const storage = {
        buffer,
        format: WGSLLight,
        length: 0,
        size: [0],
        version: 0,
      } as any as StorageSource;

      const filler = makeLayoutFiller(LIGHT_LAYOUT, data);

      return [storage, data, filler];
    }, [device, size]);

    // Make shadow texture atlas
    const texture = useMemo(() => {

      const atlases = [makeAtlasPage()];
      let [atlas] = atlases;

      for (const key of lights.keys()) {
        const light = lights.get(key);
        const {shadow} = light;
        if (shadow) {
          const {size: [w, h], depth: [near, far], bias, blur} = shadow;
          
          let mapping;
          try {
            mapping = atlas.place(key, w, h);
          } catch (e) {
            atlas = makeAtlasPage();
            atlases.push(atlas);

            mapping = atlas.place(key, w, h);
          }
          const page = atlases.length - 1;

          const nf = 1 / (near - far);
          light.shadowMap = page;
          light.shadowUV = mapping.map(x => x / SHADOW_PAGE);
          light.shadowDepth = [far * nf + 1, -far * near * nf];
          light.shadowBias = bias;
          light.shadowBlur = blur;
        }
      }

      const pages = atlases.length;

      const texture = pages ? (
        makeTexture(
          device,
          SHADOW_PAGE,
          SHADOW_PAGE,
          pages,
          SHADOW_FORMAT,
          GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
          1,
          1,
          '2d',
        )
      ) : (
        makeTexture(
          device,
          1,
          1,
          1,
          SHADOW_FORMAT,
          GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
          1,
          1,
          '2d',
        )
      );

      const source = {
        texture,
        sampler: { compare: 'greater', minFilter: 'linear', magFilter: 'linear' },
        layout: "texture_depth_2d_array",
        format: SHADOW_FORMAT,
        length: SHADOW_PAGE * SHADOW_PAGE * pages,
        size: [SHADOW_PAGE, SHADOW_PAGE, pages],
        comparison: true,
        version: 0,
      } as TextureSource;
      
      return source;
    }, [device, shadowKey]);

    let needsRefresh = prevDataRef.current !== data;
    prevDataRef.current = data;

    // Compact light IDs into contiguous indices, ordered by light kind,
    // and calculate subranges by kind.
    const [indices, order, subranges] = useOne(() => {
      needsRefresh = true;

      const keys = [...lights.keys()];
      const order = seq(keys.length);
      const kinds = keys.map(k => lights.get(k).kind);
      order.sort((a, b) => kinds[a] - kinds[b]);

      const map = new Map<number, number>();
      const subranges = new Map<number, [number, number]>();

      let j = 0;
      for (const i of order) {
        map.set(keys[i], j);

        const kind = kinds[i];
        if (!subranges.has(kind)) subranges.set(kind, [j, j + 1]);
        else subranges.get(kind)[1] = j + 1;

        ++j;
      }
      return [map, order, subranges];
    }, lightKey);

    // Order changed lights by index
    const ids = [...changed.values()];
    ids.sort((a, b) => indices.get(a) - indices.get(b));

    // Update data sparsely while calculating upload ranges
    let ranges = [];
    let range = null;
    let index = 0;
    for (const id of ids) {
      const index = indices.get(id);

      if (!range) ranges.push(range = [index, index + 1]);
      else if (range[1] === index) range[1]++;
      else ranges.push(range = [index, index + 1]);

      filler.setData(index, lights.get(id));
    }
    if (needsRefresh) ranges = [[0, size - 1]];

    // Upload changed ranges
    if (ranges.length) {
      const {buffer} = storage;

      count[0] = lightCount;
      uploadBuffer(device, buffer, count.buffer);

      const stride = LIGHT_LAYOUT.length;
      for (const [from, to] of ranges) {
        uploadBufferRange(device, buffer, data, from * stride, (to - from) * stride, LIGHT_BYTE_OFFSET);
      }
    }

    storage.size[0] = storage.length = lightCount + 1;
    storage.version = texture.version = incrementVersion(storage.version);

    queue.length = 0;
    changed.clear();

    const env = useMemo(() => ({
      lights,
      shadows: maps,
      storage,
      texture,

      order,
      subranges,
    }), [storage, texture, order, subranges]);

    return [
      signal(),
      then ? then(env) : yeet(env),
    ];
  };

  return capture(LightCapture, render(useLight), Resume);
};
