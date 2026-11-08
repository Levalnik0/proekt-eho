import data from '../data/profiles.json';
import type { AvatarKind } from './Avatar';

/**
 * Профиль собеседника в истории: то, что видно, если нажать на его ник.
 * Всё выдумано. Признаки (signs) в чате не подсвечиваются: ребёнок сам
 * решает, что подозрительно, а после финала разбор показывает, что было
 * тревожным.
 */
export type Profile = {
  avatar: AvatarKind;
  /** Строка «о себе» */
  tagline: string;
  rows: { label: string; value: string }[];
  signs: { title: string; text: string }[];
};

/** Ключ — id истории (quest.id) */
export const PROFILES = data as Record<string, Profile>;
