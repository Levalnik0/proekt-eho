import { useEffect } from 'react';
import './App.css';
import { TabBar } from './components/TabBar';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SectionScreen } from './screens/SectionScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ClubScreen } from './screens/ClubScreen';
import { RoleScreen } from './screens/RoleScreen';
import { CheckerScreen } from './checker/CheckerScreen';
import { QuestScreen } from './quest/QuestScreen';
import { MirrorScreen } from './mirror/MirrorScreen';
import { TestScreen } from './tests/TestScreen';
import { CoopScreen } from './coop/CoopScreen';
import type { Quest } from './quest/types';
import type { Mirror } from './mirror/types';
import type { PsyTest } from './tests/types';
import type { Coop } from './coop/types';
import newContact from './data/new-contact.json';
import dayInLife from './data/day-in-life.json';
import mirrorAdult from './data/mirror-adult.json';
import mirrorTeen from './data/mirror-teen.json';
import testsTeen from './data/tests-teen.json';
import testsAdult from './data/tests-adult.json';
import coop48 from './data/coop-48.json';
import { useProgress } from './progress/useProgress';
import { SECTION_BY_ID, TABS, type SectionId, type Tab } from './routes';
import { useHashRoute } from './useHashRoute';

/** Библиотеки сценариев: чтобы добавить историю, достаточно положить JSON и вписать сюда */
const QUESTS: Record<string, Quest> = {
  'new-contact': newContact as Quest,
  'day-in-life': dayInLife as Quest,
};
const MIRRORS: Record<string, Mirror> = {
  adult: mirrorAdult as Mirror,
  teen: mirrorTeen as Mirror,
};
const ALL_TESTS = [...(testsTeen as PsyTest[]), ...(testsAdult as PsyTest[])];
const TESTS = Object.fromEntries(ALL_TESTS.map((t) => [t.id, t])) as Record<string, PsyTest>;
const COOPS: Record<string, Coop> = { '48': coop48 as Coop };

export default function App() {
  const { route, go, back } = useHashRoute();
  const { progress, award, setRole } = useProgress();

  const seg = (prefix: string) => (route.startsWith(prefix) ? route.slice(prefix.length) : null);
  const quest = QUESTS[seg('quest/') ?? ''];
  const mirror = MIRRORS[seg('mirror/') ?? ''];
  const test = TESTS[seg('test/') ?? ''];
  const coop = COOPS[seg('coop/') ?? ''];

  const isTab = (TABS as string[]).includes(route);
  const section = SECTION_BY_ID[route as SectionId];
  // На внутренних экранах в таб-баре остаётся подсвеченной «Главная»
  const activeTab: Tab = isTab ? (route as Tab) : 'home';

  // Первая медаль взрослому — просто за то, что зашёл посмотреть
  useEffect(() => {
    if (route === 'adult') award(['first-step']);
  }, [route, award]);

  // Обязательно внутри .app: там задана максимальная ширина,
  // иначе на широком экране карточки растягиваются во всю страницу
  if (!progress.role) {
    return (
      <div className="app">
        <main className="app__body">
          <RoleScreen onPick={setRole} />
        </main>
      </div>
    );
  }

  // Сценарии занимают весь экран: таб-бар прячем, чтобы не рвать историю
  if (quest) {
    return (
      <div className="app">
        <QuestScreen quest={quest} onExit={back} />
      </div>
    );
  }

  const fullscreen = mirror ?? test ?? coop;
  if (fullscreen) {
    return (
      <div className="app">
        <main className="app__body">
          {mirror && <MirrorScreen mirror={mirror} onExit={back} />}
          {test && (
            <TestScreen
              test={test}
              allOfRole={ALL_TESTS.filter((t) => t.role === test.role).map((t) => t.id)}
              onExit={back}
            />
          )}
          {coop && <CoopScreen coop={coop} onExit={back} />}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="app__body">
        {route === 'profile' && <ProfileScreen />}
        {route === 'settings' && <SettingsScreen />}
        {route === 'club-program' && <ClubScreen onBack={back} />}
        {route === 'check-message' && <CheckerScreen onExit={back} />}
        {section && <SectionScreen section={section} onBack={back} onOpen={go} />}
        {!section && !['profile', 'settings', 'club-program', 'check-message'].includes(route) && (
          <HomeScreen onOpen={(id) => go(id)} />
        )}
      </main>

      <TabBar active={activeTab} onSelect={(tab) => go(tab)} />
    </div>
  );
}
