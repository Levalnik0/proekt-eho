/**
 * Презентация проекта «Эхо» для конкурсной защиты.
 * Палитра и мотив взяты из самого приложения: тёмно-синий, бирюзовый,
 * белые карточки со скруглением.
 *
 * Нумерованных кружков здесь нет намеренно: цифра внутри круга требует
 * вертикального центрирования, проверить которое в этой среде нечем,
 * а порядка в списках всё равно не было.
 *
 * Вся вёрстка держится на трёх числах: TOP — где начинается содержимое
 * под заголовком, BOTTOM — докуда оно доходит, M — поля. Если менять
 * слайд, держитесь их, иначе блоки поедут друг относительно друга.
 */
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const NAVY = '1E3F68';
const NAVY_DEEP = '16212C';
const TEAL = '45A9A8';
const TEAL_DARK = '2C6E6D';
const INK = '232A32';
const MUTED = '58636E';
const BG = 'F2F4F6';
const WHITE = 'FFFFFF';

const H = 'Cambria';
const B = 'Calibri';

const W = 10;
const M = 0.55;
const TOP = 1.3; // верх содержимого под заголовком
const BOTTOM = 5.02; // низ содержимого

// Снимки экранов сняты в 480×940, схема решений — в 1040×1280.
const PHONE = 480 / 940;
const MAP = 1040 / 1280;
const PHONE_H = 3.7;
const PHONE_W = PHONE_H * PHONE;
const PHONE_RIGHT = W - M - PHONE_W; // картинка у правого поля

const shot = (name) =>
  'image/png;base64,' +
  fs.readFileSync(path.join(__dirname, 'shots', name + '.png')).toString('base64');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Валеева Лиана Николаевна';
pres.title = 'Проект «Эхо»';

/**
 * Карточка. Тени здесь намеренно нет: просмотрщик Finder рисовал её
 * огромным белым пятном поверх соседних блоков, и то же может случиться
 * на чужом ноутбуке. Вместо тени тонкая рамка — она везде одинаковая.
 */
function card(slide, { x, y, w, h, fill = WHITE }) {
  slide.addShape(pres.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.14,
    fill: { color: fill },
    line: { color: fill === WHITE ? 'E4E9EE' : fill, width: 1 },
  });
}

/**
 * Текст на слайде. Своя обёртка нужна из-за одной особенности pptxgenjs:
 * без указания valign он центрирует текст по высоте рамки. Рамки здесь
 * с запасом, поэтому одиночная строка проваливалась на середину и уезжала
 * от своего маркера, а строка в две строки — нет. Прижимаем к верху, а где
 * центр нужен, он передаётся явно.
 */
function text(slide, str, opts) {
  slide.addText(str, { valign: 'top', margin: 0, ...opts });
}

/** Маркер списка: маленькая точка вместо кружка с цифрой */
function dot(slide, { x, y, d = 0.13, color = TEAL }) {
  slide.addShape(pres.ShapeType.ellipse, {
    x,
    y,
    w: d,
    h: d,
    fill: { color },
    line: { color },
  });
}

/**
 * Маркер перед строкой текста. Считаем середину первой строки и ставим
 * точку по ней: на глаз разница в три десятых миллиметра уже видна как
 * съехавший список.
 */
function bullet(slide, { x, y, size = 13, line = 0, d = 0.13, color = TEAL }) {
  const center = (line || size * 1.2) / 72 / 2;
  dot(slide, { x, y: y + center - d / 2, d, color });
}

function title(slide, str, { color = INK, y = 0.5, h = 0.66 } = {}) {
  text(slide, str, {
    x: M,
    y,
    w: W - M * 2,
    h,
    fontFace: H,
    fontSize: 32,
    bold: true,
    color,
  });
}

function kicker(slide, str, { color = TEAL_DARK } = {}) {
  text(slide, str.toUpperCase(), {
    x: M,
    y: 0.28,
    w: W - M * 2,
    h: 0.24,
    fontFace: B,
    fontSize: 11,
    bold: true,
    charSpacing: 1.2,
    color,
  });
}

