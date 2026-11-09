import type { ReactNode } from 'react';
import { EchoMark } from '../components/EchoLogo';
import {
  IconAdultChild,
  IconBubble,
  IconGamepad,
  IconMagnifier,
  IconPerson,
  IconSwipe,
  IconTogether,
} from '../components/icons';
import { buzz, centerOf, rings } from '../fx';
import { bestOf } from '../games/storage';
import { labUnlocked } from '../games/lab';
import { tileStyle } from '../routes';
import { useProgress } from '../progress/useProgress';
import { useTheme } from '../theme/useTheme';

const STORIES = ['new-contact', 'easy-job', 'too-much-known', 'own-people'];
const TESTS = ['trust-scale', 'pressure', 'recognition'];

type Tile = {
  route: string;
  label: string;
  /** Что внутри, три-четыре слова: по одному слову плитки не отличить */
  sub: string;
  Icon: (props: { size?: number }) => ReactNode;
  /** Сколько пройдено: число вместо слова «пройдено» */
  count?: string;
};

/**
 * Главный экран. Выбирать здесь не надо: одна большая кнопка «играть»
 * и шесть плиток из одного слова. Раньше был список из шести одинаковых
 * «таблеток», и глаза разбегались: нажать можно было куда угодно.
 * Роли («подросток / взрослый») больше нет: они видели одно и то же,
 * а взрослому нужна своя дверь, и она теперь просто плитка «Родителям».
 */
export function HomeScreen({ onOpen }: { onOpen: (route: string) => void }) {
  const { progress } = useProgress();
  const { cycle } = useTheme();
  const best = bestOf('swipe');
  const stories = STORIES.filter((id) => progress.runs[id]).length;
  const tests = TESTS.filter((id) => progress.tests[id]).length;

  const tiles: Tile[] = [
    { route: 'games', label: 'Игры', sub: labUnlocked() ? '9 игр на скорость' : '2 игры на скорость', Icon: IconGamepad },
    {
      route: 'stories',
      label: 'Истории',
      sub: 'чат с мошенником',
      Icon: IconBubble,
      count: stories ? `${stories}/${STORIES.length}` : undefined,
    },
    {
      route: 'tests',
      label: 'Кто ты?',
      sub: 'тесты про тебя',
      Icon: IconPerson,
      count: tests ? `${tests}/${TESTS.length}` : undefined,
    },
    { route: 'check-message', label: 'Проверить', sub: 'сообщение на развод', Icon: IconMagnifier },
    { route: 'parents', label: 'Родителям', sub: 'помощь и разговор', Icon: IconAdultChild },
    { route: 'coop/48', label: 'Вместе', sub: 'квест на двоих', Icon: IconTogether },
  ];

  return (
    <div className="screen home2">
      <header className="home2__top">
        <span className="home2__brand">
          <EchoMark size={30} />
          ЭХО
        </span>
        <button
          className="palette-btn"
          aria-label="Сменить цвет"
          onClick={(e) => {
            const origin = centerOf(e.currentTarget);
            buzz('select');
            // Кольца запускает сама смена темы, в правильный момент волны
            cycle(origin);
          }}
        />
      </header>

      {/* Одна строка о том, что это: без неё мама не понимала, зачем приложение */}
      <p className="home2__lead">Как не попасться на развод в сети. Для детей 10–12 лет и родителей.</p>

      <button
        className="play-hero"
        onClick={(e) => {
          const origin = centerOf(e.currentTarget);
          buzz('select');
          rings(origin.x, origin.y);
          onOpen('game/swipe');
        }}
      >
        <span className="play-hero__kicker">Играть</span>
        <span className="play-hero__title">Развод или нет?</span>
        <span className="play-hero__chips">
          <span className="chip">1 мин</span>
          <span className="chip">10 карточек</span>
          {best !== undefined && <span className="chip">рекорд {best}</span>}
        </span>
        <IconSwipe className="play-hero__mark" size={150} />
      </button>

      <ul className="tiles stagger">
        {tiles.map(({ route, label, sub, Icon, count }, index) => (
          <li key={route}>
            <button
              className="tile"
              style={tileStyle(index)}
              onClick={() => {
                buzz('tap');
                onOpen(route);
              }}
            >
              <span className="tile__badge">
                <Icon size={26} />
              </span>
              <span className="tile__label">{label}</span>
              <span className="tile__sub">{sub}</span>
              {count && <span className="tile__count">{count}</span>}
            </button>
          </li>
        ))}
      </ul>

      <p className="home2__trust">Ответы остаются в этом телефоне</p>
    </div>
  );
}
