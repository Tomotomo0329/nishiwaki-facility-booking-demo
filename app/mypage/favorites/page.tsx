import type { Metadata } from "next";

import { FavoritesClient } from "@/components/mypage/favorites-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "お気に入り施設 | 西脇市 公共施設予約システム",
  description: "お気に入り登録した施設の一覧を確認できます。",
};

export default function FavoritesPage() {
  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb
              items={[{ label: "マイページ", href: "/mypage" }, { label: "お気に入り施設" }]}
            />
          </div>

          <div className="mb-space-lg">
            <h1 className="text-h1-mobile text-primary md:text-h1">お気に入り施設</h1>
            <p className="mt-1 text-body text-ink-muted">
              お気に入り登録した施設の一覧です。
            </p>
          </div>

          <FavoritesClient />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
