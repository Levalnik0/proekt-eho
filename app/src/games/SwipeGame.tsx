import { useEffect, useRef, useState } from 'react';
import { IconBack } from '../components/icons';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import { buzz } from '../fx';
import cards from '../data/swipe.json';
import { saveBest, shuffle } from './storage';

type Card = { from: string; text: string; scam: boolean; why: string };

const POOL = cards as Card[];
const ROUND = 10;
/** Сколько пикселей надо протащить карточку, чтобы это считалось ответом */
const SWIPE_AT = 90;
const newDeck = () => shuffle(POOL).slice(0, ROUND);

/**
 * «Развод или нет?»: десять сообщений, смахни влево, если это развод,
 * вправо, если обычное. Игра на минуту без чтения длинных объяснений:
 * после ответа одна строка, почему.
 * Обычные сообщения здесь не для массовки: если всё подряд «развод», игра
 * учит бояться всего, а нужно отличать.
 */
export function SwipeGame({ onExit, beat }: { onExit: () => void; beat?: number }) {
  const [deck, setDeck] = useState(newDeck);
  const [i, setI] = useState(0);
  const [marks, setMarks] = useState<boolean[]>([]);
  /** Результат ответа на текущую карточку: null, пока не ответил */
  const [shown, setShown] = useState<boolean | null>(null);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [record, setRecord] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fresh, setFresh] = useState<string[]>([]);
  const start = useRef<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const { award } = useProgress();

  const score = marks.filter(Boolean).length;
  const done = i >= ROUND;
  const card = deck[i];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // После ответа фокус переходит на «Дальше», чтобы не терялся при клавиатуре
  const nextBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (shown !== null) nextBtn.current?.focus({ preventScroll: true });
  }, [shown]);

  function next() {
    window.clearTimeout(timer.current);
    setShown(null);
    setI((n) => n + 1);
  }

  function answer(saysScam: boolean) {
    if (shown !== null || done) return;
    const ok = saysScam === card.scam;
    setShown(ok);
    setMarks((m) => [...m, ok]);
    setDx(0);
    buzz(ok ? 'good' : 'bad');
    // Дальше человек идёт сам, кнопкой: пояснение не исчезает, пока его читают
  }

  // Раунд закончился: рекорд и медали
  useEffect(() => {
    if (!done) return;
    setRecord(saveBest('swipe', score));
    const given = award(['swipe-first', score === ROUND ? 'swipe-perfect' : undefined]);
    if (given.length) setFresh(given);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (shown !== null) return;
    start.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  // Смещение держим и в ref: при быстром «щелчке» pointerup приходит раньше
  // перерисовки, и значение из state ещё старое
  const dxNow = useRef(0);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (start.current === null) return;
    dxNow.current = e.clientX - start.current;
    setDx(dxNow.current);
  };
  const onUp = () => {
    if (start.current === null) return;
    const moved = dxNow.current;
    start.current = null;
    dxNow.current = 0;
    setDragging(false);
    if (Math.abs(moved) > SWIPE_AT) answer(moved < 0);
    else setDx(0);
  };

  function again() {
    setDeck(newDeck());
    setI(0);
    setMarks([]);
    setShown(null);
    setRecord(false);
    setFresh([]);
  }

  /** Вызов другу: счёт зашит прямо в ссылку, сервер не нужен */
  async function challenge() {
    const url = `${window.location.origin}${window.location.pathname}#/game/swipe?beat=${score}`;
    const text = `Я набрал(а) ${score} из ${ROUND} в «Развод или нет?». Сможешь лучше?`;
    try {
      if (navigator.share) {
        await navigator.share({ text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // человек закрыл окно «Поделиться»: это не ошибка
    }
  }

  if (done) {
    const verdict =
      score === ROUND
        ? 'Ни одной ошибки'
        : score >= 8
          ? 'Почти идеально'
          : score >= 5
            ? 'Неплохо, давай ещё'
            : 'Так и учатся. Ещё раз?';
    const versus =
      beat === undefined
        ? null
        : score > beat
          ? `Ты обошёл друга (${beat})`
          : score === beat
            ? `Ничья с другом (${beat})`
            : `Друг набрал ${beat}`;

    return (
      <div className="game game--result">
        <div className="game-result">
          <div className="game-result__score">
            {score}
            <span>/{ROUND}</span>
          </div>
          <div className="game-result__title">{verdict}</div>
          <div className="game-result__chips">
            {record && <span className="chip chip--accent">Новый рекорд</span>}
            {versus && <span className="chip chip--accent">{versus}</span>}
          </div>
          <div className="game-result__actions">
            <button className="btn btn--primary btn--wide" onClick={again}>
              Ещё раз
            </button>
            <button className="btn btn--wide" onClick={challenge}>
              {copied ? 'Ссылка скопирована' : 'Бросить вызов другу'}
            </button>
            <button className="btn btn--wide" onClick={onExit}>
              Назад
            </button>
          </div>
        </div>
        {fresh.length > 0 && (
          <BadgeCard badgeId={fresh[0]} onClose={() => setFresh((prev) => prev.slice(1))} />
        )}
      </div>
    );
  }

  return (
    <div className="game">
      <div className="game__bar">
        <button className="topbar__back" onClick={onExit} aria-label="Выйти из игры">
          <IconBack size={22} />
        </button>
        <div className="game__dots" aria-hidden="true">
          {Array.from({ length: ROUND }, (_, n) => (
            <i
              key={n}
              className={n < marks.length ? (marks[n] ? 'is-ok' : 'is-bad') : n === i ? 'is-now' : ''}
            />
          ))}
        </div>
        <span className="game__score" aria-label={`Счёт ${score}`}>
          {score}
        </span>
      </div>

      {beat !== undefined && i === 0 && shown === null && (
        <div className="game__challenge">Друг набрал {beat}. Побей!</div>
      )}

      <div className="swipe-stage">
        <div
          className={`swipe-card${shown === true ? ' is-ok' : ''}${shown === false ? ' is-bad' : ''}`}
          style={{
            transform: `translateX(${dx}px) rotate(${dx / 18}deg)`,
            transition: dragging ? 'none' : undefined,
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <span className="swipe-card__from">{card.from}</span>
          <p className="swipe-card__text" aria-live="polite">
            {card.text}
          </p>
          <span
            className="swipe-stamp swipe-stamp--scam"
            style={{ opacity: Math.min(1, Math.max(0, -dx) / SWIPE_AT) }}
          >
            Развод
          </span>
          <span
            className="swipe-stamp swipe-stamp--ok"
            style={{ opacity: Math.min(1, Math.max(0, dx) / SWIPE_AT) }}
          >
            Норм
          </span>
        </div>

        <div className="swipe-why" aria-live="polite">
          {shown !== null && (
            <>
              <b>{shown ? 'Верно. ' : 'Не совсем. '}</b>
              {card.why}
            </>
          )}
        </div>
      </div>

      <div className="swipe-actions">
        <button className="swipe-btn swipe-btn--scam" disabled={shown !== null} onClick={() => answer(true)}>
          Развод
        </button>
        <button className="swipe-btn swipe-btn--ok" disabled={shown !== null} onClick={() => answer(false)}>
          Норм
        </button>
      </div>

      <button ref={nextBtn} className="game__skip" onClick={next} disabled={shown === null}>
        Дальше
      </button>
    </div>
  );
}
