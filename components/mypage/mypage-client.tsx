"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { AuthMethodsSection } from "@/components/account/auth-methods-section";
import { DangerZoneSection } from "@/components/account/danger-zone-section";
import { LogoutSection } from "@/components/account/logout-section";
import { NotificationSettingsSection } from "@/components/account/notification-settings-section";
import { ProfileSection } from "@/components/account/profile-section";
import { RegistrationInfoSection } from "@/components/account/registration-info-section";
import { RequireLogin } from "@/components/mypage/require-login";
import { OrganizationsSummaryCard } from "@/components/organization/organizations-summary-card";

/** マイページ画面の本体（プロフィール・認証方法・通知設定などをまとめた個人ページ）。未ログインなら RequireLogin がログイン画面へ誘導する */
export function MypageClient() {
  return (
    <RequireLogin redirectTo="/mypage">
      {(user) => (
        <div className="flex w-full flex-col items-start gap-space-lg lg:flex-row">
          <AccountSidebar user={user} />
          <div className="flex w-full min-w-0 flex-1 flex-col gap-space-xl">
            <ProfileSection user={user} />
            <AuthMethodsSection />
            <NotificationSettingsSection />
            <RegistrationInfoSection />
            <OrganizationsSummaryCard />
            <LogoutSection />
            <DangerZoneSection />
          </div>
        </div>
      )}
    </RequireLogin>
  );
}
