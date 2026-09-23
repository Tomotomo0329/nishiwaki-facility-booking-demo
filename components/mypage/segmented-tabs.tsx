/** マイページ配下の一覧画面で共用するタブ切り替え（予約一覧・抽選申込など） */
export function SegmentedTabs<T extends string>({
  label,
  tabs,
  active,
  onChange,
}: {
  label: string;
  tabs: { key: T; label: string; count: number }[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex w-full gap-1 rounded-lg bg-canvas p-1 sm:w-auto"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-md px-4 text-caption-bold transition-colors sm:flex-none ${
              isActive
                ? "bg-surface text-primary shadow-[var(--shadow-card)]"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] numeric ${
                isActive ? "bg-primary-surface text-primary" : "bg-line/60 text-ink-muted"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
