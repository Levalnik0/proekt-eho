/**
 * «Лаборатория» - мини-игры на отдельной странице (public/lab). Раньше их
 * закрывал код «игролаб», теперь они открыты всем: детям незачем вводить код,
 * а статистике нужны все игроки. Сама функция осталась, чтобы вернуть
 * закрытие одной строкой (поставить CLOSED = true), если понадобится.
 */
export const LAB_CODE = 'игролаб';
const KEY = 'echo.lab.unlocked';
const CLOSED = false;

// Если хранилище недоступно (приватный режим), запоминаем открытие хотя бы
// до закрытия вкладки
let openedNow = false;

export function labUnlocked(): boolean {
  if (!CLOSED) return true;
  if (openedNow) return true;
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/** Проверяет код; при совпадении запоминает, что лаборатория открыта */
export function tryUnlockLab(code: string): boolean {
  const ok = code.trim().toLowerCase() === LAB_CODE;
  if (ok) {
    openedNow = true;
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // приватный режим: просто не запомнится между визитами
    }
  }
  return ok;
}
