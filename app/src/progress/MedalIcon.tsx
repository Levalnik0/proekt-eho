import type { ReactNode } from 'react';

/**
 * Глифы медалей.
 *
 * Раньше это были эмодзи — их рисует операционная система, поэтому на
 * разных телефонах они выглядели по-разному и выпадали из стиля
 * приложения. Свои глифы решают и это, и смысл: эмодзи ♻️ читался как
 * знак переработки мусора, а медаль называется «Переигравший».
 */
const GLYPHS: Record<string, ReactNode> = {
  shield: <path d="M12 3.2 20 6v6.2c0 4.6-3.2 7.6-8 9.4-4.8-1.8-8-4.8-8-9.4V6l8-2.8Z" />,
  magnifier: (
    <>
      <circle cx="10.6" cy="10.6" r="6.2" />
      <path d="m15.4 15.4 4.4 4.4" />
    </>
  ),
  // Рукопожатие в 24px превращалось в закорючку — рисуем двоих рядом
  handshake: (
    <>
      <circle cx="8.4" cy="7.6" r="3" />
      <circle cx="16.4" cy="9.4" r="2.4" />
      <path d="M3.4 19.4c0-3.3 2.2-5.4 5-5.4s5 2.1 5 5.4" />
      <path d="M14.8 19.4c0-2.6 1.4-4.2 3.2-4.2s3 1.6 3 4.2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M15.8 8.2 13.9 13.9 8.2 15.8l1.9-5.7 5.7-1.9Z" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.5-5.8" />
      <path d="M20 4v4.6h-4.6" />
    </>
  ),
  bulb: (
    <>
      <path d="M12 3.4a6 6 0 0 1 3.6 10.8V17H8.4v-2.8A6 6 0 0 1 12 3.4Z" />
      <path d="M9.6 20.2h4.8" />
    </>
  ),
  puzzle: (
    <path d="M4 6.5h5a2 2 0 1 1 4 0h5v5a2 2 0 1 0 0 4v4.5h-5a2 2 0 1 0-4 0H4V6.5Z" />
  ),
  star: <path d="m12 3.6 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 10l6.1-.9L12 3.6Z" />,
  mirror: (
    <>
      <ellipse cx="12" cy="10" rx="6.4" ry="7.2" />
      <path d="M12 17.2v4M8.6 21.2h6.8" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="0.6" />
    </>
  ),
  flashlight: (
    <>
      <path d="M9 3.6h6l-1 4.2H10L9 3.6Z" />
      <path d="M10 7.8h4v5.4a2 2 0 0 1-.6 1.4l-.6.6v5.2h-1.6v-5.2l-.6-.6a2 2 0 0 1-.6-1.4V7.8Z" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6.4 3.4h11.2M6.4 20.6h11.2" />
      <path d="M7.6 3.4c0 4.4 4.4 5.6 4.4 8.6 0 3-4.4 4.2-4.4 8.6" />
      <path d="M16.4 3.4c0 4.4-4.4 5.6-4.4 8.6 0 3 4.4 4.2 4.4 8.6" />
    </>
  ),
  ear: (
    <>
      <path d="M7.4 9.6a4.6 4.6 0 1 1 9.2 0c0 2.6-2.4 3.4-3.4 5-.8 1.3-.2 3.4-2.4 3.4" />
      <path d="M10.6 9.8a1.6 1.6 0 1 1 3.2 0" />
    </>
  ),
  speech: <path d="M4 6.4h16v10H10.5L6 20.4v-4H4v-10Z" />,
  door: (
    <>
      <path d="M6.4 3.6h11.2v16.8H6.4z" />
      <circle cx="14.4" cy="12.4" r="1.1" />
    </>
  ),
  backpack: (
    <>
      <path d="M5.4 9.4a4 4 0 0 1 4-4h5.2a4 4 0 0 1 4 4v11H5.4v-11Z" />
      <path d="M9.6 5.4V4.2h4.8v1.2M9 13.6h6" />
    </>
  ),
  map: (
    <>
      <path d="m3.6 6.4 5.4-2.2 6 2.2 5.4-2.2v13.4l-5.4 2.2-6-2.2-5.4 2.2V6.4Z" />
      <path d="M9 4.2v15.4M15 6.4v15.4" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="14.6" r="5.8" />
      <path d="M8.4 9.2 6 3.6h4.4L12 7M15.6 9.2 18 3.6h-4.4L12 7" />
    </>
  ),
  // Путь пройден до конца: тропа из точек и стрелка на выходе
  route: (
    <>
      <path d="M4 18.6c3.2 0 3.2-4.2 6.4-4.2s3.2 4.2 6.4 4.2" strokeDasharray="0.1 3.6" />
      <path d="M4.6 9.6h12.8" />
      <path d="m14.6 6.2 3.4 3.4-3.4 3.4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.6 12S6.4 5.8 12 5.8 21.4 12 21.4 12 17.6 18.2 12 18.2 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
};

/** Какой глиф у какой медали */
export const MEDAL_GLYPH: Record<string, string> = {
  'calm-no': 'shield',
  'double-check': 'magnifier',
  'call-team': 'handshake',
  'been-there': 'route',
  replay: 'refresh',
  'read-flags': 'bulb',
  checker: 'eye',
  'self-scan': 'puzzle',
  'full-profile': 'medal',
  'mirror-teen': 'mirror',
  bullseye: 'target',
  surprised: 'flashlight',
  paused: 'hourglass',
  listener: 'ear',
  translator: 'speech',
  ally: 'handshake',
  'checker-adult': 'eye',
  'first-step': 'door',
  'in-his-shoes': 'backpack',
  'own-style': 'compass',
  'full-picture': 'medal',
  'decision-map': 'map',
};

export function MedalIcon({
  badgeId,
  size = 44,
  locked = false,
}: {
  badgeId: string;
  size?: number;
  locked?: boolean;
}) {
  const glyph = GLYPHS[MEDAL_GLYPH[badgeId] ?? 'star'];
  // Заливаем только цельные силуэты. У двери, рюкзака и карты внутри есть
  // линии — при заливке они исчезали, и глиф превращался в пятно.
  const fills = ['shield', 'puzzle', 'star', 'speech'];
  const isFilled = fills.includes(MEDAL_GLYPH[badgeId] ?? '');

  return (
    <span
      className={`medal-icon${locked ? ' is-locked' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill={isFilled ? 'currentColor' : 'none'}
        stroke={isFilled ? 'none' : 'currentColor'}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {glyph}
      </svg>
    </span>
  );
}
