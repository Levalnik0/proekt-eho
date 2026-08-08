import { useState } from 'react';
import { useProgress } from '../progress/useProgress';

const ROLE_LABEL = { teen: 'Подросток', adult: 'Взрослый' } as const;

export function SettingsScreen() {
  const { progress, reset, setRole } = useProgress();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="screen">
      <div className="topbar topbar--plain">
        <span className="topbar__title">Настройки</span>
      </div>

      <div className="panel">
        <div className="panel__row">
          <span>Кто с телефоном</span>
          <button
            className="link-btn"
            onClick={() => setRole(progress.role === 'teen' ? 'adult' : 'teen')}
          >
            {progress.role ? ROLE_LABEL[progress.role] : 'Не выбрано'} · сменить
          </button>
        </div>
        <div className="panel__row">
          <span>Уведомления</span>
          <b>Включены</b>
        </div>
        <div className="panel__row">
          <span>Размер шрифта</span>
          <b>Обычный</b>
        </div>
        <div className="panel__row">
          <span>Звук в квестах</span>
          <b>Включён</b>
        </div>
      </div>

      <div className="panel">
        <div className="panel__row">
          <span>Медалей получено</span>
          <b>{progress.badges.length}</b>
        </div>
        <div className="panel__row">
          <span>О проекте</span>
          <b>Эхо</b>
        </div>
        <div className="panel__row">
          <span>Версия</span>
          <b>0.2.0</b>
        </div>
      </div>

      {/* Пригодится, чтобы показать приложение с чистого листа */}
      {confirming ? (
        <div className="panel">
          <div className="panel__row">
            <span>Удалить медали и пройденные квесты?</span>
          </div>
          <div className="panel__row">
            <button
              className="btn"
              onClick={() => {
                reset();
                setConfirming(false);
              }}
            >
              Да, начать заново
            </button>
            <button className="btn" onClick={() => setConfirming(false)}>
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <button className="btn btn--wide" onClick={() => setConfirming(true)}>
          Сбросить прогресс
        </button>
      )}

      <div className="stub-note">Переключатели станут рабочими на следующем шаге.</div>
    </div>
  );
}
