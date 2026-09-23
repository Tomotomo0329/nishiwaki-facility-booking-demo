"use client";

import { useMemo, useState } from "react";

import { ActiveFilterChips, type ActiveFilterChip } from "@/components/facilities/active-filter-chips";
import { FacilityListCard } from "@/components/facilities/facility-list-card";
import { FilterSidebar } from "@/components/facilities/filter-sidebar";
import type { FilterOption } from "@/components/facilities/filter-checkbox-group";
import { MapViewPlaceholder } from "@/components/facilities/map-view-placeholder";
import { Pagination } from "@/components/facilities/pagination";
import { ResultsToolbar } from "@/components/facilities/results-toolbar";
import type { SortKey } from "@/components/facilities/sort-select";
import type { ViewMode } from "@/components/facilities/view-toggle";
import {
  amenityFilterOptions,
  type AmenityFilterKey,
  type Facility,
} from "@/lib/demo-data";

const PAGE_SIZE = 4;

function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

/** 施設一覧画面。検索条件パネル・並び替え・表示切り替え・ページングの状態をまとめて持つ */
export function FacilityListClient({
  facilities,
  initialArea,
  initialCategory,
}: {
  facilities: Facility[];
  /** ホーム検索フォームなどから渡される初期フィルター（エリア） */
  initialArea?: string;
  /** ホーム検索フォームなどから渡される初期フィルター（カテゴリ） */
  initialCategory?: string;
}) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(initialCategory ? [initialCategory] : []),
  );
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(
    () => new Set(initialArea ? [initialArea] : []),
  );
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());

  const capacityMin = useMemo(
    () => Math.floor(Math.min(...facilities.map((f) => f.capacityNumber)) / 10) * 10,
    [facilities],
  );
  const capacityMax = useMemo(
    () => Math.ceil(Math.max(...facilities.map((f) => f.capacityNumber)) / 10) * 10,
    [facilities],
  );
  const [capacityValue, setCapacityValue] = useState(capacityMax);

  const [sortValue, setSortValue] = useState<SortKey>("recommended");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [page, setPage] = useState(1);

  const categoryOptions: FilterOption[] = useMemo(() => {
    const counts = countBy(facilities, (f) => f.category);
    return Array.from(counts, ([value, count]) => ({ value, label: value, count }));
  }, [facilities]);

  const areaOptions: FilterOption[] = useMemo(() => {
    const counts = countBy(facilities, (f) => f.area);
    return Array.from(counts, ([value, count]) => ({ value, label: value, count }));
  }, [facilities]);

  const amenityOptions: FilterOption[] = useMemo(
    () =>
      amenityFilterOptions.map((option) => ({
        value: option.value,
        label: option.label,
        count: facilities.filter((f) => f.amenityFilters.includes(option.value)).length,
      })),
    [facilities],
  );

  const filtered = useMemo(() => {
    return facilities.filter((f) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(f.category)) return false;
      if (selectedAreas.size > 0 && !selectedAreas.has(f.area)) return false;
      if (
        selectedAmenities.size > 0 &&
        !Array.from(selectedAmenities).every((a) =>
          f.amenityFilters.includes(a as AmenityFilterKey),
        )
      )
        return false;
      if (f.capacityNumber > capacityValue) return false;
      return true;
    });
  }, [facilities, selectedCategories, selectedAreas, selectedAmenities, capacityValue]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortValue) {
      case "capacity-desc":
        return list.sort((a, b) => b.capacityNumber - a.capacityNumber);
      case "price-asc":
        return list.sort((a, b) => a.feePerSlot - b.feePerSlot);
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name, "ja"));
      case "recommended":
      default:
        return list;
    }
  }, [filtered, sortValue]);

  // 検索条件・並び替えが変わったら1ページ目に戻す（レンダー中に前回値と比較して調整する。
  // React 公式が推奨する「props/state の変化に応じて state を調整する」パターン。
  // useEffect 内で setState すると再レンダーが連鎖するため使わない）
  const filterSignature = JSON.stringify([
    Array.from(selectedCategories),
    Array.from(selectedAreas),
    Array.from(selectedAmenities),
    capacityValue,
    sortValue,
  ]);
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
  if (filterSignature !== prevFilterSignature) {
    setPrevFilterSignature(filterSignature);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const amenityLabel = (value: string) =>
    amenityFilterOptions.find((o) => o.value === value)?.label ?? value;

  const chips: ActiveFilterChip[] = [
    ...Array.from(selectedCategories, (v) => ({
      key: `category-${v}`,
      label: v,
      onRemove: () => setSelectedCategories((prev) => toggle(prev, v)),
    })),
    ...Array.from(selectedAreas, (v) => ({
      key: `area-${v}`,
      label: v,
      onRemove: () => setSelectedAreas((prev) => toggle(prev, v)),
    })),
    ...Array.from(selectedAmenities, (v) => ({
      key: `amenity-${v}`,
      label: amenityLabel(v),
      onRemove: () => setSelectedAmenities((prev) => toggle(prev, v)),
    })),
    ...(capacityValue < capacityMax
      ? [
          {
            key: "capacity",
            label: `定員 ${capacityValue.toLocaleString("ja-JP")}人以下`,
            onRemove: () => setCapacityValue(capacityMax),
          },
        ]
      : []),
  ];

  function handleReset() {
    setSelectedCategories(new Set());
    setSelectedAreas(new Set());
    setSelectedAmenities(new Set());
    setCapacityValue(capacityMax);
  }

  return (
    <div className="flex w-full flex-col items-start gap-space-lg lg:flex-row">
      <FilterSidebar
        categoryOptions={categoryOptions}
        selectedCategories={selectedCategories}
        onToggleCategory={(v) => setSelectedCategories((prev) => toggle(prev, v))}
        areaOptions={areaOptions}
        selectedAreas={selectedAreas}
        onToggleArea={(v) => setSelectedAreas((prev) => toggle(prev, v))}
        amenityOptions={amenityOptions}
        selectedAmenities={selectedAmenities}
        onToggleAmenity={(v) => setSelectedAmenities((prev) => toggle(prev, v))}
        capacityMin={capacityMin}
        capacityMax={capacityMax}
        capacityValue={capacityValue}
        onCapacityChange={setCapacityValue}
        onReset={handleReset}
      />

      <section className="w-full min-w-0 flex-1">
        <ResultsToolbar
          count={sorted.length}
          sortValue={sortValue}
          onSortChange={setSortValue}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <ActiveFilterChips chips={chips} onClearAll={handleReset} />

        {viewMode === "map" ? (
          <MapViewPlaceholder />
        ) : sorted.length === 0 ? (
          <div className="rounded-xl bg-surface p-space-xl text-center text-body text-ink-muted shadow-[var(--shadow-card)]">
            条件に一致する施設が見つかりませんでした。検索条件を変更してお試しください。
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-space-md xl:grid-cols-2">
              {paged.map((facility) => (
                <FacilityListCard key={facility.slug} facility={facility} />
              ))}
            </div>

            <Pagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={sorted.length}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
