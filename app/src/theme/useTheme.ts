import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { appRect, reachFrom } from '../fx';

/**
 * 'day' — светлая тема, это :root, отдельного CSS-блока не требует.
 * Остальные тёмные и окрашены в свой цвет: фон, свечение и акценты
 * в одном оттенке. Так «выбрал оранжевый, и весь экран оранжевый»
 * получается без заливки всего сплошным цветом: на нём не читается текст.
 */
export type ThemeId = 'day' | 'ocean' | 'coral' | 'pink' | 'violet' | 'neon';

/** Порядок важен: так цвета идут на первом экране и по кнопке-палитре */
export const THEMES: { id: ThemeId; label: string; swatch: string }[] = [
  { id: 'coral', label: 'Коралл', swatch: '#ff7a45' },
  { id: 'pink', label: 'Розовый', swatch: '#ff5d8f' },
  { id: 'violet', label: 'Сирень', swatch: '#9b7cff' },
  { id: 'ocean', label: 'Океан', swatch: '#3fd0cc' },
  { id: 'neon', label: 'Неон', swatch: 'linear-gradient(135deg, #38e8d8, #ff57c7)' },
  { id: 'day', label: 'Светлая', swatch: '#ffffff' },
];

const KEY = 'echo.theme.v1';
const CHOSEN_KEY = 'echo.theme.chosen.v1';

function read(): ThemeId {
  try {
    const raw = localStorage.getItem(KEY);
    return (THEMES.find((t) => t.id === raw)?.id ?? 'ocean') as ThemeId;
  } catch {
    return 'ocean';
  }
}

function apply(theme: ThemeId) {
  if (theme === 'day') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);
}

/** Выбирал ли человек цвет: от этого зависит, показывать ли первый экран */
export function themeChosen() {
  try {
    return localStorage.getItem(CHOSEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function markThemeChosen() {
  try {
    localStorage.setItem(CHOSEN_KEY, '1');
  } catch {
    // приватный режим: первый экран покажется снова, не страшно
  }
}

let current = read();
apply(current);
const listeners = new Set<(t: ThemeId) => void>();

export type Origin = { x: number; y: number };
type ViewTransitionLike = { ready: Promise<void>; finished: Promise<void> };

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function commit(next: ThemeId) {
  current = next;
  apply(next);
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // приватный режим — тема не переживёт перезапуск, не страшно
  }
  markThemeChosen();
  // Сразу, а не «когда-нибудь»: волна снимает кадр после смены темы
  flushSync(() => listeners.forEach((fn) => fn(next)));
}

/**
 * Меняет тему. Если передана точка нажатия, от неё расходится круг нового
 * цвета (View Transitions API). Там, где браузер этого не умеет или человек
 * просил «меньше движения», тема меняется сразу, без волны.
 */
function change(next: ThemeId, origin?: Origin) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => ViewTransitionLike;
  };
  if (!origin || !doc.startViewTransition || reducedMotion()) {
    commit(next);
    return;
  }
  const root = document.documentElement;
  root.classList.add('theme-swap');
  const transition = doc.startViewTransition(() => commit(next));
  transition.finished.finally(() => root.classList.remove('theme-swap'));
  transition.ready
    .then(() => {
      // Круг рассчитан до дальнего угла «телефона», а не всего окна:
      // иначе он заливал экран на середине и дальше будто стоял на месте
      const radius = reachFrom(origin.x, origin.y, appRect()) + 2;
      root.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 900,
          // Плавно разгоняется и так же плавно доходит до края, без рывка в конце
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    })
    .catch(() => {
      // снимок кадра не удался: тема уже сменилась, волны просто не будет
    });
}

/** Общая тема на всё приложение — как useProgress, но проще: одно значение. */
export function useTheme() {
  const [theme, setThemeState] = useState(current);

  useEffect(() => {
    listeners.add(setThemeState);
    return () => void listeners.delete(setThemeState);
  }, []);

  const setTheme = useCallback((next: ThemeId, origin?: Origin) => change(next, origin), []);

  /** Следующий цвет по кругу: для кнопки-палитры на главной */
  const cycle = useCallback((origin?: Origin) => {
    const i = THEMES.findIndex((t) => t.id === current);
    change(THEMES[(i + 1) % THEMES.length].id, origin);
  }, []);

  return { theme, setTheme, cycle };
}