/** Плашка с выводом: текст по центру самой плашки, а не на глаз */
function note(slide, str, { x, y, w, h, fill = 'E4EFEF', color = TEAL_DARK, size = 13 }) {
  card(slide, { x, y, w, h, fill });
  text(slide, str, {
    x: x + 0.32,
    y,
    w: w - 0.64,
    h,
    margin: 0,
    valign: 'middle',
    fontFace: B,
    fontSize: size,
    color,
    lineSpacing: size * 1.35,
  });
}

// ── 1. Титул ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  // Круги расходятся из телефона — рисует cover.py, палитра оттуда же
  s.background = { data: shot('cover') };
  s.addImage({ data: shot('home'), x: 6.55, y: 0.34, h: 4.95, w: 4.95 * PHONE });

  text(s, 'ПРОЕКТ', {
    x: M, y: 1.42, w: 5.6, h: 0.34, margin: 0,
    fontFace: B, fontSize: 13, bold: true, charSpacing: 3, color: TEAL,
  });
  text(s, 'ЭХО', {
    x: M, y: 1.7, w: 5.6, h: 1.16, margin: 0,
    fontFace: H, fontSize: 66, bold: true, color: WHITE,
  });
  text(s, 'Приложение о безопасности в сети для детей от 10 до 12 лет и их родителей', {
    x: M, y: 2.88, w: 5.3, h: 0.78, margin: 0,
    fontFace: B, fontSize: 17, color: 'C7D3E0', lineSpacing: 26,
  });
  text(s, 'Валеева Лиана Николаевна', {
    x: M, y: 3.86, w: 5.3, h: 0.3, margin: 0,
    fontFace: B, fontSize: 14, color: WHITE,
  });
  text(s, 'Открывается по ссылке: levalnik0.github.io/proekt-eho', {
    x: M, y: 4.42, w: 5.6, h: 0.34, margin: 0,
    fontFace: B, fontSize: 13, bold: true, color: TEAL,
  });
  s.addNotes('Приложение уже опубликовано. Ссылку можно открыть прямо сейчас с телефона.');
}

// ── 2. Проблема ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Проблемное поле, от 10 до 12 лет');
  title(s, 'Что происходит в этом возрасте');

  const items = [
    ['Свой телефон', 'Ребёнок выходит в сеть один. Смотреть, кто ему пишет, некому.'],
    ['Закрывается', 'Начинается возраст, когда экранную жизнь прячут от родителей.'],
    ['Новые схемы', 'Выманивают пароли и игровую валюту, травят в чате класса.'],
  ];
  items.forEach(([h, t], i) => {
    const x = M + i * 3.05;
    card(s, { x, y: TOP, w: 2.8, h: 2.0 });
    dot(s, { x: x + 0.3, y: TOP + 0.3 });
    text(s, h, {
      x: x + 0.3, y: TOP + 0.54, w: 2.24, h: 0.32, margin: 0,
      fontFace: B, fontSize: 16, bold: true, color: INK,
    });
    text(s, t, {
      x: x + 0.3, y: TOP + 0.92, w: 2.24, h: 0.94, margin: 0,
      fontFace: B, fontSize: 12.5, color: MUTED, lineSpacing: 17,
    });
  });

  note(s, 'Пока про сеть дома не говорят, ребёнок разбирается с ней сам и спрашивает совета у ровесников.', {
    x: M, y: 3.62, w: W - M * 2, h: 1.3, color: INK, size: 16,
  });
}

