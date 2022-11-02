# @use-gpu/scene

```sh
npm install --save @use-gpu/scene
```

```sh
yarn add @use-gpu/scene
```

**Docs**: https://usegpu.live/docs/reference-live-@use-gpu-scene

# Use.GPU - Scene

Implementation of a classic 3D scene with nodes that have position/rotation/scale/matrix transforms.

Leaf nodes:
- `<Mesh>` for rendering basic triangle meshes
- `<Instances>` for efficiently drawing multiple copies of the same mesh
- `<Primitive>` for embedding other layers or draw calls

## Usage

```tsx
import { Scene, Node, Mesh, Primitive } from '@use-gpu/scene';

<Scene>
  {/* Scene will reset the matrix transform unless `inherit` is set */}

  <Node
    /* All props are optional */
    position={[1, 2, 3]}
    scale={[1, 1, 1]}
    rotation={[30, 60, 90]}
    quaternion={[0, 0, 0, 1]}
    /* 4x4 */
    matrix={[1, 0, 0, 0, ...]}
  >
    {/* <Node> can be nested */}
    <Node />

    {/* <Mesh> will render a triangle mesh using a FaceLayer */}
    <Mesh
      {/* `mesh` is produced by e.g. <GeometryData>. It is a map of attribute names to `StorageSource`s */}
      mesh={mesh}

      {/* Enable material shading */}
      shaded

      /* Meshes are pickable if given an id */
      id={id}
    >

    {/* <Instances> will render N copies of a mesh using 1 FaceLayer, placed wit a dynamic `<Instance />` component */}
    <Instances
      mesh={mesh}
      shaded
      render={(Instance) => (
        // <Instance /> can be placed inside nodes
        <Node rotation={[30, 0, 0]}>
          // <Instance /> can be transformed directly
          <Instance position={[1, 2, 3]} />
          <Instance position={[3, 4, 5]} />
        </Node>
      )}
    >
    
    {/* <Primiive> produces a TransformContext for use by layers inside */}
    <Primitive>
      <PointLayer {...} />
    </Primitive>
  </Node>
</Scene>
```

## Colofon

Made by [Steven Wittens](https://acko.net). Part of `@use-gpu`.
