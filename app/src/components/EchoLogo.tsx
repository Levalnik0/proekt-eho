/**
 * Знак «Эхо» — взрослый и ребёнок, повёрнутые друг к другу.
 *
 * Поворот на 9° — единственное, что отличает «они разговаривают»
 * от «их двое». Без него знак читается как иконка родительского
 * контроля, а проект как раз про обратное.
 */

type Props = {
  /** Размер в пикселях (знак квадратный) */
  size?: number;
  /** Одноцветный вариант — например, для таб-бара в неактивном состоянии */
  color?: string;
  className?: string;
};

export function EchoMark({ size = 48, color, className }: Props) {
  const adult = color ?? 'var(--logo-navy)';
  const kid = color ?? 'var(--logo-teal)';

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="Эхо"
    >
      {/* Вписываем знак по его фактическим границам: после поворота
          фигуры не совпадают с осями viewBox и без этого уезжают в угол.
          Значения считает scripts/gen-icons.py — там же и иконки. */}
      <g transform="translate(-12.32 -9.84) scale(1.312)">
        <g transform="rotate(-9 32 72)">
          <circle cx="32" cy="27" r="11" fill={adult} />
          <path d="M15 72 C15 49 49 49 49 72 Z" fill={adult} />
        </g>
        <g transform="rotate(9 68 72)">
          <circle cx="68" cy="41" r="8" fill={kid} />
          <path d="M55 72 C55 55 81 55 81 72 Z" fill={kid} />
        </g>
      </g>
    </svg>
  );
}

/** Знак в белой «плитке» приложения — как на макете главного экрана. */
export function EchoAppIcon({ size = 72 }: { size?: number }) {
  return (
    <div
      className="echo-app-icon"
      style={{ width: size, height: size, borderRadius: size * 0.235 }}
    >
      <EchoMark size={size * 0.76} />
    </div>
  );
}
