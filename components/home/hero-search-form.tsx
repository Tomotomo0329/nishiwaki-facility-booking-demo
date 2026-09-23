"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, MapPin, Search, Trophy } from "lucide-react";

import { DatePickerPopover } from "@/components/ui/date-picker-popover";
import { DEMO_TODAY } from "@/lib/availability";
import { areas, purposes } from "@/lib/demo-data";

/**
 * ホーム画面の空き状況検索カード。
 * 利用日は DatePickerPopover でタップ操作から選べる。「空きをさがす」を押すと、
 * 選んだ目的・エリアを施設一覧のフィルター条件として引き継いで /facilities へ遷移する
 * （利用日は施設一覧側に「日付ごとの空き状況」の絞り込み軸が無いため、現状は反映しない）。
 */
export function HeroSearchForm() {
  const router = useRouter();
  const [date, setDate] = useState(DEMO_TODAY);
  const [purpose, setPurpose] = useState(purposes[0]);
  const [area, setArea] = useState(areas[0]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams({ purpose });
    if (area !== "すべて") params.set("area", area);
    router.push(`/facilities?${params.toString()}`);
  }

  return (
    <div className="w-full text-left rounded-xl bg-surface border border-line shadow-[var(--shadow-raised)] p-space-md md:p-space-lg">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-space-md items-end">
        <Field className="sm:col-span-1 xl:col-span-3" label="利用日" required htmlFor="date">
          <CalendarDays aria-hidden className="absolute left-3 z-10 size-5 text-ink-muted pointer-events-none" />
          <DatePickerPopover id="date" value={date} onChange={setDate} minDate={DEMO_TODAY} />
        </Field>

        <Field className="sm:col-span-1 xl:col-span-3" label="目的" htmlFor="purpose">
          <Trophy aria-hidden className="absolute left-3 size-5 text-ink-muted pointer-events-none" />
          <select
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full min-h-[48px] pl-10 pr-8 py-2.5 rounded-lg bg-surface border border-line text-body text-ink appearance-none cursor-pointer"
          >
            {purposes.slice(0, 8).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>

        <Field className="sm:col-span-1 xl:col-span-3" label="エリア" htmlFor="area">
          <MapPin aria-hidden className="absolute left-3 size-5 text-ink-muted pointer-events-none" />
          <select
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full min-h-[48px] pl-10 pr-8 py-2.5 rounded-lg bg-surface border border-line text-body text-ink appearance-none cursor-pointer"
          >
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-1 xl:col-span-3">
          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-2.5 rounded-lg bg-primary text-on-primary text-caption-bold xl:text-body-bold flex items-center justify-center gap-2 whitespace-nowrap hover:bg-primary-hover transition-colors shadow-[var(--shadow-card)]"
          >
            <Search aria-hidden className="size-5 shrink-0" />
            空きをさがす
          </button>
        </div>
      </form>
    </div>
  );
}

/** ラベル（必須/任意バッジ付き）+ アイコン内包の入力欄 */
function Field({
  label,
  htmlFor,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <label htmlFor={htmlFor} className="flex items-center justify-between text-caption-bold text-ink">
        {label}
        <span className="px-1.5 py-0.5 rounded bg-canvas border border-line text-xs font-normal text-ink-muted">
          {required ? "必須" : "任意"}
        </span>
      </label>
      <div className="relative flex items-center">{children}</div>
    </div>
  );
}
