import { useId } from 'react';

export type AvatarKind = 'gamer' | 'money' | 'girl' | 'guy';

/**
 * Аватарки собеседников из историй. Нарисованы здесь же, без чужих
 * фотографий: так не надо думать об авторских правах, а у каждого героя
 * свой узнаваемый «типаж» (игрок, «успешный» с деньгами, девочка, парень
 * из компании). Все выдуманные.
 */
export function Avatar({ kind, size = 44 }: { kind: AvatarKind; size?: number }) {
  const id = useId().replace(/:/g, '');
  const bg: Record<AvatarKind, [string, string]> = {
    gamer: ['#6b4fe0', '#2a1c6b'],
    money: ['#ffd36b', '#e08a1e'],
    girl: ['#ff9ab8', '#b83a6a'],
    guy: ['#3fd0cc', '#1f7f88'],
  };
  const [a, b] = bg[kind];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Аватарка"
      style={{ flex: 'none', borderRadius: '50%' }}
    >
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect width="64" height="64" fill={`url(#${id}g)`} />

        {kind === 'gamer' && (
          <>
            <path d="M10 66c2-14 11-20 22-20s20 6 22 20Z" fill="#1d1647" />
            <circle cx="14" cy="30" r="4.5" fill="#a996ff" />
            <circle cx="50" cy="30" r="4.5" fill="#a996ff" />
            <circle cx="32" cy="29" r="14" fill="#2d2470" />
            <path d="M18.5 29a13.5 13.5 0 0 1 27 0" fill="none" stroke="#a996ff" strokeWidth="2.4" />
            <rect x="21" y="24.5" width="22" height="10" rx="5" fill="#7ff0ff" />
            <rect x="24" y="27" width="6" height="2.4" rx="1.2" fill="#2d2470" opacity="0.45" />
          </>
        )}

        {kind === 'money' && (
          <>
            <path d="M8 66c2-13 11-19 24-19s22 6 24 19Z" fill="#ffffff" />
            <path d="M29 47h6l-3 7Z" fill="#c2571a" />
            <circle cx="32" cy="29" r="12.5" fill="#f2c6a0" />
            <path d="M19.8 25c1-8 6-11 12.4-11s10.6 3 12 11c-3-3.5-7-5-12-5s-9 1.5-12.4 5Z" fill="#3a2a1f" />
            <rect x="21" y="26.5" width="9.6" height="6.2" rx="2.6" fill="#15161c" />
            <rect x="33.4" y="26.5" width="9.6" height="6.2" rx="2.6" fill="#15161c" />
            <rect x="30" y="28.4" width="4" height="1.8" fill="#15161c" />
            <path d="M26.5 37c3.6 3 7.4 3 11 0" fill="none" stroke="#7a3d22" strokeWidth="2" strokeLinecap="round" />
            <text x="50" y="14" fontSize="11" fontWeight="800" fill="#fff" textAnchor="middle">
              ₽
            </text>
          </>
        )}

        {kind === 'girl' && (
          <>
            <path d="M8 66c2-13 11-19 24-19s22 6 24 19Z" fill="#ffe6ef" />
            <path d="M16 33c-1-14 5-21 16-21s17 7 16 21c0 8-2 14-5 17H21c-3-3-5-9-5-17Z" fill="#3b2418" />
            <circle cx="32" cy="30" r="11.5" fill="#f5cdb0" />
            <path d="M20.5 27c4-1 8-4 11-8 3 4 7 7 12 8-1-8-6-12-12-12s-10 4-11 12Z" fill="#3b2418" />
            <circle cx="27.6" cy="30.4" r="1.5" fill="#3b2418" />
            <circle cx="36.4" cy="30.4" r="1.5" fill="#3b2418" />
            <path d="M27.4 35.6c3 2.4 6.2 2.4 9.2 0" fill="none" stroke="#b5485f" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {kind === 'guy' && (
          <>
            <path d="M8 66c2-13 11-19 24-19s22 6 24 19Z" fill="#2b4a6a" />
            <circle cx="32" cy="30" r="11.5" fill="#f0c19a" />
            <path d="M19 27c0-9 5-14 13-14s13 5 13 14Z" fill="#12202e" />
            <rect x="17" y="25" width="30" height="4.2" rx="2.1" fill="#12202e" />
            <circle cx="27.6" cy="32" r="1.5" fill="#24150e" />
            <circle cx="36.4" cy="32" r="1.5" fill="#24150e" />
            <path d="M28 37.4c2.6 1.6 5.4 1.6 8 0" fill="none" stroke="#8a4a2c" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}
