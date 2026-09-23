import type { Metadata } from "next";

import { MypageClient } from "@/components/mypage/mypage-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "マイページ | 西脇市 公共施設予約システム",
  description: "アカウントの基本情報、ログイン認証方法、通知設定を管理します。",
};

export default function MypagePage() {
  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb items={[{ label: "マイページ" }]} />
          </div>

          <div className="mb-space-lg">
            <h1 className="text-h1-mobile text-primary md:text-h1">マイページ</h1>
            <p className="mt-1 text-body text-ink-muted">
              アカウントの基本情報、ログイン認証方法、通知設定を管理します。
            </p>
          </div>

          <MypageClient />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
