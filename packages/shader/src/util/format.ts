import { formatMurmur53 } from './hash';
import { getBundleKey } from './bundle';

export const flattenFormat = (format: UniformFormat) => {
  if (typeof format === 'string') return format;
  if (typeof format === 'object') return formatMurmur53(getBundleKey(format));
  if (Array.isArray(format)) return `[${format.map(flattenFormat).join(' ')}]`;
};