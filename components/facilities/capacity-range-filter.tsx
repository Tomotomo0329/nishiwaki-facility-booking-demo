/** 収容定員レンジスライダー。この値「以下」の定員を持つ施設を絞り込む */
export function CapacityRangeFilter({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-space-xs flex items-center justify-between">
        <label htmlFor="capacity-range" className="text-caption-bold text-ink">
          収容定員
        </label>
        <span className="text-caption text-primary font-bold numeric">
          {min.toLocaleString("ja-JP")}人 〜 {value.toLocaleString("ja-JP")}人
        </span>
      </div>
      <input
        id="capacity-range"
        type="range"
        min={min}
        max={max}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer rounded bg-canvas accent-primary"
      />
      <div className="mt-1 flex justify-between text-[11px] text-ink-muted numeric">
        <span>{min.toLocaleString("ja-JP")}人</span>
        <span>{Math.round((min + max) / 2).toLocaleString("ja-JP")}人</span>
        <span>{max.toLocaleString("ja-JP")}人</span>
      </div>
    </div>
  );
}
