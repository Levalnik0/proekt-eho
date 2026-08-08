/** Совместный квест: два игрока по очереди на одном устройстве. */

export type CoopOption = { text: string; tag: string };

export type CoopSide = { prompt: string; options: CoopOption[] };

export type CoopStep = {
  title: string;
  scene: string;
  teen: CoopSide;
  adult: CoopSide;
  /** Что случилось, если выборы сошлись / разошлись */
  matched: string;
  missed: string;
  /** Пауза для живого разговора — в ключевых точках */
  pause?: string;
};

export type Coop = {
  id: string;
  title: string;
  intro: { title: string; text: string; note: string };
  steps: CoopStep[];
  final: Record<'allTogether' | 'mixed' | 'apart', { title: string; text: string }>;
};
