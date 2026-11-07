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

/** Три кольца расходятся от точки нажатия: «эхо». Фирменный жест приложения. */
export function rings(x: number, y: number) {
  if (reduced()) return;
  [0, 140, 280].forEach((delay) => {
    const el = document.createElement('div');
    el.className = 'echo-ring';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.animationDelay = `${delay}ms`;
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 1400);
  });
}

/** Центр элемента в координатах окна: откуда запускать кольца и волну */
export function centerOf(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
