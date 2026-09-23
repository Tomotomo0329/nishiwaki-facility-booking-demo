import Link from "next/link";
import { ArrowRight, ChevronRight, UsersRound } from "lucide-react";

import { demoMembersByOrganization, demoOrganizations } from "@/lib/organization";

/** マイページ本体に表示する、所属団体のコンパクトな一覧（詳細は団体情報・メンバー管理へ） */
export function OrganizationsSummaryCard() {
  return (
    <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-space-sm">
        <h2 className="flex items-center gap-space-xs text-h2 text-primary">
          <UsersRound aria-hidden className="size-6 text-primary" />
          所属団体
        </h2>
        <Link
          href="/mypage/organization"
          className="group flex items-center gap-1 text-caption-bold text-primary hover:underline"
        >
          団体を管理する
          <ArrowRight
            aria-hidden
            className="size-4 group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>
      <p className="mb-space-md text-caption text-ink-muted">
        先行抽選の参加資格や使用料減免は、所属団体の登録状況に基づいて適用されます。
      </p>

      {demoOrganizations.length === 0 ? (
        <div className="rounded-lg bg-canvas p-space-md text-center text-caption text-ink-muted">
          所属している団体はありません
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {demoOrganizations.map((organization) => {
            const memberCount = demoMembersByOrganization[organization.id]?.length ?? 0;
            const isRepresentative = organization.myRole === "representative";
            return (
              <li key={organization.id}>
                <Link
                  href={`/mypage/organization/${organization.id}`}
                  className="-mx-space-sm flex items-center justify-between gap-space-sm rounded-lg px-space-sm py-space-sm transition-colors hover:bg-canvas"
                >
                  <div className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-body-bold text-ink">
                        {organization.name}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          isRepresentative
                            ? "bg-primary-surface text-primary"
                            : "bg-canvas text-ink-muted"
                        }`}
                      >
                        {isRepresentative ? "代表者" : "メンバー"}
                      </span>
                    </span>
                    <span className="text-xs text-ink-muted">
                      {organization.category} ・ メンバー {memberCount}名
                    </span>
                  </div>
                  <ChevronRight aria-hidden className="size-4 shrink-0 text-ink-subtle" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
