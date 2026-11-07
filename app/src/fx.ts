/**
 * Ощущения: вибрация и эхо-кольца от нажатия.
 * Это не украшение: когда нажатие «отзывается» в руке, выбирать приятнее,
 * а на Android ещё и понятнее, правильно ли ответил.
 */

const HAPTICS_KEY = 'echo.haptics.v1';

const supported = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

let enabled = (() => {
  try {
    return localStorage.getItem(HAPTICS_KEY) !== '0';
  } catch {
    return true;
  }
})();

/** На iPhone браузер не умеет вибрировать, там остаются анимация и цвет */
export const hapticsSupported = supported;
export const hapticsEnabled = () => enabled;

const PATTERNS: Record<string, number | number[]> = {
  tap: 8, // лёгкое касание: открыл плитку
  select: 14, // выбор: цвет, ответ
  good: [14, 40, 14], // верно: два коротких
  bad: 110, // ошибка: один длинный
  beat: [26, 70, 26], // «пульс» нарастающего давления
  calm: 10, // давление спало
};

export type Feel = 'tap' | 'select' | 'good' | 'bad' | 'beat' | 'calm';

export function buzz(feel: Feel) {
  if (!enabled || !supported) return;
  try {
    navigator.vibrate(PATTERNS[feel]);
  } catch {
    // некоторые браузеры запрещают вибрацию без жеста, это не ошибка
  }
}

export function setHaptics(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(HAPTICS_KEY, on ? '1' : '0');
  } catch {
    // приватный режим: выбор не переживёт перезапуск
  }
  if (on) buzz('select');
}

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Прямоугольник «телефона»: волна и кольца не должны выходить за него */
export function appRect() {
  const app = document.querySelector('.app');
  return app
    ? app.getBoundingClientRect()
    : new DOMRect(0, 0, window.innerWidth, window.innerHeight);
}

/** Расстояние от точки до дальнего угла прямоугольника */
export function reachFrom(x: number, y: number, r: DOMRect) {
  return Math.hypot(Math.max(x - r.left, r.right - x), Math.max(y - r.top, r.bottom - y));
}

/** Три кольца расходятся от точки нажатия: «эхо». Фирменный жест приложения. */
export function rings(x: number, y: number) {
  if (reduced()) return;
  const host = document.querySelector('.app') ?? document.body;
  const r = appRect();
  // Кольцо доходит до края экрана, но не больше: так оно ровное и не тяжёлое
  const size = Math.min(420, reachFrom(x, y, r) * 1.4);
  [0, 160, 320].forEach((delay) => {
    const el = document.createElement('div');
    el.className = 'echo-ring';
    el.style.left = `${x - r.left}px`;
    el.style.top = `${y - r.top}px`;
    el.style.animationDelay = `${delay}ms`;
    el.style.setProperty('--ring-size', `${size}px`);
    host.appendChild(el);
    window.setTimeout(() => el.remove(), 1700);
  });
}

/** Центр элемента в координатах окна: откуда запускать кольца и волну */
export function centerOf(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
