import { useEffect, useRef, useState } from 'react';
import './App.css';
import { TabBar } from './components/TabBar';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SectionScreen } from './screens/SectionScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ClubScreen } from './screens/ClubScreen';
import { CrisisScreen } from './screens/CrisisScreen';
import { ColorScreen } from './screens/ColorScreen';
import { CheckerScreen } from './checker/CheckerScreen';
import { QuestScreen } from './quest/QuestScreen';
import { MirrorScreen } from './mirror/MirrorScreen';
import { TestScreen } from './tests/TestScreen';
import { CoopScreen } from './coop/CoopScreen';
import { SwipeGame } from './games/SwipeGame';
import { SlangGame } from './games/SlangGame';
import { labUnlocked } from './games/lab';
import type { Quest } from './quest/types';
import type { Mirror } from './mirror/types';
import type { PsyTest } from './tests/types';
import type { Coop } from './coop/types';
import newContact from './data/new-contact.json';
import easyJob from './data/easy-job.json';
import tooMuchKnown from './data/too-much-known.json';
import ownPeople from './data/own-people.json';
import dayInLife from './data/day-in-life.json';
import mirrorAdult from './data/mirror-adult.json';
import mirrorTeen from './data/mirror-teen.json';
import testsTeen from './data/tests-teen.json';
import testsAdult from './data/tests-adult.json';
import coop48 from './data/coop-48.json';
import { useProgress } from './progress/useProgress';
import { SECTION_BY_ID, TABS, type Section, type Tab } from './routes';
import { themeChosen } from './theme/useTheme';
import { useHashRoute } from './useHashRoute';

/** Библиотеки сценариев: чтобы добавить историю, достаточно положить JSON и вписать сюда */
const QUESTS: Record<string, Quest> = {
  'new-contact': newContact as Quest,
  'easy-job': easyJob as Quest,
  'too-much-known': tooMuchKnown as Quest,
  'own-people': ownPeople as Quest,
  'day-in-life': dayInLife as Quest,
};
const MIRRORS: Record<string, Mirror> = {
  adult: mirrorAdult as Mirror,
  teen: mirrorTeen as Mirror,
};
const ALL_TESTS = [...(testsTeen as PsyTest[]), ...(testsAdult as PsyTest[])];
const TESTS = Object.fromEntries(ALL_TESTS.map((t) => [t.id, t])) as Record<string, PsyTest>;
const COOPS: Record<string, Coop> = { '48': coop48 as Coop };

/** Экраны для взрослого: по ним определяем, кто держит телефон */
const ADULT_ROUTES = [
  'parents',
  'understand',
  'crisis-protocol',
  'quest/day-in-life',
  'mirror/adult',
];
const TEEN_ROUTES = ['games', 'stories', 'tests'];

/** Экраны с таб-баром, которые не разделы и не вкладки из списка TABS */
const OTHER = ['profile', 'settings', 'club', 'check-message', 'crisis-protocol'];

