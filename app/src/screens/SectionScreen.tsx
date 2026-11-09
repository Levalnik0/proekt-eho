import { labUnlocked } from '../games/lab';
import type { ReactNode } from 'react';
import {
  IconAdultChild,
  IconBack,
  IconBubble,
  IconCompass,
  IconDuel,
  IconFilter,
  IconFort,
  IconGamepad,
  IconMagnifier,
  IconMirror,
  IconNet,
  IconPerson,
  IconRace,
  IconSwipe,
  IconTogether,
  IconWindows,
} from '../components/icons';
import { buzz } from '../fx';
import { useProgress } from '../progress/useProgress';
import { tileStyle, type Activity, type Section } from '../routes';

const KIND_ICON: Record<Activity['kind'], (props: { size?: number }) => ReactNode> = {
  quest: IconBubble,
  mirror: IconMirror,
  test: IconPerson,
  game: IconGamepad,
  coop: IconTogether,
  offline: IconCompass,
  checker: IconMagnifier,
  section: IconAdultChild,
};

/** Свой значок у каждой игры: иначе все плитки раздела «Игры» выглядят одинаково */
const ROUTE_ICON: Record<string, (props: { size?: number }) => ReactNode> = {
  'game/swipe': IconSwipe,
  'game/slang': IconBubble,
  'game/lab/duel': IconDuel,
  'game/lab/race': IconRace,
  'game/lab/filter': IconFilter,
  'game/lab/fort': IconFort,
  'game/lab/detective': IconMagnifier,
  'game/lab/net': IconNet,
  'game/lab/windows': IconWindows,
};

/**
 * Раздел: сетка плиток, а не список. На каждой плитке значок и название
 * из одного-двух слов. Подписей вроде «Переписка с выборами · 4 финала»
 * здесь больше нет: они только мешали выбрать, да ещё и подсказывали
 * развязку заранее.
 */
export function SectionScreen({
  section,
  onBack,
  onOpen,
}: {
  section: Section;
  onBack: () => void;
  onOpen: (route: string) => void;
}) {
  const { progress } = useProgress();

  /** Пройденное помечаем галочкой: видно, что осталось */
  const isDone = (route: string) => {
    if (route.startsWith('test/')) return Boolean(progress.tests[route.slice(5)]);
    if (route.startsWith('quest/')) return Boolean(progress.runs[route.slice(6)]);
    if (route === 'coop/48') return Boolean(progress.coop);
    return false;
  };

  return (
    <div className="screen screen--section">
      <div className="topbar">
        <button className="topbar__back" onClick={onBack} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <h1 className="topbar__title">{section.title}</h1>
        <span className="topbar__spacer" />
      </div>

      <ul className="tiles tiles--section stagger">
        {section.activities.filter((a) => !a.route.startsWith('game/lab/') || labUnlocked()).map((a, index) => {
          const Icon = ROUTE_ICON[a.route] ?? KIND_ICON[a.kind];
          return (
            <li key={a.route}>
              <button
                className="tile"
                style={tileStyle(index)}
                onClick={() => {
                  buzz('tap');
                  onOpen(a.route);
                }}
              >
                <span className="tile__badge">
                  <Icon size={26} />
                </span>
                <span className="tile__label">{a.label}</span>
                {isDone(a.route) && (
                  <span className="tile__done" role="img" aria-label="пройдено">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="m5 12.5 4.5 4.5L19 7.5"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
