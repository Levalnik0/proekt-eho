import { useState } from 'react';
import { buzz, centerOf, hapticsEnabled, hapticsSupported, setHaptics } from '../fx';
import { resetGames } from '../games/storage';
import { setSound, soundEnabled } from '../sound';
import { makeProgressCode, restoreProgressCode } from '../progress/progressCode';
import { useProgress } from '../progress/useProgress';
import { useTheme, visibleThemes } from '../theme/useTheme';

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
  const [code, setCode] = useState('');
  const [typed, setTyped] = useState('');
  const [note, setNote] = useState('');

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
          {visibleThemes().map((t) => (
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
          <span>Возраст</span>
          <b>12+</b>
        </div>
        <div className="panel__row">
          <span>Версия</span>
          {/* Дата сборки нужна, чтобы сразу видеть, какую версию открыл тестировщик */}
          <b>0.3.0 · {__BUILD_DATE__}</b>
        </div>
      </div>

      {/* Код прогресса: перенести прогресс на другой телефон, без аккаунтов и паролей */}
      <div className="panel panel--code">
        <div className="panel__row">
          <span>Код прогресса</span>
        </div>
        <p className="code-hint">
          Чтобы не потерять медали и рекорды или перенести их на другой телефон, получи код и сохрани его в заметках.
          Никому его не давай.
        </p>
        <div className="code-actions">
          <button
            className="btn"
            onClick={() => {
              setNote('');
              setCode(makeProgressCode());
            }}
          >
            Получить код
          </button>
        </div>
        {code && (
          <div className="code-box">
            <code className="code-value">{code}</code>
            <button
              className="btn"
              onClick={() => {
                const done = () => setNote('Код скопирован');
                if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, () => setNote('Выдели код и скопируй вручную'));
                else setNote('Выдели код и скопируй вручную');
              }}
            >
              Скопировать
            </button>
          </div>
        )}
        <div className="code-restore">
          <input
            className="code-input"
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value);
              setNote('');
            }}
            placeholder="Вставь код, чтобы вернуть прогресс"
            aria-label="Код прогресса"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className="btn"
            disabled={!typed.trim()}
            onClick={() => {
              const res = restoreProgressCode(typed);
              if (res.ok) window.location.reload();
              else setNote(res.error);
            }}
          >
            Восстановить
          </button>
        </div>
        {note && <p className="code-note" role="status">{note}</p>}
        <p className="code-hint code-hint--small">Восстановление заменит прогресс на этом телефоне прогрессом из кода.</p>
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
        Ответы тестов хранятся только в этом телефоне и никуда не отправляются. Мы считаем только анонимную статистику (сколько человек зашло и какие экраны открывали), без имён и личных данных. Если телефоном
        пользуется кто-то ещё, он может их увидеть: кнопка «Сбросить прогресс» всё удалит.
      </div>
    </div>
  );
}
