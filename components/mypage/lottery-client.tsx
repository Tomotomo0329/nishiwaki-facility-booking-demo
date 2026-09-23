"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { LotterySection } from "@/components/mypage/lottery-section";
import { RequireLogin } from "@/components/mypage/require-login";

/** 抽選申込一覧画面の本体。未ログインなら RequireLogin がログイン画面へ誘導する */
export function LotteryClient() {
  return (
    <RequireLogin redirectTo="/mypage/lottery">
      {(user) => (
        <div className="flex w-full flex-col items-start gap-space-lg lg:flex-row">
          <AccountSidebar user={user} />
          <div className="w-full min-w-0 flex-1">
            <LotterySection />
          </div>
        </div>
      )}
    </RequireLogin>
  );
}
