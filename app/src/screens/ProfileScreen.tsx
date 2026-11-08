import { useRef, useState } from 'react';
import { useDialog } from '../components/useDialog';
import { BADGES, BADGE_BY_ID, type Badge } from '../progress/badges';
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
        <h1 className="topbar__title">Медали</h1>
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
                className={`medal${got ? ' is-got' : ' is-locked'}`}
                onClick={() => setOpen(b.id)}
                aria-label={got ? b.title : `Закрытая медаль «${b.title}»: как получить`}
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
        <DetailDialog
          detail={detail}
          locked={!progress.badges.includes(detail.id)}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

/** Окно с описанием полученной медали; закрывается по Esc, кнопке и нажатию на фон */
function DetailDialog({
  detail,
  locked,
  onClose,
}: {
  detail: Badge;
  locked: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, onClose);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="badge-pop"
      role="dialog"
      aria-modal="true"
      aria-label={`Медаль: ${detail.title}`}
      onClick={onClose}
    >
      <div className="badge-pop__card" onClick={(e) => e.stopPropagation()}>
        <div className="badge-pop__stage">
          <MedalIcon badgeId={detail.id} size={84} locked={locked} />
        </div>
        <div className="badge-pop__title">{detail.title}</div>
        {locked ? (
          // Закрытая медаль подсказывает, как её получить, а не просто «ещё нет»
          <div className="badge-pop__block">
            <b>За что дают</b>
            <span>{detail.reason}</span>
          </div>
        ) : (
          <p className="badge-pop__reason">{detail.reason}</p>
        )}
        {!locked && (
          <div className="badge-pop__block">
            <b>{detail.role === 'teen' ? 'Что это про тебя' : 'Что это про вас'}</b>
            <span>{detail.strength}</span>
          </div>
        )}
        {!locked && detail.growth && (
          <div className="badge-pop__block badge-pop__block--try">
            <b>Можно попробовать</b>
            <span>{detail.growth}</span>
          </div>
        )}
        <button className="btn btn--primary btn--wide" onClick={onClose}>
          Понятно
        </button>
      </div>
    </div>
  );
}
