import { Headset, SlidersHorizontal } from "lucide-react";

import { CapacityRangeFilter } from "@/components/facilities/capacity-range-filter";
import {
  FilterCheckboxGroup,
  type FilterOption,
} from "@/components/facilities/filter-checkbox-group";

export type FilterFieldsProps = {
  categoryOptions: FilterOption[];
  selectedCategories: Set<string>;
  onToggleCategory: (value: string) => void;
  areaOptions: FilterOption[];
  selectedAreas: Set<string>;
  onToggleArea: (value: string) => void;
  amenityOptions: FilterOption[];
  selectedAmenities: Set<string>;
  onToggleAmenity: (value: string) => void;
  capacityMin: number;
  capacityMax: number;
  capacityValue: number;
  onCapacityChange: (value: number) => void;
  onReset: () => void;
};

/** 検索条件フォーム本体。デスクトップのサイドバーとモバイルのモーダルの両方から使う */
export function FilterFields({
  categoryOptions,
  selectedCategories,
  onToggleCategory,
  areaOptions,
  selectedAreas,
  onToggleArea,
  amenityOptions,
  selectedAmenities,
  onToggleAmenity,
  capacityMin,
  capacityMax,
  capacityValue,
  onCapacityChange,
  onReset,
}: FilterFieldsProps) {
  return (
    <>
      <div className="mb-space-sm flex items-center justify-between rounded-lg bg-canvas px-3 py-2">
        <div className="flex items-center gap-space-xs">
          <SlidersHorizontal aria-hidden className="size-5 text-primary" />
          <h2 className="text-h3 text-ink">検索条件</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-caption text-ink-muted underline hover:text-primary transition-colors"
        >
          条件をクリア
        </button>
      </div>

      <div className="space-y-space-md">
        <FilterCheckboxGroup
          title="カテゴリ"
          name="category"
          options={categoryOptions}
          selected={selectedCategories}
          onToggle={onToggleCategory}
        />

        <div className="h-px bg-line" />

        <FilterCheckboxGroup
          title="エリア"
          name="area"
          options={areaOptions}
          selected={selectedAreas}
          onToggle={onToggleArea}
        />

        <div className="h-px bg-line" />

        <FilterCheckboxGroup
          title="設備・仕様"
          name="amenity"
          options={amenityOptions}
          selected={selectedAmenities}
          onToggle={onToggleAmenity}
        />

        <div className="h-px bg-line" />

        <CapacityRangeFilter
          min={capacityMin}
          max={capacityMax}
          value={capacityValue}
          onChange={onCapacityChange}
        />
      </div>

      <div className="mt-space-md flex items-center gap-2 rounded-lg bg-canvas p-3 text-caption text-ink-muted">
        <Headset aria-hidden className="size-[18px] shrink-0 text-primary" />
        <span>お電話でのご予約相談は総合市民センター窓口へ</span>
      </div>
    </>
  );
}

/** 施設一覧 左カラムの検索条件パネル（PCでのみ表示。スマホ・タブレットでは FilterModalButton を使う） */
export function FilterSidebar(props: FilterFieldsProps) {
  return (
    <aside className="hidden w-full shrink-0 lg:sticky lg:top-[88px] lg:block lg:w-[280px]">
      <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)]">
        <FilterFields {...props} />
      </div>
    </aside>
  );
}
