/**
 * Общий опыт игр лаборатории. Сами игры живут на отдельной странице и пишут
 * опыт в то же хранилище (ключ echo.proto.xp), здесь он только читается,
 * чтобы показать звание в разделе «Игры». Числа и названия должны совпадать
 * с public/lab/index.html (RANKS, DAY_GAMES).
 */
const RANKS: [number, string][] = [
  [0, 'Новичок'],
  [60, 'Наблюдатель'],
  [150, 'Следопыт'],
  [280, 'Сыщик'],
  [450, 'Защитник'],
  [680, 'Страж сети'],
  [1000, 'Мастер Эха'],
  [1400, 'Легенда Эха'],
];
const DAY_GAMES = ['imp', 'safe', 'race', 'filter', 'detective', 'net', 'windows'];

export interface LabRank {
  name: string;
  next: string | null;
  /** Сколько опыта осталось до следующего звания */
  left: number;
  /** Заполнение полоски, 0..100 */
  percent: number;
  xp: number;
}

export function labRank(): LabRank {
  let xp = 0;
  try {
    xp = Number(localStorage.getItem('echo.proto.xp')) || 0;
  } catch {
    // приватный режим: опыта просто нет
  }
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1][0]) i++;
  const next = RANKS[i + 1];
  return {
    name: RANKS[i][1],
    next: next ? next[1] : null,
    left: next ? next[0] - xp : 0,
    percent: next ? Math.round(((xp - RANKS[i][0]) / (next[0] - RANKS[i][0])) * 100) : 100,
    xp,
  };
}

/** Маршрут игры, за которую сегодня дают двойной опыт */
export function labGameOfDay(): string {
  const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);
  return `game/lab/${DAY_GAMES[day % DAY_GAMES.length]}`;
}
