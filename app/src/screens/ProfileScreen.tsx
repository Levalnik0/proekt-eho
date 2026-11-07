import { useState } from 'react';
import { BADGES, BADGE_BY_ID } from '../progress/badges';
import { useProgress } from '../progress/useProgress';
import { MedalIcon } from '../progress/MedalIcon';

/**
 * Одна полка медалей на всех. Переключателя «подросток / взрослый» больше
 * нет: ролей в приложении нет, а делить полку значило прятать половину.
 * Полученные медали идут первыми, чтобы сразу было видно, что уже есть.
 */
export function ProfileScreen() {
  const { progress } = useProgress();
  const [open, setOpen] = useState<string | null>(null);

  const got = (id: string) => progress.badges.includes(id);
  const all = [...BADGES].sort((a, b) => Number(got(b.id)) - Number(got(a.id)));
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
                aria-label={got ? b.title : 'Медаль ещё не открыта'}
              >
                <MedalIcon badgeId={b.id} size={46} locked={!got} />
                {/* У закрытых медалей названия нет: двадцать восемь одинаковых подписей только мешали */}
                <span className="medal__title">{got ? b.title : ''}</span>
              </button>
            </li>
          );
        })}
        {secretsLeft > 0 && (
          <li>
            <div className="medal medal--secret">
              <span className="medal__unknown">?</span>
              <span className="medal__title">
                Скрытых: {secretsLeft}
              </span>
            </div>
          </li>
        )}
      </ul>

      {detail && (
        <div
          className="badge-pop"
          role="dialog"
          aria-label={`Медаль: ${detail.title}`}
          onClick={() => setOpen(null)}
        >
          <div className="badge-pop__card" onClick={(e) => e.stopPropagation()}>
            <div className="badge-pop__stage">
              <MedalIcon badgeId={detail.id} size={84} />
            </div>
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
