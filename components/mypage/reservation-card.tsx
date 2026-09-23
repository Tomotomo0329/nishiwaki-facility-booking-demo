import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, QrCode, RotateCcw } from "lucide-react";

import { ReservationStatusBadge } from "@/components/mypage/reservation-status-badge";
import { formatJpDate } from "@/lib/availability";
import { getReservationFacility, type Reservation } from "@/lib/reservations";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/** マイページの予約一覧に並ぶ1件分のカード */
export function ReservationCard({
  reservation,
  onCancel,
}: {
  reservation: Reservation;
  onCancel?: (id: string) => void;
}) {
  const facility = getReservationFacility(reservation.facilitySlug);
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
                {reservation.roomLabel}
              </p>
            </div>
            <ReservationStatusBadge status={reservation.status} />
          </div>

          <div className="mt-space-sm flex flex-wrap items-center gap-x-space-md gap-y-1 text-caption text-ink-muted">
            <span className="flex items-center gap-1.5">
              <CalendarDays aria-hidden className="size-4" />
              {formatJpDate(reservation.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-4" />
              {reservation.slotLabel}
            </span>
            <span className="text-body-bold text-ink numeric">
              {yen(reservation.fee)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Link
            href={`/mypage/reservations/${reservation.id}`}
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-caption-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover"
          >
            <QrCode aria-hidden className="size-4" />
            {reservation.status === "confirmed" ? "詳細・入館用QRコード" : "予約の詳細を見る"}
          </Link>

          <Link
            href={`/facilities/${facility.slug}`}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-canvas px-4 text-caption-bold text-ink transition-colors hover:bg-line/60"
          >
            施設の詳細
          </Link>

          {reservation.status === "confirmed" && onCancel ? (
            <button
              type="button"
              onClick={() => onCancel(reservation.id)}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg px-4 text-caption-bold text-danger transition-colors hover:bg-danger-surface"
            >
              予約をキャンセル
            </button>
          ) : null}

          {reservation.status !== "confirmed" ? (
            <Link
              href={`/calendar?facility=${facility.slug}`}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg px-4 text-caption-bold text-primary transition-colors hover:bg-primary-surface"
            >
              <RotateCcw aria-hidden className="size-4" />
              もう一度予約する
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
