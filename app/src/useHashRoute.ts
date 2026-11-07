import { useCallback, useEffect, useState } from 'react';

/**
 * Маршрут живёт в hash — тогда системная кнопка «назад» на Android
 * и жест «назад» в браузере работают сами.
 *
 * В каждой записи истории лежит номер idx: сколько переходов человек
 * сделал внутри приложения. По нему «назад» понимает, есть ли куда
 * возвращаться, и не выбрасывает из приложения, когда ссылку открыли
 * из мессенджера и предыдущая запись принадлежит чужому сайту.
 */
const idxNow = (): number => {
  const s = window.history.state as { idx?: number } | null;
  return typeof s?.idx === 'number' ? s.idx : 0;
};

export function useHashRoute(fallback = 'home') {
  const read = () => window.location.hash.replace(/^#\/?/, '') || fallback;
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('popstate', onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** replace: true — для вкладок внизу, чтобы они не копили историю */
  const go = useCallback((next: string, opts?: { replace?: boolean }) => {
    const url = `#/${next}`;
    if (opts?.replace) window.history.replaceState({ idx: idxNow() }, '', url);
    else window.history.pushState({ idx: idxNow() + 1 }, '', url);
    setRoute(next);
  }, []);

  const back = useCallback(() => {
    if (idxNow() > 0) window.history.back();
    else window.location.replace('#/home');
  }, []);

  return { route, go, back };
}
