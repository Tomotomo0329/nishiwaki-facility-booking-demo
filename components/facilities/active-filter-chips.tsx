import { X } from "lucide-react";

export type ActiveFilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

/** 現在適用中の絞り込み条件をチップで表示し、個別／一括で解除できるようにする */
export function ActiveFilterChips({
  chips,
  onClearAll,
}: {
  chips: ActiveFilterChip[];
  onClearAll: () => void;
}) {
  if (chips.length === 0) return null;

  return (
    <div
      aria-label="適用中の絞り込み条件"
      className="mb-space-md flex flex-wrap items-center gap-space-xs"
    >
      <span className="mr-1 text-caption text-ink-muted">現在の検索条件:</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="group inline-flex items-center gap-1 rounded-full bg-primary-surface px-3 py-1 text-caption-bold text-primary hover:bg-primary hover:text-on-primary transition-colors"
        >
          <span>{chip.label}</span>
          <X aria-hidden className="size-4 group-hover:scale-110 transition-transform" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-2 text-caption text-ink-muted underline hover:text-primary transition-colors"
      >
        すべて解除
      </button>
    </div>
  );
}