// ── 3. Для кого ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Целевая аудитория');
  title(s, 'Для кого');

  const cols = [
    {
      x: M,
      head: 'Дети от 10 до 12 лет',
      sub: 'с четвёртого по шестой класс',
      lines: [
        'Roblox, Minecraft, мессенджеры, видео',
        'Лесть и спешка работают безотказно',
        'Со спорным вопросом идут к друзьям',
      ],
    },
    {
      x: 5.15,
      head: 'Родители и учителя',
      sub: 'те, кто рядом каждый день',
      lines: [
        'Видят перемены и не знают, что делать',
        'Запрет ссорит, невмешательство пугает',
        'Готовых слов для разговора нет',
      ],
    },
  ];
  cols.forEach((c) => {
    card(s, { x: c.x, y: TOP, w: 4.3, h: 3.2 });
    text(s, c.head, {
      x: c.x + 0.32, y: TOP + 0.26, w: 3.66, h: 0.36, margin: 0,
      fontFace: H, fontSize: 20, bold: true, color: NAVY,
    });
    text(s, c.sub, {
      x: c.x + 0.32, y: TOP + 0.68, w: 3.66, h: 0.26, margin: 0,
      fontFace: B, fontSize: 12, color: TEAL_DARK,
    });
    // Рамка высотой ровно в строку: если пункт перестанет помещаться,
    // проверка это покажет. Иначе перенос съедает половину отступа
    // до следующего пункта и список идёт неровно.
    c.lines.forEach((t, i) => {
      const y = TOP + 1.16 + i * 0.74;
      bullet(s, { x: c.x + 0.34, y, size: 13, line: 17 });
      text(s, t, {
        x: c.x + 0.58, y, w: 3.4, h: 0.24, margin: 0,
        fontFace: B, fontSize: 13, color: INK, lineSpacing: 17,
      });
    });
  });

  text(s, 'Приложение говорит с каждой стороной отдельно, а потом сводит их вместе.', {
    x: M, y: 4.68, w: W - M * 2, h: 0.34, margin: 0,
    fontFace: B, fontSize: 13, italic: true, color: TEAL_DARK,
  });
}

// ── 4. Что умеет ────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Решение');
  title(s, 'Что умеет приложение');
  s.addImage({ data: shot('home'), x: M, y: TOP, h: PHONE_H, w: PHONE_W });

  const rows = [
    ['«Я подросток»', 'квест в переписке и три теста про себя'],
    ['«Я взрослый»', 'день глазами ребёнка и проверка догадок'],
    ['«Мы вместе»', 'квест на двоих и карта решений'],
    ['Проверка сообщения', 'разбор настоящей переписки'],
    ['«Клуб навигаторов»', 'сценарий очной встречи в школе'],
  ];
  rows.forEach(([h, t], i) => {
    const y = TOP + i * 0.76;
    card(s, { x: 2.85, y, w: 6.6, h: 0.66 });
    bullet(s, { x: 3.1, y: y + 0.1, size: 14 });
    text(s, h, {
      x: 3.42, y: y + 0.1, w: 2.6, h: 0.26, margin: 0,
      fontFace: B, fontSize: 14, bold: true, color: INK,
    });
    text(s, t, {
      x: 3.42, y: y + 0.36, w: 5.8, h: 0.24, margin: 0,
      fontFace: B, fontSize: 12, color: MUTED,
    });
  });
}

// ── 5. Психология ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Главная идея');
  title(s, 'Взрослого здесь не проверяют');
  s.addImage({ data: shot('mirror'), x: PHONE_RIGHT, y: TOP, h: PHONE_H, w: PHONE_W });

  const colW = PHONE_RIGHT - 0.3 - M;

  text(s, 'Тест «какой вы родитель» закрывают на втором вопросе. Поэтому его тут нет.', {
    x: M, y: TOP, w: colW, h: 0.6, margin: 0,
    fontFace: B, fontSize: 15, color: INK, lineSpacing: 21,
  });

  const blocks = [
    ['Угадать, а не ответить',
     'Взрослый предполагает, что ответил бы его ребёнок. Оценивают догадку, и расхождение он замечает сам.'],
    ['Сначала о том, что получается',
     'Каждый результат начинается с сильной стороны. Совет один и небольшой, на пробу.'],
    ['Без обещаний, которых нет',
     'Написано прямо: это частый ответ детей такого возраста, а не ответ вашего ребёнка.'],
  ];
  blocks.forEach(([h, t], i) => {
    const y = 1.98 + i * 1.01;
    card(s, { x: M, y, w: colW, h: 0.91 });
    text(s, h, {
      x: M + 0.26, y: y + 0.14, w: colW - 0.52, h: 0.28, margin: 0,
      fontFace: B, fontSize: 14, bold: true, color: NAVY,
    });
    text(s, t, {
      x: M + 0.26, y: y + 0.44, w: colW - 0.52, h: 0.44, margin: 0,
      fontFace: B, fontSize: 12, color: MUTED, lineSpacing: 16,
    });
  });
}

