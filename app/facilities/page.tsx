import type { Metadata } from "next";
import { BadgeCheck, Info } from "lucide-react";

import { FacilityListClient } from "@/components/facilities/facility-list-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { popularFacilities, purposeToCategory } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "施設をさがす | 西脇市 公共施設予約システム",
  description:
    "西脇市の体育館・グラウンド・研修室などの公共施設を、カテゴリやエリア、設備で絞り込んで検索できます。",
};

export default async function FacilitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; purpose?: string }>;
}) {
  const { area, purpose } = await searchParams;
  // ホーム画面の検索フォームからの遷移時、選ばれていた条件を初期フィルターとして反映する
  const initialArea = area && area !== "すべて" ? area : undefined;
  const initialCategory = purpose ? purposeToCategory[purpose] : undefined;

  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb
              items={[{ label: "トップ", href: "/" }, { label: "施設一覧・検索" }]}
            />
          </div>

          <div className="mb-space-lg flex flex-col gap-space-md md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-space-xs inline-flex items-center gap-space-xs rounded bg-primary/10 px-2.5 py-1 text-caption-bold text-primary">
                <BadgeCheck aria-hidden className="size-4" />
                <span>西脇市公式 公共予約システム</span>
              </div>
              <h1 className="text-h2 text-ink">施設をさがす</h1>
            </div>
            <div className="flex items-center gap-space-xs text-caption text-ink-muted">
              <Info aria-hidden className="size-5 text-primary" />
              <span>播州織発祥のまち・日本のへそ西脇市の各種公共スポーツ・文化施設です</span>
            </div>
          </div>

          <FacilityListClient
            facilities={popularFacilities}
            initialArea={initialArea}
            initialCategory={initialCategory}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
