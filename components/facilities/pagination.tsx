import { ChevronLeft, ChevronRight } from "lucide-react";

/** 汎用ページネーション。total <= pageSize のときは前へ/次へが無効化される */
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(total, page * pageSize);

  return (
    <nav
      aria-label="ページ送り"
      className="mt-space-xl flex flex-col items-center justify-between gap-space-md rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:flex-row"
    >
      <p className="text-caption text-ink-muted">
        全<span className="numeric font-bold text-ink">{total}</span>件中{" "}
        <span className="numeric font-bold text-ink">
          {rangeStart} - {rangeEnd}件目
        </span>{" "}
        を表示しています
      </p>

      <ul className="inline-flex items-center gap-1">
        <li>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 py-2 text-body text-ink-muted hover:bg-canvas transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronLeft aria-hidden className="mr-1 size-[18px]" />
            <span>前へ</span>
          </button>
        </li>

        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            {p === page ? (
              <span
                aria-current="page"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-primary px-3 py-2 font-bold text-on-primary numeric shadow-[var(--shadow-card)]"
              >
                {p}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onPageChange(p)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-3 py-2 text-ink numeric hover:bg-canvas transition-colors"
              >
                {p}
              </button>
            )}
          </li>
        ))}

        <li>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 py-2 text-body text-ink-muted hover:bg-canvas transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span>次へ</span>
            <ChevronRight aria-hidden className="ml-1 size-[18px]" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
