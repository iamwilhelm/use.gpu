import { LiveComponent } from '@use-gpu/live/types';
import { TextureSource, Rectangle, Point4 } from '@use-gpu/core/types';
import { ShaderModule } from '@use-gpu/shader/types';

import { use, yeet, memo, useContext, useMemo, useNoContext } from '@use-gpu/live';
import { LayoutContext } from '../../providers/layout-provider';
import { LayerType } from '../../layers/types';
import { ImageTrait, Fit, Repeat, Anchor } from '../types';

import { evaluateDimension, evaluateAnchor, parseAnchorXY } from '../parse';

const UV_SQUARE = [0, 0, 1, 1];

const REPEAT_FLAG = {
  'none': 0,
  'x':    1,
  'y':    2,
  'xy':   3,
};

export type UIRectangleProps = {
  id: number,
  layout: Rectangle,

  image?: Partial<ImageTrait>,

  fill?: Point4,
  stroke?: Point4,
  border?: Point4,
  radius?: Point4,

  clip?: ShaderModule,
  transform?: ShaderModule
};

export const UIRectangle: LiveComponent<UIRectangleProps> = (props) => {
  const {
    id,
    image,

    fill,
    stroke,
    radius,
    border,

    clip,
    transform,
  } = props;

  let layout;
  if (props.layout) {
    layout = props.layout;
    useNoContext(LayoutContext);
  }
  else {
    layout = useContext(LayoutContext);
  }

  const sampledTexture = useMemo(() => {
    if (!image?.texture) return null;
    
    const {texture, repeat} = image;
    const addressModeU = repeat === 'x' || repeat === 'xy' ? 'repeat' : 'clamp-to-edge';
    const addressModeV = repeat === 'y' || repeat === 'xy' ? 'repeat' : 'clamp-to-edge';

    const sampler = texture.sampler !== null ? {
      minFilter: 'linear',
      magFilter: 'linear',
      ...texture.sampler,
      addressModeU,
      addressModeV,
    } : null;

    return {
      ...texture,
      sampler,
    };
  }, [image?.texture, image?.repeat]);

  if (sampledTexture) {
    sampledTexture.texture = image!.texture!.texture;
    sampledTexture.view = image!.texture!.view;
    sampledTexture.size = image!.texture!.size;
  }
  
  let boxW = layout[2] - layout[0];
  let boxH = layout[3] - layout[1];
  if (radius) {
    let [tl, tr, br, bl] = radius;

    // Clip radius to size
    if (tl + tr > boxW) {
      const f = boxW / (tl + tr);
      tl *= f;
      tr *= f;
    }
    if (bl + br > boxW) {
      const f = boxW / (bl + br);
      bl *= f;
      br *= f;
    }
    if (tl + bl > boxH) {
      const f = boxH / (tl + bl);
      tl *= f;
      bl *= f;
    }
    if (tr + br > boxH) {
      const f = boxH / (tr + br);
      tr *= f;
      br *= f;
    }
    
    radius[0] = tl;
    radius[1] = tr;
    radius[2] = br;
    radius[3] = bl;
  }

  let render;
  if (image && image.texture) {
    const {
      texture,
      fit,
      width,
      height,
      repeat,
      align,
    } = image;
    const {size} = texture;

    let uv = UV_SQUARE;

    if (fit !== 'scale') {
 
      let w = (width != null ? evaluateDimension(width, size[0], false) : size[0])!;
      let h = (height != null ? evaluateDimension(height, size[1], false) : size[1])!;

      if (fit === 'contain') {
        let fitW = boxW / w;
        let fitH = boxH / h;
        let scale = Math.min(fitW, fitH);
        w *= scale;
        h *= scale;
      }
      else if (fit === 'cover') {
        let fitW = boxW / w;
        let fitH = boxH / h;
        let scale = Math.max(fitW, fitH);
        w *= scale;
        h *= scale;
      }

      const [alignX, alignY] = parseAnchorXY(align);
      let left   = evaluateAnchor(alignX) * (boxW - w);
      let top    = evaluateAnchor(alignY) * (boxH - h);
      let right  = boxW - (left + w);
      let bottom = boxH - (top + h);

      uv = [
        -left / w,
        -top / h,
        1 + right / w,
        1 + bottom / h,
      ];
    }

    render = {
      id,
      rectangle: layout,
      radius,
      border,
      stroke,
      fill,
      
      texture: sampledTexture,
      repeat: (repeat != null ? REPEAT_FLAG[repeat] : repeat) ?? 0,
      uv,

      bounds: layout,
      count: 1,
      transform,
    };
  }
  else {
    render = {
      id,
      rectangle: layout,
      radius,
      border,
      stroke,
      fill,

      bounds: layout,
      count: 1,
      clip,
      transform,
    };
  }

  return yeet(render);
};
