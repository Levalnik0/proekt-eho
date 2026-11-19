/**
 * Код прогресса: короткая строка, в которую сложен весь прогресс ребёнка.
 * Нужен, чтобы перенести его на другой телефон или не потерять после очистки
 * браузера. Аккаунтов, паролей и сервера нет: код живёт только у самого ребёнка,
 * поэтому личные данные никуда не уходят.
 *
 * Порядок в списках ниже менять нельзя: код хранит не названия, а номера.
 * Новое можно только дописывать в конец, тогда старые коды продолжат работать.
 */

const BADGES = [
  'check-profile', 'reported', 'calm-no', 'double-check', 'call-team', 'been-there', 'replay',
  'read-flags', 'checker', 'self-scan', 'full-profile', 'mirror-teen', 'spotted-drop',
  'spotted-group', 'geo-aware', 'bullseye', 'surprised', 'translator', 'ally', 'checker-adult',
  'first-step', 'in-his-shoes', 'own-style', 'full-picture', 'decision-map', 'family-round',
  'swipe-first', 'swipe-perfect', 'slang-first',
];
const RUNS = ['new-contact', 'easy-job', 'too-much-known', 'own-people', 'day-in-life', 'coop-48'];
const TESTS: [string, string[]][] = [
  ['trust-scale', ['scout', 'open', 'keeper']],
  ['pressure', ['rock', 'joker', 'fire']],
  ['recognition', ['self', 'close', 'crowd']],
  ['reaction-style', ['guard', 'scout', 'free']],
  ['digital-trust', ['balance', 'watch', 'trust']],
  ['generation-language', ['native', 'inside', 'outside']],
];
/** Рекорды и опыт игр «Лаборатории» (ключи echo.proto.*) */
const PROTO = [
  'xp', 'glitch_wins', 'imp_best', 'imp_streak', 'imp_wins', 'net', 'post_b', 'post_egg', 'post_lv',
  'post_stamps', 'race', 'safe_gems', 'safe_lv', 'safe_wins', 'windows_b', 'windows_lv',
  'detective_e', 'detective_lv', 'detective_s',
];
const GAMES = ['swipe', 'slang'];

const PROGRESS_KEY = 'echo.progress.v1';
const GAMES_KEY = 'echo.games.v1';
const VERSION = 1;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // без I, O, 0, 1: их путают
const PREFIX = 'ECHO';

// Номера записей после значков: роль, пройденные истории, тесты, рекорды
const SLOT_ROLE = 0;
const SLOT_RUNS = 1;
const SLOT_TESTS = SLOT_RUNS + RUNS.length;
const SLOT_PROTO = SLOT_TESTS + TESTS.length;
const SLOT_GAMES = SLOT_PROTO + PROTO.length;

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.round(v) : 0);
const readJson = (key: string): Record<string, unknown> => {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(key) ?? '{}');
    return typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
};

function checksum(bytes: number[]): number {
  let h = 0x811c9dc5;
  for (const b of bytes) h = Math.imul(h ^ b, 0x01000193) >>> 0;
  return h & 0xffff;
}

function pushVarint(out: number[], n: number) {
  let v = Math.min(n, 0x0fffffff);
  while (v >= 0x80) {
    out.push((v & 0x7f) | 0x80);
    v >>>= 7;
  }
  out.push(v);
}

function toBase32(bytes: number[]): string {
  let bits = 0;
  let acc = 0;
  let out = '';
  for (const b of bytes) {
    acc = (acc << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(acc >>> (bits - 5)) & 31];
      bits -= 5;
    }
    acc &= (1 << bits) - 1;
  }
  if (bits > 0) out += ALPHABET[(acc << (5 - bits)) & 31];
  return out;
}

function fromBase32(text: string): number[] | null {
  const bytes: number[] = [];
  let bits = 0;
  let acc = 0;
  for (const ch of text) {
    const v = ALPHABET.indexOf(ch);
    if (v < 0) return null;
    acc = (acc << 5) | v;
    bits += 5;
    if (bits >= 8) {
      bytes.push((acc >>> (bits - 8)) & 255);
      bits -= 8;
    }
    acc &= (1 << bits) - 1;
  }
  return bytes;
}

