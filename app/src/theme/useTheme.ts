import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { appRect, reachFrom, rings } from '../fx';

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
  flushSync(() => listeners.forEach((fn) => fn(next)));
}

let wave: { el: HTMLElement; anim: Animation; next: ThemeId } | null = null;

/** Доводит текущую волну сразу, если человек нажал новый цвет посреди старой */
function finishWave() {
  if (!wave) return;
  const { el, anim, next } = wave;
  wave = null;
  anim.cancel();
  el.remove();
  commit(next);
  document.documentElement.classList.remove('theme-swap');
}

/**
 * Меняет тему. Если передана точка нажатия, от неё расходится круг нового
 * цвета, под ним незаметно меняется тема, и круг растворяется.
 *
 * Раньше волна была «снимок экрана плюс вырезанный круг» (View Transitions).
 * Такой круг браузер перерисовывает сам, без видеокарты, и на середине
 * волна замирала примерно на секунду. Теперь круг двигается только через
 * transform и opacity: их ведёт видеокарта, и они не останавливаются, даже
 * когда основной поток занят сменой темы.
 */
function change(next: ThemeId, origin?: Origin) {
  finishWave();
  if (!origin || reducedMotion()) {
    commit(next);
    if (origin) rings(origin.x, origin.y);
    return;
  }

  const host = (document.querySelector('.app') as HTMLElement | null) ?? document.body;
  const r = appRect();
  const x = origin.x - r.left;
  const y = origin.y - r.top;
  // До дальнего угла «телефона»: круг закрывает весь экран ровно в конце
  const radius = reachFrom(origin.x, origin.y, r) + 2;

  const el = document.createElement('div');
  el.className = 'theme-wave';
  // Атрибут даёт кругу переменные новой темы: он сразу нужного цвета
  el.setAttribute('data-theme', next);
  el.style.left = `${x - radius}px`;
  el.style.top = `${y - radius}px`;
  el.style.width = `${radius * 2}px`;
  el.style.height = `${radius * 2}px`;
  // Свечение сверху рисуем в координатах экрана, как у самого приложения
  el.style.backgroundSize = `${r.width}px 300px`;
  el.style.backgroundPosition = `${radius - x}px ${radius - y}px`;
  host.appendChild(el);
  rings(origin.x, origin.y);

  const grow = el.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
    duration: 620,
    // Трогается сразу от пальца и мягко доезжает до края, без остановок
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'forwards',
  });
  wave = { el, anim: grow, next };

  grow.finished
    .then(() => {
      if (wave?.el !== el) return;
      wave = null;
      // Экран полностью закрыт кругом: меняем тему под ним, переходов
      // цвета у кнопок не нужно, иначе они «доезжали» бы после волны
      const root = document.documentElement;
      root.classList.add('theme-swap');
      commit(next);
      const fade = el.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 260,
        easing: 'ease-out',
        fill: 'forwards',
      });
      fade.finished
        .catch(() => undefined)
        .finally(() => {
          el.remove();
          root.classList.remove('theme-swap');
        });
    })
    .catch(() => {
      // волну прервало новое нажатие: finishWave уже всё довёл
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
