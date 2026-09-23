import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";

import type { Facility } from "@/lib/demo-data";

/** トップページと施設一覧で共用する施設カード */
export function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <Link
      href={`/facilities/${facility.slug}`}
      className="group h-full flex flex-col rounded-xl bg-surface border border-line overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-raised)] transition-shadow"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={facility.image}
          alt={facility.imageAlt}
          fill
          sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-primary/90 text-on-primary text-xs font-bold backdrop-blur-sm">
          {facility.area}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between p-space-md">
        <div>
          <h3 className="text-h3 text-ink group-hover:text-primary transition-colors">
            {facility.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-caption text-ink-muted">
            <Users aria-hidden className="size-4" />
            {facility.capacity}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-space-sm">
            {facility.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded bg-canvas border border-line text-xs text-ink"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-space-md pt-space-sm border-t border-line flex items-center justify-between">
          <span className="text-body-bold text-ink">
            <span className="numeric">
              ¥{facility.feePerSlot.toLocaleString("ja-JP")}
            </span>
            <span className="ml-1 text-xs font-normal text-ink-muted">
              / 区分
            </span>
          </span>
          {facility.hasOpening ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ok-surface text-ok border border-ok-line text-xs font-bold">
              <span aria-hidden className="size-2 rounded-full bg-ok" />
              本日空きあり
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
