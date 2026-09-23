import Image from "next/image";
import { CalendarDays, Clock } from "lucide-react";

import { formatJpDate } from "@/lib/availability";
import type { FacilityDetail } from "@/lib/demo-data";
import type { SlotId } from "@/lib/availability";
import { SLOT_LABELS } from "@/lib/reservation-flow";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/** 申請フォーム・確認画面の両方で使う、施設・日時のサマリーカード */
export function FacilitySlotSummary({
  facility,
  date,
  slotId,
}: {
  facility: FacilityDetail;
  date: Date;
  slotId: SlotId;
}) {
  return (
    <div className="flex flex-col gap-space-md rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:flex-row sm:p-space-lg">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-canvas sm:h-auto sm:w-44">
        <Image
          src={facility.image}
          alt={facility.imageAlt}
          fill
          sizes="176px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-caption text-primary">{facility.address}</p>
        <h2 className="text-h2 text-ink">{facility.primaryRoomLabel}</h2>
        <div className="mt-space-sm grid grid-cols-1 gap-x-space-md gap-y-1 rounded-lg bg-canvas p-space-sm text-caption text-ink sm:grid-cols-2">
          <p className="flex items-center gap-2">
            <CalendarDays aria-hidden className="size-[18px] text-primary" />
            日時: <strong className="numeric">{formatJpDate(date)}</strong>
          </p>
          <p className="flex items-center gap-2">
            <Clock aria-hidden className="size-[18px] text-primary" />
            区分: <strong>{SLOT_LABELS[slotId]}</strong>
          </p>
        </div>
        <p className="mt-space-sm text-caption text-ink-muted">
          基本室料: <span className="numeric font-bold text-primary">{yen(facility.feePerSlot)}</span>{" "}
          / 区分〜
        </p>
      </div>
    </div>
  );
}
