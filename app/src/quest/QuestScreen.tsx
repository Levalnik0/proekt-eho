import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconBack, IconCardAlert } from '../components/icons';
import { BadgeCard } from '../progress/BadgeCard';
import { useProgress } from '../progress/useProgress';
import { Glossed } from '../glossary/Glossed';
import { Avatar } from './Avatar';
import { ProfileSheet } from './ProfileSheet';
import { PROFILES } from './profiles';
import type { Quest, QuestChoice, QuestMessage, QuestNode } from './types';

/** Пауза перед появлением сообщения — чтобы переписка шла в живом темпе.
 * У system чуть длиннее остальных: пауза перед «приходом» уведомления
 * создаёт короткое напряжение перед плохой новостью. */
const DELAY: Record<QuestMessage['from'], number> = {
  them: 1100,
  me: 350,
  note: 750,
  system: 900,
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
  const [profileOpen, setProfileOpen] = useState(false);
  /** Что человек сделал в профиле: медали выдаём, когда окно закрыто, чтобы они не наложились */
  const profileDid = useRef({ viewed: false, reported: false });
  const profile = PROFILES[quest.id];

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
    // Плавная прокрутка не нужна тем, кто в системе просил уменьшить движение
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: calm ? 'auto' : 'smooth' });
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

  const openProfile = useCallback(() => {
    profileDid.current.viewed = true;
    setProfileOpen(true);
  }, []);

  const closeProfile = useCallback(() => {
    setProfileOpen(false);
    const did = profileDid.current;
    const ids = [did.viewed ? 'check-profile' : undefined, did.reported ? 'reported' : undefined].filter(
      Boolean,
    ) as string[];
    profileDid.current = { viewed: false, reported: false };
    const given = award(ids);
    if (given.length) setFresh((prev) => [...prev, ...given]);
  }, [award]);

  // «Заблокировать» ведёт в финал, где игрок вышел из разговора
  const blockContact = useCallback(() => {
    closeProfile();
    choose({ text: 'Заблокировал(а) контакт', next: 'block_end' });
  }, [closeProfile, choose]);

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
        {profile ? (
          <button
            className="quest__who"
            onClick={openProfile}
            aria-label={`Открыть профиль: ${quest.contact}`}
          >
            <Avatar kind={profile.avatar} size={40} />
            <span className="quest__contact">
              <span className="quest__name">{quest.contact}</span>
              <span className="quest__note">{quest.contactNote}</span>
            </span>
            <span className="quest__more" aria-hidden="true">
              ›
            </span>
          </button>
        ) : (
          <div className="quest__contact">
            <span className="quest__name">{quest.contact}</span>
            <span className="quest__note">{quest.contactNote}</span>
          </div>
        )}
        <button className="quest__restart" onClick={restart}>
          Заново
        </button>
      </div>

      {/* role="log": новые реплики собеседника скринридер читает по мере появления */}
      <div className="quest__feed" ref={feedRef} role="log" aria-live="polite" aria-relevant="additions">
        {shown.map((m, i) =>
          m.from === 'system' ? (
            <div className="sys-notif" key={i} role="status">
              <span className="sys-notif__icon" aria-hidden="true">
                <IconCardAlert size={18} />
              </span>
              <div className="sys-notif__body">
                <div className="sys-notif__top">
                  <span className="sys-notif__app">{m.app ?? 'Банк'}</span>
                  <span className="sys-notif__time">{m.time ?? 'сейчас'}</span>
                </div>
                <div className="sys-notif__text">
                  <Glossed text={m.text} />
                  {m.amount && <b className="sys-notif__amount"> {m.amount}</b>}
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className={`bubble bubble--${m.from}`}>
              <Glossed text={m.text} />
            </div>
          ),
        )}

        {waiting && queue[0].from === 'them' && (
          <div className="bubble bubble--them bubble--typing" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        )}

        {ending && (
          <div className={`ending ending--${ending.tone}`}>
            <div className="ending__title">{ending.title}</div>
            <div className="ending__power">{ending.superpower}</div>
            <p className="ending__text">
              <Glossed text={ending.text} />
            </p>
          </div>
        )}

        {ending && showDebrief && (
          <div className="debrief">
            <div className="debrief__title">Что можно было заметить</div>
            {quest.redFlags.map((f) => (
              <div className="debrief__item" key={f.title}>
                <b>{f.title}</b>
                <span>
                  <Glossed text={f.text} />
                </span>
              </div>
            ))}
            {profile && (
              <>
                <div className="debrief__title debrief__title--sub">Что выдавал профиль</div>
                {profile.signs.map((f) => (
                  <div className="debrief__item" key={f.title}>
                    <b>{f.title}</b>
                    <span>
                      <Glossed text={f.text} />
                    </span>
                  </div>
                ))}
              </>
            )}
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

      {profileOpen && profile && (
        <ProfileSheet
          nick={quest.contact}
          profile={profile}
          canBlock={!ending && Boolean(nodeById.block_end)}
          onClose={closeProfile}
          onReport={() => {
            profileDid.current.reported = true;
          }}
          onBlock={blockContact}
        />
      )}

      {fresh.length > 0 && (
        <BadgeCard badgeId={fresh[0]} onClose={() => setFresh((prev) => prev.slice(1))} />
      )}
    </div>
  );
}
