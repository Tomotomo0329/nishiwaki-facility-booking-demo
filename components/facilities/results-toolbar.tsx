import { SortSelect, type SortKey } from "@/components/facilities/sort-select";
import { ViewToggle, type ViewMode } from "@/components/facilities/view-toggle";

/** 検索結果件数 + 並び替え + 表示切り替えをまとめたツールバー */
export function ResultsToolbar({
  count,
  sortValue,
  onSortChange,
  viewMode,
  onViewModeChange,
}: {
  count: number;
  sortValue: SortKey;
  onSortChange: (value: SortKey) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
}) {
  return (
    <div className="mb-space-md flex flex-col items-start justify-between gap-space-md rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
      <div className="flex items-center gap-space-xs">
        <h2 className="text-h2 text-ink">
          <span className="numeric">{count}</span>
          <span className="ml-1 text-body-bold text-ink-muted">件の施設</span>
        </h2>
        <span
          aria-hidden
          className="mx-1 hidden size-1.5 rounded-full bg-line sm:inline-block"
        />
        <span className="text-caption text-ink-muted">
          西脇市内の公共貸出施設
        </span>
      </div>

      <div className="flex w-full items-center justify-between gap-space-sm sm:w-auto sm:justify-end">
        <SortSelect value={sortValue} onChange={onSortChange} />
        <ViewToggle value={viewMode} onChange={onViewModeChange} />
      </div>
    </div>
  );
}
