export type FilterOption = {
  value: string;
  label: string;
  count: number;
};

/** カテゴリ／エリア／設備で共用する、件数付きチェックボックスの絞り込みセクション */
export function FilterCheckboxGroup({
  title,
  name,
  options,
  selected,
  onToggle,
}: {
  title: string;
  name: string;
  options: FilterOption[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <span className="mb-space-xs block text-caption-bold text-ink">
        {title}
      </span>
      <div className="space-y-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="group flex cursor-pointer items-center justify-between rounded px-2 py-1.5 hover:bg-canvas transition-colors"
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={selected.has(option.value)}
                onChange={() => onToggle(option.value)}
                className="size-4 rounded text-primary focus:ring-primary"
              />
              <span className="text-body text-ink group-hover:text-primary">
                {option.label}
              </span>
            </span>
            <span className="rounded bg-canvas px-1.5 py-0.5 text-caption text-ink-muted numeric">
              {option.count}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
