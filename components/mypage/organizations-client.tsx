"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { OrganizationsListSection } from "@/components/organization/organizations-list-section";
import { RequireLogin } from "@/components/mypage/require-login";

/** 団体一覧画面の本体。未ログインなら RequireLogin がログイン画面へ誘導する */
export function OrganizationsClient() {
  return (
    <RequireLogin redirectTo="/mypage/organization">
      {(user) => (
        <div className="flex w-full flex-col items-start gap-space-lg lg:flex-row">
          <AccountSidebar user={user} />
          <div className="w-full min-w-0 flex-1">
            <OrganizationsListSection />
          </div>
        </div>
      )}
    </RequireLogin>
  );
}
