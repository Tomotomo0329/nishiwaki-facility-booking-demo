import type { Metadata } from "next";
import { Circle } from "lucide-react";

import { MonthlyCalendarClient } from "@/components/calendar/monthly-calendar-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { facilityDetails, popularFacilities } from "@/lib/demo-data";

const FACILITIES = Object.values(facilityDetails);
const DEFAULT_SLUG = popularFacilities[0].slug;

export const metadata: Metadata = {
  title: "月間空き状況カレンダー | 西脇市 公共施設予約システム",
  description:
    "西脇市の公共施設の月間空き状況を、施設・面ごとに時間帯単位で確認できます。",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ facility?: string }>;
}) {
  const { facility } = await searchParams;
  const initialSlug =
    facility && facilityDetails[facility] ? facility : DEFAULT_SLUG;

  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md flex flex-wrap items-center justify-between gap-space-sm">
            <Breadcrumb
              items={[
                { label: "トップ", href: "/" },
                { label: "施設一覧", href: "/facilities" },
                { label: "月間空き状況カレンダー" },
              ]}
            />
            <span className="inline-flex items-center gap-1.5 rounded bg-canvas px-2.5 py-1 text-caption text-ink-muted">
              <Circle aria-hidden className="size-2 fill-ok text-ok" />
              デモデータを表示中
            </span>
          </div>

          <MonthlyCalendarClient facilities={FACILITIES} initialSlug={initialSlug} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
