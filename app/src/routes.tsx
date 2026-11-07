import type { CSSProperties } from 'react';

/**
 * Цвета плиток. У каждой плитки свой цвет, иначе все значки сливаются
 * в одинаковые кружки и по ним не понять, что где. Белый значок на каждом
 * читается (контраст не меньше 4,3 к 1).
 */
const TILE_COLORS = ['#c2571a', '#6d4fc2', '#b83a6a', '#1f7f88', '#a8661a', '#2a7d48'];
export const tileStyle = (index: number): CSSProperties => {
  const c = TILE_COLORS[index % TILE_COLORS.length];
  return {
    ['--tile-bg' as string]: `linear-gradient(145deg, ${c}, color-mix(in srgb, ${c} 68%, #000))`,
  };
};

export type SectionId = 'games' | 'stories' | 'tests' | 'parents' | 'understand';

/** Что можно запустить внутри раздела */
export type Activity = {
  route: string;
  /**
   * Одно-два слова. На экране выбора читать нечего, только нажимать:
   * подписей, меток и описаний здесь нарочно нет, глаза не должны разбегаться.
   */
  label: string;
  kind: 'quest' | 'mirror' | 'test' | 'game' | 'coop' | 'offline' | 'checker' | 'section';
};

export type Section = {
  id: SectionId;
  title: string;
  activities: Activity[];
};

export const SECTIONS: Section[] = [
  {
    id: 'games',
    title: 'Игры',
    activities: [
      { route: 'game/swipe', label: 'Развод или нет?', kind: 'game' },
      // Игры на отдельной странице (рамка в App.tsx): теперь открыты всем,
      // без кода. Лучшие стоят выше: их дети называют «самыми моими»
      { route: 'game/lab/duel', label: 'Дуэль паролей', kind: 'game' },
      { route: 'game/lab/race', label: 'Автодром слов', kind: 'game' },
      { route: 'game/lab/filter', label: 'Фильтр', kind: 'game' },
      { route: 'game/slang', label: 'Сленг-блиц', kind: 'game' },
      { route: 'game/lab/fort', label: 'Крепость', kind: 'game' },
      { route: 'game/lab/detective', label: 'Детектив', kind: 'game' },
      { route: 'game/lab/net', label: 'Сеть', kind: 'game' },
      { route: 'game/lab/windows', label: 'Окна', kind: 'game' },
    ],
  },
  {
    id: 'stories',
    title: 'Истории',
    activities: [
      { route: 'quest/new-contact', label: 'Новый контакт', kind: 'quest' },
      { route: 'quest/easy-job', label: 'Лёгкий заработок', kind: 'quest' },
      { route: 'quest/too-much-known', label: 'Слишком много знают', kind: 'quest' },
      { route: 'quest/own-people', label: 'Свои', kind: 'quest' },
    ],
  },
  {
    id: 'tests',
    title: 'Кто ты?',
    activities: [
      { route: 'test/trust-scale', label: 'Шкала доверия', kind: 'test' },
      { route: 'test/pressure', label: 'Давление', kind: 'test' },
      { route: 'test/recognition', label: 'Признание', kind: 'test' },
      { route: 'mirror/teen', label: 'Угадай взрослого', kind: 'mirror' },
    ],
  },
  {
    // Не «типы контента», а ситуации: родитель приходит с вопросом,
    // а не за курсом. Сообщение, тревога, желание понять.
    id: 'parents',
    title: 'Родителям',
    activities: [
      { route: 'check-message', label: 'Проверить сообщение', kind: 'checker' },
      { route: 'crisis-protocol', label: 'Что делать сейчас', kind: 'checker' },
      { route: 'understand', label: 'Понять его', kind: 'section' },
    ],
  },
  {
    id: 'understand',
    title: 'Понять его',
    activities: [
      { route: 'quest/day-in-life', label: 'День из жизни', kind: 'quest' },
      { route: 'mirror/adult', label: 'Угадай ребёнка', kind: 'mirror' },
      { route: 'test/reaction-style', label: 'Стиль реакции', kind: 'test' },
      { route: 'test/digital-trust', label: 'Цифровое доверие', kind: 'test' },
      { route: 'test/generation-language', label: 'Язык поколений', kind: 'test' },
    ],
  },
];

export const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<
  SectionId,
  Section
>;

/**
 * «Клуб» — отдельная вкладка, а не плитка у родителей: код от ведущего
 * вводят и дети, и взрослые на очной встрече, искать его некогда.
 */
export type Tab = 'home' | 'club' | 'profile' | 'settings';
export const TABS: Tab[] = ['home', 'club', 'profile', 'settings'];
export const TAB_LABEL: Record<Tab, string> = {
  home: 'Главная',
  club: 'Клуб',
  profile: 'Медали',
  settings: 'Настройки',
};
