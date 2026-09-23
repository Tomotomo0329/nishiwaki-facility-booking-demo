import { Ban, Wrench } from "lucide-react";

import { slotAppearance } from "@/components/ui/slot-chip";
import {
  HOLIDAY_NAMES,
  SLOTS,
  demoSlotStateFor,
  getClosureReason,
  offeredSlots,
  type CalendarCell,
} from "@/lib/availability";

/** 「翌月／前月にまたがる日」の薄いプレースホルダーセル */
export function CalendarOverflowCell({
  cell,
  year,
  month,
}: {
  cell: CalendarCell;
  year: number;
  month: number;
}) {
  const isPrev = cell.date < new Date(year, month - 1, 1);
  return (
    <div className="flex min-h-[124px] flex-col justify-between bg-canvas p-2 opacity-60">
      <span className="text-caption text-ink-muted numeric">
        {cell.date.getMonth() + 1}/{cell.day}
      </span>
      <p className="py-2 text-center text-[11px] text-ink-subtle">
        {isPrev ? "前月の日付" : "翌月の日付"}
      </p>
    </div>
  );
}

/** 休館・点検日セル */
function ClosedCell({ cell }: { cell: CalendarCell }) {
  const reason = getClosureReason(cell.date);
  const isMaintenance = reason === "maintenance";

  return (
    <div
      className={`flex min-h-[124px] flex-col justify-between p-2 ${
        isMaintenance
          ? "bg-[repeating-linear-gradient(45deg,var(--color-line)_0,var(--color-line)_1px,transparent_1px,transparent_8px)] bg-canvas"
          : "bg-canvas"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-caption-bold text-ink-subtle numeric">{cell.day}</span>
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
            isMaintenance
              ? "bg-danger-surface text-danger"
              : "bg-line/60 text-ink-muted"
          }`}
        >
          {isMaintenance ? "設備点検" : "定期休館"}
        </span>
      </div>
      <div className="my-auto flex flex-col items-center justify-center py-2">
        {isMaintenance ? (
          <Wrench aria-hidden className="size-6 text-danger" />
        ) : (
          <Ban aria-hidden className="size-6 text-ink-subtle" />
        )}
        <span className="mt-1 text-xs font-bold text-ink-muted">
          {isMaintenance ? "設備保守点検日" : "施設休館日"}
        </span>
        {isMaintenance ? (
          <span className="text-[10px] text-ink-subtle">全館立入不可</span>
        ) : null}
      </div>
    </div>
  );
}

/** 通常セル（午前・午後・夜間の空き状況を表示し、クリックで詳細を開く） */
export function CalendarDayCell({
  cell,
  seedOffset,
  isToday,
  isSelected,
  onSelect,
}: {
  cell: CalendarCell;
  seedOffset: number;
  isToday: boolean;
  isSelected: boolean;
  onSelect: (key: string) => void;
}) {
  if (cell.state === "closed") {
    return <ClosedCell cell={cell} />;
  }

  const offered = offeredSlots(cell.date);
  const holidayName = HOLIDAY_NAMES[cell.key];
  const isSunday = cell.dayType === "sunday";
  const isHoliday = cell.dayType === "holiday";
  const isSaturday = cell.dayType === "saturday";

  return (
    <button
      type="button"
      onClick={() => onSelect(cell.key)}
      aria-pressed={isSelected}
      className={[
        "flex min-h-[124px] flex-col justify-between p-2 text-left transition-colors hover:bg-canvas",
        isSunday || isHoliday ? "bg-danger-surface/40" : isSaturday ? "bg-primary-surface/60" : "bg-surface",
        isSelected ? "ring-2 ring-primary ring-inset bg-primary-surface" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isToday ? (
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary numeric">
              {cell.day}
            </span>
          ) : (
            <span
              className={`text-caption-bold numeric ${
                isSunday || isHoliday ? "text-danger" : isSaturday ? "text-primary" : "text-ink"
              }`}
            >
              {cell.day}
            </span>
          )}
          {isHoliday ? <span className="text-[10px] text-danger">祝日</span> : null}
        </div>
        {isToday ? (
          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-on-primary">
            本日
          </span>
        ) : holidayName ? (
          <span className="rounded bg-danger-surface px-1 text-[9px] font-bold text-danger">
            {holidayName}
          </span>
        ) : isSaturday ? (
          <span className="rounded bg-primary-surface px-1.5 text-[10px] text-primary">土曜</span>
        ) : isSunday ? (
          <span className="rounded bg-danger-surface px-1.5 text-[10px] text-danger">日曜</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 text-[11px]">
        {SLOTS.map((slot) => {
          if (!offered.includes(slot.id)) {
            return (
              <div
                key={slot.id}
                className="flex items-center justify-center rounded bg-canvas py-1 text-[10px] text-ink-subtle"
              >
                {slot.label}枠なし
              </div>
            );
          }
          const state = demoSlotStateFor(cell.date, slot.id, seedOffset);
          const a = slotAppearance[state];
          return (
            <div
              key={slot.id}
              className={`flex items-center justify-between rounded px-1.5 py-0.5 ${a.chip}`}
            >
              <span className="text-[10px] text-ink-muted">{slot.label}</span>
              <span className="font-bold">
                {a.symbol} {a.label}
              </span>
            </div>
          );
        })}
      </div>
    </button>
  );
}
