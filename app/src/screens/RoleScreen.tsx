import { EchoAppIcon } from '../components/EchoLogo';
import { IconAdultChild, IconGamepad } from '../components/icons';
import type { Role } from '../progress/badges';

/**
 * Первый экран при запуске.
 * Формулировки нарочно нейтральные: «кто держит телефон», а не
 * «выберите свою роль» — чтобы взрослый не читал это как запись на курс.
 */
export function RoleScreen({ onPick }: { onPick: (role: Role) => void }) {
  return (
    <div className="screen role-screen">
      <EchoAppIcon size={70} />
      <h1 className="role-screen__title">Кто сейчас с телефоном?</h1>
      <p className="role-screen__text">
        От этого зависит, что будет на экране. Поменять можно в любой момент в настройках.
      </p>

      <button className="role-card" onClick={() => onPick('teen')}>
        <span className="role-card__badge">
          <IconGamepad size={26} />
        </span>
        <span className="role-card__body">
          <b>Я — подросток</b>
          <span>Квесты, тесты про себя и медали</span>
        </span>
      </button>

      <button className="role-card" onClick={() => onPick('adult')}>
        <span className="role-card__badge">
          <IconAdultChild size={26} />
        </span>
        <span className="role-card__body">
          <b>Я — взрослый</b>
          <span>Родитель, учитель или психолог</span>
        </span>
      </button>

      <div className="stub-note">Ответы не уходят никуда за пределы этого телефона.</div>
    </div>
  );
}
