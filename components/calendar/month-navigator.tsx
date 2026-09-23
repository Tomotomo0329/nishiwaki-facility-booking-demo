import { ChevronLeft, ChevronRight } from "lucide-react";

const WAREKI_MONTH_NAMES = [
  "睦月",
  "如月",
  "弥生",
  "卯月",
  "皐月",
  "水無月",
  "文月",
  "葉月",
  "長月",
  "神無月",
  "霜月",
  "師走",
];

/** 令和年に変換（デモの対象年は2019年以降のみ想定） */
function toReiwa(year: number): number {
  return year - 2018;
}

/** 月間カレンダーの月送りコントロール */
export function MonthNavigator({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
}: {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-space-sm">
      <div className="flex items-center rounded-lg bg-canvas p-1">
        <button
          type="button"
          aria-label="前月へ"
          onClick={onPrevMonth}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-surface transition-colors sm:size-10"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <div className="flex flex-col items-center px-1.5 py-1 sm:flex-row sm:items-baseline sm:gap-2 sm:px-4">
          <span className="text-h3 text-primary tracking-tight numeric sm:text-h2">
            {year}年 {month}月
          </span>
          <span className="hidden text-caption text-ink-muted sm:inline">
            令和{toReiwa(year)}年・{WAREKI_MONTH_NAMES[month - 1]}
          </span>
        </div>
        <button
          type="button"
          aria-label="翌月へ"
          onClick={onNextMonth}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-surface transition-colors sm:size-10"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={onToday}
        className="min-h-[40px] shrink-0 rounded-lg bg-canvas px-3.5 py-1.5 text-caption-bold text-primary hover:bg-line/60 transition-colors"
      >
        今月へ戻る
      </button>
    </div>
  );
}
