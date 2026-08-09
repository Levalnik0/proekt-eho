import type { ReactNode } from 'react';
import {
  IconAdultChild,
  IconCompass,
  IconGamepad,
  IconMagnifier,
  IconRing,
  IconTogether,
} from './components/icons';

export type SectionId = 'teen' | 'adult' | 'together' | 'quest48' | 'club' | 'checker';

/** Что можно запустить внутри раздела */
export type Activity = {
  route: string;
  label: string;
  /** Подпись под названием */
  hint: string;
  kind: 'quest' | 'mirror' | 'test' | 'coop' | 'offline' | 'checker';
};

export type Section = {
  id: SectionId;
  title: string;
  icon: (props: { size?: number }) => ReactNode;
  /** gradient — залитый круг с белым глифом, outline — белый круг с бирюзовым контуром */
  look: 'gradient' | 'outline';
  lead: string;
  activities: Activity[];
};

export const SECTIONS: Section[] = [
  {
    id: 'teen',
    title: '«Я подросток»',
    icon: IconGamepad,
    look: 'gradient',
    lead: 'Опасные ситуации в формате переписки — и три теста про то, как устроен именно ты.',
    activities: [
      {
        route: 'quest/new-contact',
        label: 'Квест «Новый контакт»',
        hint: 'Переписка с выборами · 4 финала',
        kind: 'quest',
      },
      {
        route: 'mirror/teen',
        label: 'А что ответит твой взрослый?',
        hint: 'Угадай, что у него внутри',
        kind: 'mirror',
      },
      {
        route: 'test/trust-scale',
        label: 'Шкала доверия',
        hint: 'Тест · 5 вопросов',
        kind: 'test',
      },
      {
        route: 'test/pressure',
        label: 'Реакция на давление',
        hint: 'Тест · 5 вопросов',
        kind: 'test',
      },
      {
        route: 'test/recognition',
        label: 'Потребность в признании',
        hint: 'Тест · 5 вопросов',
        kind: 'test',
      },
    ],
  },
  {
    id: 'adult',
    title: '«Я взрослый»',
    icon: IconAdultChild,
    look: 'gradient',
    lead: 'Здесь не проверяют вас. Здесь можно посмотреть на его день изнутри и проверить свои догадки.',
    activities: [
      {
        route: 'quest/day-in-life',
        label: 'Квест «День из жизни»',
        hint: 'Один день от лица ребёнка',
        kind: 'quest',
      },
      {
        route: 'mirror/adult',
        label: 'Как думаете, что он ответил?',
        hint: 'Пять ситуаций · проверяют догадку',
        kind: 'mirror',
      },
      {
        route: 'test/reaction-style',
        label: 'Стиль реакции',
        hint: 'Тест · 5 вопросов',
        kind: 'test',
      },
      {
        route: 'test/digital-trust',
        label: 'Уровень цифрового доверия',
        hint: 'Тест · 5 вопросов',
        kind: 'test',
      },
      {
        route: 'test/generation-language',
        label: 'Язык поколений',
        hint: 'Тест · 5 вопросов',
        kind: 'test',
      },
    ],
  },
  {
    id: 'together',
    title: '«Мы вместе»',
    icon: IconTogether,
    look: 'gradient',
    lead: 'Одни выходные с двух сторон. Решения одного меняют то, что происходит у другого.',
    activities: [
      {
        route: 'coop/48',
        label: 'Кооп-квест «48 часов»',
        hint: 'Вдвоём · паузы для разговора · Карта решений',
        kind: 'coop',
      },
    ],
  },
  {
    id: 'quest48',
    title: '«Квест: 48 часов»',
    icon: IconRing,
    look: 'outline',
    lead: 'Четыре точки за выходные, где взрослый и ребёнок выбирают каждый за себя.',
    activities: [
      {
        route: 'coop/48',
        label: 'Начать квест',
        hint: 'Телефон передаётся из рук в руки',
        kind: 'coop',
      },
    ],
  },
  {
    id: 'checker',
    title: 'Проверка сообщения',
    icon: IconMagnifier,
    look: 'gradient',
    lead: 'Пришло странное сообщение? Вставьте его — покажем, какие приёмы в нём спрятаны.',
    activities: [
      {
        route: 'check-message',
        label: 'Разобрать сообщение',
        hint: 'Работает без интернета · текст никуда не уходит',
        kind: 'checker',
      },
    ],
  },
  {
    id: 'club',
    title: '«Клуб навигаторов»',
    icon: IconCompass,
    look: 'outline',
    lead: 'Очные встречи в школах: играют не по одному, а вместе — и придумывают новые истории для приложения.',
    activities: [
      {
        route: 'club-program',
        label: 'Программа встречи',
        hint: 'Сценарий на 90 минут для ведущего',
        kind: 'offline',
      },
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
