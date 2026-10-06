import { memo, useMemo } from 'react';
import { images } from '../data/images.js';
import { plateSVG } from '../art/plates.js';

/**
 * <Plate id="hero" />  — the only way images enter the site.
 * Looks `id` up in data/images.js. Real photo if `src` is set, otherwise a
 * clearly-labelled generative placeholder. `tint` only affects portraits.
 */
function PlateBase({ id, tint, eager = false, className = '', tag = true }) {
  const cfg = images[id];
  if (!cfg) {
    // eslint-disable-next-line no-console
    console.warn(`[Plate] "${id}" is not defined in src/data/images.js`);
    return null;
  }
  const svg = useMemo(() => (cfg.src ? '' : plateSVG(cfg.kind, id, tint)), [cfg.src, cfg.kind, id, tint]);
  return (
    <div className={`plate ${className}`} data-plate={id}>
      {cfg.src ? (
        <img
          src={cfg.src}
          alt={cfg.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable="false"
        />
      ) : (
        <>
          <div className="plate__art" role="img" aria-label={cfg.alt || undefined} aria-hidden={cfg.alt ? undefined : true}
               dangerouslySetInnerHTML={{ __html: svg }} />
          {tag && <span className="plate__tag" aria-hidden="true">placeholder · {id} · {cfg.size}</span>}
        </>
      )}
    </div>
  );
}
export default memo(PlateBase);
