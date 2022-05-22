import { useOne, useFiber, useState } from '@use-gpu/live';

export const useInspectable = () => {
  const fiber = useFiber();

  const inspected = fiber.__inspect = fiber.__inspect || {};
  const inspect = useOne(() => (data: Record<string, any>) => {
    for (const key in data) inspected[key] = data[key];
    return fiber.__inspect as Record<string, any>;
  });

  return inspect;
}

export const useInspectHover = () => {
  const fiber = useFiber();
  const inspect = fiber.__inspect = fiber.__inspect || {};

  const [hovered, setHovered] = useState<boolean>(false);
  if (!inspect.setHovered) {
    fiber.__inspect.setHovered = setHovered;
  }
  
  return hovered;
}

