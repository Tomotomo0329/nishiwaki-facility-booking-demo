import { ChevronDown } from "lucide-react";

export type SortKey = "recommended" | "capacity-desc" | "price-asc" | "name-asc";

const sortLabels: Record<SortKey, string> = {
  recommended: "おすすめ順",
  "capacity-desc": "収容定員が多い順",
  "price-asc": "利用料金が安い順",
  "name-asc": "施設名50音順",
};

export function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (value: SortKey) => void;
}) {
  return (
    <div className="relative inline-block">
      <select
        aria-label="並び順"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="min-h-[44px] cursor-pointer appearance-none rounded-lg bg-canvas py-2 pl-3 pr-8 text-caption-bold text-ink hover:bg-line/60 transition-colors"
      >
        {(Object.keys(sortLabels) as SortKey[]).map((key) => (
          <option key={key} value={key}>
            {sortLabels[key]}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-2 top-1/2 size-[18px] -translate-y-1/2 text-ink-muted"
      />
    </div>
  );
}
