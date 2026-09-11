import { useEffect, RefObject } from 'react';

/** Calls onOutside when a pointer-down lands outside every given ref, and whenever Escape
 * is pressed. Pass one or more refs (e.g. several open dropdowns sharing one close handler). */
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  onOutside: () => void,
  active: boolean = true
): void {
  useEffect(() => {
    if (!active) return;

    const refList = Array.isArray(refs) ? refs : [refs];

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const isInside = refList.some((r) => r.current && r.current.contains(target));
      if (!isInside) onOutside();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOutside();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, onOutside, refs]);
}
