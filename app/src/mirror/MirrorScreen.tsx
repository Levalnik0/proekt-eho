import { useCallback, useMemo, useState } from 'react';
import { IconBack } from '../components/icons';
import { Glossed } from '../glossary/Glossed';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import type { Mirror } from './types';

type Phase = { kind: 'intro' } | { kind: 'ask'; i: number } | { kind: 'reveal'; i: number } | { kind: 'done' };

export function MirrorScreen({ mirror, onExit }: { mirror: Mirror; onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [fresh, setFresh] = useState<string[]>([]);
  const { award } = useProgress();

  const hits = useMemo(
    () => mirror.questions.filter((q) => picked[q.id] === q.kidAnswer).length,
    [mirror.questions, picked],
  );

  const result = useMemo(
    () => [...mirror.results].sort((a, b) => b.minHits - a.minHits).find((r) => hits >= r.minHits)!,
    [mirror.results, hits],
  );

  const pick = useCallback(
    (qid: string, oid: string, i: number) => {
      setPicked((prev) => ({ ...prev, [qid]: oid }));
      setPhase({ kind: 'reveal', i });
    },
    [],
  );

  const next = useCallback(
    (i: number) => {
      if (i + 1 < mirror.questions.length) {
        setPhase({ kind: 'ask', i: i + 1 });
        return;
      }
      setPhase({ kind: 'done' });
      const given = award([result.badge]);
      if (given.length) setFresh(given);
    },
    [mirror.questions.length, award, result.badge],
  );

  const q = phase.kind === 'ask' || phase.kind === 'reveal' ? mirror.questions[phase.i] : null;
  const step = q ? mirror.questions.indexOf(q) + 1 : 0;

  return (
    <div className="screen screen--mirror">
      <div className="topbar">
        <button className="topbar__back" onClick={onExit} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <span className="topbar__title">
          {q ? `${step} из ${mirror.questions.length}` : mirror.title}
        </span>
        <span className="topbar__spacer" />
      </div>

      {phase.kind === 'intro' && (
        <div className="mirror-intro">
          <div className="mirror-intro__kicker">{mirror.intro.kicker}</div>
          <h2 className="mirror-intro__title">{mirror.intro.title}</h2>
          <p className="mirror-intro__text">{mirror.intro.text}</p>
          <div className="mirror-intro__note">{mirror.intro.note}</div>
          <button className="btn btn--primary btn--wide" onClick={() => setPhase({ kind: 'ask', i: 0 })}>
            Попробовать угадать
          </button>
        </div>
      )}

      {q && (
        <>
          <div className="situation">
            <Glossed text={q.situation} />
          </div>
          <div className="mirror-ask">{q.ask}</div>

          <ul className="choices">
            {q.options.map((o) => {
              const chosen = picked[q.id] === o.id;
              const isKid = o.id === q.kidAnswer;
              const revealed = phase.kind === 'reveal';
              const mark = revealed && isKid ? ' is-kid' : revealed && chosen ? ' is-chosen' : '';
              return (
                <li key={o.id}>
                  <button
                    className={`choice${mark}`}
                    disabled={revealed}
                    onClick={() => pick(q.id, o.id, mirror.questions.indexOf(q))}
                  >
                    {o.text}
                    {revealed && isKid && <span className="choice__tag">его ответ</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          {phase.kind === 'reveal' && (
            <div className="reveal">
              <div className={`reveal__verdict${picked[q.id] === q.kidAnswer ? ' is-hit' : ''}`}>
                {picked[q.id] === q.kidAnswer ? 'Совпало' : 'Не совпало — и это интересно'}
              </div>
              <div className="reveal__quote">
                <Glossed text={q.kidSays} />
              </div>
              <p className="reveal__insight">{q.insight}</p>
              <button
                className="btn btn--primary btn--wide"
                onClick={() => next(mirror.questions.indexOf(q))}
              >
                Дальше
              </button>
            </div>
          )}
        </>
      )}

      {phase.kind === 'done' && (
        <div className="mirror-result">
          <div className="mirror-result__score">
            Совпало {hits} из {mirror.questions.length}
          </div>
          <h2 className="mirror-result__style">{result.style}</h2>
          <p className="mirror-result__text">{result.text}</p>

          <div className="panel">
            <div className="result-block">
              <b>Что уже работает</b>
              <span>{result.strength}</span>
            </div>
            <div className="result-block result-block--try">
              <b>Можно попробовать на этой неделе</b>
              <span>{result.growth}</span>
            </div>
          </div>

          <button className="btn btn--wide" onClick={onExit}>
            В меню
          </button>
        </div>
      )}

      {fresh.length > 0 && (
        <BadgeCard badgeId={fresh[0]} onClose={() => setFresh((p) => p.slice(1))} />
      )}
    </div>
  );
}
