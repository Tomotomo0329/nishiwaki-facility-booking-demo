import { Info } from "lucide-react";

import { slotAppearance } from "@/components/ui/slot-chip";
import type { SlotState } from "@/lib/availability";

const LEGEND_STATES: SlotState[] = ["open", "limited", "booked"];

const LEGEND_NOTES: Record<SlotState, string> = {
  open: "(予約可)",
  limited: "(残り1〜2枠)",
  booked: "(受付不可)",
  closed: "",
};

/** 予約状況の凡例と、日付クリックの案内 */
export function CalendarLegend() {
  return (
    <div className="flex flex-col gap-space-sm border-t border-line pt-space-xs sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-space-md gap-y-1">
        <span className="text-caption-bold text-ink-muted">予約状況凡例:</span>
        {LEGEND_STATES.map((state) => {
          const a = slotAppearance[state];
          return (
            <span key={state} className="inline-flex items-center gap-1.5">
              <span aria-hidden className={`font-bold ${a.chip.split(" ")[1]}`}>
                {a.symbol}
              </span>
              <span className={`text-caption-bold ${a.chip.split(" ")[1]}`}>
                {a.label}
              </span>
              <span className="text-xs text-ink-muted">{LEGEND_NOTES[state]}</span>
            </span>
          );
        })}
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="flex size-3.5 items-center justify-center rounded bg-canvas text-[10px] text-ink-muted"
          >
            ／
          </span>
          <span className="text-caption-bold text-ink-muted">休館・点検日</span>
        </span>
      </div>
      <p className="flex items-center gap-2 text-xs text-ink-muted">
        <Info aria-hidden className="size-4 text-primary" />
        日付枠をクリックすると時間帯詳細と予約申込みが可能です
      </p>
    </div>
  );
}
