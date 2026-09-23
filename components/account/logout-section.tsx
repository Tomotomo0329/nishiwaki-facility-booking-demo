import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/lib/auth-context";

/** このブラウザからのログアウト。アカウント削除の直前に置き、削除と混同しないよう分ける */
export function LogoutSection() {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="flex flex-col gap-space-md md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-h3 text-ink">ログアウト</h2>
          <p className="mt-1 text-caption text-ink-muted">
            このブラウザからログアウトします。登録情報や予約履歴は残ったままです。
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-[48px] w-full shrink-0 items-center justify-center gap-space-xs rounded-lg bg-canvas px-space-lg text-body-bold text-ink transition-colors hover:bg-line/60 md:w-auto"
        >
          <LogOut aria-hidden className="size-5" />
          ログアウトする
        </button>
      </div>
    </section>
  );
}
