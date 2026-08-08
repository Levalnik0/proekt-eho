import { IconChevron } from './icons';
import type { Section } from '../routes';

export function MenuButton({ section, onClick }: { section: Section; onClick: () => void }) {
  const Icon = section.icon;
  return (
    <button className="menu-item" onClick={onClick} aria-label={section.title}>
      <span className={`menu-item__badge menu-item__badge--${section.look}`}>
        <Icon size={section.look === 'gradient' ? 24 : 26} />
      </span>

      <span className="menu-item__labels">
        {section.overline && <span className="menu-item__overline">{section.overline}</span>}
        <span className="menu-item__title">{section.title}</span>
      </span>

      <IconChevron className="menu-item__chevron" />
    </button>
  );
}
