import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconBack } from '../components/icons';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import type { Quest, QuestChoice, QuestMessage, QuestNode } from './types';

/** Пауза перед появлением сообщения — чтобы переписка шла в живом темпе */
const DELAY: Record<QuestMessage['from'], number> = {
  them: 1100,
  me: 350,
  note: 750,
};

export function QuestScreen({ quest, onExit }: { quest: Quest; onExit: () => void }) {
  const nodeById = useMemo(
    () => Object.fromEntries(quest.nodes.map((n) => [n.id, n])) as Record<string, QuestNode>,
    [quest],
  );

  const [nodeId, setNodeId] = useState(quest.start);
  const [shown, setShown] = useState<QuestMessage[]>([]);
  const [queue, setQueue] = useState<QuestMessage[]>(nodeById[quest.start].messages);
  const [showDebrief, setShowDebrief] = useState(false);
  const [fresh, setFresh] = useState<string[]>([]);

  const { award, countRun } = useProgress();
  const node = nodeById[nodeId];
  const waiting = queue.length > 0;
  const feedRef = useRef<HTMLDivElement>(null);

  // Сообщения появляются по одному
  useEffect(() => {
    if (!queue.length) return;
    const next = queue[0];
    const timer = setTimeout(() => {
      setShown((prev) => [...prev, next]);
      setQueue((prev) => prev.slice(1));
    }, DELAY[next.from]);
    return () => clearTimeout(timer);
  }, [queue]);

  // Лента всегда прокручена к последнему сообщению
  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [shown, waiting, showDebrief]);

  const ending = !waiting ? node.ending : undefined;

  // Медали за финал: считаем прохождение и выдаём всё разом
  useEffect(() => {
    if (!ending) return;
    const runs = countRun(quest.id);
    const ids = [ending.badge, runs >= 2 ? 'replay' : undefined].filter(Boolean) as string[];
    const given = award(ids);
    if (given.length) setFresh((prev) => [...prev, ...given]);
  }, [ending, quest.id, award, countRun]);

  const openDebrief = useCallback(() => {
    setShowDebrief(true);
    const given = award(['read-flags']);
    if (given.length) setFresh((prev) => [...prev, ...given]);
  }, [award]);

  const choose = useCallback(
    (choice: QuestChoice) => {
      const target = nodeById[choice.next];
      if (!target) return;
      setShown((prev) => [...prev, { from: 'me', text: choice.text }]);
      setNodeId(choice.next);
      setQueue(target.messages);
    },
    [nodeById],
  );

  const restart = useCallback(() => {
    setNodeId(quest.start);
    setShown([]);
    setQueue(nodeById[quest.start].messages);
    setShowDebrief(false);
  }, [quest.start, nodeById]);

  return (
    <div className="quest">
      <div className="quest__bar">
        <button className="topbar__back" onClick={onExit} aria-label="Выйти из квеста">
          <IconBack size={22} />
        </button>
        <div className="quest__contact">
          <span className="quest__name">{quest.contact}</span>
          <span className="quest__note">{quest.contactNote}</span>
        </div>
        <button className="quest__restart" onClick={restart}>
          Заново
        </button>
      </div>

      <div className="quest__feed" ref={feedRef}>
        {shown.map((m, i) => (
          <div key={i} className={`bubble bubble--${m.from}`}>
            {m.text}
          </div>
        ))}

        {waiting && queue[0].from === 'them' && (
          <div className="bubble bubble--them bubble--typing" aria-label="Собеседник печатает">
            <i />
            <i />
            <i />
          </div>
        )}

        {ending && (
          <div className={`ending ending--${ending.tone}`}>
            <div className="ending__title">{ending.title}</div>
            <div className="ending__power">{ending.superpower}</div>
            <p className="ending__text">{ending.text}</p>
          </div>
        )}

        {ending && showDebrief && (
          <div className="debrief">
            <div className="debrief__title">Что можно было заметить</div>
            {quest.redFlags.map((f) => (
              <div className="debrief__item" key={f.title}>
                <b>{f.title}</b>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quest__actions">
        {!waiting && node.choices && (
          <ul className="choices stagger">
            {node.choices.map((c) => (
              <li key={c.text}>
                <button className="choice" onClick={() => choose(c)}>
                  {c.text}
                </button>
              </li>
            ))}
          </ul>
        )}

        {ending && (
          <div className="quest__final">
            {!showDebrief && (
              <button className="btn btn--primary" onClick={openDebrief}>
                Показать разбор
              </button>
            )}
            <div className="quest__final-row">
              <button className="btn" onClick={restart}>
                Пройти заново
              </button>
              <button className="btn" onClick={onExit}>
                В меню
              </button>
            </div>
          </div>
        )}
      </div>

      {fresh.length > 0 && (
        <BadgeCard badgeId={fresh[0]} onClose={() => setFresh((prev) => prev.slice(1))} />
      )}
    </div>
  );
}
