import { useState } from 'react';
import { badgesFor, BADGE_BY_ID, type Role } from '../progress/badges';
import { useProgress } from '../progress/useProgress';

const ROLE_LABEL: Record<Role, string> = { teen: 'Подросток', adult: 'Взрослый' };

export function ProfileScreen() {
  const { progress } = useProgress();
  // Начинаем со своей роли, но чужие медали тоже видно — это часть механики
  const [role, setRole] = useState<Role>(progress.role ?? 'teen');
  const [open, setOpen] = useState<string | null>(null);

  const all = badgesFor(role);
  const earned = all.filter((b) => progress.badges.includes(b.id));
  // Скрытые медали не показываем заранее — их интереснее найти
  const visible = all.filter((b) => !b.secret || progress.badges.includes(b.id));
  const secretsLeft = all.filter((b) => b.secret && !progress.badges.includes(b.id)).length;

  const detail = open ? BADGE_BY_ID[open] : null;

  return (
    <div className="screen">
      <div className="topbar topbar--plain">
        <span className="topbar__title">Медали</span>
      </div>

      <div className="switch">
        {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
          <button
            key={r}
            className={`switch__item${r === role ? ' is-active' : ''}`}
            onClick={() => setRole(r)}
          >
            {ROLE_LABEL[r]}
          </button>
        ))}
      </div>

      <div className="progress-line">
        <div className="progress-line__head">
          <span>
            {earned.length} из {all.length}
          </span>
          {secretsLeft > 0 && <span className="progress-line__hint">есть скрытые</span>}
        </div>
        <div className="progress-line__track">
          <i style={{ width: `${(earned.length / all.length) * 100}%` }} />
        </div>
      </div>

      <ul className="medals stagger">
        {visible.map((b) => {
          const got = progress.badges.includes(b.id);
          return (
            <li key={b.id}>
              <button
                className={`medal${got ? ' is-got' : ''}`}
                onClick={() => got && setOpen(b.id)}
                disabled={!got}
              >
                <span className="medal__emoji">{got ? b.emoji : '·'}</span>
                <span className="medal__title">{got ? b.title : 'Ещё не открыта'}</span>
              </button>
            </li>
          );
        })}
        {secretsLeft > 0 && (
          <li>
            <div className="medal medal--secret">
              <span className="medal__emoji">?</span>
              <span className="medal__title">
                Скрытых: {secretsLeft}
              </span>
            </div>
          </li>
        )}
      </ul>

      {detail && (
        <div className="badge-pop" role="dialog" onClick={() => setOpen(null)}>
          <div className="badge-pop__card" onClick={(e) => e.stopPropagation()}>
            <div className="badge-pop__emoji">{detail.emoji}</div>
            <div className="badge-pop__title">{detail.title}</div>
            <p className="badge-pop__reason">{detail.reason}</p>
            <div className="badge-pop__block">
              <b>{detail.role === 'teen' ? 'Что это про тебя' : 'Что это про вас'}</b>
              <span>{detail.strength}</span>
            </div>
            {detail.growth && (
              <div className="badge-pop__block badge-pop__block--try">
                <b>Можно попробовать</b>
                <span>{detail.growth}</span>
              </div>
            )}
            <button className="btn btn--primary btn--wide" onClick={() => setOpen(null)}>
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
