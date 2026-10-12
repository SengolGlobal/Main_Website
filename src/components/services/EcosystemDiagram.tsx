import { Plane, Ship, TrainFront, Truck, FileCheck2, Warehouse } from 'lucide-react';

type Props = {
  center: string;
  nodes: { air: string; sea: string; rail: string; road: string; customs: string; warehousing: string };
};

const order = [
  { key: 'air', icon: Plane },
  { key: 'sea', icon: Ship },
  { key: 'rail', icon: TrainFront },
  { key: 'warehousing', icon: Warehouse },
  { key: 'road', icon: Truck },
  { key: 'customs', icon: FileCheck2 },
] as const;

/** "One connected logistics ecosystem" hub diagram from the company profile. */
export function EcosystemDiagram({ center, nodes }: Props) {
  const radius = 41; // % of container
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem]" role="img" aria-label={`${center}: ${order.map((o) => nodes[o.key]).join(', ')}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--color-navy-200)" strokeWidth="0.35" strokeDasharray="1.2 1.6" />
        <circle cx="50" cy="50" r="24" fill="none" stroke="var(--color-gold-500)" strokeWidth="0.35" opacity="0.6" />
        {order.map((_, i) => {
          const a = (i / order.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * 18}
              y1={50 + Math.sin(a) * 18}
              x2={50 + Math.cos(a) * (radius - 7)}
              y2={50 + Math.sin(a) * (radius - 7)}
              stroke="var(--color-navy-200)"
              strokeWidth="0.35"
            />
          );
        })}
      </svg>
      <div className="absolute top-1/2 left-1/2 grid size-[38%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-navy-900 p-4 text-center shadow-lift ring-8 ring-navy-50">
        <span className="font-display text-sm leading-tight font-bold text-white sm:text-base">{center}</span>
      </div>
      {order.map(({ key, icon: Icon }, i) => {
        const a = (i / order.length) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + Math.cos(a) * radius;
        const y = 50 + Math.sin(a) * radius;
        return (
          <div
            key={key}
            className="absolute flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center sm:w-32"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="grid size-14 place-items-center rounded-full border border-line bg-white text-navy-700 shadow-card sm:size-16">
              <Icon className="size-6 sm:size-7" aria-hidden />
            </span>
            <span className="rounded-full bg-white/90 px-2 text-xs font-semibold text-navy-900 sm:text-sm">{nodes[key]}</span>
          </div>
        );
      })}
    </div>
  );
}
