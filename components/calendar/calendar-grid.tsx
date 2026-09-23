import { Building2 } from "lucide-react";

import {
  CalendarDayCell,
  CalendarOverflowCell,
} from "@/components/calendar/calendar-day-cell";
import { buildMonthGrid, demoStateFor, toKey } from "@/lib/availability";

/** 月曜始まりの曜日ヘッダー（土曜=青、日曜=赤） */
const WEEKDAY_HEADERS = ["月", "火", "水", "木", "金", "土", "日・祝"];

export function CalendarGrid({
  facilityName,
  roomLabel,
  year,
  month,
  seedOffset,
  today,
  selectedKey,
  onSelectDay,
}: {
  facilityName: string;
  roomLabel: string;
  year: number;
  month: number;
  seedOffset: number;
  today: Date;
  selectedKey: string | null;
  onSelectDay: (key: string) => void;
}) {
  const cells = buildMonthGrid(
    year,
    month,
    (d) => demoStateFor(d, seedOffset),
    "monday",
  );
  const todayKey = toKey(today);

  return (
    <section className="flex w-full flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]">
      {/* 横スクロール領域の外に置き、どの施設・どの面かの見出しは常に見える位置に固定する */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-primary px-4 py-3 text-on-primary">
        <h2 className="flex items-center gap-2 text-h3 text-on-primary">
          <Building2 aria-hidden className="size-5" />
          {facilityName}
        </h2>
        <span className="rounded-full bg-white/15 px-3 py-1 text-caption-bold">
          {roomLabel}
        </span>
      </div>

      {/* 曜日ヘッダーと日付グリッドだけを横スクロールさせる */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[860px]">
          <div className="grid grid-cols-7 bg-canvas py-3 text-center text-caption-bold">
            {WEEKDAY_HEADERS.map((label, i) => (
              <div key={label} className={i === 6 ? "text-danger" : i === 5 ? "text-primary" : "text-ink"}>
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-line">
            {cells.map((cell) =>
              !cell.inMonth ? (
                <CalendarOverflowCell key={cell.key} cell={cell} year={year} month={month} />
              ) : (
                <CalendarDayCell
                  key={cell.key}
                  cell={cell}
                  seedOffset={seedOffset}
                  isToday={cell.key === todayKey}
                  isSelected={cell.key === selectedKey}
                  onSelect={onSelectDay}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
