/**
 * «Лаборатория» — семь новых мини-игр, пока закрытых. Открываются кодом,
 * который вводится во вкладке «Клуб»: без него нет ни меню лаборатории,
 * ни отдельных игр в разделе «Игры», ни прямых адресов. Это занавес, а не
 * защита: код лежит в коде приложения, сервера нет.
 */
export const LAB_CODE = 'игролаб';
const KEY = 'echo.lab.unlocked';

// Если хранилище недоступно (приватный режим), запоминаем открытие хотя бы
// до закрытия вкладки, иначе после ввода кода показывалась бы главная
let openedNow = false;

export function labUnlocked(): boolean {
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
