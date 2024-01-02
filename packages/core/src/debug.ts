/** @hidden */
export const LOGGING = {
  buffer: true,
  pipeline: true,
} as Record<string, boolean>;

export const decodeUsageFlags = (flags: GPUBufferUsageFlags) => {
  const out = {};
  for (const k in GPUBufferUsage) if (flags & GPUBufferUsage[k]) out[k] = true;
  return out;
};