"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import {
  buildMonthGrid,
  getClosureReason,
  toKey,
  WEEKDAY_LABELS,
  type CalendarCell,
} from "@/lib/availability";

// トリガー表示は年をまたいでも迷わないよう、年月日をすべて表示する
// （lib/availability.ts の formatJpDate は月日のみのため、ここだけ別にする）
function formatJpDateWithYear(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${WEEKDAY_LABELS[date.getDay()]})`;
}

/**
 * 日付選択ポップオーバー（Radix UI Popover + 自社トークンで組んだ「shadcn 風」日付ピッカー）。
 * ホーム画面の検索フォームなど、単に「対象日」を選びたいだけの場面向け。
 * 施設ごとの空き状況ドットは出さず、休館日（毎週月曜・臨時休館）と過去日だけを選択不可にする。
 */
export function DatePickerPopover({
  id,
  value,
  onChange,
  minDate,
}: {
  id?: string;
  value: Date;
  onChange: (date: Date) => void;
  minDate: Date;
}) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth() + 1);

  // ポップオーバーを開いた瞬間だけ、表示月を選択中の日付に合わせ直す
  // （開いている間にユーザーが月を送っても勝手に戻さない）
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setViewYear(value.getFullYear());
      setViewMonth(value.getMonth() + 1);
    }
  }

  const cells = buildMonthGrid(viewYear, viewMonth, () => "open");
  const selectedKey = toKey(value);
  const todayKey = toKey(minDate);
  const minTime = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();

  function handlePrevMonth() {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function handleSelect(cell: CalendarCell) {
    if (!cell.inMonth) return;
    if (cell.date.getTime() < minTime) return;
    if (getClosureReason(cell.date)) return;
    onChange(cell.date);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          className="w-full min-h-[48px] pl-10 pr-3 py-2.5 rounded-lg bg-surface border border-line text-body text-ink text-left cursor-pointer hover:bg-canvas transition-colors"
        >
          {formatJpDateWithYear(value)}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="z-50 w-[300px] rounded-xl border border-line bg-surface p-space-md shadow-[var(--shadow-raised)] outline-none"
        >
          {/* ---------------- 月送り ---------------- */}
          <div className="mb-space-sm flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="前の月"
              className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas transition-colors"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <p className="text-body-bold text-ink numeric">
              {viewYear}年 {viewMonth}月
            </p>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="次の月"
              className="flex size-8 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas transition-colors"
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>

          {/* ---------------- カレンダー ---------------- */}
          <table className="w-full border-collapse">
            <caption className="sr-only">
              {viewYear}年{viewMonth}月のカレンダー。日付を選んでください
            </caption>
            <thead>
              <tr>
                {WEEKDAY_LABELS.map((w, i) => (
                  <th
                    key={w}
                    scope="col"
                    className={`pb-1 text-center text-xs font-normal ${
                      i === 0 ? "text-danger" : i === 6 ? "text-primary" : "text-ink-muted"
                    }`}
                  >
                    {w}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(cells.length / 7) }, (_, row) => (
                <tr key={row}>
                  {cells.slice(row * 7, row * 7 + 7).map((cell) => {
                    if (!cell.inMonth) {
                      return (
                        <td key={cell.key} className="p-0.5 text-center">
                          <span className="flex h-8 items-center justify-center text-xs text-ink-subtle/40">
                            {cell.day}
                          </span>
                        </td>
                      );
                    }

                    const isSelected = cell.key === selectedKey;
                    const isToday = cell.key === todayKey;
                    const isPast = cell.date.getTime() < minTime;
                    const closure = getClosureReason(cell.date);
                    const isDisabled = isPast || !!closure;
                    const isRedDay = cell.dayType === "sunday" || cell.dayType === "holiday";

                    return (
                      <td key={cell.key} className="p-0.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleSelect(cell)}
                          disabled={isDisabled}
                          aria-current={isSelected ? "date" : undefined}
                          aria-label={`${viewMonth}月${cell.day}日${closure ? "（休館日）" : ""}`}
                          className={[
                            "flex h-8 w-full items-center justify-center rounded-lg text-xs numeric transition-colors",
                            isSelected
                              ? "border-2 border-primary bg-primary-surface font-bold text-primary"
                              : isDisabled
                                ? "cursor-not-allowed text-ink-subtle line-through"
                                : `hover:bg-canvas text-ink ${isToday ? "ring-1 ring-inset ring-primary/50" : ""}`,
                            !isSelected && isRedDay && !isDisabled ? "text-danger" : "",
                          ].join(" ")}
                        >
                          {cell.day}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-space-sm flex items-center gap-1.5 border-t border-line pt-space-sm text-xs text-ink-muted">
            <CalendarDays aria-hidden className="size-3.5" />
            毎週月曜は休館日です（祝日を除く）
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
