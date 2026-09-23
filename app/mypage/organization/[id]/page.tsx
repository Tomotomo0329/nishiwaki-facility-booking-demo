import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrganizationClient } from "@/components/mypage/organization-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { demoOrganizations, getOrganization } from "@/lib/organization";

export function generateStaticParams() {
  return demoOrganizations.map((o) => ({ id: o.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const organization = getOrganization(id);
  if (!organization) return { title: "団体が見つかりません" };
  return {
    title: `${organization.name}｜団体情報・メンバー管理 | 西脇市 公共施設予約システム`,
    description: "登録団体の情報確認と、メンバーの招待・権限管理ができます。",
  };
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const organization = getOrganization(id);
  if (!organization) notFound();

  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb
              items={[
                { label: "マイページ", href: "/mypage" },
                { label: "団体情報・メンバー管理", href: "/mypage/organization" },
                { label: organization.name },
              ]}
            />
          </div>

          <div className="mb-space-lg">
            <h1 className="text-h1-mobile text-primary md:text-h1">{organization.name}</h1>
            <p className="mt-1 text-body text-ink-muted">
              登録団体の情報確認と、メンバーの招待・権限管理ができます。
            </p>
          </div>

          <OrganizationClient organizationId={id} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
