import { Fragment } from 'react';

/**
 * Declarative text splitters (no DOM mutation, safe with React).
 * A visually-hidden copy carries the real text for assistive tech;
 * the visual spans are aria-hidden.
 *
 *  <Chars text="LEARN." />            → .chars > .ch > .ch__i
 *  <Lines lines={['A','B']} chars />  → .line > .line__i (> chars)
 */
export function Chars({ text, className = '' }) {
  return (
    <span className={`chars ${className}`}>
      <span className="sr">{text} </span>
      <span aria-hidden="true">
        {[...text].map((c, i) => (
          <span className="ch" key={i}>
            <span className="ch__i">{c === ' ' ? '\u00A0' : c}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

export function Lines({ lines, chars = false, className = '', lineClass = '' }) {
  return (
    <>
      {lines.map((l, i) => (
        <Fragment key={i}>
          <span className={`line ${lineClass} ${className}`}>
            <span className="line__i">{chars ? <Chars text={l} /> : l}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}
