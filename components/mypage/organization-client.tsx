"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { OrganizationSection } from "@/components/organization/organization-section";
import { RequireLogin } from "@/components/mypage/require-login";

/** 団体詳細（団体情報・メンバー管理）画面の本体。未ログインなら RequireLogin がログイン画面へ誘導する */
export function OrganizationClient({ organizationId }: { organizationId: string }) {
  return (
    <RequireLogin redirectTo={`/mypage/organization/${organizationId}`}>
      {(user) => (
        <div className="flex w-full flex-col items-start gap-space-lg lg:flex-row">
          <AccountSidebar user={user} />
          <div className="w-full min-w-0 flex-1">
            <OrganizationSection organizationId={organizationId} />
          </div>
        </div>
      )}
    </RequireLogin>
  );
}