// ── 6. Квесты ───────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Квесты');
  title(s, 'Ситуацию проходят в переписке');
  s.addImage({ data: shot('quest'), x: M, y: TOP, h: PHONE_H, w: PHONE_W });

  const quests = [
    ['«Новый контакт» для ребёнка',
     'Незнакомец в игровом чате: сперва хвалит, потом торопит, потом просит пароль. Четыре концовки и разбор в конце.'],
    ['«День из жизни» для взрослого',
     'Взрослый играет за одиннадцатилетнего: чат класса, отобранный на уроке телефон, «как дела?» на бегу.'],
  ];
  quests.forEach(([h, t], i) => {
    const y = TOP + i * 1.48;
    card(s, { x: 2.85, y, w: 6.6, h: 1.36 });
    text(s, h, {
      x: 3.1, y: y + 0.18, w: 6.1, h: 0.3, margin: 0,
      fontFace: B, fontSize: 15, bold: true, color: NAVY,
    });
    text(s, t, {
      x: 3.1, y: y + 0.54, w: 6.1, h: 0.64, margin: 0,
      fontFace: B, fontSize: 12.5, color: MUTED, lineSpacing: 17,
    });
  });

  note(s, 'Истории лежат в обычных файлах, психолог добавляет новые сам.', {
    x: 2.85, y: 4.3, w: 6.6, h: 0.72,
  });
}

// ── 7. Проверка сообщения ───────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Инструмент на каждый день');
  title(s, 'Проверка сообщения');
  s.addImage({ data: shot('checker'), x: PHONE_RIGHT, y: TOP, h: PHONE_H, w: PHONE_W });

  const colW = PHONE_RIGHT - 0.3 - M;

  text(s, 
    'Вставляешь переписку, которая насторожила. Приложение находит приёмы и цитирует места, где они встретились.',
    { x: M, y: TOP, w: colW, h: 0.6, margin: 0,
      fontFace: B, fontSize: 14, color: INK, lineSpacing: 20 },
  );

  const flags = [
    'Просят молчать',
    'Просят пароль или код',
    'Обещают что-то даром',
    'Торопят',
    'Зовут в личку',
    'Называются админом',
    'Пугают блокировкой',
    'Спрашивают, где живёшь',
  ];
  const cellW = (colW - 0.25) / 2;
  flags.forEach((f, i) => {
    const x = M + (i % 2) * (cellW + 0.25);
    const y = 2.06 + Math.floor(i / 2) * 0.56;
    card(s, { x, y, w: cellW, h: 0.48 });
    dot(s, { x: x + 0.2, y: y + 0.18, d: 0.12 });
    text(s, f, {
      x: x + 0.44, y, w: cellW - 0.6, h: 0.48, margin: 0,
      fontFace: B, fontSize: 12, color: INK, valign: 'middle',
    });
  });

  note(s, 'Текст остаётся в телефоне. Иначе свою переписку сюда никто не вставит.', {
    x: M, y: 4.42, w: colW, h: 0.6, size: 12.5,
  });
  s.addNotes('Демонстрация занимает пятнадцать секунд: вставить пример и показать разбор.');
}