/** Собирает код из того, что сейчас лежит в телефоне */
export function makeProgressCode(): string {
  const progress = readJson(PROGRESS_KEY);
  const games = readJson(GAMES_KEY);
  const have = Array.isArray(progress.badges) ? (progress.badges as unknown[]) : [];
  const runs = (typeof progress.runs === 'object' && progress.runs ? progress.runs : {}) as Record<string, unknown>;
  const tests = (typeof progress.tests === 'object' && progress.tests ? progress.tests : {}) as Record<string, unknown>;

  const bytes: number[] = [VERSION];
  // Значки одной маской: 29 штук умещаются в четыре байта
  let mask = 0;
  BADGES.forEach((id, i) => {
    if (have.includes(id)) mask |= 1 << i;
  });
  for (let i = 0; i < 4; i++) bytes.push((mask >>> (i * 8)) & 255);

  const entry = (slot: number, value: number) => {
    if (value <= 0) return;
    pushVarint(bytes, slot);
    pushVarint(bytes, value);
  };
  entry(SLOT_ROLE, progress.role === 'teen' ? 1 : progress.role === 'adult' ? 2 : 0);
  RUNS.forEach((id, i) => entry(SLOT_RUNS + i, num(runs[id])));
  TESTS.forEach(([id, keys], i) => entry(SLOT_TESTS + i, keys.indexOf(String(tests[id])) + 1));
  PROTO.forEach((k, i) => {
    const raw = Number(localStorage.getItem('echo.proto.' + k));
    entry(SLOT_PROTO + i, num(raw));
  });
  GAMES.forEach((k, i) => entry(SLOT_GAMES + i, num(games[k]) + (typeof games[k] === 'number' ? 1 : 0)));

  const sum = checksum(bytes);
  bytes.push(sum >>> 8, sum & 255);
  const body = toBase32(bytes).match(/.{1,5}/g) ?? [];
  return [PREFIX, ...body].join('-');
}

export type RestoreResult = { ok: true } | { ok: false; error: string };

/** Проверяет код и, если он верный, заменяет прогресс в телефоне */
export function restoreProgressCode(input: string): RestoreResult {
  let text = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (text.startsWith(PREFIX)) text = text.slice(PREFIX.length);
  if (text.length < 8) return { ok: false, error: 'Код слишком короткий. Проверь, что скопировал его целиком.' };
  const bytes = fromBase32(text);
  if (!bytes || bytes.length < 7) {
    return { ok: false, error: 'В коде есть лишние символы. Проверь, нет ли ошибки.' };
  }
  const sumPos = bytes.length - 2;
  if (checksum(bytes.slice(0, sumPos)) !== ((bytes[sumPos] << 8) | bytes[sumPos + 1])) {
    return { ok: false, error: 'Код не подошёл: где-то ошибка. Введи его ещё раз, по буквам.' };
  }
  if (bytes[0] !== VERSION) return { ok: false, error: 'Этот код от другой версии приложения.' };

  let mask = 0;
  for (let i = 0; i < 4; i++) mask |= bytes[1 + i] << (i * 8);
  const badges = BADGES.filter((_, i) => (mask >>> i) & 1);

  const values = new Map<number, number>();
  let pos = 5;
  const readVarint = (): number | null => {
    let v = 0;
    let shift = 0;
    while (pos < sumPos) {
      const b = bytes[pos++];
      v |= (b & 0x7f) << shift;
      if (!(b & 0x80)) return v;
      shift += 7;
      if (shift > 28) return null;
    }
    return null;
  };
  while (pos < sumPos) {
    const slot = readVarint();
    const value = readVarint();
    if (slot === null || value === null) return { ok: false, error: 'Код повреждён.' };
    values.set(slot, value);
  }

  const role = values.get(SLOT_ROLE);
  const runs: Record<string, number> = {};
  RUNS.forEach((id, i) => {
    const v = values.get(SLOT_RUNS + i);
    if (v) runs[id] = v;
  });
  const tests: Record<string, string> = {};
  TESTS.forEach(([id, keys], i) => {
    const v = values.get(SLOT_TESTS + i);
    if (v && keys[v - 1]) tests[id] = keys[v - 1];
  });
  const games: Record<string, number> = {};
  GAMES.forEach((k, i) => {
    const v = values.get(SLOT_GAMES + i);
    if (v) games[k] = v - 1;
  });

  try {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ role: role === 1 ? 'teen' : role === 2 ? 'adult' : null, badges, runs, tests }),
    );
    if (Object.keys(games).length) localStorage.setItem(GAMES_KEY, JSON.stringify(games));
    else localStorage.removeItem(GAMES_KEY);
    PROTO.forEach((k, i) => {
      const v = values.get(SLOT_PROTO + i);
      if (v) localStorage.setItem('echo.proto.' + k, String(v));
      else localStorage.removeItem('echo.proto.' + k);
    });
  } catch {
    return { ok: false, error: 'Не получилось сохранить: в этом браузере запрещена память.' };
  }
  return { ok: true };
}
