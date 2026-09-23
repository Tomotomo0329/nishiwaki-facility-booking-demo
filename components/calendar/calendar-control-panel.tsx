import { GitCompare } from "lucide-react";

import { CalendarLegend } from "@/components/calendar/calendar-legend";
import { CalendarSelect } from "@/components/calendar/calendar-select";
import { MonthNavigator } from "@/components/calendar/month-navigator";
import type { Facility, Room } from "@/lib/demo-data";

/** 月間カレンダー上部の検索条件パネル一式（月送り・施設/面選択・凡例） */
export function CalendarControlPanel({
  facilities,
  facilitySlug,
  onFacilityChange,
  rooms,
  roomName,
  onRoomChange,
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
}: {
  facilities: Facility[];
  facilitySlug: string;
  onFacilityChange: (slug: string) => void;
  rooms: Room[];
  roomName: string;
  onRoomChange: (name: string) => void;
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}) {
  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] lg:p-space-lg">
      <div className="flex flex-col gap-space-md lg:flex-row lg:items-center lg:justify-between">
        <MonthNavigator
          year={year}
          month={month}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          onToday={onToday}
        />

        <div className="flex flex-col gap-space-sm sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
          <CalendarSelect
            id="facility-select"
            label="施設を選択"
            value={facilitySlug}
            onChange={onFacilityChange}
            options={facilities.map((f) => ({ value: f.slug, label: f.name }))}
            className="sm:w-56"
          />
          <CalendarSelect
            id="room-select"
            label="面・区分を選択"
            value={roomName}
            onChange={onRoomChange}
            options={rooms.map((r) => ({ value: r.name, label: r.name }))}
            className="sm:w-48"
          />
          <a
            href="#cross-matrix-section"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-caption-bold text-on-primary shadow-[var(--shadow-card)] hover:bg-primary-hover transition-colors sm:w-auto"
          >
            <GitCompare aria-hidden className="size-[18px]" />
            施設を横断して比較
          </a>
        </div>
      </div>

      <CalendarLegend />
    </section>
  );
}
