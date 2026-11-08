/**
 * Звуки игр. Рисует сам браузер (WebAudio), файлов нет, весит ноль.
 * Переключатель один на всё приложение и на страницу мини-игр: ключ
 * echo.lab.sound общий, его же читает public/lab/index.html.
 */
const KEY = 'echo.lab.sound';

let on = true;
try {
  on = localStorage.getItem(KEY) !== '0';
} catch {
  // приватный режим: звук просто включён до закрытия вкладки
}

let ctx: AudioContext | null = null;

function ensure(): AudioContext | null {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, at = 0, to?: number) {
  if (!on) return;
  const c = ensure();
  if (!c) return;
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

export const soundEnabled = () => on;

export function setSound(value: boolean) {
  on = value;
  try {
    localStorage.setItem(KEY, value ? '1' : '0');
  } catch {
    // не сохранится между запусками, в этой сессии работает
  }
  if (value) sound.tap();
}

export const sound = {
  tap: () => tone(520, 0.05, 'sine', 0.07),
  /** Верный ответ: две ноты вверх */
  good: () => {
    tone(660, 0.09, 'sine', 0.1);
    tone(990, 0.14, 'sine', 0.1, 0.08);
  },
  /** Неверный: мягкая нота вниз, без резкости */
  bad: () => tone(240, 0.22, 'triangle', 0.12, 0, 150),
  /** Итог раунда */
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, 'sine', 0.1, i * 0.1)),
};
