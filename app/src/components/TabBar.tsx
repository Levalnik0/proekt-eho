import { EchoMark } from './EchoLogo';
import { IconGear, IconPerson } from './icons';
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
              <EchoMark size={30} stroke={10} color={isActive ? undefined : 'currentColor'} />
            )}
            {tab === 'profile' && <IconPerson size={24} />}
            {tab === 'settings' && <IconGear size={24} />}
          </button>
        );
      })}
    </nav>
  );
}
