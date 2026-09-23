import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react";

import { slotAppearance } from "@/components/ui/slot-chip";
import type { Facility } from "@/lib/demo-data";

/** マイページのお気に入り施設一覧に並ぶカード（施設一覧のカードにお気に入り解除ボタンを足した派生形） */
export function FavoriteFacilityCard({
  facility,
  onRemove,
}: {
  facility: Facility;
  onRemove: (slug: string) => void;
}) {
  const badge = slotAppearance[facility.availabilityStatus];

  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-raised)] transition-shadow sm:flex-row">
      <div className="relative h-48 shrink-0 bg-canvas sm:h-auto sm:w-[220px] md:w-[240px]">
        <Image
          src={facility.image}
          alt={facility.imageAlt}
          fill
          sizes="(min-width: 768px) 240px, 100vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-caption-bold shadow-[var(--shadow-card)] ${badge.chip} bg-surface/95`}
          >
            <span aria-hidden>{badge.symbol}</span>
            <span>{badge.label}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(facility.slug)}
          aria-label={`${facility.name}をお気に入りから解除`}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-surface/95 text-danger shadow-[var(--shadow-card)] transition-colors hover:bg-danger hover:text-white"
        >
          <Heart aria-hidden className="size-[18px] fill-current" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-space-md">
        <div>
          <h3 className="text-h3 leading-tight text-ink">
            <Link
              href={`/facilities/${facility.slug}`}
              className="hover:text-primary hover:underline transition-colors"
            >
              {facility.name}
            </Link>
          </h3>
          <p className="mb-space-sm mt-1 flex items-center gap-1 text-caption text-ink-muted">
            <MapPin aria-hidden className="size-4 shrink-0" />
            <span>
              {facility.area} ・ {facility.capacity.split("・")[1]?.trim() ?? facility.capacity}
            </span>
          </p>
          <div className="mb-space-md flex flex-wrap gap-1.5">
            {facility.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-canvas px-2 py-0.5 text-caption text-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 pt-space-xs">
          <div>
            <span className="block text-[12px] text-ink-muted">
              施設使用料（1区分あたり）
            </span>
            <span className="text-[18px] font-bold text-primary numeric">
              ¥{facility.feePerSlot.toLocaleString("ja-JP")}
              <span className="ml-1 text-caption font-normal text-ink">
                / 区分〜
              </span>
            </span>
          </div>
          <Link
            href={`/calendar?facility=${facility.slug}`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 text-caption-bold text-on-primary shadow-[var(--shadow-card)] hover:bg-primary-hover transition-colors"
          >
            空き状況をみる
          </Link>
        </div>
      </div>
    </article>
  );
}
