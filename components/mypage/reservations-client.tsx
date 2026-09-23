"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { ReservationsSection } from "@/components/mypage/reservations-section";
import { RequireLogin } from "@/components/mypage/require-login";

/** 予約一覧画面の本体。未ログインなら RequireLogin がログイン画面へ誘導する */
export function ReservationsClient() {
  return (
    <RequireLogin redirectTo="/mypage/reservations">
      {(user) => (
        <div className="flex w-full flex-col items-start gap-space-lg lg:flex-row">
          <AccountSidebar user={user} />
          <div className="w-full min-w-0 flex-1">
            <ReservationsSection />
          </div>
        </div>
      )}
    </RequireLogin>
  );
}
