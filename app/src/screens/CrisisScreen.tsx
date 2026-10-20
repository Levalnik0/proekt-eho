import { IconBack } from '../components/icons';

/**
 * «Что делать прямо сейчас» — протокол для взрослого, который заметил
 * тревожные признаки (не только денежные — любую схему из приложения).
 *
 * Важно: номера горячих линий ниже — заготовка. Перед публикацией
 * нужно подставить актуальный контакт антитеррористической комиссии
 * Республики Татарстан и проверить остальные номера.
 */
const DONT = [
  'Не отбирать телефон и не читать переписку без ребёнка — это закрывает разговор, а не открывает его.',
  'Не кричать и не устраивать допрос с порога.',
  'Не говорить «я же говорил(а)» — это про вас, а не про него.',
];

const SAY_FIRST = [
  {
    title: 'Не вопрос-ловушка, а открытая дверь',
    text: '«Я кое-что заметил(а) и беспокоюсь. Можем поговорить?» — вместо «Что это значит?!» или «Признавайся».',
  },
  {
    title: 'Сначала послушать, потом спрашивать',
    text: 'Дайте договорить до конца, даже если ответ уже понятен. Вопросы — после, не вместо.',
  },
];

const CONTACTS = [
  {
    title: 'Детский телефон доверия',
    value: '8-800-2000-122',
    note: 'Круглосуточно и бесплатно, по всей России — для детей и для взрослых.',
  },
  {
    title: 'Школьный психолог или классный руководитель',
    value: '[указать контакт]',
    note: 'Тот, кто видит ребёнка каждый день — часто быстрее заметит остальное.',
  },
];

export function CrisisScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="screen">
      <div className="topbar">
        <button className="topbar__back" onClick={onBack} aria-label="Назад">
          <IconBack size={22} />
        </button>
        <span className="topbar__title">Что делать прямо сейчас</span>
        <span className="topbar__spacer" />
      </div>

      <p className="section-lead">
        Если вы заметили тревожные признаки из квестов — у ребёнка в переписке или в поведении —
        вот с чего начать, по шагам.
      </p>

      <h2 className="section-title">Что не делать сразу</h2>
      <ul className="section-points">
        {DONT.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>

      <h2 className="section-title">Что сказать первым делом</h2>
      <ul className="program">
        {SAY_FIRST.map((s) => (
          <li key={s.title}>
            <b className="program__title">{s.title}</b>
            <span className="program__text">{s.text}</span>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Куда обратиться</h2>
      <div className="panel">
        {CONTACTS.map((c) => (
          <div className="panel__row crisis__contact" key={c.title}>
            <div>
              <span>{c.title}</span>
              <p className="crisis__contact-note">{c.note}</p>
            </div>
            <b>{c.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
