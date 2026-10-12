import { arcPath, regions, worldMap, type RegionId } from '@/data/network';

/**
 * Hook-free world routes drawing, shared by the static homepage preview (server
 * rendered, no JavaScript) and the interactive map on the network page.
 */
export type Direction = 'both' | 'export' | 'import';

type Interaction = {
  active: RegionId | null;
  controls: string;
  onSelect: (id: RegionId) => void;
  onHover: (id: RegionId | null) => void;
};

type Props = {
  idPrefix: string;
  ariaLabel: string;
  indiaLabel: string;
  regionNames: Record<RegionId, string>;
  focus?: RegionId | null;
  direction?: Direction;
  interaction?: Interaction;
};

const W = worldMap.width;
const H = worldMap.height;
const hub = worldMap.pins.india;
const pct = (p: { x: number; y: number }) => ({ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` });

export function RoutesCanvas({ idPrefix, ariaLabel, indiaLabel, regionNames, focus = null, direction = 'both', interaction }: Props) {
  // Region-level routes always; market-level routes for the focused region.
  type Route = { id: string; region: RegionId; to: { x: number; y: number }; market: boolean };
  const routes = regions.flatMap((r): Route[] =>
    focus === r.id
      ? r.markets.map((m) => ({ id: m, region: r.id, to: worldMap.pins[m], market: true }))
      : [{ id: r.id, region: r.id, to: worldMap.pins[r.pin], market: false }],
  );
  const showExport = direction !== 'import';
  const showImport = direction !== 'export';

  return (
    <div className="relative" dir="ltr">
      {/* Static dotted base map (cacheable file); routes and markers are drawn on top. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maps/world-dots.svg" alt="" aria-hidden width={W} height={H} loading="lazy" decoding="async" className="absolute inset-0 size-full" />
      <svg viewBox={`0 0 ${W} ${H}`} className="relative block h-auto w-full" role="img" aria-label={ariaLabel}>
        <defs>
          <radialGradient id={`${idPrefix}-glow`}>
            <stop offset="0%" stopColor="var(--color-gold-500)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-gold-500)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={hub.x} cy={hub.y} r="9" fill={`url(#${idPrefix}-glow)`} />

        {routes.map((r, i) => (
          <g key={`${r.id}-${direction}`} opacity={focus && focus !== r.region ? 0.25 : 1} className="transition-opacity duration-300">
            {showExport && (
              <>
                <path d={arcPath(hub, r.to, 0.32)} pathLength={100} fill="none" stroke="var(--color-gold-500)" strokeWidth={r.market ? 0.28 : 0.38} strokeLinecap="round" className="route-line" style={{ '--route-length': 100, '--route-delay': `${i * 90}ms` } as React.CSSProperties} />
                <path d={arcPath(hub, r.to, 0.32)} pathLength={100} fill="none" stroke="#fff6d8" strokeWidth={0.22} strokeLinecap="round" className="route-flow" opacity="0.8" />
              </>
            )}
            {showImport && (
              <>
                <path d={arcPath(r.to, hub, 0.16)} pathLength={100} fill="none" stroke="#5fa0ff" strokeWidth={r.market ? 0.28 : 0.38} strokeLinecap="round" className="route-line" style={{ '--route-length': 100, '--route-delay': `${i * 90 + 200}ms` } as React.CSSProperties} />
                <path d={arcPath(r.to, hub, 0.16)} pathLength={100} fill="none" stroke="#d6e6ff" strokeWidth={0.22} strokeLinecap="round" className="route-flow" opacity="0.7" />
              </>
            )}
          </g>
        ))}

        {/* Market markers */}
        {regions.flatMap((r) =>
          r.markets.map((m) => {
            const p = worldMap.pins[m];
            const on = focus === r.id;
            return <circle key={m} cx={p.x} cy={p.y} r={on ? 0.85 : 0.55} fill={on ? '#ffffff' : 'rgb(255 255 255 / 0.55)'} className="transition-all duration-300" />;
          }),
        )}

        {/* Region markers (keyboard and pointer operable when interactive) */}
        {regions.map((r) => {
          const p = worldMap.pins[r.pin];
          const on = focus === r.id;
          const i = interaction;
          return (
            <g
              key={r.id}
              role={i ? 'button' : undefined}
              tabIndex={i ? 0 : undefined}
              aria-pressed={i ? i.active === r.id : undefined}
              aria-label={i ? regionNames[r.id] : undefined}
              aria-controls={i?.controls}
              className={i ? 'cursor-pointer outline-none [&:focus-visible>circle:last-child]:stroke-gold-400' : undefined}
              onClick={i ? () => i.onSelect(r.id) : undefined}
              onKeyDown={
                i
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        i.onSelect(r.id);
                      }
                    }
                  : undefined
              }
              onMouseEnter={i ? () => i.onHover(r.id) : undefined}
              onMouseLeave={i ? () => i.onHover(null) : undefined}
            >
              <circle cx={p.x} cy={p.y} r="4" fill="transparent" />
              <circle cx={p.x} cy={p.y} r="1.6" fill="var(--color-navy-500)" opacity="0.5" className="pulse-ring" />
              <circle cx={p.x} cy={p.y} r={on ? 1.5 : 1.15} fill={on ? 'var(--color-gold-500)' : 'var(--color-navy-950)'} stroke={on ? '#fff' : '#9cc3ee'} strokeWidth="0.4" className="transition-all duration-300" />
            </g>
          );
        })}

        {/* Home base */}
        <circle cx={hub.x} cy={hub.y} r="2.2" fill="var(--color-gold-500)" opacity="0.6" className="pulse-ring" />
        <circle cx={hub.x} cy={hub.y} r="1.5" fill="var(--color-gold-500)" stroke="var(--color-navy-950)" strokeWidth="0.5" />
      </svg>

      {/* HTML labels stay readable at any size */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
        <span className="absolute -translate-x-1/2 translate-y-3 rounded-full bg-gold-500 px-2.5 py-0.5 text-xs font-bold text-navy-950 shadow" style={pct(hub)}>
          {indiaLabel}
        </span>
        {regions.map((r) => (
          <span
            key={r.id}
            className={`absolute -translate-x-1/2 -translate-y-[170%] rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow transition-colors ${
              focus === r.id ? 'bg-white text-navy-950' : 'bg-navy-900/85 text-navy-100'
            }`}
            style={pct(worldMap.pins[r.pin])}
          >
            {regionNames[r.id]}
          </span>
        ))}
      </div>
    </div>
  );
}

type LegendLabels = { legendTitle: string; legendHome: string; legendExport: string; legendImport: string; legendMarket: string };

export function MapLegend({ labels }: { labels: LegendLabels }) {
  const item = 'inline-flex items-center gap-2';
  return (
    <ul aria-label={labels.legendTitle} className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-navy-100 sm:text-sm">
      <li className={item}>
        <span className="size-3 rounded-full bg-gold-500 ring-2 ring-gold-500/30" aria-hidden />
        {labels.legendHome}
      </li>
      <li className={item}>
        <span className="h-0.5 w-6 rounded bg-gold-500" aria-hidden />
        {labels.legendExport}
      </li>
      <li className={item}>
        <span className="h-0.5 w-6 rounded bg-[#5fa0ff]" aria-hidden />
        {labels.legendImport}
      </li>
      <li className={item}>
        <span className="size-2 rounded-full bg-white/70" aria-hidden />
        {labels.legendMarket}
      </li>
    </ul>
  );
}
