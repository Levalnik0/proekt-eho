/**
 * «Зеркало» — режим, где взрослый не отвечает за себя,
 * а угадывает ответ ребёнка (и наоборот).
 *
 * Почему так, а не тест «какой вы родитель»:
 * тест оценивает человека, и защита включается на первом же вопросе.
 * Здесь оценивают догадку, а не личность — и расхождение взрослый
 * обнаруживает сам. Вывод, сделанный самостоятельно, не вызывает спора.
 */

export type MirrorOption = { id: string; text: string };

export type MirrorQuestion = {
  id: string;
  situation: string;
  ask: string;
  options: MirrorOption[];
  /** Как отвечает большинство детей этого возраста */
  kidAnswer: string;
  /** Живая цитата — она убеждает сильнее статистики */
  kidSays: string;
  /** Пояснение психолога. Только после ответа — иначе это подсказка */
  insight: string;
};

export type MirrorResult = {
  /** Порог совпадений, от большего к меньшему */
  minHits: number;
  style: string;
  text: string;
  strength: string;
  growth: string;
  badge: string;
};

export type Mirror = {
  id: string;
  title: string;
  role: 'adult' | 'teen';
  intro: { kicker: string; title: string; text: string; note: string };
  questions: MirrorQuestion[];
  results: MirrorResult[];
};
