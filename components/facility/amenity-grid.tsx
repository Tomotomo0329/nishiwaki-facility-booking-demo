import {
  Accessibility,
  AirVent,
  Lightbulb,
  ParkingSquare,
  Presentation,
  ShirtIcon,
  ShowerHead,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import type { AmenityKey } from "@/lib/demo-data";

const icons: Record<AmenityKey, LucideIcon> = {
  parking: ParkingSquare,
  locker: ShirtIcon,
  shower: ShowerHead,
  aircon: AirVent,
  wifi: Wifi,
  accessible: Accessibility,
  lighting: Lightbulb,
  projector: Presentation,
};

export function AmenityGrid({
  amenities,
}: {
  amenities: { key: AmenityKey; label: string; note: string }[];
}) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-sm">
      {amenities.map((a) => {
        const Icon = icons[a.key];
        return (
          <li
            key={a.key}
            className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-surface text-primary">
              <Icon aria-hidden className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-caption-bold text-ink">{a.label}</span>
              <span className="block text-xs text-ink-muted">{a.note}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
