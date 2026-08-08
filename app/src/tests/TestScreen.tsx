import { useCallback, useMemo, useState } from 'react';
import { IconBack } from '../components/icons';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import type { PsyTest } from './types';

export function TestScreen({
  test,
  allOfRole,
  onExit,
}: {
  test: PsyTest;
  /** id всех тестов этой роли — чтобы понять, что пройдены все */
  allOfRole: string[];
  onExit: () => void;
}) {
  const [step, setStep] = useState(-1); // -1 — вступление
  const [keys, setKeys] = useState<string[]>([]);
  const [fresh, setFresh] = useState<string[]>([]);
  const { progress, award, saveTest } = useProgress();

  const winner = useMemo(() => {
    const tally = new Map<string, number>();
    for (const k of keys) tally.set(k, (tally.get(k) ?? 0) + 1);
    let best = test.results[0].key;
    let bestCount = -1;
    // При равенстве побеждает тип, который встретился раньше — так результат стабилен
    for (const r of test.results) {
      const c = tally.get(r.key) ?? 0;
      if (c > bestCount) {
        best = r.key;
        bestCount = c;
      }
    }
    return test.results.find((r) => r.key === best)!;
  }, [keys, test.results]);

  const answer = useCallback(
    (key: string) => {
      const next = [...keys, key];
      setKeys(next);
      if (step + 1 < test.questions.length) {
        setStep(step + 1);
        return;
      }
      // Тест закончился
      setStep(test.questions.length);
      const tally = new Map<string, number>();
      for (const k of next) tally.set(k, (tally.get(k) ?? 0) + 1);
      let best = test.results[0].key;
      let bestCount = -1;
      for (const r of test.results) {
        const c = tally.get(r.key) ?? 0;
        if (c > bestCount) {
          best = r.key;
          bestCount = c;
        }
      }
      saveTest(test.id, best);

      const done = new Set([...Object.keys(progress.tests), test.id]);
      const allDone = allOfRole.every((id) => done.has(id));
      const given = award([
        test.role === 'teen' ? 'self-scan' : 'own-style',
        allDone ? (test.role === 'teen' ? 'full-profile' : 'full-picture') : undefined,
      ]);
      if (given.length) setFresh(given);
    },
    [keys, step, test, saveTest, award, progress.tests, allOfRole],
  );

  const q = step >= 0 && step < test.questions.length ? test.questions[step] : null;
  const done = step >= test.questions.length;

  return (
    <div className="screen">
      <div className="topbar">
        <button className="topbar__back" onClick={onExit} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <span className="topbar__title">
          {q ? `${step + 1} из ${test.questions.length}` : test.title}
        </span>
        <span className="topbar__spacer" />
      </div>

      {step === -1 && (
        <div className="mirror-intro">
          <div className="mirror-intro__kicker">{test.kicker}</div>
          <h2 className="mirror-intro__title">{test.title}</h2>
          <p className="mirror-intro__text">{test.intro}</p>
          <div className="mirror-intro__note">
            {test.role === 'teen'
              ? 'Правильных ответов нет. Отвечай как есть — результат всё равно будет про суперсилу.'
              : 'Здесь нет «хорошего» и «плохого» стиля. У каждого своя сильная сторона.'}
          </div>
          <button className="btn btn--primary btn--wide" onClick={() => setStep(0)}>
            Начать
          </button>
        </div>
      )}

      {q && (
        <>
          <div className="situation">{q.text}</div>
          <ul className="choices stagger">
            {q.options.map((o) => (
              <li key={o.text}>
                <button className="choice" onClick={() => answer(o.key)}>
                  {o.text}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {done && (
        <div className="mirror-result">
          <div className="mirror-result__score">Результат</div>
          <h2 className="mirror-result__style">{winner.title}</h2>
          <p className="mirror-result__text">{winner.lead}</p>

          <div className="panel">
            <div className="result-block">
              <b>{test.role === 'teen' ? 'В чём твоя сила' : 'Что уже работает'}</b>
              <span>{winner.strength}</span>
            </div>
            {winner.growth && (
              <div className="result-block result-block--try">
                <b>Можно попробовать на этой неделе</b>
                <span>{winner.growth}</span>
              </div>
            )}
          </div>

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
