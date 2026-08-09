import { useCallback, useMemo, useState } from 'react';
import { IconBack } from '../components/icons';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import { analyse, CHECKLIST, SAMPLES, VERDICTS } from './analyse';

/**
 * «Проверка сообщения» — разбор настоящей переписки на приёмы давления.
 *
 * Работает целиком на телефоне: текст никуда не отправляется.
 * Это принципиально — иначе ребёнок не станет вставлять сюда
 * свою реальную переписку, и вся затея не сработает.
 */
export function CheckerScreen({ onExit }: { onExit: () => void }) {
  const [text, setText] = useState('');
  const [checked, setChecked] = useState<string | null>(null);
  const [fresh, setFresh] = useState<string[]>([]);
  const { award, progress } = useProgress();
  // Медаль своя для каждой роли: формулировки у них разные
  const badgeId = progress.role === 'adult' ? 'checker-adult' : 'checker';

  const hits = useMemo(() => (checked ? analyse(checked) : []), [checked]);
  const score = hits.reduce((sum, h) => sum + h.weight, 0);
  const verdict = VERDICTS.find((v) => score >= v.min)!;

  const run = useCallback(
    (value: string) => {
      setText(value);
      setChecked(value);
      const given = award([badgeId]);
      if (given.length) setFresh(given);
    },
    [award, badgeId],
  );

  return (
    <div className="screen">
      <div className="topbar">
        <button className="topbar__back" onClick={onExit} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <span className="topbar__title">Проверка сообщения</span>
        <span className="topbar__spacer" />
      </div>

      {!checked && (
        <>
          <p className="section-lead">
            Вставьте сообщение, которое показалось странным. Разберём, какие приёмы в нём есть.
          </p>

          <textarea
            className="checker__input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Вставьте или перепечатайте сообщение…"
            rows={6}
            aria-label="Текст сообщения для проверки"
          />

          <div className="checker__privacy">
            Текст остаётся на этом телефоне и никуда не отправляется.
          </div>

          <button
            className="btn btn--primary btn--wide"
            onClick={() => run(text)}
            disabled={!text.trim()}
          >
            Проверить
          </button>

          <div className="checker__samples-title">Или посмотрите на примере</div>
          <ul className="activities stagger">
            {SAMPLES.map((s) => (
              <li key={s.label}>
                <button className="activity" onClick={() => run(s.text)}>
                  <span className="activity__kind">Пример</span>
                  <span className="activity__label">{s.label}</span>
                  <span className="activity__hint">{s.text.slice(0, 58)}…</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {checked && (
        <>
          <div className={`checker__verdict checker__verdict--${verdict.tone}`}>
            <div className="checker__score">
              {hits.length === 0 ? 'Приёмов не найдено' : `Найдено приёмов: ${hits.length}`}
            </div>
            <h2 className="checker__title">{verdict.title}</h2>
            <p className="checker__text">{verdict.text}</p>
          </div>

          {hits.length > 0 && (
            <ul className="flags stagger">
              {hits.map((h) => (
                <li key={h.id}>
                  <div className="flag__title">{h.title}</div>
                  <div className="flag__quotes">
                    {h.quotes.map((q) => (
                      <span className="flag__quote" key={q}>
                        {q}
                      </span>
                    ))}
                  </div>
                  <div className="flag__why">{h.why}</div>
                </li>
              ))}
            </ul>
          )}

          {/* Чек-лист не зависит от слов, поэтому работает там,
              где разбор по признакам ничего не нашёл */}
          <div className="checklist">
            <div className="checklist__title">Проверьте сами — эти вопросы работают всегда</div>
            <ol>
              {CHECKLIST.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </div>

          <p className="checker__limits">
            Разбор смотрит на слова и признаки, а не на смысл целиком: он может пропустить
            новую схему или сработать на безобидном тексте. Последнее слово — за вами.
          </p>

          <div className="quest__final">
            <button
              className="btn btn--primary"
              onClick={() => {
                setChecked(null);
                setText('');
              }}
            >
              Проверить другое
            </button>
            <button className="btn" onClick={onExit}>
              В меню
            </button>
          </div>
        </>
      )}

      {fresh.length > 0 && (
        <BadgeCard badgeId={fresh[0]} onClose={() => setFresh((p) => p.slice(1))} />
      )}
    </div>
  );
}
