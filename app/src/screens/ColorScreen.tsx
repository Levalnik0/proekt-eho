import { EchoAppIcon } from '../components/EchoLogo';
import { buzz, centerOf, rings } from '../fx';
import { markThemeChosen, THEMES, useTheme, type ThemeId } from '../theme/useTheme';

/**
 * Первый экран при запуске. Раньше здесь был выбор «подросток или взрослый»,
 * но он ни на что не влиял: оба видели одно и то же. Теперь здесь выбор,
 * который чувствуется сразу: от нажатия расходится волна и красит всё
 * приложение. Слов почти нет нарочно: это первое касание, оно должно быть
 * игрой, а не анкетой.
 */
export function ColorScreen({ onDone }: { onDone: () => void }) {
  const { theme, setTheme } = useTheme();

  const pick = (id: ThemeId, el: HTMLElement) => {
    const origin = centerOf(el);
    buzz('select');
    rings(origin.x, origin.y);
    setTheme(id, origin);
  };

  return (
    <div className="screen color-screen">
      <EchoAppIcon size={64} />
      <h1 className="color-screen__title">Твой цвет?</h1>

      <div className="color-grid" role="radiogroup" aria-label="Цвет приложения">
        {THEMES.map((t) => (
          <button
            key={t.id}
            role="radio"
            aria-checked={theme === t.id}
            aria-label={t.label}
            className={`color-dot${theme === t.id ? ' is-active' : ''}${t.id === 'day' ? ' color-dot--day' : ''}`}
            style={{ ['--swatch' as string]: t.swatch }}
            onClick={(e) => pick(t.id, e.currentTarget)}
          />
        ))}
      </div>

      <button
        className="btn btn--primary btn--wide"
        onClick={() => {
          markThemeChosen();
          buzz('tap');
          onDone();
        }}
      >
        Поехали
      </button>
    </div>
  );
}
