const KEY = 'echo.games.v1';

export type GameId = 'swipe' | 'slang';

type Store = Partial<Record<GameId, number>>;

function read(): Store {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    // Если в хранилище лежит что-то не то (null, строка), считаем, что рекордов нет
    return typeof parsed === 'object' && parsed !== null ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

/** Лучший счёт в игре, или undefined, если ещё не играли */
export function bestOf(game: GameId): number | undefined {
  return read()[game];
}

/** Записывает счёт; возвращает true, если это новый рекорд */
export function saveBest(game: GameId, score: number): boolean {
  const store = read();
  const prev = store[game];
  if (prev !== undefined && prev >= score) return false;
  store[game] = score;
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // приватный режим: рекорд не сохранится, игре это не мешает
  }
  return prev !== undefined;
}

/** Стирает рекорды игр и рекорды «Лаборатории» (ключи echo.proto.*) */
export function resetGames() {
  try {
    localStorage.removeItem(KEY);
    Object.keys(localStorage)
      .filter((k) => k.startsWith('echo.proto.') || k.startsWith('echo.lab.how.') || k === 'echo.lab.race.hard')
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // приватный режим: стирать нечего
  }
}

export function shuffle<T>(list: readonly T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
