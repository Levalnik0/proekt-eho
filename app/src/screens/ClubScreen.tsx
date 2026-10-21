import { useState } from 'react';
import { IconBack } from '../components/icons';

/**
 * Формат офлайн-встреч ещё обсуждается, поэтому программа не видна всем
 * подряд — открывается кодом, который называет ведущий на самой встрече.
 * Это не защита данных, а просто занавес: код живёт в коде приложения,
 * без сервера.
 */
const CLUB_CODE = 'навигатор90';
const UNLOCK_KEY = 'echo.club.unlocked';

function useClubGate() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(UNLOCK_KEY) === '1';
    } catch {
      return false;
    }
  });

  const tryUnlock = (code: string) => {
    const ok = code.trim().toLowerCase() === CLUB_CODE;
    if (ok) {
      setUnlocked(true);
      try {
        localStorage.setItem(UNLOCK_KEY, '1');
      } catch {
        // приватный режим — просто не запомнится между визитами
      }
    }
    return ok;
  };

  return { unlocked, tryUnlock };
}

/**
 * Программа офлайн-встречи «Клуб навигаторов».
 * Экран нужен ведущему — школьному психологу или классному руководителю,
 * поэтому здесь тайминг и реплики, а не общие слова.
 */
const PROGRAM = [
  {
    time: '0–10 мин',
    title: 'Вход без представлений',
    text: 'Не «расскажите о себе», а сразу дело: каждый пишет на стикере одно слово из интернета, которое, по его мнению, не знает человек напротив. Взрослые и дети — вперемешку.',
  },
  {
    time: '10–25 мин',
    title: 'Смена ролей',
    text: 'Дети получают роль родителя, взрослые — роль десятилетнего. Разыгрывается сцена «телефон за ужином». Задача не сыграть смешно, а продержаться в роли до конца.',
  },
  {
    time: '25–40 мин',
    title: 'Разбор без победителей',
    text: 'Вопрос по кругу — один и тот же: «Что было труднее всего в вашей роли?» Ведущий не комментирует ответы и не подводит к морали.',
  },
  {
    time: '40–60 мин',
    title: 'Квест в парах',
    text: 'Пары «взрослый + ребёнок» (не свои — чужие) проходят «48 часов» в приложении. В точках паузы телефон откладывается: обсуждение вслух.',
  },
  {
    time: '60–75 мин',
    title: 'Карта решений на стене',
    text: 'Пары переносят свои расхождения на общий ватман. Видно: расходятся все, и примерно в одних и тех же местах. Это снимает ощущение «только у нас так».',
  },
  {
    time: '75–90 мин',
    title: 'Своя история',
    text: 'Дети придумывают новую ситуацию для квеста — то, что было с ними или с друзьями. Лучшие сценарии психолог заносит в приложение, автор указывается.',
  },
];

const RULES = [
  'Никаких «правильных» ответов от ведущего. Ведущий задаёт вопросы, а не подводит итоги.',
  'Пары составляются из чужих взрослых и детей. Со своим родителем ребёнок играет роль, а не себя.',
  'Ничего из сказанного на встрече не выносится родителям поимённо.',
  'Взрослый, который отказался играть роль ребёнка, остаётся наблюдателем без уговоров.',
];

export function ClubScreen({ onBack }: { onBack: () => void }) {
  const { unlocked, tryUnlock } = useClubGate();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  if (!unlocked) {
    return (
      <div className="screen">
        <div className="topbar">
          <button className="topbar__back" onClick={onBack} aria-label="Назад">
            <IconBack size={22} />
          </button>
          <span className="topbar__title">Клуб навигаторов</span>
          <span className="topbar__spacer" />
        </div>

        <p className="section-lead">
          Программа встречи открывается кодом прямо на самой встрече — его
          называет ведущий.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!tryUnlock(code)) {
              setError(true);
            }
          }}
        >
          <input
            className="checker__input"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Код встречи"
            autoFocus
          />
          <p className="checker__privacy">Код скажет ведущий встречи.</p>
          {error && (
            <p className="checker__privacy" style={{ color: 'var(--danger, #c0392b)' }}>
              Код неверный, попробуйте ещё раз.
            </p>
          )}
          <button type="submit" className="btn btn--primary">
            Открыть
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="topbar">
        <button className="topbar__back" onClick={onBack} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <span className="topbar__title">Программа встречи</span>
        <span className="topbar__spacer" />
      </div>

      <p className="section-lead">
        Сценарий на 90 минут для школьного психолога или классного руководителя.
      </p>

      <ul className="program">
        {PROGRAM.map((p) => (
          <li key={p.time}>
            <span className="program__time">{p.time}</span>
            <b className="program__title">{p.title}</b>
            <span className="program__text">{p.text}</span>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Правила ведущего</h2>
      <ul className="section-points">
        {RULES.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
