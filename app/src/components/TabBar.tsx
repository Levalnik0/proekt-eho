import { EchoMark } from './EchoLogo';
import { IconCompass, IconGear, IconMedal } from './icons';
import { TAB_LABEL, TABS, type Tab } from '../routes';

export function TabBar({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label="Основная навигация">
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            className={`tabbar__item${isActive ? ' is-active' : ''}`}
            onClick={() => onSelect(tab)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={TAB_LABEL[tab]}
          >
            {tab === 'home' && (
              <EchoMark size={28} color={isActive ? undefined : 'currentColor'} />
            )}
            {tab === 'club' && <IconCompass size={24} />}
            {tab === 'profile' && <IconMedal size={24} />}
            {tab === 'settings' && <IconGear size={24} />}
            <span className="tabbar__label">{TAB_LABEL[tab]}</span>
          </button>
        );
      })}
    </nav>
  );
}