// ── 8. Медали ───────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Мотивация');
  title(s, 'Медали');
  s.addImage({ data: shot('medals'), x: M, y: TOP, h: PHONE_H, w: PHONE_W });

  const rules = [
    ['Название про действие',
     '«Взял паузу», а не «терпеливый родитель». Действие можно повторить завтра.'],
    ['Ошибка тоже награждается',
     'Плохая концовка квеста даёт медаль за опыт: схема теперь известна изнутри.'],
    ['Часть медалей скрыта',
     'В списке видно пустые места. Это возвращает в приложение лучше уведомлений.'],
  ];
  rules.forEach(([h, t], i) => {
    const y = TOP + i * 1.28;
    card(s, { x: 2.85, y, w: 6.6, h: 1.16 });
    bullet(s, { x: 3.1, y: y + 0.18, size: 14.5 });
    text(s, h, {
      x: 3.42, y: y + 0.18, w: 5.8, h: 0.3, margin: 0,
      fontFace: B, fontSize: 14.5, bold: true, color: NAVY,
    });
    text(s, t, {
      x: 3.42, y: y + 0.54, w: 5.8, h: 0.5, margin: 0,
      fontFace: B, fontSize: 12.5, color: MUTED, lineSpacing: 17,
    });
  });
}

// ── 9. Карта решений ────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Режим «Мы вместе»');
  title(s, '«Карта решений»');

  text(s, 
    'Одни выходные с двух сторон. Каждый выбирает за себя и не видит чужой ход: телефон передают из рук в руки. В двух местах игра просит его отложить и поговорить.',
    { x: M, y: TOP, w: 5.3, h: 0.9, margin: 0,
      fontFace: B, fontSize: 14, color: INK, lineSpacing: 20 },
  );

  const steps = [
    ['Пятница, 19:40', 'навстречу', true],
    ['Суббота, 12:10', 'разошлись', false],
    ['Суббота, 22:30', 'навстречу', true],
    ['Воскресенье, 17:00', 'разошлись', false],
  ];
  steps.forEach(([t, mark, together], i) => {
    const y = 2.34 + i * 0.68;
    card(s, { x: M, y, w: 5.3, h: 0.56 });
    dot(s, { x: M + 0.22, y: y + 0.205, d: 0.15, color: together ? TEAL : 'B9C2CC' });
    text(s, t, {
      x: M + 0.5, y, w: 2.6, h: 0.56, margin: 0, valign: 'middle',
      fontFace: B, fontSize: 13, color: INK,
    });
    text(s, mark, {
      x: M + 3.1, y, w: 2.0, h: 0.56, margin: 0, align: 'right', valign: 'middle',
      fontFace: B, fontSize: 12, bold: true, color: together ? TEAL_DARK : MUTED,
    });
  });

  // Схему рисуем картинкой: линии из фигур PowerPoint здесь нечем проверить
  const mapH = 3.32;
  card(s, { x: 6.35, y: TOP, w: 3.1, h: 3.7 });
  s.addImage({ data: shot('map'), x: 6.55, y: TOP + 0.19, w: mapH * MAP, h: mapH });
}

// ── 10. Как сделано ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Как сделано');
  title(s, 'Без установки и без интернета');
  s.addImage({ data: shot('club'), x: PHONE_RIGHT, y: TOP, h: PHONE_H, w: PHONE_W });

  const colW = PHONE_RIGHT - 0.3 - M;

  const tech = [
    ['Веб-приложение',
     'Ставится на телефон с иконкой на экране, открывается и просто по ссылке. Магазины приложений не нужны.'],
    ['Сценарии в файлах',
     'Тексты квестов, тестов и словаря правятся без программиста.'],
    ['Без интернета',
     'После первого открытия сеть не нужна. Подойдёт классу со слабым вайфаем.'],
    ['Офлайн-встреча',
     'Внутри лежит сценарий занятия на 90 минут с таймингом и правилами для ведущего.'],
  ];
  tech.forEach(([h, t], i) => {
    const y = TOP + i * 0.94;
    card(s, { x: M, y, w: colW, h: 0.86 });
    bullet(s, { x: M + 0.24, y: y + 0.12, size: 14 });
    text(s, h, {
      x: M + 0.56, y: y + 0.12, w: colW - 0.8, h: 0.26, margin: 0,
      fontFace: B, fontSize: 14, bold: true, color: NAVY,
    });
    text(s, t, {
      x: M + 0.56, y: y + 0.4, w: colW - 0.8, h: 0.42, margin: 0,
      fontFace: B, fontSize: 11.5, color: MUTED, lineSpacing: 15,
    });
  });
}

