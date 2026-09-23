"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { CheckCircle2, Gavel, PhoneCall, ShieldCheck } from "lucide-react";

import { DocumentAttachments } from "@/components/organization/document-attachments";
import { MemberTable } from "@/components/organization/member-table";
import { OrganizationOverview } from "@/components/organization/organization-overview";
import { ResidencyRequirementCard } from "@/components/organization/residency-requirement-card";
import {
  demoDocumentsByOrganization,
  demoMembersByOrganization,
  getOrganization,
  type Member,
} from "@/lib/organization";

/** マイページの中心コンテンツ。指定団体の情報表示とメンバー一覧の状態をここで持つ */
export function OrganizationSection({ organizationId }: { organizationId: string }) {
  const organization = getOrganization(organizationId);
  const [members, setMembers] = useState<Member[]>(
    demoMembersByOrganization[organizationId] ?? [],
  );

  if (!organization) notFound();

  const documents = demoDocumentsByOrganization[organizationId] ?? [];
  const canManage = organization.myRole === "representative";

  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-space-sm rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex items-center gap-space-xs text-h2 text-primary">
              <ShieldCheck aria-hidden className="size-6 text-primary" />
              {organization.name}
            </h2>
            <span className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-bold text-ink-muted">
              {organization.category}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                canManage ? "bg-primary-surface text-primary" : "bg-canvas text-ink-muted"
              }`}
            >
              {canManage ? "自分の立場: 代表者" : "自分の立場: メンバー"}
            </span>
          </div>
          <p className="mt-1 text-caption text-ink-muted">
            登録団体の情報確認{canManage ? "と、メンバーの招待・権限管理ができます。" : "ができます。"}
          </p>
        </div>
        {canManage ? (
          <a
            href="tel:0795-22-3111"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-canvas px-4 text-caption-bold text-ink transition-colors hover:bg-line/60"
          >
            <PhoneCall aria-hidden className="size-[18px]" />
            登録内容の変更は窓口へお問い合わせ
          </a>
        ) : null}
      </div>

      <OrganizationOverview organization={organization} />

      <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
        <ResidencyRequirementCard
          members={members}
          requiredRatio={organization.requiredResidencyRatio}
        />
        <DocumentAttachments documents={documents} />
      </div>

      <MemberTable
        members={members}
        onChange={setMembers}
        organizationName={organization.name}
        canManage={canManage}
      />

      <div className="flex items-start gap-space-sm rounded-xl bg-canvas p-space-md">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-surface text-primary">
          <Gavel aria-hidden className="size-5" />
        </div>
        <div className="space-y-space-sm">
          <div>
            <h3 className="text-body-bold text-ink">
              西脇市公共施設利用条例における「市内公認団体」要件について
            </h3>
            <p className="mt-1 text-caption leading-relaxed text-ink-muted">
              市内団体特典（先行抽選申込の参加資格および使用料減免措置）を継続して受けるためには、所属メンバーの
              {organization.requiredResidencyRatio}
              %以上が西脇市内に在住・在勤・在学している必要があります。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
            <div className="rounded-lg bg-surface p-space-sm">
              <p className="flex items-center gap-1.5 text-caption-bold text-ink">
                <CheckCircle2 aria-hidden className="size-4 text-ok" />
                メンバーの入れ替えと名簿更新
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                年度途中でメンバーが退会または新規加入した際は、速やかに名簿の変更または招待を行ってください。基準を下回る見込みがある場合は窓口での事前相談を受け付けています。
              </p>
            </div>
            <div className="rounded-lg bg-surface p-space-sm">
              <p className="flex items-center gap-1.5 text-caption-bold text-ink">
                <ShieldCheck aria-hidden className="size-4 text-primary" />
                予約権限の管理と責任
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                「予約・決済権限」を持つメンバーが行った予約確定およびキャンセル料発生は、団体代表者が責任を負います。定期的な権限棚卸しを推奨します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
