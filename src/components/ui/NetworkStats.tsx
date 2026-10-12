import { company } from '@/data/site';

type Props = {
  labels: { forwarders: string; countries: string; cities: string };
  note?: string;
  tone?: 'light' | 'dark';
  className?: string;
  compact?: boolean;
};

/** Company-provided partner-network figures, always shown with their meaning. */
export function NetworkStats({ labels, note, tone = 'dark', className = '', compact }: Props) {
  const stats = [
    { value: company.network.forwarders, label: labels.forwarders },
    { value: company.network.countries, label: labels.countries },
    { value: company.network.cities, label: labels.cities },
  ];
  const light = tone === 'light';
  return (
    <div className={className}>
      <dl className={`grid grid-cols-3 divide-x rtl:divide-x-reverse ${light ? 'divide-white/15' : 'divide-line'}`}>
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse justify-end px-3 first:ps-0 sm:px-6">
            <dt className={`mt-1text-xs leading-snug sm:text-sm ${light ? 'text-navy-100' : 'text-muted'}`}>{s.label}</dt>
            <dd className={`font-display font-bold ${compact ? 'text-2xl min-[400px]:text-3xl sm:text-4xl' : 'text-2xl min-[400px]:text-3xl sm:text-5xl'} ${light ? 'text-white' : 'text-navy-900'}`} dir="ltr">
              {s.value}
              <span className="text-gold-500">+</span>
            </dd>
          </div>
        ))}
      </dl>
      {note && <p className={`mt-5 text-xs leading-relaxed ${light ? 'text-navy-200' : 'text-muted'}`}>{note}</p>}
    </div>
  );
}
