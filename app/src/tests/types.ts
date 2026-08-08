/**
 * Психологический тест.
 *
 * Считаем НЕ баллы, а ключи: каждый вариант ответа добавляет очко
 * своему типу, побеждает тип с максимумом. Это принципиально:
 * шкала «мало/много» всегда читается как оценка («у меня низкий балл»),
 * а тип — как описание. Плохих типов в тесте нет.
 */

export type TestOption = { text: string; key: string };

export type TestQuestion = {
  text: string;
  options: TestOption[];
};

export type TestResult = {
  key: string;
  /** Название типа: «Ты — Разведчик», «Ваш стиль — Защитник» */
  title: string;
  lead: string;
  strength: string;
  /** Только для взрослых: одно небольшое действие */
  growth?: string;
};

export type PsyTest = {
  id: string;
  role: 'teen' | 'adult';
  title: string;
  kicker: string;
  intro: string;
  questions: TestQuestion[];
  results: TestResult[];
};
