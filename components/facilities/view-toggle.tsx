import { LayoutList, Map } from "lucide-react";

export type ViewMode = "list" | "map";

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="表示切り替え"
      className="inline-flex rounded-lg bg-canvas p-1"
    >
      <button
        type="button"
        aria-pressed={value === "list"}
        onClick={() => onChange("list")}
        className={`inline-flex min-h-[36px] items-center gap-1 rounded-md px-3 text-caption transition-colors ${
          value === "list"
            ? "bg-surface text-primary font-bold shadow-[var(--shadow-card)]"
            : "text-ink-muted hover:text-ink"
        }`}
      >
        <LayoutList aria-hidden className="size-[18px]" />
        <span>リスト表示</span>
      </button>
      <button
        type="button"
        aria-pressed={value === "map"}
        onClick={() => onChange("map")}
        className={`inline-flex min-h-[36px] items-center gap-1 rounded-md px-3 text-caption transition-colors ${
          value === "map"
            ? "bg-surface text-primary font-bold shadow-[var(--shadow-card)]"
            : "text-ink-muted hover:text-ink"
        }`}
      >
        <Map aria-hidden className="size-[18px]" />
        <span className="hidden sm:inline">マップ表示</span>
      </button>
    </div>
  );
}
