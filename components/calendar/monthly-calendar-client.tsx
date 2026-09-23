"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { CalendarControlPanel } from "@/components/calendar/calendar-control-panel";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CrossFacilityMatrix } from "@/components/calendar/cross-facility-matrix";
import { DayDetailPanel } from "@/components/calendar/day-detail-panel";
import { DEMO_TODAY, firstPickableSlot, seedFromSlug, toKey, type SlotId } from "@/lib/availability";
import type { FacilityDetail } from "@/lib/demo-data";

/** 月間空き状況カレンダー画面。施設・面・月の選択と日別詳細をまとめて管理する */
export function MonthlyCalendarClient({
  facilities,
  initialSlug,
}: {
  facilities: FacilityDetail[];
  initialSlug: string;
}) {
  const router = useRouter();

  const [facilitySlug, setFacilitySlug] = useState(initialSlug);
  const facility =
    facilities.find((f) => f.slug === facilitySlug) ?? facilities[0];

  const [roomName, setRoomName] = useState(
    facility.rooms.find((r) => r.primary)?.name ?? facility.rooms[0].name,
  );
  const room =
    facility.rooms.find((r) => r.name === roomName) ?? facility.rooms[0];

  const [year, setYear] = useState(DEMO_TODAY.getFullYear());
  const [month, setMonth] = useState(DEMO_TODAY.getMonth() + 1);
  const [selectedKey, setSelectedKey] = useState<string | null>(
    toKey(DEMO_TODAY),
  );

  const seedOffset = useMemo(() => seedFromSlug(facility.slug), [facility.slug]);

  function handleFacilityChange(slug: string) {
    const next = facilities.find((f) => f.slug === slug);
    if (!next) return;
    setFacilitySlug(slug);
    setRoomName(next.rooms.find((r) => r.primary)?.name ?? next.rooms[0].name);
    setSelectedKey(null);
    router.replace(`/calendar?facility=${slug}`, { scroll: false });
  }

  function handlePrevMonth() {
    setSelectedKey(null);
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  }

  function handleNextMonth() {
    setSelectedKey(null);
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  }

  function handleToday() {
    setYear(DEMO_TODAY.getFullYear());
    setMonth(DEMO_TODAY.getMonth() + 1);
    setSelectedKey(toKey(DEMO_TODAY));
  }

  const selectedDate = useMemo(() => {
    if (!selectedKey) return null;
    const [y, m, d] = selectedKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedKey]);

  // 選択中の日付が変わったら、その日の時間枠選択を最初に選べる枠へ仮選択し直す
  // （レンダー中に前回の selectedKey と比較して調整する。useEffect 内で setState すると
  //   再レンダーが連鎖するため使わない）
  const [chosenSlot, setChosenSlot] = useState<SlotId>(() =>
    selectedDate ? firstPickableSlot(selectedDate, seedFromSlug(initialSlug)) : "am",
  );
  const [prevSelectedKeyForSlot, setPrevSelectedKeyForSlot] = useState(selectedKey);
  if (selectedKey !== prevSelectedKeyForSlot) {
    setPrevSelectedKeyForSlot(selectedKey);
    if (selectedDate) setChosenSlot(firstPickableSlot(selectedDate, seedOffset));
  }

  return (
    <div className="flex flex-col gap-space-lg">
      <CalendarControlPanel
        facilities={facilities}
        facilitySlug={facility.slug}
        onFacilityChange={handleFacilityChange}
        rooms={facility.rooms}
        roomName={room.name}
        onRoomChange={setRoomName}
        year={year}
        month={month}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <div className="grid grid-cols-1 gap-space-lg xl:grid-cols-[1fr_320px] xl:items-start">
        <CalendarGrid
          facilityName={facility.name}
          roomLabel={room.name}
          year={year}
          month={month}
          seedOffset={seedOffset}
          today={DEMO_TODAY}
          selectedKey={selectedKey}
          onSelectDay={(key) =>
            setSelectedKey((prev) => (prev === key ? null : key))
          }
        />

        {selectedDate ? (
          <DayDetailPanel
            date={selectedDate}
            facilitySlug={facility.slug}
            facilityName={facility.name}
            roomLabel={room.name}
            fee={room.inCity}
            seedOffset={seedOffset}
            chosenSlot={chosenSlot}
            onChooseSlot={setChosenSlot}
            onClose={() => setSelectedKey(null)}
          />
        ) : (
          <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface p-space-md text-center text-caption text-ink-muted">
            <p>カレンダーの日付をクリックすると</p>
            <p>時間帯ごとの空き状況が表示されます</p>
          </div>
        )}
      </div>

      <CrossFacilityMatrix
        facilities={facilities}
        selectedSlug={facility.slug}
        onSelectFacility={handleFacilityChange}
      />
    </div>
  );
}
