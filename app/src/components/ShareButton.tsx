import { useRef, useState } from 'react';
import { buzz } from '../fx';

/**
 * «Скинуть другу»: системное окно «Поделиться», а если его нет
 * (компьютер, старый телефон), текст с ссылкой копируется.
 * В сообщении только то, что человек сам захотел показать: сайт и результат.
 */
export function ShareButton({
  text,
  label = 'Скинуть другу',
  className = 'btn btn--wide',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  async function share() {
    buzz('tap');
    const url = `${window.location.origin}${window.location.pathname}`;
    try {
      if (navigator.share) {
        await navigator.share({ text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // человек закрыл окно «Поделиться»: это не ошибка
    }
  }

  return (
    <button className={className} onClick={share}>
      {copied ? 'Ссылка скопирована' : label}
    </button>
  );
}
