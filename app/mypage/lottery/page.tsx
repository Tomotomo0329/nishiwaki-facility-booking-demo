import type { Metadata } from "next";

import { LotteryClient } from "@/components/mypage/lottery-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "抽選申込一覧 | 西脇市 公共施設予約システム",
  description: "抽選施設への申込状況と結果を確認できます。",
};

export default function LotteryPage() {
  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb items={[{ label: "マイページ", href: "/mypage" }, { label: "抽選申込" }]} />
          </div>

          <div className="mb-space-lg">
            <h1 className="text-h1-mobile text-primary md:text-h1">抽選申込</h1>
            <p className="mt-1 text-body text-ink-muted">
              人気施設の抽選申込状況と結果を確認できます。
            </p>
          </div>

          <LotteryClient />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
