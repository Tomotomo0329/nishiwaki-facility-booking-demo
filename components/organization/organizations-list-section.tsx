import { UsersRound } from "lucide-react";

import { OrganizationCard } from "@/components/organization/organization-card";
import { demoOrganizations } from "@/lib/organization";

/** マイページの中心コンテンツ。所属している団体の一覧を表示する */
export function OrganizationsListSection() {
  return (
    <section className="flex flex-col gap-space-md">
      <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)]">
        <h2 className="flex items-center gap-space-xs text-h2 text-primary">
          <UsersRound aria-hidden className="size-6 text-primary" />
          団体情報・メンバー管理
        </h2>
        <p className="mt-1 text-caption text-ink-muted">
          所属している団体の一覧です。詳細から情報確認・メンバー管理ができます。
        </p>
      </div>

      {demoOrganizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-space-sm rounded-xl border border-dashed border-line bg-surface p-space-xl text-center">
          <UsersRound aria-hidden className="size-8 text-ink-subtle" />
          <p className="text-body-bold text-ink">所属している団体はありません</p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {demoOrganizations.map((organization) => (
            <OrganizationCard key={organization.id} organization={organization} />
          ))}
        </div>
      )}
    </section>
  );
}
