import type { Metadata } from "next";

import { OrganizationsClient } from "@/components/mypage/organizations-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "団体情報・メンバー管理 | 西脇市 公共施設予約システム",
  description: "所属している団体の一覧です。詳細から情報確認・メンバー管理ができます。",
};

export default function OrganizationsPage() {
  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb items={[{ label: "マイページ", href: "/mypage" }, { label: "団体情報・メンバー管理" }]} />
          </div>

          <div className="mb-space-lg">
            <h1 className="text-h1-mobile text-primary md:text-h1">団体情報・メンバー管理</h1>
            <p className="mt-1 text-body text-ink-muted">
              所属している団体の一覧です。詳細から情報確認・メンバー管理ができます。
            </p>
          </div>

          <OrganizationsClient />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
