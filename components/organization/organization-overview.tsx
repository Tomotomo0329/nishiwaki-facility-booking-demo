import { CalendarClock, Percent, User } from "lucide-react";

import type { Organization } from "@/lib/organization";

const jpDate = (d: Date) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

/** 団体の基本情報（有効期限・代表者・設立年月日）を示すベントグリッド */
export function OrganizationOverview({ organization }: { organization: Organization }) {
  const years =
    new Date().getFullYear() -
    organization.establishedDate.getFullYear() -
    (new Date() < new Date(organization.establishedDate) ? 1 : 0);

  return (
    <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="flex flex-col gap-space-sm pb-space-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-h2 text-ink">{organization.name}</h2>
            <span className="rounded-full bg-primary-surface px-2.5 py-0.5 text-xs font-bold text-primary">
              {organization.certificationLabel}
            </span>
          </div>
          <p className="mt-1 text-caption text-ink-muted">
            市内スポーツ振興団体（減免認定第 {organization.exemptionNo} 号）
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ok-surface px-3 py-1.5 text-caption-bold text-ok">
          <Percent aria-hidden className="size-[18px]" />
          {organization.feeExemptionLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
        <div className="space-y-2 rounded-lg bg-canvas p-space-md">
          <div className="flex items-center justify-between text-caption text-ink-muted">
            <span>登録有効期限</span>
            <CalendarClock aria-hidden className="size-4 text-ok" />
          </div>
          <p className="text-[17px] font-bold text-ink numeric">
            {jpDate(organization.registrationExpiry)}
          </p>
          <p className="flex items-center gap-1.5 text-xs font-bold text-ok">
            <span aria-hidden className="size-1.5 rounded-full bg-ok" />
            自動更新対象（年次活動報告済）
          </p>
        </div>

        <div className="space-y-2 rounded-lg bg-canvas p-space-md">
          <div className="flex items-center justify-between text-caption text-ink-muted">
            <span>登録代表者・連絡責任者</span>
            <User aria-hidden className="size-4 text-primary" />
          </div>
          <p className="text-[17px] font-bold text-ink">{organization.representativeName}</p>
          <p className="text-xs text-ink-muted numeric">{organization.representativeTel}</p>
        </div>

        <div className="space-y-2 rounded-lg bg-canvas p-space-md">
          <div className="flex items-center justify-between text-caption text-ink-muted">
            <span>設立年月日・登録年度</span>
            <CalendarClock aria-hidden className="size-4 text-ink-muted" />
          </div>
          <p className="text-[17px] font-bold text-ink numeric">
            {jpDate(organization.establishedDate)}
          </p>
          <p className="text-xs text-ink-muted">活動歴 {years}年目</p>
        </div>
      </div>
    </div>
  );
}