export default function App() {
  const { route, go, back } = useHashRoute();
  const { progress, award, setRole } = useProgress();
  const [colorDone, setColorDone] = useState(themeChosen);

  // Ссылка может нести параметры: #/game/swipe?beat=8 («Друг набрал 8»)
  const [path, query = ''] = route.split('?');
  const params = new URLSearchParams(query);
  // Ссылку может подделать кто угодно, поэтому «друг набрал» ограничиваем размером раунда
  const beatParam = Number(params.get('beat'));
  const beat =
    params.has('beat') && Number.isInteger(beatParam) && beatParam >= 0 && beatParam <= 10
      ? beatParam
      : undefined;

  // Имена из адреса ищем только среди своих ключей: иначе #/quest/constructor
  // нашёл бы функцию из прототипа объекта и приложение упало бы
  const own = <T,>(m: Record<string, T>, key: string | null): T | undefined =>
    key !== null && Object.hasOwn(m, key) ? m[key] : undefined;
  const seg = (prefix: string) => (path.startsWith(prefix) ? path.slice(prefix.length) : null);
  const quest = own(QUESTS, seg('quest/'));
  const mirror = own(MIRRORS, seg('mirror/'));
  const test = own(TESTS, seg('test/'));
  const coop = own(COOPS, seg('coop/'));

  const isTab = (TABS as string[]).includes(path);
  const section = own(SECTION_BY_ID as Record<string, Section>, path);
  // На внутренних экранах в таб-баре остаётся подсвеченной «Главная»
  const activeTab: Tab = isTab ? (path as Tab) : 'home';

  // Страница «Лаборатории» живёт в рамке и сама просит вернуться в приложение.
  // Слушаем только эту рамку, а не любое окно с тем же адресом
  const labFrame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (
        e.source === labFrame.current?.contentWindow &&
        e.origin === window.location.origin &&
        e.data?.echoLab === 'exit'
      )
        back();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [back]);

  // Неизвестный адрес не должен молча показывать главную с мусором в строке
  // Игры теперь открыты всем: маршрут game/lab/<игра> запускает нужную сразу,
  // game/lab (меню всех игр) остаётся для тех, кто знает код в «Клубе»
  const labGame = path.startsWith('game/lab/') ? path.slice('game/lab/'.length) : null;
  const labOpen = labGame !== null || (path === 'game/lab' && labUnlocked());
  const known =
    isTab ||
    Boolean(section || quest || mirror || test || coop) ||
    labOpen ||
    ['game/swipe', 'game/slang', ...OTHER].includes(path);
  useEffect(() => {
    if (!known) window.location.replace('#/home');
  }, [known]);

  // При смене экрана: название вкладки, прокрутка вверх и фокус на заголовок,
  // чтобы скринридер сказал, где человек оказался. На самый первый показ
  // фокус не переносим, чтобы не прыгать при открытии приложения.
  const firstScreen = useRef(true);
  useEffect(() => {
    const heading = document.querySelector<HTMLElement>('main h1, main h2, h1');
    document.title = heading?.textContent ? `${heading.textContent} — Эхо` : 'Проект Эхо';
    document.querySelector('.app__body')?.scrollTo({ top: 0 });
    if (firstScreen.current) {
      firstScreen.current = false;
      return;
    }
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [path, colorDone]);

  // Первая медаль взрослому: просто за то, что зашёл посмотреть
  useEffect(() => {
    if (path === 'parents') award(['first-step']);
  }, [path, award]);

  // Выбора роли в начале больше нет: кто с телефоном, видно по тому,
  // куда человек заходит. От роли зависит только первая вкладка в медалях
  // и какая медаль выдаётся за проверку сообщения.
  useEffect(() => {
    const adult = ADULT_ROUTES.includes(path) || test?.role === 'adult';
    const teen = TEEN_ROUTES.includes(path) || path.startsWith('game/') || test?.role === 'teen';
    const next = adult ? 'adult' : teen ? 'teen' : null;
    if (next && progress.role !== next) setRole(next);
  }, [path, test, progress.role, setRole]);

  // Обязательно внутри .app: там задана максимальная ширина,
  // иначе на широком экране карточки растягиваются во всю страницу
  if (!colorDone) {
    return (
      <div className="app">
        <main className="app__body">
          <ColorScreen onDone={() => setColorDone(true)} />
        </main>
      </div>
    );
  }

  // Сценарии и игры занимают весь экран: таб-бар прячем, чтобы не рвать игру
  if (quest) {
    return (
      <div className="app" role="main">
        <QuestScreen key={quest.id} quest={quest} onExit={back} />
      </div>
    );
  }

  if (path === 'game/swipe') {
    return (
      <div className="app" role="main">
        <SwipeGame onExit={back} beat={beat} />
      </div>
    );
  }

  // «Лаборатория»: пять новых игр на отдельной странице, открывается кодом
  if (labOpen) {
    return (
      <div className="app" role="main">
        <iframe
          ref={labFrame}
          title="Лаборатория игр"
          src={`${import.meta.env.BASE_URL}lab/index.html${labGame ? `?game=${encodeURIComponent(labGame)}` : ''}`}
          style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    );
  }

  if (path === 'game/slang') {
    return (
      <div className="app" role="main">
        <SlangGame onExit={back} />
      </div>
    );
  }

  const fullscreen = mirror ?? test ?? coop;
  if (fullscreen) {
    return (
      <div className="app">
        <main className="app__body">
          {mirror && <MirrorScreen key={mirror.id} mirror={mirror} onExit={back} />}
          {test && (
            <TestScreen
              key={test.id}
              test={test}
              allOfRole={ALL_TESTS.filter((t) => t.role === test.role).map((t) => t.id)}
              onExit={back}
            />
          )}
          {coop && <CoopScreen key={coop.id} coop={coop} onExit={back} />}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="app__body">
        {path === 'profile' && <ProfileScreen />}
        {path === 'settings' && <SettingsScreen />}
        {path === 'club' && <ClubScreen onBack={back} onOpenLab={() => go('game/lab')} />}
        {path === 'check-message' && <CheckerScreen onExit={back} />}
        {path === 'crisis-protocol' && <CrisisScreen onBack={back} />}
        {section && <SectionScreen section={section} onBack={back} onOpen={go} />}
        {!section && !OTHER.includes(path) && <HomeScreen onOpen={go} />}
      </main>

      <TabBar active={activeTab} onSelect={(tab) => go(tab, { replace: true })} />
    </div>
  );
}
