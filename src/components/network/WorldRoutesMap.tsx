'use client';

import { useId, useState } from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { regions, type RegionId } from '@/data/network';
import { MapLegend, RoutesCanvas, type Direction } from './RoutesCanvas';

/** Interactive network map: direction filter, clickable regions and a market panel. */
export function WorldRoutesMap() {
  const t = useTranslations('network');
  const { network } = useMessages();
  const [direction, setDirection] = useState<Direction>('both');
  const [active, setActive] = useState<RegionId | null>(null);
  const [hovered, setHovered] = useState<RegionId | null>(null);
  const panelId = useId();
  const selectedRegion = regions.find((r) => r.id === active);
  const chip =
    'min-h-11 rounded-full border border-white/15 px-4 text-sm text-navy-100 transition-colors hover:border-white/40 aria-pressed:border-gold-500 aria-pressed:bg-gold-500 aria-pressed:text-navy-950';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">{t('map.directionLabel')}</legend>
          {(['both', 'export', 'import'] as const).map((d) => (
            <label
              key={d}
              className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-navy-100 transition-colors has-[:checked]:border-gold-500 has-[:checked]:bg-gold-500 has-[:checked]:text-navy-950 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-400 hover:border-white/40"
            >
              <input type="radio" name={`${panelId}-dir`} value={d} checked={direction === d} onChange={() => setDirection(d)} className="sr-only" />
              {d === 'both' ? t('map.showBoth') : d === 'export' ? t('map.showExports') : t('map.showImports')}
            </label>
          ))}
        </fieldset>
        <MapLegend labels={network.map} />
      </div>

      <RoutesCanvas
        idPrefix="network-map"
        ariaLabel={t('map.ariaLabel')}
        indiaLabel={t('map.india')}
        regionNames={network.regions}
        focus={active ?? hovered}
        direction={direction}
        interaction={{ active, controls: panelId, onSelect: (id) => setActive(active === id ? null : id), onHover: setHovered }}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div>
          <p className="text-sm font-semibold text-white">{t('map.regionLabel')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" aria-pressed={active === null} onClick={() => setActive(null)} className={chip}>
              {t('map.allRegions')}
            </button>
            {regions.map((r) => (
              <button key={r.id} type="button" aria-pressed={active === r.id} aria-controls={panelId} onClick={() => setActive(r.id)} className={chip}>
                {t(`regions.${r.id}`)}
              </button>
            ))}
          </div>
        </div>
        <div id={panelId} aria-live="polite" className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          {selectedRegion ? (
            <>
              <p className="text-sm font-semibold text-gold-400">{t('map.marketsIn', { region: t(`regions.${selectedRegion.id}`) })}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {selectedRegion.markets.map((m) => (
                  <li key={m} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white">
                    <MapPin className="size-3.5 text-gold-400" aria-hidden />
                    {t(`countries.${m}`)}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <dl className="grid gap-4 sm:grid-cols-2">
              {regions.map((r) => (
                <div key={r.id}>
                  <dt className="text-sm font-semibold text-gold-400">{t(`regions.${r.id}`)}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-navy-100">{r.markets.map((m) => t(`countries.${m}`)).join(' · ')}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-navy-200">{t('map.disclaimer')}</p>
    </div>
  );
}
