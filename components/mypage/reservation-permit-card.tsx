import Image from "next/image";
import { CalendarDays, ClipboardList, Phone, ShieldCheck, User, Users } from "lucide-react";

import { formatJpDate } from "@/lib/availability";
import type { DemoUser } from "@/lib/auth-context";
import type { FacilityDetail } from "@/lib/demo-data";
import type { Organization } from "@/lib/organization";
import { EQUIPMENT_OPTIONS, SLOT_LABELS, calculateFee } from "@/lib/reservation-flow";
import type { Reservation } from "@/lib/reservations";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

const PAYMENT_LABELS = { counter: "当日窓口決済", online: "オンライン決済済み" } as const;

/** 予約詳細の左カラム: 利用内容の控え（Stitch「入館用QRコード・利用許可書控え」参考） */
export function ReservationPermitCard({
  reservation,
  facility,
  organization,
  user,
}: {
  reservation: Reservation;
  facility: FacilityDetail;
  organization: Organization | null;
  user: DemoUser;
}) {
  const fee = calculateFee({
    baseFee: facility.feePerSlot,
    discountPercent: organization?.feeExemptionPercent ?? 0,
    equipmentIds: reservation.equipmentIds,
  });
  const equipmentSelected = EQUIPMENT_OPTIONS.filter((e) => reservation.equipmentIds.includes(e.id));

  return (
    <section className="relative overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]">
      <div aria-hidden className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-hover to-primary" />

      <div className="p-space-lg sm:p-space-xl">
        <div className="mb-space-md flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded bg-primary-surface px-2.5 py-1 text-caption-bold text-primary">
            <ShieldCheck aria-hidden className="size-4" />
            利用内容の控え
          </span>
          <span className="numeric text-caption text-ink-muted">整理番号: {reservation.permitNumber}</span>
        </div>

        <div className="relative mb-space-lg h-44 overflow-hidden rounded-xl bg-canvas sm:h-52">
          <Image src={facility.image} alt={facility.imageAlt} fill sizes="600px" className="object-cover" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/90 via-primary/20 to-transparent p-space-md text-white">
            <span className="text-xs font-bold uppercase tracking-wide text-white/80">施設利用区分</span>
            <span className="text-h3">{facility.name}</span>
            <span className="text-caption text-white/85">{reservation.roomLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-md rounded-xl bg-canvas p-space-md sm:grid-cols-2">
          <div>
            <span className="text-xs text-ink-muted">使用日時（確定枠）</span>
            <p className="mt-0.5 flex items-center gap-1.5 text-body-bold text-ink">
              <CalendarDays aria-hidden className="size-4 text-primary" />
              {formatJpDate(reservation.date)}
            </p>
            <p className="pl-[22px] text-caption-bold text-primary">
              {SLOT_LABELS[reservation.slotId]}
            </p>
          </div>

          <div>
            <span className="text-xs text-ink-muted">申請団体・使用者</span>
            {organization ? (
              <p className="mt-0.5 flex items-center gap-1.5 text-body-bold text-ink">
                {organization.name}
                <span className="rounded bg-primary-surface px-1.5 py-0.5 text-[11px] font-bold text-primary">
                  {organization.feeExemptionPercent}%減免
                </span>
              </p>
            ) : (
              <p className="mt-0.5 text-body-bold text-ink">個人利用</p>
            )}
            <p className="flex items-center gap-1.5 text-caption text-ink-muted">
              <User aria-hidden className="size-3.5" />
              責任者: {user.name}
            </p>
          </div>

          <div>
            <span className="text-xs text-ink-muted">利用目的・参加人数</span>
            <p className="mt-0.5 text-body-bold text-ink">{reservation.purpose}</p>
            <p className="flex items-center gap-1.5 text-caption text-ink-muted">
              <Users aria-hidden className="size-3.5" />
              {reservation.participants}名
            </p>
          </div>

          <div>
            <span className="text-xs text-ink-muted">納付状況・利用料金</span>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="rounded bg-warn-surface px-2 py-0.5 text-[12px] font-bold text-warn">
                {PAYMENT_LABELS[reservation.paymentMethod]}
              </span>
              <span className="numeric text-body-bold text-primary">{yen(fee.total)}</span>
            </div>
            {fee.discountAmount > 0 ? (
              <p className="text-xs text-ok">団体減免 -{yen(fee.discountAmount)} 適用済</p>
            ) : null}
          </div>
        </div>

        {equipmentSelected.length > 0 ? (
          <div className="mt-space-md rounded-xl bg-canvas p-space-md">
            <span className="mb-1 block text-xs text-ink-muted">承認済み付帯設備・備品</span>
            <div className="flex flex-wrap gap-space-xs">
              {equipmentSelected.map((e) => (
                <span
                  key={e.id}
                  className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-caption text-primary shadow-[var(--shadow-card)]"
                >
                  {e.label}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-space-md rounded-xl bg-canvas p-space-md">
          <p className="mb-1 flex items-center gap-1.5 text-caption-bold text-ink">
            <ClipboardList aria-hidden className="size-[18px] text-primary" />
            利用上のご案内
          </p>
          <ul className="space-y-1 pl-1 text-caption text-ink-muted">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              室内用シューズをご持参ください。外靴での入場はご遠慮いただいています。
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              終了15分前までに清掃・原状復帰を行い、利用日誌を窓口へご返却ください。
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">3.</span>
              発生したゴミはすべてお持ち帰りください。
            </li>
          </ul>
        </div>

        <div className="mt-space-md flex flex-col items-start justify-between gap-1 border-t border-line pt-space-sm text-xs text-ink-muted sm:flex-row sm:items-center">
          <span className="flex items-center gap-1.5">
            <Phone aria-hidden className="size-3.5" />
            {facility.contact.office} {facility.contact.tel}
          </span>
          <span>西脇市公共施設予約システム 整理番号: {reservation.permitNumber}</span>
        </div>
      </div>
    </section>
  );
}
