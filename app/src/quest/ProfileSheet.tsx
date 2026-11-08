import { useRef, useState } from 'react';
import { useDialog } from '../components/useDialog';
import { Avatar } from './Avatar';
import type { Profile } from './profiles';

/** Причины жалобы: те же, что в настоящих играх и соцсетях */
const REASONS = [
  'Притворяется другом или знакомым',
  'Просит пароль, код или деньги',
  'Обещает подарки или лёгкие деньги',
  'Просит скрыть от родителей',
  'Пугает или давит',
];

/**
 * Профиль собеседника. Здесь же две кнопки, которые есть в настоящих
 * играх: «Заблокировать» (человек больше не сможет писать) и
 * «Пожаловаться» (жалобу видят модераторы). В истории они тренировочные,
 * но привычка нажимать их настоящая.
 */
export function ProfileSheet({
  nick,
  profile,
  canBlock,
  onClose,
  onReport,
  onBlock,
}: {
  nick: string;
  profile: Profile;
  /** Заблокировать можно, пока история не закончилась */
  canBlock: boolean;
  onClose: () => void;
  /** Человек отправил жалобу */
  onReport: () => void;
  onBlock: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);
  const [view, setView] = useState<'main' | 'report' | 'reported'>('main');

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="sheet"
      role="dialog"
      aria-modal="true"
      aria-label={`Профиль: ${nick}`}
      onClick={onClose}
    >
      <div className="sheet__card prof" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__grip" />

        {view === 'main' && (
          <>
            <div className="prof__head">
              <Avatar kind={profile.avatar} size={72} />
              <div className="prof__who">
                <div className="prof__nick">{nick}</div>
                <p className="prof__tagline">{profile.tagline}</p>
              </div>
            </div>

            <dl className="prof__rows">
              {profile.rows.map((r) => (
                <div className="prof__row" key={r.label}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>

            <div className="prof__actions">
              <button className="btn" onClick={() => setView('report')}>
                Пожаловаться
              </button>
              {canBlock && (
                <button className="btn btn--primary" onClick={onBlock}>
                  Заблокировать
                </button>
              )}
            </div>
            <button className="btn btn--wide" onClick={onClose}>
              Закрыть
            </button>
          </>
        )}

        {view === 'report' && (
          <>
            <div className="sheet__title">На что жалуешься?</div>
            <ul className="prof__reasons">
              {REASONS.map((r) => (
                <li key={r}>
                  <button
                    className="choice"
                    onClick={() => {
                      onReport();
                      setView('reported');
                    }}
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
            <button className="btn btn--wide" onClick={() => setView('main')}>
              Назад
            </button>
          </>
        )}

        {view === 'reported' && (
          <>
            <div className="sheet__title">Жалоба отправлена</div>
            <p className="sheet__text">
              В настоящей игре её увидят модераторы и проверят аккаунт. Жалоба защищает не только
              тебя, но и других ребят. Чтобы человек не мог тебе писать, его ещё можно заблокировать.
            </p>
            <div className="prof__actions">
              {canBlock && (
                <button className="btn btn--primary" onClick={onBlock}>
                  Заблокировать
                </button>
              )}
              <button className="btn" onClick={onClose}>
                Вернуться в чат
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
