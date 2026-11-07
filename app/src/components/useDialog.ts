import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Поведение модального окна, которого не хватало: при открытии фокус
 * уходит внутрь, Esc закрывает, Tab не выходит за окно, а после закрытия
 * фокус возвращается туда, откуда окно открыли. Без этого человек с
 * клавиатурой или скринридером оставался «под» окном.
 */
export function useDialog(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  // Закрывающую функцию держим в ref, иначе при каждой перерисовке эффект
  // запускался бы заново и снова уводил фокус в начало окна
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const before = document.activeElement as HTMLElement | null;
    (el.querySelector<HTMLElement>(FOCUSABLE) ?? el).focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      before?.focus?.({ preventScroll: true });
    };
  }, [ref]);
}
