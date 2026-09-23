import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReserveFlowClient } from "@/components/reserve/reserve-flow-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DEMO_TODAY, fromKey, offeredSlots, type SlotId } from "@/lib/availability";
import { getFacilityDetail } from "@/lib/demo-data";

const VALID_SLOT_IDS: SlotId[] = ["am", "pm", "night"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const facility = getFacilityDetail(slug);
  if (!facility) return { title: "施設が見つかりません" };
  return {
    title: `${facility.name}の予約申請 | 西脇市 公共施設予約システム`,
    description: "利用内容を入力し、内容確認のうえ予約（または抽選申込）を行います。",
  };
}

export default async function ReservePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; slot?: string }>;
}) {
  const { slug } = await params;
  const { date: dateParam, slot: slotParam } = await searchParams;

  const facility = getFacilityDetail(slug);
  if (!facility) notFound();

  // 未指定・不正な日付は「今日」にフォールバックする（直接URLを開いた場合など）
  const date = fromKey(dateParam) ?? DEMO_TODAY;

  // 指定された枠がその日に提供されていなければ無視する（後段で先頭の提供枠にフォールバック）
  const initialSlotId =
    slotParam && VALID_SLOT_IDS.includes(slotParam as SlotId) && offeredSlots(date).includes(slotParam as SlotId)
      ? (slotParam as SlotId)
      : undefined;

  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb
              items={[
                { label: "施設一覧", href: "/facilities" },
                { label: facility.name, href: `/facilities/${facility.slug}` },
                { label: "予約申請" },
              ]}
            />
          </div>

          <div className="mb-space-lg">
            <h1 className="text-h1-mobile text-primary md:text-h1">利用予約の申込み内容入力</h1>
            <p className="mt-1 text-body text-ink-muted">
              申請内容をご入力ください。料金は入力に応じてリアルタイムに再計算されます。
            </p>
          </div>

          <ReserveFlowClient facility={facility} date={date} initialSlotId={initialSlotId} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
