import { useEffect, useState } from 'react';
import { IconBack } from '../components/icons';
import { goal } from '../analytics';
import { FEEDBACK_URL } from '../config';

/**
 * «Отзывы»: форма встроена прямо в экран, поэтому оставить отзыв можно, не
 * выходя из приложения. Отзыв никуда не ведёт, кроме формы авторов проекта,
 * и приходит анонимно: ни имени, ни почты форма не просит.
 */
export function FeedbackScreen({ onBack }: { onBack: () => void }) {
  const ready = Boolean(FEEDBACK_URL);
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  useEffect(() => {
    if (ready) goal('feedback_open');
  }, [ready]);

  return (
    <div className="screen feedback">
      <div className="topbar">
        <button className="topbar__back" onClick={onBack} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <h1 className="topbar__title">Отзывы</h1>
        <span className="topbar__spacer" />
      </div>

      {!ready && <p className="home2__trust">Форма откроется совсем скоро</p>}
      {ready && !online && (
        <div className="panel">
          <div className="panel__row">
            <span>Чтобы оставить отзыв, нужен интернет. Загляни сюда, когда он появится.</span>
          </div>
        </div>
      )}
      {ready && online && (
        <>
          <iframe
            className="feedback__frame"
            title="Форма отзыва"
            src={`${FEEDBACK_URL}?iframe=1`}
            loading="lazy"
          />
          <p className="home2__trust">
            Отзыв анонимный: имя и почту указывать не нужно.{' '}
            <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
              Если форма не открылась, нажми сюда
            </a>
          </p>
        </>
      )}
    </div>
  );
}
