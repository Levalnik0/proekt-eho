import { IconBack } from '../components/icons';
import { useProgress } from '../progress/useProgress';
import type { Section } from '../routes';

const KIND_LABEL: Record<string, string> = {
  quest: 'Квест',
  mirror: 'Угадай',
  test: 'Тест',
  coop: 'Вдвоём',
  offline: 'Офлайн',
  checker: 'Инструмент',
};

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
  const Icon = section.icon;

  /** Пройденное помечаем — так виден прогресс и то, что осталось */
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

      <div className={`section-hero section-hero--${section.look}`}>
        <Icon size={34} />
      </div>

      <p className="section-lead">{section.lead}</p>

      <ul className="activities stagger">
        {section.activities.map((a) => (
          <li key={a.route}>
            <button className="activity" onClick={() => onOpen(a.route)}>
              <span className="activity__kind">{KIND_LABEL[a.kind]}</span>
              <span className="activity__label">{a.label}</span>
              <span className="activity__hint">{a.hint}</span>
              {isDone(a.route) && <span className="activity__done">пройдено</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
