"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Phone,
} from "lucide-react";

import {
  SLOTS,
  buildMonthGrid,
  demoSlotStateFor,
  demoStateFor,
  firstPickableSlot,
  formatJpDate,
  offeredSlots,
  seedFromSlug,
  toKey,
  WEEKDAY_LABELS,
  type CalendarCell,
  type SlotId,
} from "@/lib/availability";
import { useAuth } from "@/lib/auth-context";
import { slotAppearance, SlotDot } from "@/components/ui/slot-chip";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export function BookingPanel({
  slug,
  roomLabel,
  fee,
  selectedDate: initialDate,
  contact,
}: {
  slug: string;
  roomLabel: string;
  fee: number;
  selectedDate: Date;
  contact: { office: string; tel: string; hours: string };
}) {
  const { isLoggedIn } = useAuth();
  const seedOffset = seedFromSlug(slug);

  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [chosen, setChosen] = useState<SlotId>(() => firstPickableSlot(initialDate, seedOffset));

  const cells = buildMonthGrid(year, month, (d) => demoStateFor(d, seedOffset));
  const offered = offeredSlots(selectedDate);
  const selectedKey = toKey(selectedDate);

  const slotStates = Object.fromEntries(
    SLOTS.map((s) => [
      s.id,
      offered.includes(s.id) ? demoSlotStateFor(selectedDate, s.id, seedOffset) : "closed",
    ]),
  ) as Record<SlotId, ReturnType<typeof demoSlotStateFor>>;

  const reserveTarget = `/reserve/${slug}?date=${toKey(selectedDate)}&slot=${chosen}`;
  const reserveHref = isLoggedIn
    ? reserveTarget
    : `/login?next=${encodeURIComponent(reserveTarget)}`;

  function handlePrevMonth() {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  }

  function handleNextMonth() {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  }

  function handleSelectDay(cell: CalendarCell) {
    if (!cell.inMonth || cell.state === "closed") return;
    setSelectedDate(cell.date);
    setChosen(firstPickableSlot(cell.date, seedOffset));
  }

  return (
    <div className="space-y-space-md">
      <section
        aria-labelledby="booking-heading"
        className="rounded-xl border border-line bg-surface shadow-[var(--shadow-card)] p-space-md"
      >
        {/* ---------------- ヘッダー ---------------- */}
        <div className="flex items-center justify-between gap-2 mb-space-md">
          <h2
            id="booking-heading"
            className="flex items-center gap-2 text-h3 text-ink"
          >
            <CalendarCheck aria-hidden className="size-5 text-primary" />
            空き状況をみる
          </h2>
          <span className="shrink-0 rounded bg-primary-surface px-2 py-0.5 text-xs font-bold text-primary">
            {roomLabel}
          </span>
        </div>

        {/* ---------------- 月セレクタ ---------------- */}
        <div className="flex items-center justify-between mb-space-sm">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="前の月"
            className="flex size-9 items-center justify-center rounded-lg border border-line text-ink-muted hover:bg-canvas"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <p className="text-body-bold text-ink numeric">
            {year}年 {month}月
          </p>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="次の月"
            className="flex size-9 items-center justify-center rounded-lg border border-line text-ink-muted hover:bg-canvas"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>

        {/* ---------------- カレンダー ---------------- */}
        <table className="w-full border-collapse">
          <caption className="sr-only">
            {year}年{month}月の空き状況カレンダー。日付を選ぶと下の時間枠が更新されます
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
                  const isSelected = cell.key === selectedKey && cell.inMonth;
                  const isClosed = cell.state === "closed";

                  if (!cell.inMonth) {
                    return (
                      <td key={cell.key} className="p-0.5 text-center">
                        <span className="flex h-9 flex-col items-center justify-center text-xs text-ink-subtle/40">
                          {cell.day}
                        </span>
                      </td>
                    );
                  }

                  return (
                    <td key={cell.key} className="p-0.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleSelectDay(cell)}
                        aria-current={isSelected ? "date" : undefined}
                        aria-label={`${month}月${cell.day}日 ${slotAppearance[cell.state].label}`}
                        disabled={isClosed}
                        className={[
                          "flex h-9 w-full flex-col items-center justify-center rounded-lg text-xs transition-colors",
                          isSelected
                            ? "border-2 border-primary bg-primary-surface font-bold text-primary"
                            : isClosed
                              ? "cursor-not-allowed bg-canvas text-ink-subtle"
                              : "hover:bg-canvas text-ink",
                          cell.dayType === "sunday" || cell.dayType === "holiday"
                            ? isSelected
                              ? ""
                              : "text-danger"
                            : "",
                        ].join(" ")}
                      >
                        <span className="numeric leading-none">{cell.day}</span>
                        {isClosed ? (
                          <span className="text-[9px] leading-tight text-ink-subtle">
                            休館
                          </span>
                        ) : (
                          <SlotDot state={cell.state} />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------------- 凡例 ---------------- */}
        <ul className="mt-space-sm flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-space-sm text-xs text-ink-muted">
          {(["open", "limited", "booked"] as const).map((s) => (
            <li key={s} className="flex items-center gap-1">
              <SlotDot state={s} />
              {slotAppearance[s].label}
            </li>
          ))}
          <li className="text-ink-subtle">/ 休館日</li>
        </ul>

        <Link
          href={`/calendar?facility=${slug}`}
          className="mt-space-sm flex items-center justify-center gap-1.5 rounded-lg border border-line bg-canvas py-2 text-caption-bold text-primary hover:bg-primary-surface transition-colors"
        >
          月間カレンダーで詳しく見る
          <ArrowRight aria-hidden className="size-4" />
        </Link>

        {/* ---------------- 選択中の日付と時間枠 ---------------- */}
        <div className="mt-space-md flex items-center justify-between border-t border-line pt-space-md">
          <p className="flex items-center gap-2 text-body-bold text-ink">
            <CalendarDays aria-hidden className="size-4 text-primary" />
            {formatJpDate(selectedDate)}
          </p>
          <p className="text-caption text-ink-muted">時間枠を選択</p>
        </div>

        <ul className="mt-space-sm space-y-2">
          {SLOTS.map((slot) => {
            const state = slotStates[slot.id];
            const isChosen = slot.id === chosen;
            const disabled = state === "booked" || state === "closed";

            return (
              <li key={slot.id}>
                <div
                  className={[
                    "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5",
                    isChosen
                      ? "border-primary bg-primary-surface"
                      : disabled
                        ? "border-line bg-canvas"
                        : "border-line bg-surface",
                  ].join(" ")}
                >
                  <div className="min-w-0">
                    <p
                      className={`text-caption-bold ${
                        disabled ? "text-ink-subtle line-through" : "text-ink"
                      }`}
                    >
                      {slot.label} {slot.time}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <span className="numeric">{yen(fee)}</span>
                      <span aria-hidden>·</span>
                      <span className={disabled ? "" : "text-ok"}>
                        {slotAppearance[state].symbol}{" "}
                        {slotAppearance[state].label}
                      </span>
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setChosen(slot.id)}
                    aria-pressed={isChosen}
                    className={[
                      "shrink-0 min-h-[36px] rounded-lg px-3 text-caption-bold transition-colors",
                      isChosen
                        ? "bg-primary text-on-primary"
                        : disabled
                          ? "cursor-not-allowed bg-full-surface text-ink-subtle"
                          : "border border-line bg-surface text-primary hover:bg-primary-surface",
                    ].join(" ")}
                  >
                    {isChosen
                      ? "✓ 選択中"
                      : state === "closed"
                        ? "休館"
                        : disabled
                          ? "選択不可"
                          : "選択"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* ---------------- CTA ---------------- */}
        <Link
          href={reserveHref}
          className="mt-space-md flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover"
        >
          {isLoggedIn ? "予約へすすむ" : "ログインして予約へすすむ"}
          <ArrowRight aria-hidden className="size-5" />
        </Link>
        <p className="mt-2 text-center text-caption text-ink-muted">
          予約には利用者登録が必要です
        </p>
        <Link
          href="/guide"
          className="mt-2 flex items-center justify-center gap-1.5 text-caption text-primary hover:underline"
        >
          <CircleHelp aria-hidden className="size-4" />
          予約手順・キャンセル規定のご案内
        </Link>
      </section>

      {/* ---------------- 連絡先 ---------------- */}
      <section
        aria-labelledby="contact-heading"
        className="rounded-xl border border-line bg-canvas p-space-md"
      >
        <h2
          id="contact-heading"
          className="flex items-center gap-2 text-caption-bold text-ink"
        >
          <Phone aria-hidden className="size-4 text-ink-muted" />
          お電話での確認・お問い合わせ
        </h2>
        <p className="mt-1 text-caption text-ink-muted">
          {contact.office}：
          <a href={`tel:${contact.tel}`} className="numeric text-primary hover:underline">
            {contact.tel}
          </a>
        </p>
        <p className="text-caption text-ink-muted">受付時間: {contact.hours}</p>
      </section>
    </div>
  );
}
