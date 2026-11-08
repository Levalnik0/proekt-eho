import { useState } from 'react';
import { buzz, centerOf, hapticsEnabled, hapticsSupported, setHaptics } from '../fx';
import { resetGames } from '../games/storage';
import { setSound, soundEnabled } from '../sound';
import { useProgress } from '../progress/useProgress';
import { THEMES, useTheme } from '../theme/useTheme';

/**
 * Настройки. Здесь остались только вещи, которые работают: цвет и
 * вибрация. Раньше были ещё «Уведомления», «Размер шрифта» и «Звук»
 * с пометкой «станут рабочими на следующем шаге»: кнопки, которые ничего
 * не делают, учат не доверять остальному.
 */
export function SettingsScreen() {
  const { progress, reset } = useProgress();
  const { theme, setTheme } = useTheme();
  const [vibration, setVibration] = useState(hapticsEnabled);
  const [sounds, setSounds] = useState(soundEnabled);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="screen">
      <div className="topbar topbar--plain">
        <h1 className="topbar__title">Настройки</h1>
      </div>

      <div className="panel">
        <div className="panel__row panel__row--theme">
          <span>Цвет</span>
        </div>
        <div className="theme-picker">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-swatch${theme === t.id ? ' is-active' : ''}`}
              style={{ ['--swatch' as string]: t.swatch }}
              onClick={(e) => {
                const origin = centerOf(e.currentTarget);
                buzz('select');
                // Кольца запускает сама смена темы, в правильный момент волны
                setTheme(t.id, origin);
              }}
              aria-pressed={theme === t.id}
              aria-label={`Цвет «${t.label}»`}
            >
              <span className="theme-swatch__dot" />
              <span className="theme-swatch__label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel__row">
          <span>Вибрация</span>
          {hapticsSupported ? (
            <button
              className="toggle"
              role="switch"
              aria-checked={vibration}
              aria-label="Вибрация"
              onClick={() => {
                setHaptics(!vibration);
                setVibration(!vibration);
              }}
            />
          ) : (
            <b>нет на этом телефоне</b>
          )}
        </div>
        <div className="panel__row">
          <span>Звук в играх</span>
          <button
            className="toggle"
            role="switch"
            aria-checked={sounds}
            aria-label="Звук в играх"
            onClick={() => {
              setSound(!sounds);
              setSounds(!sounds);
            }}
          />
        </div>
        <div className="panel__row">
          <span>Медалей получено</span>
          <b>{progress.badges.length}</b>
        </div>
        <div className="panel__row">
          <span>Версия</span>
          {/* Дата сборки нужна, чтобы сразу видеть, какую версию открыл тестировщик */}
          <b>0.3.0 · {__BUILD_DATE__}</b>
        </div>
      </div>

      {/* Пригодится, чтобы показать приложение с чистого листа */}
      {confirming ? (
        <div className="panel">
          <div className="panel__row">
            <span>Удалить медали, пройденное и рекорды?</span>
          </div>
          <div className="panel__row">
            <button
              className="btn"
              onClick={() => {
                reset();
                resetGames();
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

      <div className="stub-note">
        Ответы хранятся только в этом телефоне и никуда не отправляются. Если телефоном
        пользуется кто-то ещё, он может их увидеть: кнопка «Сбросить прогресс» всё удалит.
      </div>
    </div>
  );
}
