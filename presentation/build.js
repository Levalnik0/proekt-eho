/**
 * Презентация проекта «Эхо» для конкурсной защиты.
 * Палитра и мотив взяты из самого приложения: тёмно-синий, бирюзовый,
 * белые карточки со скруглением.
 *
 * Нумерованных кружков здесь нет намеренно: цифра внутри круга требует
 * вертикального центрирования, проверить которое в этой среде нечем,
 * а порядка в списках всё равно не было.
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

const shot = (name) =>
  'image/png;base64,' +
  fs.readFileSync(path.join(__dirname, 'shots', name + '.png')).toString('base64');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Валеева Лиана Николаевна';
pres.title = 'Проект «Эхо»';

function card(slide, { x, y, w, h, fill = WHITE }) {
  slide.addShape(pres.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.14,
    fill: { color: fill },
    line: { color: fill },
    shadow: { type: 'outer', color: '1E3F68', opacity: 0.1, blur: 10, offset: 2, angle: 90 },
  });
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

function title(slide, text, { color = INK, y = 0.42, h = 0.68 } = {}) {
  slide.addText(text, {
    x: M,
    y,
    w: W - M * 2,
    h,
    margin: 0,
    fontFace: H,
    fontSize: 32,
    bold: true,
    color,
  });
}

function kicker(slide, text, { color = TEAL_DARK } = {}) {
  slide.addText(text.toUpperCase(), {
    x: M,
    y: 0.24,
    w: W - M * 2,
    h: 0.24,
    margin: 0,
    fontFace: B,
    fontSize: 11,
    bold: true,
    charSpacing: 1.2,
    color,
  });
}

// ── 1. Титул ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY_DEEP };
  s.addImage({ data: shot('home'), x: 6.55, y: 0.34, h: 4.95, w: 2.53 });

  s.addText('ПРОЕКТ', {
    x: M, y: 1.28, w: 5.6, h: 0.4, margin: 0,
    fontFace: B, fontSize: 13, bold: true, charSpacing: 3, color: TEAL,
  });
  s.addText('ЭХО', {
    x: M, y: 1.6, w: 5.6, h: 1.1, margin: 0,
    fontFace: H, fontSize: 66, bold: true, color: WHITE,
  });
  s.addText('Приложение о безопасности в сети для детей 10–12 лет и их родителей', {
    x: M, y: 2.8, w: 5.3, h: 0.8, margin: 0,
    fontFace: B, fontSize: 17, color: 'C7D3E0', lineSpacing: 26,
  });
  s.addText('Валеева Лиана Николаевна', {
    x: M, y: 3.74, w: 5.3, h: 0.3, margin: 0,
    fontFace: B, fontSize: 14, color: WHITE,
  });
  s.addText('Открывается по ссылке: levalnik0.github.io/proekt-eho', {
    x: M, y: 4.34, w: 5.6, h: 0.34, margin: 0,
    fontFace: B, fontSize: 13, bold: true, color: TEAL,
  });
  s.addNotes('Приложение уже опубликовано — ссылку можно открыть прямо сейчас с телефона.');
}

// ── 2. Проблема ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Проблемное поле');
  title(s, 'Что происходит в 10–12 лет');

  const items = [
    ['Свой телефон', 'Ребёнок выходит в сеть один. Смотреть, кто ему пишет, некому.'],
    ['Закрывается', 'Начинается возраст, когда экранную жизнь прячут от родителей.'],
    ['Новые схемы', 'Выманивают пароли и игровую валюту, травят в чате класса.'],
  ];
  items.forEach(([h, t], i) => {
    const x = M + i * 3.05;
    card(s, { x, y: 1.62, w: 2.8, h: 1.75 });
    dot(s, { x: x + 0.3, y: 1.94 });
    s.addText(h, {
      x: x + 0.3, y: 2.16, w: 2.24, h: 0.32, margin: 0,
      fontFace: B, fontSize: 16, bold: true, color: INK,
    });
    s.addText(t, {
      x: x + 0.3, y: 2.52, w: 2.24, h: 0.72, margin: 0,
      fontFace: B, fontSize: 12.5, color: MUTED, lineSpacing: 17,
    });
  });

  card(s, { x: M, y: 3.66, w: W - M * 2, h: 1.16, fill: 'E4EFEF' });
  s.addText(
    'Пока про сеть дома не говорят, ребёнок разбирается с ней сам и спрашивает совета у ровесников.',
    { x: M + 0.34, y: 3.94, w: 8.2, h: 0.62, margin: 0,
      fontFace: B, fontSize: 16, color: INK, lineSpacing: 24 },
  );
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
      head: 'Дети 10–12 лет',
      sub: '4–6 классы',
      lines: [
        'Roblox, Minecraft, мессенджеры, короткие видео',
        'Спешка, лесть и подначки работают безотказно',
        'Со спорным вопросом идут к друзьям, не к родителям',
      ],
    },
    {
      x: 5.15,
      head: 'Родители и учителя',
      sub: 'те, кто рядом каждый день',
      lines: [
        'Видят, что ребёнок изменился, но не знают, с чего начать',
        'Запрет ссорит, невмешательство пугает',
        'Готовых слов для такого разговора нет',
      ],
    },
  ];
  cols.forEach((c) => {
    card(s, { x: c.x, y: 1.5, w: 4.3, h: 3.0 });
    s.addText(c.head, {
      x: c.x + 0.32, y: 1.76, w: 3.66, h: 0.36, margin: 0,
      fontFace: H, fontSize: 20, bold: true, color: NAVY,
    });
    s.addText(c.sub, {
      x: c.x + 0.32, y: 2.14, w: 3.66, h: 0.26, margin: 0,
      fontFace: B, fontSize: 12, color: TEAL_DARK,
    });
    c.lines.forEach((t, i) => {
      const y = 2.56 + i * 0.6;
      dot(s, { x: c.x + 0.34, y: y + 0.09 });
      s.addText(t, {
        x: c.x + 0.58, y, w: 3.4, h: 0.52, margin: 0,
        fontFace: B, fontSize: 13, color: INK, lineSpacing: 17,
      });
    });
  });

  s.addText('Приложение говорит с обеими сторонами по отдельности — и потом сводит их вместе.', {
    x: M, y: 4.72, w: W - M * 2, h: 0.36, margin: 0,
    fontFace: B, fontSize: 13, italic: true, color: TEAL_DARK,
  });
}

// ── 4. Что умеет ────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Решение');
  title(s, 'Что умеет приложение');
  s.addImage({ data: shot('home'), x: M, y: 1.4, h: 3.85, w: 1.97 });

  const rows = [
    ['«Я подросток»', 'квест в переписке и три теста про себя'],
    ['«Я взрослый»', 'день глазами ребёнка и проверка догадок'],
    ['«Мы вместе»', 'квест на двоих и карта решений'],
    ['Проверка сообщения', 'разбор настоящей переписки'],
    ['«Клуб навигаторов»', 'сценарий очной встречи в школе'],
  ];
  rows.forEach(([h, t], i) => {
    const y = 1.42 + i * 0.76;
    card(s, { x: 2.85, y, w: 6.6, h: 0.64 });
    dot(s, { x: 3.1, y: y + 0.26 });
    s.addText(h, {
      x: 3.42, y: y + 0.08, w: 2.6, h: 0.3, margin: 0,
      fontFace: B, fontSize: 14, bold: true, color: INK,
    });
    s.addText(t, {
      x: 3.42, y: y + 0.34, w: 5.8, h: 0.26, margin: 0,
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
  s.addImage({ data: shot('mirror'), x: 6.9, y: 1.35, h: 3.9, w: 1.99 });

  s.addText('Тест «какой вы родитель» закрывают на втором вопросе. Поэтому его тут нет.', {
    x: M, y: 1.4, w: 6.05, h: 0.56, margin: 0,
    fontFace: B, fontSize: 15, color: INK, lineSpacing: 21,
  });

  const blocks = [
    ['Угадать, а не ответить',
     'Взрослый предполагает, что ответил бы его ребёнок. Оценивают догадку, и расхождение он замечает сам.'],
    ['Сначала о том, что получается',
     'Каждый результат начинается с сильной стороны. Совет — один и небольшой, на пробу.'],
    ['Без обещаний, которых нет',
     'Написано прямо: это частый ответ детей такого возраста, а не ответ вашего ребёнка.'],
  ];
  blocks.forEach(([h, t], i) => {
    const y = 2.1 + i * 1.06;
    card(s, { x: M, y, w: 6.05, h: 0.94 });
    s.addText(h, {
      x: M + 0.26, y: y + 0.12, w: 5.5, h: 0.28, margin: 0,
      fontFace: B, fontSize: 14, bold: true, color: NAVY,
    });
    s.addText(t, {
      x: M + 0.26, y: y + 0.4, w: 5.55, h: 0.46, margin: 0,
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
  s.addImage({ data: shot('quest'), x: M, y: 1.4, h: 3.85, w: 1.97 });

  const quests = [
    ['«Новый контакт» — для ребёнка',
     'Незнакомец в игровом чате: сперва хвалит, потом торопит, потом просит пароль. Четыре концовки и разбор в конце.'],
    ['«День из жизни» — для взрослого',
     'Взрослый играет за одиннадцатилетнего: чат класса, отобранный на уроке телефон, «как дела?» на бегу.'],
  ];
  quests.forEach(([h, t], i) => {
    const y = 1.42 + i * 1.5;
    card(s, { x: 2.85, y, w: 6.6, h: 1.3 });
    s.addText(h, {
      x: 3.1, y: y + 0.16, w: 6.1, h: 0.3, margin: 0,
      fontFace: B, fontSize: 15, bold: true, color: NAVY,
    });
    s.addText(t, {
      x: 3.1, y: y + 0.5, w: 6.1, h: 0.66, margin: 0,
      fontFace: B, fontSize: 12.5, color: MUTED, lineSpacing: 17,
    });
  });

  card(s, { x: 2.85, y: 4.42, w: 6.6, h: 0.83, fill: 'E4EFEF' });
  s.addText('Истории лежат в обычных файлах — психолог добавляет новые сам.', {
    x: 3.1, y: 4.62, w: 6.1, h: 0.44, margin: 0,
    fontFace: B, fontSize: 13, color: TEAL_DARK,
  });
}

// ── 7. Проверка сообщения ───────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Инструмент на каждый день');
  title(s, 'Проверка сообщения');
  s.addImage({ data: shot('checker'), x: 7.0, y: 1.35, h: 3.9, w: 1.99 });

  s.addText(
    'Вставляешь переписку, которая насторожила. Приложение находит приёмы и цитирует места, где они встретились.',
    { x: M, y: 1.38, w: 6.15, h: 0.66, margin: 0,
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
  flags.forEach((f, i) => {
    const x = M + (i % 2) * 3.15;
    const y = 2.2 + Math.floor(i / 2) * 0.53;
    card(s, { x, y, w: 2.95, h: 0.44 });
    dot(s, { x: x + 0.18, y: y + 0.155, d: 0.12 });
    s.addText(f, {
      x: x + 0.4, y: y + 0.05, w: 2.42, h: 0.34, margin: 0,
      fontFace: B, fontSize: 12, color: INK, valign: 'middle',
    });
  });

  card(s, { x: M, y: 4.42, w: 6.15, h: 0.8, fill: 'E4EFEF' });
  s.addText('Текст остаётся в телефоне. Иначе свою переписку сюда никто не вставит.', {
    x: M + 0.28, y: 4.62, w: 5.7, h: 0.42, margin: 0,
    fontFace: B, fontSize: 12.5, color: TEAL_DARK, lineSpacing: 17,
  });
  s.addNotes('Демонстрация занимает пятнадцать секунд: вставить пример и показать разбор.');
}

// ── 8. Медали ───────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Мотивация');
  title(s, 'Медали');
  s.addImage({ data: shot('medals'), x: M, y: 1.4, h: 3.85, w: 1.97 });

  const rules = [
    ['Название про действие',
     '«Взял паузу», а не «терпеливый родитель». Действие можно повторить завтра.'],
    ['Ошибка тоже награждается',
     'Плохая концовка квеста даёт медаль за опыт: схема теперь известна изнутри.'],
    ['Часть медалей скрыта',
     'В списке видно пустые места. Это возвращает в приложение лучше уведомлений.'],
  ];
  rules.forEach(([h, t], i) => {
    const y = 1.42 + i * 1.3;
    card(s, { x: 2.85, y, w: 6.6, h: 1.12 });
    dot(s, { x: 3.1, y: y + 0.28 });
    s.addText(h, {
      x: 3.42, y: y + 0.16, w: 5.8, h: 0.3, margin: 0,
      fontFace: B, fontSize: 14.5, bold: true, color: NAVY,
    });
    s.addText(t, {
      x: 3.42, y: y + 0.5, w: 5.8, h: 0.5, margin: 0,
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

  s.addText(
    'Одни выходные с двух сторон. Каждый выбирает за себя и не видит чужой ход: телефон передают из рук в руки. В двух местах игра просит его отложить и поговорить.',
    { x: M, y: 1.4, w: 5.3, h: 0.96, margin: 0,
      fontFace: B, fontSize: 14, color: INK, lineSpacing: 20 },
  );

  const steps = [
    ['Пятница, 19:40', 'навстречу', true],
    ['Суббота, 12:10', 'разошлись', false],
    ['Суббота, 22:30', 'навстречу', true],
    ['Воскресенье, 17:00', 'разошлись', false],
  ];
  steps.forEach(([t, mark, together], i) => {
    const y = 2.6 + i * 0.62;
    card(s, { x: M, y, w: 5.3, h: 0.52 });
    dot(s, { x: M + 0.22, y: y + 0.19, d: 0.15, color: together ? TEAL : 'B9C2CC' });
    s.addText(t, {
      x: M + 0.5, y: y + 0.11, w: 2.6, h: 0.3, margin: 0,
      fontFace: B, fontSize: 13, color: INK,
    });
    s.addText(mark, {
      x: M + 3.1, y: y + 0.11, w: 2.0, h: 0.3, margin: 0, align: 'right',
      fontFace: B, fontSize: 12, bold: true, color: together ? TEAL_DARK : MUTED,
    });
  });

  // Схему рисуем картинкой: линии из фигур PowerPoint здесь нечем проверить
  card(s, { x: 6.35, y: 1.4, w: 3.1, h: 3.72 });
  s.addImage({ data: shot('map'), x: 6.55, y: 1.62, w: 2.7, h: 3.32 });
}

// ── 10. Как сделано ─────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Как сделано');
  title(s, 'Работает без установки и без интернета');
  s.addImage({ data: shot('club'), x: 7.0, y: 1.35, h: 3.9, w: 1.99 });

  const tech = [
    ['Веб-приложение',
     'Ставится на телефон с иконкой на экране, открывается и просто по ссылке. Магазины приложений не нужны.'],
    ['Сценарии в файлах',
     'Тексты квестов, тестов и словаря правятся без программиста.'],
    ['Без интернета',
     'После первого открытия сеть не нужна — подойдёт классу со слабым вайфаем.'],
    ['Офлайн-встреча',
     'Внутри лежит сценарий занятия на 90 минут с таймингом и правилами для ведущего.'],
  ];
  tech.forEach(([h, t], i) => {
    const y = 1.4 + i * 0.98;
    card(s, { x: M, y, w: 6.2, h: 0.86 });
    dot(s, { x: M + 0.24, y: y + 0.2 });
    s.addText(h, {
      x: M + 0.56, y: y + 0.11, w: 5.4, h: 0.28, margin: 0,
      fontFace: B, fontSize: 14, bold: true, color: NAVY,
    });
    s.addText(t, {
      x: M + 0.56, y: y + 0.39, w: 5.5, h: 0.42, margin: 0,
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

  const col = (x, head, items, accent) => {
    s.addText(head, {
      x, y: 1.52, w: 4.2, h: 0.32, margin: 0,
      fontFace: B, fontSize: 13, bold: true, charSpacing: 1, color: accent,
    });
    items.forEach((t, i) => {
      const y = 1.98 + i * 0.56;
      dot(s, { x: x + 0.02, y: y + 0.09, color: accent });
      s.addText(t, {
        x: x + 0.3, y, w: 3.9, h: 0.34, margin: 0,
        fontFace: B, fontSize: 13.5, color: 'DCE5EE',
      });
    });
  };
  col(M, 'УЖЕ РАБОТАЕТ', done, TEAL);
  col(5.25, 'СЛЕДУЮЩИЙ ШАГ', next, WHITE);

  card(s, { x: M, y: 4.42, w: W - M * 2, h: 0.78, fill: '22303F' });
  s.addText('levalnik0.github.io/proekt-eho', {
    x: M + 0.3, y: 4.55, w: 5.2, h: 0.5, margin: 0,
    fontFace: B, fontSize: 18, bold: true, color: TEAL, valign: 'middle',
  });
  s.addText('Откройте на телефоне, установка не нужна', {
    x: 5.4, y: 4.55, w: 4.05, h: 0.5, margin: 0, align: 'right',
    fontFace: B, fontSize: 13, color: 'A9BACB', valign: 'middle',
  });
  s.addNotes('Здесь можно дать жюри открыть ссылку со своего телефона.');
}

const out = path.join(__dirname, 'Проект_Эхо_презентация.pptx');
pres.writeFile({ fileName: out }).then(() => console.log('готово:', out));
