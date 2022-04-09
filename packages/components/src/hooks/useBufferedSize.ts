import { useOne } from '@use-gpu/live';

export const adjustSize = (size: number, alloc: number) => {
  while (size < alloc * 0.25) alloc = Math.floor(alloc / 2);
  if (size > alloc) alloc = Math.max(size, Math.round(alloc * 1.2));
  return alloc;
};

export const useBufferedSize = (size: number) => {
  const ref = useOne(() => ({alloc: 0}));
  return ref.alloc = adjustSize(size, ref.alloc);  
};
