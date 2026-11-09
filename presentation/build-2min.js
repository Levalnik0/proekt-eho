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
const PHONE = 720 / 1410;
const MAP = 1040 / 1280;
const PHONE_H = 3.7;
const PHONE_W = PHONE_H * PHONE;
const PHONE_RIGHT = W - M - PHONE_W; // картинка у правого поля

const SHOTS = { home: 'new', games: 'new', quest: 'new', duel: 'new', checker: 'new', medals: 'new', mirror: 'new', cover: 'old', qr: 'old', map: 'old', club: 'old' };
const shot = (name) =>
  'image/png;base64,' +
  fs.readFileSync(path.join(__dirname, SHOTS[name] === 'new' ? 'new_shots' : 'shots', name + '.png')).toString('base64');

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


const LINK = 'levalnik0.github.io/proekt-eho';
const P_H = 3.55;
const P_W = P_H * PHONE;

// ── 1. Титул ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { data: shot('cover') };
  s.addImage({ data: shot('home'), x: 6.55, y: 0.34, h: 4.95, w: 4.95 * PHONE });
  text(s, 'ПРОЕКТ', { x: M, y: 1.42, w: 5.6, h: 0.34, margin: 0, fontFace: B, fontSize: 13, bold: true, charSpacing: 3, color: TEAL });
  text(s, 'ЭХО', { x: M, y: 1.7, w: 5.6, h: 1.16, margin: 0, fontFace: H, fontSize: 66, bold: true, color: WHITE });
  text(s, 'Безопасность в сети для детей 10–12 лет и их родителей', {
    x: M, y: 2.88, w: 5.3, h: 0.78, margin: 0, fontFace: B, fontSize: 17, color: 'C7D3E0', lineSpacing: 26,
  });
  text(s, 'Валеева Лиана Николаевна', { x: M, y: 3.86, w: 5.3, h: 0.3, margin: 0, fontFace: B, fontSize: 14, color: WHITE });
  text(s, 'Промежуточный отчёт', { x: M, y: 4.42, w: 5.6, h: 0.34, margin: 0, fontFace: B, fontSize: 13, bold: true, color: TEAL });
  s.addNotes('Здравствуйте. Расскажу за две минуты, что сделано, какие результаты уже есть и что дальше.');
}

// ── 2. Статус реализации ────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Статус реализации');
  title(s, 'Приложение уже работает');

  const done = [
    ['9 мини-игр', 'Дуэль паролей, Автодром, Фильтр, Детектив и другие'],
    ['5 историй', 'чат с «мошенником» и профиль собеседника'],
    ['Тесты и квест на двоих', 'для детей и для родителей'],
    ['Проверка сообщения', 'разбор переписки прямо на телефоне'],
  ];
  done.forEach(([h, t], i) => {
    const y = TOP + i * 0.9;
    card(s, { x: M, y, w: 3.75, h: 0.8 });
    bullet(s, { x: M + 0.22, y: y + 0.14, size: 13.5 });
    text(s, h, { x: M + 0.5, y: y + 0.12, w: 3.1, h: 0.26, margin: 0, fontFace: B, fontSize: 13.5, bold: true, color: NAVY });
    text(s, t, { x: M + 0.5, y: y + 0.4, w: 3.1, h: 0.38, margin: 0, fontFace: B, fontSize: 10.5, color: MUTED, lineSpacing: 13 });
  });

  ['home', 'duel', 'quest'].forEach((n, i) => {
    s.addImage({ data: shot(n), x: 4.55 + i * (P_W + 0.14), y: TOP, h: P_H, w: P_W });
  });
  s.addNotes('Приложение уже работает. Внутри девять мини-игр, пять историй, тесты, квест на двоих и проверка сообщения.');
}

// ── 2б. Что внутри ──────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Статус реализации');
  title(s, 'Что внутри');
  const items = [
    ['Проверка сообщения', 'видно, какие приёмы мошенника в тексте'],
    ['Медали', '29 наград за практику, часть скрыта'],
    ['Зеркало', 'родитель угадывает, как ответит ребёнок'],
  ];
  ['checker', 'medals', 'mirror'].forEach((n, i) => {
    const x = M + i * 3.05;
    s.addImage({ data: shot(n), x, y: TOP, h: 2.75, w: 2.75 * PHONE });
    text(s, items[i][0], { x: x + 1.5, y: TOP + 0.1, w: 1.5, h: 0.5, margin: 0, fontFace: B, fontSize: 13, bold: true, color: NAVY, lineSpacing: 16 });
    text(s, items[i][1], { x: x + 1.5, y: TOP + 0.7, w: 1.45, h: 1.2, margin: 0, fontFace: B, fontSize: 11, color: MUTED, lineSpacing: 14 });
  });
  note(s, 'Всё работает без интернета, ответы хранятся только на телефоне.', { x: M, y: 4.46, w: W - M * 2, h: 0.5, size: 13 });
  s.addNotes('Ещё внутри: проверка сообщения, медали и зеркало для родителя и ребёнка.');
}

