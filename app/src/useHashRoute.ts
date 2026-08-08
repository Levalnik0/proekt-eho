import { useCallback, useEffect, useState } from 'react';

/**
 * Маршрут живёт в hash — тогда системная кнопка «назад» на Android
 * и жест «назад» в браузере работают сами, без своей истории.
 */
export function useHashRoute(fallback = 'home') {
  const read = () => window.location.hash.replace(/^#\/?/, '') || fallback;
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback((next: string) => {
    window.location.hash = `/${next}`;
  }, []);

  const back = useCallback(() => {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = '/home';
  }, []);

  return { route, go, back };
}
