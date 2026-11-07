import { useCallback, useMemo, useState } from 'react';
import { IconBack } from '../components/icons';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import { Glossed } from '../glossary/Glossed';
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

  // На телефоне вставить одним нажатием проще, чем долгим тапом по полю
  const canPaste = typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.readText);
  const paste = async () => {
    try {
      const value = await navigator.clipboard.readText();
      if (value.trim()) setText(value);
    } catch {
      // человек не разрешил доступ к буферу: вставит в поле сам
    }
  };

  return (
    <div className="screen">
      <div className="topbar">
        <button className="topbar__back" onClick={onExit} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <span className="topbar__title">Проверка сообщения</span>
        <span className="topbar__spacer" />
      </div>

      {/* На входе ничего лишнего: поле, «Вставить», одна строка про
          приватность и кнопка. Объяснения — в разборе, после проверки. */}
      {!checked && (
        <>
          <textarea
            className="checker__input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Вставь сюда сообщение, которое насторожило"
            rows={6}
            aria-label="Текст сообщения для проверки"
          />

          {canPaste && (
            <button className="checker__paste" onClick={paste}>
              Вставить из буфера
            </button>
          )}

          <button
            className="btn btn--primary btn--wide"
            onClick={() => run(text)}
            disabled={!text.trim()}
          >
            Проверить
          </button>

          <div className="checker__privacy">Текст не уходит с телефона</div>

          <div className="checker__samples-title">Примеры</div>
          <div className="example-chips">
            {SAMPLES.map((s) => (
              <button key={s.label} className="example-chip" onClick={() => run(s.text)}>
                {s.label}
              </button>
            ))}
          </div>
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
                  <div className="flag__why">
                    <Glossed text={h.why} />
                  </div>
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