// ── 3. Результаты ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Промежуточные результаты');
  title(s, 'Что уже получилось');

  text(s, 'КОЛИЧЕСТВЕННЫЕ', { x: M, y: 1.22, w: 4.2, h: 0.26, margin: 0, fontFace: B, fontSize: 12, bold: true, charSpacing: 1, color: TEAL_DARK });
  const nums = [
    ['9', 'мини-игр'],
    ['5', 'историй'],
    ['8', 'тестов и «зеркал»'],
    ['29', 'медалей'],
    ['11', 'приёмов в проверке сообщения'],
    ['6', 'цветовых тем'],
  ];
  nums.forEach(([n, l], i) => {
    const x = M + (i % 2) * 2.1;
    const y = 1.56 + Math.floor(i / 2) * 1.14;
    card(s, { x, y, w: 1.95, h: 1.0 });
    text(s, n, { x: x + 0.2, y: y + 0.08, w: 1.55, h: 0.5, margin: 0, fontFace: H, fontSize: 30, bold: true, color: NAVY });
    text(s, l, { x: x + 0.2, y: y + 0.6, w: 1.6, h: 0.34, margin: 0, fontFace: B, fontSize: 11, color: MUTED, lineSpacing: 13 });
  });

  text(s, 'КАЧЕСТВЕННЫЕ', { x: 5.15, y: 1.22, w: 4.3, h: 0.26, margin: 0, fontFace: B, fontSize: 12, bold: true, charSpacing: 1, color: TEAL_DARK });
  const qual = [
    ['Идея прошла защиту', 'питч перед 8 экспертами по профилактике и кризисной психологии'],
    ['Отзыв подростка учтён', 'по его замечаниям добавлены звуки, вибрация и понятные правила в играх'],
    ['Проверка перед пилотом', 'тексты, логика тестов, доступность и безопасность проверены по девяти направлениям'],
  ];
  qual.forEach(([h, t], i) => {
    const y = 1.56 + i * 1.14;
    card(s, { x: 5.15, y, w: 4.3, h: 1.0 });
    bullet(s, { x: 5.4, y: y + 0.16, size: 13.5 });
    text(s, h, { x: 5.72, y: y + 0.14, w: 3.55, h: 0.26, margin: 0, fontFace: B, fontSize: 13.5, bold: true, color: NAVY });
    text(s, t, { x: 5.72, y: y + 0.44, w: 3.55, h: 0.5, margin: 0, fontFace: B, fontSize: 11, color: MUTED, lineSpacing: 14 });
  });
  s.addNotes('В цифрах: девять игр, пять историй, восемь тестов, двадцать девять медалей. По качеству: идея прошла защиту перед экспертами, а замечания подростка уже внесены.');
}

// ── 4. Планы ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: BG };
  kicker(s, 'Запланированные мероприятия');
  title(s, 'Что дальше');

  const plans = [
    ['Проверка на семьях', 'Пары «родитель + ребёнок» играют в школе, мы смотрим, где они зависают и что им непонятно.'],
    ['Экспертная проверка', 'Школьный психолог проверяет тексты историй, тестов и кризисного экрана.'],
    ['Игры с друзьями онлайн', 'Друзья по ссылке без переписки, игры на нескольких телефонах. Для этого нужен сервер.'],
    ['Рейтинг школ', 'Соревнование классов и «игра придумана учениками школы». С согласия родителей и школ.'],
  ];
  plans.forEach(([h, t], i) => {
    const x = M + (i % 2) * 4.55;
    const y = TOP + Math.floor(i / 2) * 1.6;
    card(s, { x, y, w: 4.35, h: 1.45 });
    dot(s, { x: x + 0.3, y: y + 0.3 });
    text(s, h, { x: x + 0.58, y: y + 0.22, w: 3.5, h: 0.3, margin: 0, fontFace: B, fontSize: 15, bold: true, color: NAVY });
    text(s, t, { x: x + 0.3, y: y + 0.66, w: 3.8, h: 0.7, margin: 0, fontFace: B, fontSize: 12, color: MUTED, lineSpacing: 16 });
  });
  note(s, 'Сначала доводим основное и проверяем на живых детях, и только потом рейтинги и школы.', {
    x: M, y: 4.46, w: W - M * 2, h: 0.56, size: 13,
  });
  s.addNotes('Ближайший шаг: проверка на семьях и консультация психолога. Онлайн, рейтинг школ и панель психолога идут после.');
}

// ── 5. Ссылка ───────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY_DEEP };
  const qr = 3.8;
  text(s, 'ОТКРОЙТЕ С ТЕЛЕФОНА', { x: 0, y: 0.26, w: W, h: 0.26, align: 'center', fontFace: B, fontSize: 13, bold: true, charSpacing: 3, color: TEAL });
  s.addImage({ data: shot('qr'), x: (W - qr) / 2, y: 0.68, w: qr, h: qr });
  text(s, LINK, { x: 0, y: 4.62, w: W, h: 0.4, align: 'center', fontFace: B, fontSize: 20, bold: true, color: WHITE });
  s.addNotes('Спасибо. Приложение можно открыть прямо сейчас с телефона.');
}

const out = path.join(__dirname, '..', 'Проект_Эхо_презентация.pptx');
pres.writeFile({ fileName: out }).then(() => console.log('готово:', out));
