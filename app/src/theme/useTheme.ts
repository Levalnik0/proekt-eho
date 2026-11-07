import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { reachFrom, rings } from '../fx';

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

let wave: { frame: HTMLElement; anims: Animation[]; next: ThemeId } | null = null;

/** Доводит текущую волну сразу, если человек нажал новый цвет посреди старой */
function finishWave() {
  if (!wave) return;
  const { frame, anims, next } = wave;
  wave = null;
  anims.forEach((a) => a.cancel());
  frame.remove();
  commit(next);
  document.documentElement.classList.remove('theme-swap');
}

/** Плавное замедление к краю: быстро от пальца, мягко у края */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const WAVE_MS = 650;
const STEPS = 60;

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

  const app = document.querySelector('.app') as HTMLElement | null;
  if (!app) {
    commit(next);
    return;
  }
  const r = app.getBoundingClientRect();
  const ox = origin.x - r.left;
  const oy = origin.y - r.top;
  // До дальнего угла «телефона»: круг закрывает весь экран ровно в конце
  const radius = reachFrom(origin.x, origin.y, r) + 2;

  // Копия экрана в новом цвете: под волной видны те же карточки и кнопки,
  // а не пустой фон. Атрибут data-theme даёт копии переменные новой темы.
  const clone = app.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.echo-ring, .theme-wave-frame').forEach((n) => n.remove());
  clone.classList.add('theme-clone');
  clone.setAttribute('data-theme', next);
  clone.setAttribute('aria-hidden', 'true');
  Object.assign(clone.style, {
    position: 'absolute',
    left: `${radius - ox}px`,
    top: `${radius - oy}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    transformOrigin: `${ox}px ${oy}px`,
  });

  // Круг, через который видна копия
  const circle = document.createElement('div');
  circle.className = 'theme-wave';
  Object.assign(circle.style, {
    left: `${ox - radius}px`,
    top: `${oy - radius}px`,
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
  });
  circle.appendChild(clone);

  // Рамка ровно по экрану: круг не выходит за «телефон»
  const frame = document.createElement('div');
  frame.className = 'theme-wave-frame';
  frame.appendChild(circle);
  app.appendChild(frame);

  // Копия должна стоять там же, где настоящий экран, даже если он прокручен
  const scrollers = '.app__body, .quest__feed';
  const from = app.querySelectorAll<HTMLElement>(scrollers);
  clone.querySelectorAll<HTMLElement>(scrollers).forEach((el, i) => {
    if (from[i]) el.scrollTop = from[i].scrollTop;
  });

  rings(origin.x, origin.y);

  // Круг растёт, а копия внутри так же уменьшается: в сумме она стоит на
  // месте. Оба движения только transform, их ведёт видеокарта, поэтому
  // волна не замирает посередине. Шаги считаем заранее, чтобы масштабы
  // в каждом кадре были точно обратными друг другу.
  const outerKf: Keyframe[] = [];
  const innerKf: Keyframe[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const s = 0.02 + 0.98 * easeOut(i / STEPS);
    outerKf.push({ transform: `scale(${s})` });
    innerKf.push({ transform: `scale(${1 / s})` });
  }
  const opts: KeyframeAnimationOptions = { duration: WAVE_MS, easing: 'linear', fill: 'forwards' };
  const grow = circle.animate(outerKf, opts);
  const hold = clone.animate(innerKf, opts);
  wave = { frame, anims: [grow, hold], next };

  // Страховка: если анимацию придержали (фоновая вкладка, слабый телефон),
  // новый цвет всё равно должен примениться, а не ждать неизвестно сколько
  window.setTimeout(() => {
    if (wave?.frame === frame) finishWave();
  }, WAVE_MS + 300);

  grow.finished
    .then(() => {
      if (wave?.frame !== frame) return;
      wave = null;
      // Копия закрыла экран целиком: меняем тему на настоящем экране
      // и убираем копию. Они совпадают до пикселя, подмены не видно.
      const root = document.documentElement;
      root.classList.add('theme-swap');
      commit(next);
      // Таймер, а не кадры отрисовки: если браузер придержит кадры,
      // копия всё равно уберётся
      window.setTimeout(() => {
        frame.remove();
        root.classList.remove('theme-swap');
      }, 60);
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
