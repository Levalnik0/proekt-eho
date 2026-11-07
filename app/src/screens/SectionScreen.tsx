import type { ReactNode } from 'react';
import {
  IconAdultChild,
  IconBack,
  IconBubble,
  IconCompass,
  IconGamepad,
  IconMagnifier,
  IconMirror,
  IconPerson,
  IconTogether,
} from '../components/icons';
import { buzz } from '../fx';
import { labUnlocked } from '../games/lab';
import { useProgress } from '../progress/useProgress';
import type { Activity, Section } from '../routes';

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
        <span className="topbar__title">{section.title}</span>
        <span className="topbar__spacer" />
      </div>

      <ul className="tiles tiles--section stagger">
        {[
          ...section.activities,
          // После ввода кода в «Клубе» в играх появляется «Лаборатория»
          ...(section.id === 'games' && labUnlocked()
            ? [{ route: 'game/lab', label: 'Лаборатория', kind: 'game' as const }]
            : []),
        ].map((a) => {
          const Icon = KIND_ICON[a.kind];
          return (
            <li key={a.route}>
              <button
                className="tile"
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
