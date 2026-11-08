import { useEffect, useRef, useState } from 'react';
import { IconBack } from '../components/icons';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import { buzz } from '../fx';
import { sound } from '../sound';
import words from '../data/slang.json';
import { saveBest, shuffle } from './storage';

type Word = { word: string; ok: string; bad: [string, string] };
type Question = Word & { options: string[] };

const POOL = words as Word[];
const ROUND = 10;
/** Сколько видно верный ответ, прежде чем придёт следующее слово */
const NEXT_MS = 2200;

const newDeck = (): Question[] =>
  shuffle(POOL)
    .slice(0, ROUND)
    .map((w) => ({ ...w, options: shuffle([w.ok, ...w.bad]) }));

/**
 * «Сленг-блиц»: что значит слово. Это игра для двоих: один играет,
 * потом передаёт телефон второму, и видно, кто больше знает. Взрослому
 * здесь не страшно проиграть: слова смешные, а ошибиться в них не стыдно.
 * Для ребёнка это редкий случай, когда он знает больше взрослого.
 */
export function SlangGame({ onExit }: { onExit: () => void }) {
  const [deck, setDeck] = useState(newDeck);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [player, setPlayer] = useState<1 | 2>(1);
  const [first, setFirst] = useState<number | null>(null);
  const [record, setRecord] = useState(false);
  const [fresh, setFresh] = useState<string[]>([]);
  const timer = useRef<number | undefined>(undefined);
  const { award } = useProgress();

  const done = i >= ROUND;
  const q = deck[i];

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function choose(option: string) {
    if (picked !== null) return;
    const ok = option === q.ok;
    setPicked(option);
    if (ok) setScore((s) => s + 1);
    buzz(ok ? 'good' : 'bad');
    if (ok) sound.good();
    else sound.bad();
    timer.current = window.setTimeout(() => {
      setPicked(null);
      setI((n) => n + 1);
    }, NEXT_MS);
  }

  // Круг закончился: рекорд и медали
  useEffect(() => {
    if (!done) return;
    if (player === 1) setRecord(saveBest('slang', score));
    if (score >= 8) sound.win();
    const given = award(['slang-first', player === 2 ? 'family-round' : undefined]);
    if (given.length) setFresh(given);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function restart(nextPlayer: 1 | 2) {
    setDeck(newDeck());
    setI(0);
    setScore(0);
    setPicked(null);
    setRecord(false);
    setPlayer(nextPlayer);
    if (nextPlayer === 1) setFirst(null);
  }

  if (done) {
    const versus =
      player === 2 && first !== null
        ? first === score
          ? 'Ничья'
          : first > score
            ? 'Выиграл первый'
            : 'Выиграл второй'
        : null;

    return (
      <div className="game game--result">
        <div className="game-result">
          {player === 2 && first !== null ? (
            <div className="game-result__duel">
              <div>
                <b>{first}</b>
                <span>первый</span>
              </div>
              <div>
                <b>{score}</b>
                <span>второй</span>
              </div>
            </div>
          ) : (
            <div className="game-result__score">
              {score}
              <span>/{ROUND}</span>
            </div>
          )}
          <div className="game-result__title">{versus ?? 'Теперь пусть сыграет второй'}</div>
          <div className="game-result__chips">
            {record && <span className="chip chip--accent">Новый рекорд</span>}
          </div>
          <div className="game-result__actions">
            {player === 1 ? (
              <button
                className="btn btn--primary btn--wide"
                onClick={() => {
                  setFirst(score);
                  restart(2);
                }}
              >
                Передать телефон
              </button>
            ) : (
              <button className="btn btn--primary btn--wide" onClick={() => restart(1)}>
                Ещё раунд
              </button>
            )}
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
            <i key={n} className={n < i ? 'is-ok' : n === i ? 'is-now' : ''} />
          ))}
        </div>
        <span className="game__score" aria-label={`Счёт ${score}`}>
          {score}
        </span>
      </div>

      {(player === 2 || first !== null) && (
        <div className="game__challenge">{player === 2 ? 'Второй игрок' : 'Первый игрок'}</div>
      )}

      <div className="slang-stage">
        <div className="slang-word" key={q.word}>
          {q.word}
        </div>
        <ul className="slang-opts">
          {q.options.map((opt) => {
            const right = picked !== null && opt === q.ok;
            const wrong = picked === opt && opt !== q.ok;
            return (
              <li key={opt}>
                <button
                  className={`slang-opt${right ? ' is-right' : ''}${wrong ? ' is-wrong' : ''}`}
                  onClick={() => choose(opt)}
                  disabled={picked !== null}
                >
                  {right && <span aria-hidden="true">✓ </span>}
                  {wrong && <span aria-hidden="true">✕ </span>}
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
        {/* Результат ответа для скринридера: цвет и значок видят не все */}
        <div className="sr-only" role="status">
          {picked === null ? '' : picked === q.ok ? 'Верно' : `Неверно. Правильный ответ: ${q.ok}`}
        </div>
      </div>
    </div>
  );
}
