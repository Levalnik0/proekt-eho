/** Иконки интерфейса. Все — в квадрате 24×24, без внешних библиотек. */

type IconProps = { size?: number; className?: string };

/** Геймпад — режим «Я — Подросток» */
export function IconGamepad({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.6 6h8.8a4.6 4.6 0 0 1 4.55 3.93l.72 4.85A2.85 2.85 0 0 1 18.86 18c-.86 0-1.67-.4-2.2-1.07L15.5 15.5h-7l-1.16 1.43A2.8 2.8 0 0 1 5.14 18a2.85 2.85 0 0 1-2.81-3.22l.72-4.85A4.6 4.6 0 0 1 7.6 6Z"
      />
      <path
        fill="var(--icon-glyph-bg, #5a94a5)"
        d="M7.9 9.15c.36 0 .65.29.65.65v.9h.9a.65.65 0 1 1 0 1.3h-.9v.9a.65.65 0 1 1-1.3 0v-.9h-.9a.65.65 0 1 1 0-1.3h.9v-.9c0-.36.29-.65.65-.65Z"
      />
      <circle cx="15.6" cy="10.6" r="1.05" fill="var(--icon-glyph-bg, #5a94a5)" />
      <circle cx="17.6" cy="12.7" r="1.05" fill="var(--icon-glyph-bg, #5a94a5)" />
    </svg>
  );
}

/** Взрослый и ребёнок — режим «Я — Взрослый» */
export function IconAdultChild({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="currentColor">
        <circle cx="8.6" cy="4.6" r="2.3" />
        <path d="M8.6 8.1c-1.9 0-3.2 1.2-3.5 3l-.7 4.2a1.05 1.05 0 0 0 2.07.35l.63-3.15v1.9l-.85 5.4a1.15 1.15 0 0 0 2.27.33l.68-4.03.68 4.03a1.15 1.15 0 0 0 2.27-.33l-.85-5.4v-1.9l.63 3.15a1.05 1.05 0 0 0 2.07-.35l-.7-4.2c-.3-1.8-1.6-3-3.5-3Z" />
        <circle cx="17.4" cy="9.5" r="1.85" />
        <path d="M17.4 12.4c-1.5 0-2.5 1-2.7 2.4l-.42 2.9a.9.9 0 0 0 1.78.26l.24-1.6v.9l-.5 3.35a.98.98 0 0 0 1.93.28l.17-1.05.17 1.05a.98.98 0 0 0 1.93-.28l-.5-3.35v-.9l.24 1.6a.9.9 0 0 0 1.78-.26l-.42-2.9c-.2-1.4-1.2-2.4-2.7-2.4Z" />
      </g>
    </svg>
  );
}

/** Трое рядом — режим «Мы вместе» */
export function IconTogether({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="currentColor">
        <circle cx="6.3" cy="7.7" r="2.5" />
        <circle cx="17.7" cy="7.7" r="2.5" />
        <circle cx="12" cy="14.4" r="2.9" />
        <path d="M6.3 11.2c-2.3 0-3.9 1.35-4.2 3.35a.95.95 0 0 0 .94 1.1h2.4c.2-1.3.83-2.4 1.8-3.15a4.2 4.2 0 0 0-.94-1.3Z" />
        <path d="M17.7 11.2c2.3 0 3.9 1.35 4.2 3.35a.95.95 0 0 1-.94 1.1h-2.4a4.9 4.9 0 0 0-1.8-3.15c.26-.5.58-.94.94-1.3Z" />
        <path d="M12 18c-2.7 0-4.6 1.5-4.95 3.75a1 1 0 0 0 .99 1.15h7.92a1 1 0 0 0 .99-1.15C16.6 19.5 14.7 18 12 18Z" />
      </g>
    </svg>
  );
}

/** Незамкнутое кольцо-прогресс — «Квест: 48 часов» */
export function IconRing({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="3.1" opacity="0.22" />
      <path
        d="M12 3.6a8.4 8.4 0 0 1 8.4 8.4"
        stroke="currentColor"
        strokeWidth="3.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Компас — «Клуб навигаторов» */
export function IconCompass({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M15.6 8.4 13.9 13.9 8.4 15.6l1.7-5.5 5.5-1.7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Профиль */
export function IconPerson({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="currentColor">
        <circle cx="12" cy="7.4" r="4.1" />
        <path d="M12 13.6c-4.1 0-7 2.3-7.5 5.7a1.15 1.15 0 0 0 1.14 1.32h12.72a1.15 1.15 0 0 0 1.14-1.32c-.5-3.4-3.4-5.7-7.5-5.7Z" />
      </g>
    </svg>
  );
}

/** Настройки */
export function IconGear({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M13.9 2.2a1 1 0 0 1 .97.76l.4 1.62c.4.17.79.39 1.14.64l1.6-.48a1 1 0 0 1 1.15.46l1.5 2.6a1 1 0 0 1-.18 1.22l-1.2 1.13a7.4 7.4 0 0 1 0 1.3l1.2 1.13a1 1 0 0 1 .18 1.22l-1.5 2.6a1 1 0 0 1-1.15.46l-1.6-.48c-.35.25-.74.47-1.14.64l-.4 1.62a1 1 0 0 1-.97.76h-3a1 1 0 0 1-.97-.76l-.4-1.62a6.7 6.7 0 0 1-1.14-.64l-1.6.48a1 1 0 0 1-1.15-.46l-1.5-2.6a1 1 0 0 1 .18-1.22l1.2-1.13a7.4 7.4 0 0 1 0-1.3l-1.2-1.13a1 1 0 0 1-.18-1.22l1.5-2.6a1 1 0 0 1 1.15-.46l1.6.48c.35-.25.74-.47 1.14-.64l.4-1.62a1 1 0 0 1 .97-.76h3ZM12.4 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/** Стрелка «назад» */
export function IconBack({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M14.5 5 8 12l6.5 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Шеврон «вперёд» — правый край пункта меню */
export function IconChevron({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="m9.5 5.5 6.5 6.5-6.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
