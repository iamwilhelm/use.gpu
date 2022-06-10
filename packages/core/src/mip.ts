import { Rectangle, Point, TextureSource } from './types';

import { makeVertexAttributeLayout } from './attribute';
import { makeColorAttachment, makeColorState } from './color';
import { makeVertexBuffer } from './buffer';
import { makeRenderPipeline, makeShaderModule } from './pipeline';
import { makeTextureBinding, makeTextureView, makeSampler } from './texture';

const seq = (n: number, start: number = 0, step: number = 1) => Array.from({length: n}).map((_, i) => start + i * step);

const MIP_SHADER = `
struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@stage(vertex)
fn vertexMain(
  @location(0) uv: vec2<f32>,
) -> VertexOutput {
  return VertexOutput(
    vec4<f32>((uv * 2.0 - 1.0) * vec2<f32>(1.0, -1.0), 0.5, 1.0),
    uv,
  );
}

@group(0) @binding(0) var mipTexture: texture_2d<f32>;
@group(0) @binding(1) var mipSampler: sampler;

@stage(fragment)
fn fragmentMain(
  @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
  return textureSample(mipTexture, mipSampler, uv);
}
`

const MIP_UVS = makeVertexAttributeLayout([{ name: 'uv', format: 'float32x2' }]);

const makeMipMesh = (bounds: Rectangle[], size: Point): VertexData => {
  let i = 0;
  const [w, h] = size;

  const uvs = new Float32Array(bounds.length * 5 * 2);
  for (const [l, t, r, b] of bounds) {
    uvs[i++] = l / w;
    uvs[i++] = t / h;
    uvs[i++] = r / w;
    uvs[i++] = t / h;
    uvs[i++] = l / w;
    uvs[i++] = b / h;
    uvs[i++] = r / w;
    uvs[i++] = b / h;
    uvs[i++] = NaN;
    uvs[i++] = NaN;
  }

  const vertices   = [uvs];
  const attributes = [MIP_UVS];

  return {vertices, attributes, count: uvs.length / 2};
}

const NO_CLEAR = [0, 0, 0, 0] as Rectangle;
const MIP_PIPELINES = new WeakMap<GPUDevice, GPURenderPipeline>();

export const updateMipTextureChain = (
  device: GPUDevice,
  source: TextureSource,
  bounds: Rectangle[] = null,
) => {
  const {
    texture,
    size,
    mips = 1,
  } = source;

  const [width, height] = size;
  if (bounds == null) {
    bounds = [0, 0, width, height];
  }

  const mesh = makeMipMesh(bounds, size);
  const vertexBuffer = makeVertexBuffer(device, mesh.vertices[0]);
  const vertex = makeShaderModule(MIP_SHADER, 'mip-v', 'vertexMain');
  const fragment = makeShaderModule(MIP_SHADER, 'mip-f', 'fragmentMain');

  const sampler = makeSampler(device, {
    minFilter: 'linear',
    magFilter: 'linear',
  });

  const views = seq(mips).map((mip: number) => makeTextureView(texture, 1, mip));
  
  const renderPassDescriptors = seq(mips).map(i => ({
    colorAttachments: [makeColorAttachment(views[i], null, NO_CLEAR, 'load')],
  } as GPURenderPassDescriptor));

  const renderContext = {
    device,
    samples: 1,
    colorStates: [makeColorState(source.format)],
  } as any;

  let pipeline = MIP_PIPELINES.get(device);
  if (!pipeline) {
    pipeline = makeRenderPipeline(device, renderContext, vertex, fragment, {
      primitive: {
        topology: "triangle-strip",
      },
      vertex:   {buffers: mesh.attributes},
      fragment: {},
    });
    MIP_PIPELINES.set(device, pipeline);
  }

  const bindGroups = seq(mips).map((mip: number) => makeTextureBinding(device, pipeline, sampler, views[mip]));

  const commandEncoder = device.createCommandEncoder();
  for (let i = 1; i < mips; ++i) {
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptors[i]);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroups[i - 1]);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(mesh.count, 1, 0, 0);
    passEncoder.end();    
  }

  device.queue.submit([commandEncoder.finish()]);
};
