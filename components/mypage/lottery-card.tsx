import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Search } from "lucide-react";

import { LotteryStatusBadge } from "@/components/mypage/lottery-status-badge";
import { formatJpDate } from "@/lib/availability";
import { getLotteryFacility, type LotteryApplication } from "@/lib/lottery";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/** マイページの抽選申込一覧に並ぶ1件分のカード */
export function LotteryCard({
  application,
  onWithdraw,
}: {
  application: LotteryApplication;
  onWithdraw?: (id: string) => void;
}) {
  const facility = getLotteryFacility(application.facilitySlug);
  if (!facility) return null;

  return (
    <article className="flex flex-col gap-space-md rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:flex-row">
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-canvas sm:h-auto sm:w-[140px]">
        <Image
          src={facility.image}
          alt={facility.imageAlt}
          fill
          sizes="140px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-space-sm">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link
                href={`/facilities/${facility.slug}`}
                className="text-h3 text-ink hover:text-primary hover:underline"
              >
                {facility.name}
              </Link>
              <p className="mt-0.5 flex items-center gap-1 text-caption text-ink-muted">
                <MapPin aria-hidden className="size-4 shrink-0" />
                {application.roomLabel}
              </p>
            </div>
            <LotteryStatusBadge status={application.status} />
          </div>

          <div className="mt-space-sm flex flex-wrap items-center gap-x-space-md gap-y-1 text-caption text-ink-muted">
            <span className="flex items-center gap-1.5">
              <CalendarDays aria-hidden className="size-4" />
              利用日: {formatJpDate(application.targetDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-4" />
              {application.slotLabel}
            </span>
            <span className="text-body-bold text-ink numeric">
              {yen(application.fee)}
            </span>
          </div>

          <p className="mt-1 text-caption text-ink-muted numeric">
            抽選発表日: {formatJpDate(application.drawDate)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Link
            href={`/facilities/${facility.slug}`}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-canvas px-4 text-caption-bold text-ink transition-colors hover:bg-line/60"
          >
            施設の詳細
          </Link>

          {application.status === "pending" && onWithdraw ? (
            <button
              type="button"
              onClick={() => onWithdraw(application.id)}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg px-4 text-caption-bold text-danger transition-colors hover:bg-danger-surface"
            >
              申込を取り消す
            </button>
          ) : null}

          {application.status === "won" ? (
            <Link
              href={`/calendar?facility=${facility.slug}`}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-caption-bold text-on-primary transition-colors hover:bg-primary-hover"
            >
              予約手続きへ進む
            </Link>
          ) : null}

          {application.status === "lost" ? (
            <Link
              href={`/calendar?facility=${facility.slug}`}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg px-4 text-caption-bold text-primary transition-colors hover:bg-primary-surface"
            >
              <Search aria-hidden className="size-4" />
              他の空き状況を探す
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
