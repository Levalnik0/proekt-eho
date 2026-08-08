import { useCallback, useState } from 'react';
import { IconBack } from '../components/icons';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import { DecisionMap } from './DecisionMap';
import type { CoopState } from '../progress/useProgress';
import type { Coop, CoopOption } from './types';

/** Навстречу друг другу пошли оба, один или ни одного */
const stateOf = (teen: CoopOption, adult: CoopOption): CoopState =>
  teen.tag === 'open' && adult.tag === 'open'
    ? 'together'
    : teen.tag === adult.tag
      ? 'closed'
      : 'crossed';

const STATE_LABEL: Record<CoopState, string> = {
  together: 'Шли навстречу',
  closed: 'Оба закрылись',
  crossed: 'Разошлись',
};

type Turn = 'teen' | 'adult';

type Phase =
  | { kind: 'intro' }
  | { kind: 'handoff'; step: number; turn: Turn }
  | { kind: 'choose'; step: number; turn: Turn }
  | { kind: 'result'; step: number }
  | { kind: 'map' };

type Answer = { teen: CoopOption; adult: CoopOption };

const WHO: Record<Turn, string> = { teen: 'подростку', adult: 'взрослому' };

export function CoopScreen({ coop, onExit }: { coop: Coop; onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>({ kind: 'intro' });
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [pending, setPending] = useState<CoopOption | null>(null);
  const [fresh, setFresh] = useState<string[]>([]);
  const { award, saveCoop } = useProgress();

  const finish = useCallback(
    (all: Answer[]) => {
      saveCoop({
        questId: coop.id,
        finishedAt: Date.now(),
        steps: all.map((a, i) => ({
          title: coop.steps[i].title,
          teen: a.teen.text,
          adult: a.adult.text,
          state: stateOf(a.teen, a.adult),
        })),
      });
      const given = award(['decision-map', 'ally']);
      if (given.length) setFresh(given);
      setPhase({ kind: 'map' });
    },
    [coop, saveCoop, award],
  );

  const pick = useCallback(
    (step: number, turn: Turn, option: CoopOption) => {
      if (turn === 'teen') {
        setPending(option);
        setPhase({ kind: 'handoff', step, turn: 'adult' });
        return;
      }
      const all = [...answers, { teen: pending!, adult: option }];
      setAnswers(all);
      setPending(null);
      setPhase({ kind: 'result', step });
    },
    [answers, pending],
  );

  const afterResult = useCallback(
    (step: number) => {
      if (step + 1 < coop.steps.length) {
        setPhase({ kind: 'handoff', step: step + 1, turn: 'teen' });
      } else {
        finish(answers);
      }
    },
    [coop.steps.length, answers, finish],
  );

  const together = answers.filter((a) => stateOf(a.teen, a.adult) === 'together').length;
  const finalKey =
    together === coop.steps.length ? 'allTogether' : together === 0 ? 'apart' : 'mixed';

  return (
    <div className="screen">
      <div className="topbar">
        <button className="topbar__back" onClick={onExit} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <span className="topbar__title">
          {phase.kind === 'choose' || phase.kind === 'result' || phase.kind === 'handoff'
            ? `${('step' in phase ? phase.step : 0) + 1} из ${coop.steps.length}`
            : coop.title}
        </span>
        <span className="topbar__spacer" />
      </div>

      {phase.kind === 'intro' && (
        <div className="mirror-intro">
          <div className="mirror-intro__kicker">Квест на двоих</div>
          <h2 className="mirror-intro__title">{coop.intro.title}</h2>
          <p className="mirror-intro__text">{coop.intro.text}</p>
          <div className="mirror-intro__note">{coop.intro.note}</div>
          <button
            className="btn btn--primary btn--wide"
            onClick={() => setPhase({ kind: 'handoff', step: 0, turn: 'teen' })}
          >
            Начать
          </button>
        </div>
      )}

      {/* Заслонка: без неё второй игрок увидит чужой выбор и вся затея развалится */}
      {phase.kind === 'handoff' && (
        <div className="handoff">
          <div className="handoff__icon">📱</div>
          <div className="handoff__title">Передайте телефон {WHO[phase.turn]}</div>
          <p className="handoff__text">
            {phase.turn === 'adult'
              ? 'Выбор подростка сделан. Не подсматривайте — вы увидите его после своего хода.'
              : 'Следующий ход за подростком.'}
          </p>
          <button
            className="btn btn--primary btn--wide"
            onClick={() => setPhase({ kind: 'choose', step: phase.step, turn: phase.turn })}
          >
            Я на месте
          </button>
        </div>
      )}

      {phase.kind === 'choose' && (
        <>
          <div className="step-title">{coop.steps[phase.step].title}</div>
          <div className="situation">{coop.steps[phase.step].scene}</div>
          <div className="mirror-ask">{coop.steps[phase.step][phase.turn].prompt}</div>
          <ul className="choices">
            {coop.steps[phase.step][phase.turn].options.map((o) => (
              <li key={o.text}>
                <button className="choice" onClick={() => pick(phase.step, phase.turn, o)}>
                  {o.text}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {phase.kind === 'result' && (
        <div className="coop-result">
          {(() => {
            const a = answers[phase.step];
            const step = coop.steps[phase.step];
            const state = stateOf(a.teen, a.adult);
            return (
              <>
                <div className="step-title">{step.title}</div>
                <div className="pair">
                  <div className="pair__row">
                    <b>Подросток</b>
                    <span>{a.teen.text}</span>
                  </div>
                  <div className="pair__row">
                    <b>Взрослый</b>
                    <span>{a.adult.text}</span>
                  </div>
                </div>
                <div className={`verdict${state === 'together' ? ' is-together' : ''}`}>
                  {STATE_LABEL[state]}
                </div>
                <p className="coop-consequence">
                  {state === 'together' ? step.matched : step.missed}
                </p>

                {step.pause && (
                  <div className="pause-card">
                    <b>Пауза</b>
                    <span>{step.pause}</span>
                  </div>
                )}

                <button
                  className="btn btn--primary btn--wide"
                  onClick={() => afterResult(phase.step)}
                >
                  {phase.step + 1 < coop.steps.length ? 'Дальше' : 'Открыть карту решений'}
                </button>
              </>
            );
          })()}
        </div>
      )}

      {phase.kind === 'map' && (
        <div className="mirror-result">
          <div className="mirror-result__score">
            Вместе {together} из {coop.steps.length}
          </div>
          <h2 className="mirror-result__style">{coop.final[finalKey].title}</h2>
          <p className="mirror-result__text">{coop.final[finalKey].text}</p>

          <DecisionMap
            steps={answers.map((a, i) => ({
              title: coop.steps[i].title,
              teen: a.teen.text,
              adult: a.adult.text,
              state: stateOf(a.teen, a.adult),
            }))}
          />

          <button className="btn btn--wide" onClick={onExit}>
            Готово
          </button>
        </div>
      )}

      {fresh.length > 0 && (
        <BadgeCard badgeId={fresh[0]} onClose={() => setFresh((p) => p.slice(1))} />
      )}
    </div>
  );
}
