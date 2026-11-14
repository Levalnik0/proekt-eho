import { IconBack } from '../components/icons';
import { goal } from '../analytics';
import { FEEDBACK_URL } from '../config';

/**
 * «Отзывы»: короткое приглашение и кнопка, которая открывает форму.
 * Сам текст отзыва в приложении не вводится и никуда из него не уходит:
 * ответы попадают прямо в форму авторов проекта.
 */
export function FeedbackScreen({ onBack }: { onBack: () => void }) {
  const ready = Boolean(FEEDBACK_URL);
  return (
    <div className="screen">
      <div className="topbar">
        <button className="topbar__back" onClick={onBack} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <h1 className="topbar__title">Отзывы</h1>
        <span className="topbar__spacer" />
      </div>

      <div className="panel">
        <div className="panel__row">
          <span>
            <b>Расскажи, как тебе «Эхо».</b> Что понравилось, где было непонятно, какую игру ты бы
            добавил. Ответ займёт две минуты.
          </span>
        </div>
        <div className="panel__row">
          <span>Не пиши в отзыве свою фамилию, телефон и адрес. Имя можно не указывать вовсе.</span>
        </div>
      </div>

      {ready ? (
        <a
          className="btn btn--primary btn--wide"
          href={FEEDBACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => goal('feedback_open')}
          style={{ textAlign: 'center', textDecoration: 'none' }}
        >
          Оставить отзыв
        </a>
      ) : (
        <button className="btn btn--wide" disabled>
          Форма откроется совсем скоро
        </button>
      )}
      <p className="home2__trust">Отзывы читают только авторы проекта</p>
    </div>
  );
}
