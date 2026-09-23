"use client";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { FavoritesSection } from "@/components/mypage/favorites-section";
import { RequireLogin } from "@/components/mypage/require-login";

/** お気に入り施設一覧画面の本体。未ログインなら RequireLogin がログイン画面へ誘導する */
export function FavoritesClient() {
  return (
    <RequireLogin redirectTo="/mypage/favorites">
      {(user) => (
        <div className="flex w-full flex-col items-start gap-space-lg lg:flex-row">
          <AccountSidebar user={user} />
          <div className="w-full min-w-0 flex-1">
            <FavoritesSection />
          </div>
        </div>
      )}
    </RequireLogin>
  );
}
