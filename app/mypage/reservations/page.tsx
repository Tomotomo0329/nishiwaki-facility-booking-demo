import type { Metadata } from "next";

import { ReservationsClient } from "@/components/mypage/reservations-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "予約一覧 | 西脇市 公共施設予約システム",
  description: "ご自身の予約状況・利用履歴を確認できます。",
};

export default function ReservationsPage() {
  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb items={[{ label: "マイページ", href: "/mypage" }, { label: "予約一覧" }]} />
          </div>

          <div className="mb-space-lg">
            <h1 className="text-h1-mobile text-primary md:text-h1">予約一覧</h1>
            <p className="mt-1 text-body text-ink-muted">
              予約状況の確認や各種お手続きはこちらから行えます。
            </p>
          </div>

          <ReservationsClient />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
