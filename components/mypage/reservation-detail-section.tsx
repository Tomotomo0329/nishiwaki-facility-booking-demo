import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { ReservationPermitCard } from "@/components/mypage/reservation-permit-card";
import { ReservationQrPassCard } from "@/components/mypage/reservation-qr-pass-card";
import { ReservationStatusBadge } from "@/components/mypage/reservation-status-badge";
import type { DemoUser } from "@/lib/auth-context";
import { formatJpDate } from "@/lib/availability";
import type { FacilityDetail } from "@/lib/demo-data";
import { getOrganization } from "@/lib/organization";
import { calculateFee } from "@/lib/reservation-flow";
import type { Reservation } from "@/lib/reservations";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/** 予約詳細画面の本体。上部に要約ヘッダー、下に控えカード＋入館用QRコードを並べる */
export function ReservationDetailSection({
  reservation,
  facility,
  user,
}: {
  reservation: Reservation;
  facility: FacilityDetail;
  user: DemoUser;
}) {
  const organization = reservation.organizationId ? getOrganization(reservation.organizationId) ?? null : null;
  const fee = calculateFee({
    baseFee: facility.feePerSlot,
    discountPercent: organization?.feeExemptionPercent ?? 0,
    equipmentIds: reservation.equipmentIds,
  });

  return (
    <div className="space-y-space-lg">
      <Link
        href="/mypage/reservations"
        className="inline-flex items-center gap-1.5 text-caption-bold text-primary hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" />
        予約一覧へ戻る
      </Link>

      <div className="rounded-xl bg-surface p-space-lg shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-space-md lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <ReservationStatusBadge status={reservation.status} />
              <span className="numeric text-caption text-ink-muted">{reservation.permitNumber}</span>
            </div>
            <h1 className="text-h1-mobile text-primary md:text-h1">{facility.name}</h1>
            <p className="text-body text-ink-muted">{reservation.roomLabel}</p>
            <div className="mt-space-sm flex flex-wrap items-center gap-x-space-md gap-y-1 text-ink">
              <span className="flex items-center gap-1.5">
                <CalendarDays aria-hidden className="size-[18px] text-primary" />
                <span className="text-body-bold">{formatJpDate(reservation.date)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock aria-hidden className="size-[18px] text-primary" />
                <span className="text-body-bold">{reservation.slotLabel}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-space-md rounded-lg bg-canvas p-space-md lg:min-w-[220px] lg:flex-col lg:items-end">
            <span className="text-caption text-ink-muted">利用料金（合計）</span>
            <span className="numeric text-[26px] font-bold text-primary">{yen(fee.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <ReservationPermitCard reservation={reservation} facility={facility} organization={organization} user={user} />
        </div>
        <aside className="lg:sticky lg:top-[100px] lg:col-span-5">
          <ReservationQrPassCard reservation={reservation} facility={facility} />
        </aside>
      </div>
    </div>
  );
}
