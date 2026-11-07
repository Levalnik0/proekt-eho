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
      { route: 'game/slang', label: 'Сленг-блиц', kind: 'game' },
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
      { route: 'club-program', label: 'Клуб навигаторов', kind: 'offline' },
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

export type Tab = 'home' | 'profile' | 'settings';
export const TABS: Tab[] = ['home', 'profile', 'settings'];
export const TAB_LABEL: Record<Tab, string> = {
  home: 'Главная',
  profile: 'Медали',
  settings: 'Настройки',
};
