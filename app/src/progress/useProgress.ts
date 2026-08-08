import { useCallback, useEffect, useState } from 'react';
import type { Role } from './badges';

const KEY = 'echo.progress.v1';

export type Progress = {
  /** Кто держит телефон. null — роль ещё не выбрана */
  role: Role | null;
  /** id полученных медалей в порядке получения */
  badges: string[];
  /** id пройденных квестов и сколько раз */
  runs: Record<string, number>;
  /** id теста → ключ результата */
  tests: Record<string, string>;
  /** Последняя «Карта решений» совместного прохождения */
  coop?: CoopRun;
};

/**
 * Результат совместного квеста — из него рисуется «Карта решений».
 * together — оба пошли навстречу, closed — оба закрылись,
 * crossed — один открылся, другой нет. Третье состояние нужно:
 * «оба промолчали» — это не то же самое, что «мы вместе».
 */
export type CoopState = 'together' | 'closed' | 'crossed';

export type CoopRun = {
  questId: string;
  finishedAt: number;
  steps: { title: string; teen: string; adult: string; state: CoopState }[];
};

const EMPTY: Progress = { role: null, badges: [], runs: {}, tests: {} };

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<Progress>;
    return {
      role: p.role ?? null,
      badges: p.badges ?? [],
      runs: p.runs ?? {},
      tests: p.tests ?? {},
      coop: p.coop,
    };
  } catch {
    return EMPTY;
  }
}

/** Общее состояние на всё приложение: экраны должны видеть одни и те же медали */
let current = read();
const listeners = new Set<(p: Progress) => void>();

function commit(next: Progress) {
  current = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // приватный режим — прогресс просто не переживёт перезапуск
  }
  listeners.forEach((fn) => fn(next));
}

export function useProgress() {
  const [progress, setProgress] = useState(current);

  useEffect(() => {
    listeners.add(setProgress);
    return () => void listeners.delete(setProgress);
  }, []);

  /** Возвращает медали, которых ещё не было — чтобы показать их карточкой */
  const award = useCallback((ids: (string | undefined)[]) => {
    const wanted = ids.filter(Boolean) as string[];
    const fresh = wanted.filter((id) => !current.badges.includes(id));
    if (fresh.length) commit({ ...current, badges: [...current.badges, ...fresh] });
    return fresh;
  }, []);

  const countRun = useCallback((questId: string) => {
    const runs = { ...current.runs, [questId]: (current.runs[questId] ?? 0) + 1 };
    commit({ ...current, runs });
    return runs[questId];
  }, []);

  const saveTest = useCallback((testId: string, resultKey: string) => {
    commit({ ...current, tests: { ...current.tests, [testId]: resultKey } });
  }, []);

  const saveCoop = useCallback((run: CoopRun) => {
    commit({ ...current, coop: run });
  }, []);

  const setRole = useCallback((role: Role) => {
    commit({ ...current, role });
  }, []);

  const reset = useCallback(() => commit({ ...EMPTY, role: current.role }), []);

  const has = useCallback((id: string) => progress.badges.includes(id), [progress.badges]);

  return { progress, award, countRun, saveTest, saveCoop, setRole, reset, has };
}