// ── 11. Статус и планы ──────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY_DEEP };
  kicker(s, 'Что сделано и что дальше', { color: TEAL });
  title(s, 'Приложение уже можно открыть', { color: WHITE });

  const done = [
    'Шесть разделов, два квеста, шесть тестов',
    'Квест на двоих и карта решений',
    'Проверка сообщения: одиннадцать приёмов',
    'Двадцать медалей для обеих ролей',
  ];
  const next = [
    'Связать родителя и ребёнка по коду',
    'Синхронизация двух телефонов',
    'Согласия и хранение данных детей',
    'Панель психолога для новых историй',
  ];

  // Левому столбцу отдаём чуть больше ширины: там пункты длиннее
  const col = (x, head, items, accent, w) => {
    text(s, head, {
      x, y: 1.44, w, h: 0.3, margin: 0,
      fontFace: B, fontSize: 13, bold: true, charSpacing: 1, color: accent,
    });
    items.forEach((t, i) => {
      const y = 1.84 + i * 0.56;
      bullet(s, { x: x + 0.02, y, size: 13.5, color: accent });
      text(s, t, {
        x: x + 0.3, y, w: w - 0.3, h: 0.28, margin: 0,
        fontFace: B, fontSize: 13.5, color: 'DCE5EE',
      });
    });
  };
  col(M, 'УЖЕ РАБОТАЕТ', done, TEAL, 4.45);
  col(5.25, 'СЛЕДУЮЩИЙ ШАГ', next, WHITE, 4.2);

  const bar = { y: 4.14, h: 0.88 };
  card(s, { x: M, y: bar.y, w: W - M * 2, h: bar.h, fill: '22303F' });
  text(s, 'levalnik0.github.io/proekt-eho', {
    x: M + 0.3, y: bar.y, w: 5.2, h: bar.h,
    fontFace: B, fontSize: 18, bold: true, color: TEAL, valign: 'middle',
  });
  text(s, 'Код для сканирования на следующем слайде', {
    x: 5.4, y: bar.y, w: 4.05, h: bar.h, align: 'right',
    fontFace: B, fontSize: 13, color: 'A9BACB', valign: 'middle',
  });
  s.addNotes('Здесь можно дать жюри открыть ссылку со своего телефона.');
}

// ── 12. Код ─────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY_DEEP };

  // Слайд целиком под код: его сканируют из зала, с расстояния в несколько
  // метров. Код оставлен чёрным на белом — так камера ловит его увереннее
  // всего, любая перекраска под палитру этому только мешает.
  const qr = 4.0;
  text(s, 'ОТКРОЙТЕ С ТЕЛЕФОНА', {
    x: 0, y: 0.26, w: W, h: 0.26, align: 'center',
    fontFace: B, fontSize: 13, bold: true, charSpacing: 3, color: TEAL,
  });
  s.addImage({ data: shot('qr'), x: (W - qr) / 2, y: 0.68, w: qr, h: qr });
  text(s, 'levalnik0.github.io/proekt-eho', {
    x: 0, y: 4.82, w: W, h: 0.4, align: 'center',
    fontFace: B, fontSize: 20, bold: true, color: WHITE,
  });
  s.addNotes('Этот слайд можно оставить на экране, пока жюри сканирует код.');
}

const out = path.join(__dirname, '..', 'Проект_Эхо_презентация.pptx');
pres.writeFile({ fileName: out }).then(() => console.log('готово:', out));
