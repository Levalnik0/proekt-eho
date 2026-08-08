import type { CoopRun } from '../progress/useProgress';

/**
 * «Карта решений»: две линии, которые сходятся там, где выборы совпали,
 * и расходятся там, где нет. Смысл картинки — не «кто прав»,
 * а «вот здесь мы друг друга не поняли».
 *
 * Координаты SVG совпадают с пикселями вёрстки один к одному,
 * иначе точки уезжают от строк списка.
 */
const W = 92; // ширина колонки с рисунком
const ROW = 92; // высота строки в списке справа
const LEFT = 22;
const RIGHT = 70;
const MID = (LEFT + RIGHT) / 2;

const MARK: Record<CoopRun['steps'][number]['state'], string> = {
  together: 'навстречу',
  closed: 'оба закрылись',
  crossed: 'разошлись',
};

export function DecisionMap({ steps }: { steps: CoopRun['steps'] }) {
  const height = ROW * steps.length;

  const x = (state: CoopRun['steps'][number]['state'], side: 'teen' | 'adult') =>
    state === 'together' ? MID : side === 'teen' ? LEFT : RIGHT;

  const line = (side: 'teen' | 'adult') => {
    const start = side === 'teen' ? LEFT : RIGHT;
    let d = `M${start} 6`;
    steps.forEach((s, i) => {
      d += ` L${x(s.state, side)} ${ROW * i + ROW / 2}`;
    });
    const last = steps[steps.length - 1];
    d += ` L${x(last.state, side)} ${height - 6}`;
    return d;
  };

  return (
    <div className="map">
      <div className="map__legend">
        <span className="map__key map__key--teen">подросток</span>
        <span className="map__key map__key--adult">взрослый</span>
      </div>

      <div className="map__body">
        <svg
          className="map__svg"
          width={W}
          height={height}
          viewBox={`0 0 ${W} ${height}`}
          fill="none"
          aria-hidden="true"
        >
          <path d={line('teen')} stroke="var(--echo-teal)" strokeWidth="3" strokeLinecap="round" />
          <path d={line('adult')} stroke="var(--echo-navy)" strokeWidth="3" strokeLinecap="round" />

          {steps.map((s, i) => {
            const cy = ROW * i + ROW / 2;
            return s.state === 'together' ? (
              <g key={i}>
                <circle cx={MID} cy={cy} r="9" fill="var(--echo-navy)" />
                <circle cx={MID} cy={cy} r="4.5" fill="var(--echo-teal)" />
              </g>
            ) : (
              <g key={i} opacity={s.state === 'closed' ? 0.45 : 1}>
                <circle cx={LEFT} cy={cy} r="6.5" fill="var(--echo-teal)" />
                <circle cx={RIGHT} cy={cy} r="6.5" fill="var(--echo-navy)" />
              </g>
            );
          })}
        </svg>

        <ul className="map__steps">
          {steps.map((s, i) => (
            <li key={i} className={s.state === 'together' ? 'is-together' : undefined}>
              <b>{s.title}</b>
              <span className="map__mark">{MARK[s.state]}</span>
              <span className="map__choice map__choice--teen">{s.teen}</span>
              <span className="map__choice map__choice--adult">{s.adult}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
