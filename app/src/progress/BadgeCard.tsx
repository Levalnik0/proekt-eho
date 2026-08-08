import { BADGE_BY_ID } from './badges';
import { MedalIcon } from './MedalIcon';

/**
 * Карточка новой медали.
 * Сначала — что получилось хорошо. «Что попробовать» идёт следом
 * и только для взрослых: без похвалы такая строка читается как упрёк.
 */
export function BadgeCard({ badgeId, onClose }: { badgeId: string; onClose: () => void }) {
  const badge = BADGE_BY_ID[badgeId];
  if (!badge) return null;

  return (
    <div className="badge-pop" role="dialog" aria-label={`Медаль: ${badge.title}`}>
      <div className="badge-pop__card">
        <div className="badge-pop__label">Новая медаль</div>

        {/* Лучи и кольцо живут отдельным слоем, чтобы не дёргать саму медаль */}
        <div className="badge-pop__stage">
          <span className="badge-pop__rays" aria-hidden="true" />
          <span className="badge-pop__ring" aria-hidden="true" />
          <MedalIcon badgeId={badge.id} size={92} />
        </div>

        <div className="badge-pop__title">{badge.title}</div>
        <p className="badge-pop__reason">{badge.reason}</p>

        <div className="badge-pop__block">
          <b>{badge.role === 'teen' ? 'Что это про тебя' : 'Что это про вас'}</b>
          <span>{badge.strength}</span>
        </div>

        {badge.growth && (
          <div className="badge-pop__block badge-pop__block--try">
            <b>Можно попробовать</b>
            <span>{badge.growth}</span>
          </div>
        )}

        <button className="btn btn--primary btn--wide" onClick={onClose}>
          Забрать
        </button>
      </div>
    </div>
  );
}
