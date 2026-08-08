import { EchoAppIcon } from '../components/EchoLogo';
import { MenuButton } from '../components/MenuButton';
import { SECTIONS, type SectionId } from '../routes';

export function HomeScreen({ onOpen }: { onOpen: (id: SectionId) => void }) {
  return (
    <div className="screen screen--home">
      <header className="hero">
        <EchoAppIcon size={76} />
        <h1 className="hero__title">Проект Эхо</h1>
        <p className="hero__subtitle">
          «Интерактивный мост
          <br />
          доверия для 10–11 лет»
        </p>
      </header>

      <ul className="menu">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <MenuButton section={section} onClick={() => onOpen(section.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
