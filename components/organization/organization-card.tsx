import Link from "next/link";
import { ArrowRight, CalendarClock, ShieldCheck, UsersRound } from "lucide-react";

import { demoMembersByOrganization, type Organization } from "@/lib/organization";

const jpDate = (d: Date) => `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

/** マイページの団体一覧に並ぶ1件分のカード */
export function OrganizationCard({ organization }: { organization: Organization }) {
  const memberCount = demoMembersByOrganization[organization.id]?.length ?? 0;
  const isRepresentative = organization.myRole === "representative";

  return (
    <article className="flex flex-col gap-space-md rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-space-md">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
          <ShieldCheck aria-hidden className="size-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/mypage/organization/${organization.id}`}
              className="text-h3 text-ink hover:text-primary hover:underline"
            >
              {organization.name}
            </Link>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                isRepresentative ? "bg-primary-surface text-primary" : "bg-canvas text-ink-muted"
              }`}
            >
              {isRepresentative ? "代表者" : "メンバー"}
            </span>
          </div>
          <p className="mt-0.5 text-caption text-ink-muted">{organization.category}</p>
          <div className="mt-space-sm flex flex-wrap items-center gap-x-space-md gap-y-1 text-caption text-ink-muted">
            <span className="flex items-center gap-1.5">
              <UsersRound aria-hidden className="size-4" />
              メンバー {memberCount}名
            </span>
            <span className="flex items-center gap-1.5 numeric">
              <CalendarClock aria-hidden className="size-4" />
              登録有効期限: {jpDate(organization.registrationExpiry)}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/mypage/organization/${organization.id}`}
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-canvas px-4 text-caption-bold text-ink transition-colors hover:bg-line/60"
      >
        詳細を見る
        <ArrowRight aria-hidden className="size-4" />
      </Link>
    </article>
  );
}
