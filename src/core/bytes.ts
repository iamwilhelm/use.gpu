export const setUint8  = (view: DataView, offset: number, value: number): void => view.setUint8(offset, value);
export const setUint16 = (view: DataView, offset: number, value: number): void => view.setUint16(offset, value, true);
export const setUint32 = (view: DataView, offset: number, value: number): void => view.setUint32(offset, value, true);

export const setInt8   = (view: DataView, offset: number, value: number): void => view.setInt8(offset, value);
export const setInt16  = (view: DataView, offset: number, value: number): void => view.setInt16(offset, value, true);
export const setInt32  = (view: DataView, offset: number, value: number): void => view.setInt32(offset, value, true);

const setFloat32 = (view: DataView, offset: number, value: number): void => view.setFloat32(offset, value, true);
const setFloat64 = (view: DataView, offset: number, value: number): void => view.setFloat64(offset, value, true);

export const setUint8N = (n: number) => (view: DataView, offset: number, data: Uint8Array): void => {
  for (let i = 0; i < n; ++i) setUint8(view, offset + i, data[i]);
};

export const setInt8N = (n: number) => (view: DataView, offset: number, data: Int8Array): void => {
  for (let i = 0; i < n; ++i) setInt8(view, offset + i, data[i]);
};

export const setUint16N = (n: number) => (view: DataView, offset: number, data: Uint16Array): void => {
  for (let i = 0; i < n; ++i) setUint16(view, offset + i * 2, data[i]);
};

export const setInt16N = (n: number) => (view: DataView, offset: number, data: Int16Array): void => {
  for (let i = 0; i < n; ++i) setInt16(view, offset + i * 2, data[i]);
};

export const setUint32N = (n: number) => (view: DataView, offset: number, data: Uint32Array): void => {
  for (let i = 0; i < n; ++i) setUint32(view, offset + i * 4, data[i]);
};

export const setInt32N = (n: number) => (view: DataView, offset: number, data: Int32Array): void => {
  for (let i = 0; i < n; ++i) setInt32(view, offset + i * 4, data[i]);
};

export const setFloat32N = (n: number) => (view: DataView, offset: number, data: Float32Array): void => {
  for (let i = 0; i < n; ++i) setFloat32(view, offset + i * 4, data[i]);
};

export const setFloat64N = (n: number) => (view: DataView, offset: number, data: Float64Array): void => {
  for (let i = 0; i < n; ++i) setFloat64(view, offset + i * 8, data[i]);
};

export const UNIFORM_BYTE_SETTERS = {
  "bool":        setUint8N(1),
  "bvec2":       setUint8N(2),
  "bvec3":       setUint8N(3),
  "bvec4":       setUint8N(4),

  "uint":        setUint32N(1),
  "uvec2":       setUint32N(2),
  "uvec3":       setUint32N(3),
  "uvec4":       setUint32N(4),

  "int":         setInt32N(1),
  "ivec2":       setInt32N(2),
  "ivec3":       setInt32N(3),
  "ivec4":       setInt32N(4),

  "float":       setFloat32N(1),
  "vec2":        setFloat32N(2),
  "vec3":        setFloat32N(3),
  "vec4":        setFloat32N(4),

  "double":      setFloat64N(1),
  "dvec2":       setFloat64N(2),
  "dvec3":       setFloat64N(3),
  "dvec4":       setFloat64N(4),

  "mat2":        setFloat32N(4),
  "mat2x2":      setFloat32N(4),
  "mat3x2":      setFloat32N(6),
  "mat2x3":      setFloat32N(6),
  "mat2x4":      setFloat32N(8),
  "mat4x2":      setFloat32N(8),
  "mat3":        setFloat32N(9),
  "mat3x3":      setFloat32N(9),
  "mat3x4":      setFloat32N(12),
  "mat4x3":      setFloat32N(12),
  "mat4":        setFloat32N(16),
  "mat4x4":      setFloat32N(16),

  "dmat2":       setFloat64N(4),
  "dmat2x2":     setFloat64N(4),
  "dmat3x2":     setFloat64N(6),
  "dmat2x3":     setFloat64N(6),
  "dmat2x4":     setFloat64N(8),
  "dmat4x2":     setFloat64N(8),
  "dmat3":       setFloat64N(9),
  "dmat3x3":     setFloat64N(9),
  "dmat3x4":     setFloat64N(12),
  "dmat4x3":     setFloat64N(12),
  "dmat4":       setFloat64N(16),
  "dmat4x4":     setFloat64N(16),
};
