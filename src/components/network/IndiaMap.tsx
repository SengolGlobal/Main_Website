import { indiaCities, indiaMap, type IndiaCity } from '@/data/network';

type Props = { cities: Record<IndiaCity, string>; label: string };

// Label side per city keeps neighbouring names (Mumbai / Navi Mumbai) apart.
const labelSide: Partial<Record<IndiaCity, 'left' | 'right'>> = {
  mumbai: 'left',
  mundra: 'left',
  ahmedabad: 'right',
  cochin: 'left',
  'navi-mumbai': 'right',
  tuticorin: 'right',
  bengaluru: 'left',
  hyderabad: 'left',
};

/** Dotted India map marking the network locations listed in the company profile. */
export function IndiaMap({ cities, label }: Props) {
  const { width: W, height: H } = indiaMap;
  return (
    <figure className="relative mx-auto w-full max-w-md" dir="ltr">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maps/india-dots.svg" alt="" aria-hidden width={W + 2} height={H + 2} loading="lazy" decoding="async" className="absolute inset-0 size-full" />
      <svg viewBox={`-1 -1 ${W + 2} ${H + 2}`} className="relative block h-auto w-full" role="img" aria-label={label}>
        {indiaCities.map((c) => {
          const p = indiaMap.pins[c];
          return (
            <g key={c}>
              <circle cx={p.x} cy={p.y} r="1.6" fill="var(--color-gold-500)" opacity="0.35" className="pulse-ring" />
              <circle cx={p.x} cy={p.y} r="0.95" fill="var(--color-gold-500)" stroke="var(--color-navy-900)" strokeWidth="0.35" />
            </g>
          );
        })}
      </svg>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {indiaCities.map((c) => {
          const p = indiaMap.pins[c];
          const side = labelSide[c] ?? 'right';
          return (
            <span
              key={c}
              className={`absolute -translate-y-1/2 text-[0.65rem] font-semibold whitespace-nowrap text-navy-900 sm:text-xs ${
                side === 'left' ? '-translate-x-[calc(100%+8px)]' : 'translate-x-2'
              }`}
              style={{ left: `${((p.x + 1) / (W + 2)) * 100}%`, top: `${((p.y + 1) / (H + 2)) * 100}%` }}
            >
              {cities[c]}
            </span>
          );
        })}
      </div>
    </figure>
  );
}
