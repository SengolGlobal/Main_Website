import type { LucideIcon } from 'lucide-react';
import { Boxes, FileCheck2, Network, PackageCheck, Plane, Ship, Truck, Warehouse } from 'lucide-react';
import { photos } from './site';

export const serviceSlugs = [
  'air-freight',
  'sea-freight',
  'door-to-door',
  'customs-clearance',
  'warehousing',
  'specialist-cargo',
  'integrated-logistics',
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

/** Freight mode pre-selected on the quote form when arriving from a service page. */
export type FreightMode = 'air' | 'sea' | 'road' | 'rail' | 'multimodal' | 'unsure';

type ServiceConfig = {
  icon: LucideIcon;
  image: string;
  related: ServiceSlug[];
  mode?: FreightMode;
};

export const serviceConfig: Record<ServiceSlug, ServiceConfig> = {
  'air-freight': { icon: Plane, image: photos.air, mode: 'air', related: ['customs-clearance', 'door-to-door', 'specialist-cargo'] },
  'sea-freight': { icon: Ship, image: photos.ship, mode: 'sea', related: ['customs-clearance', 'door-to-door', 'warehousing'] },
  'door-to-door': { icon: Truck, image: photos.road, mode: 'road', related: ['sea-freight', 'air-freight', 'warehousing'] },
  'customs-clearance': { icon: FileCheck2, image: photos.terminal, related: ['sea-freight', 'air-freight', 'specialist-cargo'] },
  warehousing: { icon: Warehouse, image: photos.warehouse, related: ['door-to-door', 'integrated-logistics', 'customs-clearance'] },
  'specialist-cargo': { icon: PackageCheck, image: photos.forklift, related: ['customs-clearance', 'air-freight', 'sea-freight'] },
  'integrated-logistics': { icon: Network, image: photos.aerialShip, mode: 'multimodal', related: ['sea-freight', 'air-freight', 'warehousing'] },
};

export const ecosystemIcon = Boxes;

export function isServiceSlug(value: string): value is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(value);
}
