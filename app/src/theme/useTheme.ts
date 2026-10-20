import { useCallback, useEffect, useState } from 'react';

/** 'ocean' — тема по умолчанию, отдельного CSS-блока не требует (это :root). */
export type ThemeId = 'ocean' | 'pink' | 'violet' | 'coral' | 'neon';

export const THEMES: { id: ThemeId; label: string; swatch: string }[] = [
  { id: 'ocean', label: 'Океан', swatch: '#45a9a8' },
  { id: 'pink', label: 'Розовый', swatch: '#d9607e' },
  { id: 'violet', label: 'Сирень', swatch: '#8b6fd1' },
  { id: 'coral', label: 'Коралл', swatch: '#e2693f' },
  { id: 'neon', label: 'Неон', swatch: '#38e8d8' },
];

const KEY = 'echo.theme.v1';

function read(): ThemeId {
  try {
    const raw = localStorage.getItem(KEY);
    return (THEMES.find((t) => t.id === raw)?.id ?? 'ocean') as ThemeId;
  } catch {
    return 'ocean';
  }
}

function apply(theme: ThemeId) {
  if (theme === 'ocean') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);
}

let current = read();
apply(current);
const listeners = new Set<(t: ThemeId) => void>();

/** Общая тема на всё приложение — как useProgress, но проще: одно значение. */
export function useTheme() {
  const [theme, setThemeState] = useState(current);

  useEffect(() => {
    listeners.add(setThemeState);
    return () => void listeners.delete(setThemeState);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    current = next;
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // приватный режим — тема не переживёт перезапуск, не страшно
    }
    listeners.forEach((fn) => fn(next));
  }, []);

  return { theme, setTheme };
}
