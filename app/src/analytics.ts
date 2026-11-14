/** Номер счётчика Яндекс.Метрики (см. index.html) */
const COUNTER = 114151261;

declare global {
  interface Window {
    ym?: (id: number, action: string, goal?: string) => void;
  }
}

/** Отмечает цель в Метрике. Без интернета или с блокировщиком просто ничего не делает. */
export function goal(name: string) {
  try {
    window.ym?.(COUNTER, 'reachGoal', name);
  } catch {
    // статистика не должна ломать приложение
  }
}
