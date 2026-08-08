/**
 * Формат сценария квеста.
 * Сценарий — обычный JSON: психолог может добавить новую историю,
 * не трогая код приложения.
 */

/** Одно сообщение в переписке */
export type QuestMessage = {
  /** them — незнакомец, me — сам игрок, note — пояснение от игры */
  from: 'them' | 'me' | 'note';
  text: string;
};

/** Вариант ответа */
export type QuestChoice = {
  text: string;
  /** id следующего узла */
  next: string;
};

/** Что игра подсвечивает в разборе после финала */
export type RedFlag = {
  title: string;
  text: string;
};

export type QuestEnding = {
  /** good — распознал угрозу, care — вышел из разговора, hard — попался */
  tone: 'good' | 'care' | 'hard';
  title: string;
  /** «Твоя суперсила — …» */
  superpower: string;
  text: string;
  /** id медали за этот финал */
  badge?: string;
};

export type QuestNode = {
  id: string;
  messages: QuestMessage[];
  choices?: QuestChoice[];
  ending?: QuestEnding;
};

export type Quest = {
  id: string;
  title: string;
  /** Имя контакта в шапке переписки */
  contact: string;
  contactNote: string;
  start: string;
  nodes: QuestNode[];
  /** Разбор: показывается после любого финала */
  redFlags: RedFlag[];
};
