import flagsData from '../data/flags.json';

export type Flag = { id: string; weight: number; title: string; why: string; stems: string[] };
export type Signal = {
  id: string;
  weight: number;
  title: string;
  why: string;
  pattern: string;
  /** Для поиска ЗАГЛАВНЫХ регистр важен, для остальных — нет */
  caseSensitive?: boolean;
};
export type Hit = { id: string; title: string; why: string; weight: number; quotes: string[] };

const FLAGS = flagsData.flags as Flag[];
const SIGNALS = (flagsData.signals as Signal[]).map((s) => ({
  ...s,
  re: new RegExp(s.pattern, s.caseSensitive ? 'g' : 'gi'),
}));

/**
 * Приводим слово к сравнимому виду: русский текст пишут как попало —
 * с «ё», без неё, капслоком, с лишними знаками.
 */
const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ');

/**
 * Разбор ищет не точные фразы, а КОРНИ слов и структурные признаки.
 * Из-за этого работает на произвольном тексте: «переведи», «перевод»,
 * «переведите» — один и тот же корень «перевед».
 *
 * Чего разбор не умеет: понимать смысл целиком, иронию и контекст.
 * Поэтому в интерфейсе всегда есть чек-лист вопросов, который
 * не зависит от слов.
 */
export function analyse(raw: string): Hit[] {
  const text = norm(raw);
  if (!text.trim()) return [];

  const hits: Hit[] = [];

  for (const flag of FLAGS) {
    const quotes: string[] = [];
    for (const stem of flag.stems) {
      const at = text.indexOf(norm(stem));
      if (at === -1) continue;
      const quote = expand(raw, at, norm(stem).length);
      if (quote && !quotes.some((q) => norm(q) === norm(quote))) quotes.push(quote);
      if (quotes.length === 2) break; // двух примеров достаточно, дальше это шум
    }
    if (quotes.length) {
      hits.push({ id: flag.id, title: flag.title, why: flag.why, weight: flag.weight, quotes });
    }
  }

  for (const s of SIGNALS) {
    s.re.lastIndex = 0;
    const found = [...raw.matchAll(s.re)].map((m) => m[0]).filter(Boolean);
    if (found.length) {
      const quotes = [...new Set(found)].slice(0, 2);
      hits.push({ id: s.id, title: s.title, why: s.why, weight: s.weight, quotes });
    }
  }

  // Сначала то, что тревожнее
  return hits.sort((a, b) => b.weight - a.weight);
}

/**
 * Совпадение по корню дотягиваем до целых слов, иначе в цитате
 * окажется обрубок вроде «бесплатн» и разбор перестанет убеждать.
 */
function expand(source: string, start: number, length: number) {
  const stop = /[\s.,!?;:()«»"'\n]/;
  let from = start;
  let to = start + length;
  while (from > 0 && !stop.test(source[from - 1])) from--;
  while (to < source.length && !stop.test(source[to])) to++;
  return source.slice(from, to).trim();
}

export const CHECKLIST = flagsData.checklist as string[];
export const SAMPLES = flagsData.samples as { label: string; text: string }[];
export const VERDICTS = flagsData.verdicts as {
  min: number;
  tone: 'ok' | 'warn' | 'bad';
  title: string;
  text: string;
}[];
