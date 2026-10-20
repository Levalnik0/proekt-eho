import { useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useProgress } from '../progress/useProgress';
import { BadgeCard } from '../progress/BadgeCard';
import glossary from '../data/glossary.json';

type Term = { forms: string[]; title: string; text: string; note: string };

const TERMS = glossary.terms as Term[];

/** Словоформа → термин. Ключ — форма с пробелами, приведёнными к одному. */
const BY_FORM = new Map<string, Term>();
const ALL_FORMS: string[] = [];
for (const term of TERMS) {
  for (const form of term.forms) {
    BY_FORM.set(form.toLowerCase().replace(/\s+/g, ' '), term);
    ALL_FORMS.push(form);
  }
}
// Длинные формы — в т.ч. из нескольких слов вроде «цифровой след» —
// проверяем раньше коротких, чтобы фраза не распалась на одно слово.
ALL_FORMS.sort((a, b) => b.length - a.length);

/**
 * Границы слова строим сами, а не через \b: в JS \b завязан на \w,
 * а кириллица в \w не входит — \bскинь\b никогда не совпадёт.
 * Формы ищем точным совпадением (а не разбиением текста на токены),
 * чтобы поддержать и словосочетания из нескольких слов.
 */
const NOT_WORD_CHAR = 'А-Яа-яЁёA-Za-z0-9_';
const escapeForm = (f: string) =>
  f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
const WORD = new RegExp(
  `(?<![${NOT_WORD_CHAR}])(?:${ALL_FORMS.map(escapeForm).join('|')})(?![${NOT_WORD_CHAR}])`,
  'gi',
);

/**
 * Подсвечивает сленг в тексте: тап по слову открывает объяснение.
 *
 * Смысл механики — не «обучить родителя молодёжному языку».
 * Взрослый сам решает, что ему непонятно, и сам это открывает:
 * никто не объясняет ему то, о чём он не спрашивал.
 */
export function Glossed({ text }: { text: string }) {
  const [open, setOpen] = useState<Term | null>(null);
  const [fresh, setFresh] = useState<string[]>([]);
  const { award } = useProgress();

  function reveal(term: Term) {
    setOpen(term);
    const given = award(['translator']);
    if (given.length) setFresh(given);
  }

  const parts = useMemo<ReactNode[]>(() => {
    const out: ReactNode[] = [];
    let last = 0;
    let match: RegExpExecArray | null;
    WORD.lastIndex = 0;
    while ((match = WORD.exec(text))) {
      const term = BY_FORM.get(match[0].toLowerCase().replace(/\s+/g, ' '));
      if (!term) continue;
      if (match.index > last) out.push(text.slice(last, match.index));
      const word = match[0];
      out.push(
        <button
          key={`${match.index}-${word}`}
          className="gloss"
          onClick={() => reveal(term)}
          aria-label={`Что значит «${word}»`}
        >
          {word}
        </button>,
      );
      last = match.index + word.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <>
      {parts}

      {open &&
        createPortal(
          <div
            className="sheet"
            role="dialog"
            aria-label={`Слово: ${open.title}`}
            onClick={() => setOpen(null)}
          >
            <div className="sheet__card" onClick={(e) => e.stopPropagation()}>
              <div className="sheet__grip" />
              <div className="sheet__title">{open.title}</div>
              <p className="sheet__text">{open.text}</p>
              <div className="sheet__note">{open.note}</div>
              <button className="btn btn--wide" onClick={() => setOpen(null)}>
                Понятно
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* Медаль ждёт, пока закроют словарь: два окна разом сбивают с толку */}
      {!open &&
        fresh.length > 0 &&
        createPortal(
          <BadgeCard badgeId={fresh[0]} onClose={() => setFresh((p) => p.slice(1))} />,
          document.body,
        )}
    </>
  );
}
