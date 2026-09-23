import Link from "next/link";
import { ArrowRight, Check, Info, X } from "lucide-react";

import { slotAppearance } from "@/components/ui/slot-chip";
import {
  SLOTS,
  demoSlotStateFor,
  formatJpDate,
  offeredSlots,
  toKey,
  type SlotId,
} from "@/lib/availability";
import { useAuth } from "@/lib/auth-context";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/** 選択した日の時間帯別空き状況と予約 CTA を表示するパネル */
export function DayDetailPanel({
  date,
  facilitySlug,
  facilityName,
  roomLabel,
  fee,
  seedOffset,
  chosenSlot,
  onChooseSlot,
  onClose,
}: {
  date: Date;
  facilitySlug: string;
  facilityName: string;
  roomLabel: string;
  fee: number;
  seedOffset: number;
  chosenSlot: SlotId;
  onChooseSlot: (slot: SlotId) => void;
  onClose: () => void;
}) {
  const offered = offeredSlots(date);
  const { isLoggedIn } = useAuth();
  const reserveTarget = `/reserve/${facilitySlug}?date=${toKey(date)}&slot=${chosenSlot}`;
  const reserveHref = isLoggedIn
    ? reserveTarget
    : `/login?next=${encodeURIComponent(reserveTarget)}`;

  return (
    <section className="flex flex-col gap-3 rounded-xl border-2 border-primary bg-surface p-space-md shadow-[var(--shadow-raised)]">
      <div className="flex items-start justify-between gap-2 border-b border-line pb-2">
        <div>
          <span className="mb-1 inline-block rounded bg-primary-surface px-2 py-0.5 text-[11px] font-bold text-primary">
            選択中
          </span>
          <h3 className="text-h3 leading-snug text-ink">
            {formatJpDate(date)} 空き枠
          </h3>
          <p className="text-caption text-ink-muted">
            {facilityName}（{roomLabel}）
          </p>
        </div>
        <button
          type="button"
          aria-label="詳細カードを閉じる"
          onClick={onClose}
          className="rounded p-1 text-ink-subtle hover:text-ink transition-colors"
        >
          <X aria-hidden className="size-[18px]" />
        </button>
      </div>

      <div className="space-y-2">
        {SLOTS.map((slot) => {
          const isOffered = offered.includes(slot.id);
          const state = isOffered ? demoSlotStateFor(date, slot.id, seedOffset) : "closed";
          const a = slotAppearance[state];
          const disabled = !isOffered || state === "booked";
          const isChosen = slot.id === chosenSlot && !disabled;

          return (
            <button
              key={slot.id}
              type="button"
              disabled={disabled}
              onClick={() => onChooseSlot(slot.id)}
              aria-pressed={isChosen}
              className={`flex w-full items-center justify-between rounded-lg border p-2 text-left transition-colors ${
                isChosen
                  ? "border-primary bg-primary-surface"
                  : disabled
                    ? "cursor-not-allowed border-transparent bg-canvas"
                    : "border-transparent bg-canvas hover:bg-line/40"
              }`}
            >
              <div>
                <span
                  className={`block font-bold ${
                    disabled ? "text-ink-subtle line-through" : "text-ink"
                  }`}
                >
                  {slot.label} {slot.time}
                </span>
                {isOffered ? (
                  <span className="text-xs text-ink-muted">
                    通常基本料金: <span className="numeric">{yen(fee)}</span>
                  </span>
                ) : (
                  <span className="text-xs text-ink-subtle">この日は提供対象外</span>
                )}
              </div>
              <span className="flex items-center gap-1.5">
                {isChosen ? (
                  <span className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs font-bold text-on-primary">
                    <Check aria-hidden className="size-3.5" />
                    選択中
                  </span>
                ) : (
                  <span className={`rounded px-2.5 py-1 text-xs font-bold ${a.chip}`}>
                    {a.symbol} {a.label}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="flex items-center gap-1.5 rounded bg-canvas p-2 text-[11px] text-ink-muted">
        <Info aria-hidden className="size-[14px] shrink-0 text-primary" />
        市外居住者の場合は利用料が上記表記の5割増となります。
      </p>

      <Link
        href={reserveHref}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary text-caption-bold text-on-primary shadow-[var(--shadow-card)] hover:bg-primary-hover transition-colors"
      >
        {isLoggedIn ? "この日を予約する" : "ログインしてこの日を予約する"}
        <ArrowRight aria-hidden className="size-[18px]" />
      </Link>
    </section>
  );
}
