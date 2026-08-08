import { useCallback, useMemo, useState } from 'react';
import { IconBack } from '../components/icons';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import flagsData from '../data/flags.json';

type Flag = { id: string; weight: number; title: string; why: string; patterns: string[] };
type Sample = { label: string; text: string };
type Verdict = { min: number; tone: 'ok' | 'warn' | 'bad'; title: string; text: string };

const FLAGS = flagsData.flags as Flag[];
const SAMPLES = flagsData.samples as Sample[];
const VERDICTS = flagsData.verdicts as Verdict[];

/** Скомпилированные шаблоны: собираем один раз, а не на каждый ввод */
const COMPILED = FLAGS.map((f) => ({
  flag: f,
  re: f.patterns.map((p) => new RegExp(p, 'i')),
}));

type Hit = { flag: Flag; quote: string };

/**
 * Шаблоны написаны по корням слов («бесплатн»), поэтому совпадение
 * приходится дотягивать до границ слов — иначе в цитате окажется обрубок,
 * и разбор перестанет выглядеть убедительно.
 */
function wholeWords(text: string, start: number, length: number) {
  let from = start;
  let to = start + length;
  while (from > 0 && !/[\s.,!?;:()«»"'-]/.test(text[from - 1])) from--;
  while (to < text.length && !/[\s.,!?;:()«»"'-]/.test(text[to])) to++;
  return text.slice(from, to);
}

function analyse(text: string): Hit[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const hits: Hit[] = [];
  for (const { flag, re } of COMPILED) {
    for (const r of re) {
      const m = clean.match(r);
      if (m && m.index !== undefined) {
        hits.push({ flag, quote: wholeWords(clean, m.index, m[0].length) });
        break; // один приём считаем один раз, даже если совпало несколько формулировок
      }
    }
  }
  return hits;
}

/**
 * «Проверка сообщения» — разбор настоящей переписки на приёмы давления.
 *
 * Работает целиком на телефоне: текст никуда не отправляется.
 * Это принципиально — иначе ребёнок не станет вставлять сюда
 * свою реальную переписку, и вся затея не сработает.
 */
export function CheckerScreen({ onExit }: { onExit: () => void }) {
  const [text, setText] = useState('');
  const [checked, setChecked] = useState(false);
  const [fresh, setFresh] = useState<string[]>([]);
  const { award, progress } = useProgress();
  // Медаль своя для каждой роли: формулировки у них разные
  const badgeId = progress.role === 'adult' ? 'checker-adult' : 'checker';

  const hits = useMemo(() => (checked ? analyse(text) : []), [checked, text]);
  const score = hits.reduce((sum, h) => sum + h.flag.weight, 0);
  const verdict = VERDICTS.find((v) => score >= v.min)!;

  const check = useCallback(() => {
    setChecked(true);
    const given = award([badgeId]);
    if (given.length) setFresh(given);
  }, [award, badgeId]);

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

          <button className="btn btn--primary btn--wide" onClick={check} disabled={!text.trim()}>
            Проверить
          </button>

          <div className="checker__samples-title">Или посмотрите на примере</div>
          <ul className="activities stagger">
            {SAMPLES.map((s) => (
              <li key={s.label}>
                <button
                  className="activity"
                  onClick={() => {
                    setText(s.text);
                    setChecked(true);
                    const given = award([badgeId]);
                    if (given.length) setFresh(given);
                  }}
                >
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
              {hits.length === 0
                ? 'Приёмов не найдено'
                : `Найдено приёмов: ${hits.length}`}
            </div>
            <h2 className="checker__title">{verdict.title}</h2>
            <p className="checker__text">{verdict.text}</p>
          </div>

          {hits.length > 0 && (
            <ul className="flags stagger">
              {hits.map((h) => (
                <li key={h.flag.id}>
                  <div className="flag__title">{h.flag.title}</div>
                  <div className="flag__quote">«{h.quote}»</div>
                  <div className="flag__why">{h.flag.why}</div>
                </li>
              ))}
            </ul>
          )}

          <div className="quest__final">
            <button
              className="btn btn--primary"
              onClick={() => {
                setChecked(false);
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
