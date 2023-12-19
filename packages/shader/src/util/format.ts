import type { UniformFormat } from '../types';
import { formatMurmur53 } from './hash';
import { getBundleEntry, getBundleKey } from './bundle';

export const flattenFormat = (format: UniformFormat): string => {
  if (typeof format === 'string') return format;
  if (Array.isArray(format)) return `[${format.map(f => flattenFormat(f.format)).join(' ')}]`;
  if (typeof format === 'object') return formatMurmur53(getBundleKey(format));
  return 'unknown';
};

export const formatFormat = (format: UniformFormat): string => {
  if (typeof format === 'string') return format;
  if (Array.isArray(format)) return `[${format.map(f => formatFormat(f.format)).join(' ')}]`;
  if (typeof format === 'object') return getBundleEntry(format) ?? 'unknown';
  return 'unknown';
};