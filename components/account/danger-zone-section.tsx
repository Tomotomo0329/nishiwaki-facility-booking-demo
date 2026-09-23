import { useRouter } from "next/navigation";
import { AlertTriangle, UserX } from "lucide-react";

import { useAuth } from "@/lib/auth-context";

/** アカウント削除。デモのため実際の削除は行わず、確認後にログアウトしてトップへ戻す */
export function DangerZoneSection() {
  const router = useRouter();
  const { logout } = useAuth();

  function handleDelete() {
    const ok = window.confirm(
      "本当に退会しますか？（デモのため実際のデータは削除されず、ログアウトのみ行われます）",
    );
    if (!ok) return;
    logout();
    router.push("/");
  }

  return (
    <section className="rounded-xl bg-danger-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="flex flex-col gap-space-md md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-space-xs text-danger">
            <AlertTriangle aria-hidden className="size-[22px]" />
            <h2 className="text-h3 text-danger">アカウントの削除・退会</h2>
          </div>
          <p className="max-w-2xl text-caption leading-relaxed text-ink-muted">
            予約中の施設がある場合は退会できません。アカウントを削除すると、過去の予約履歴や登録情報はすべて削除され、復元することはできません。
          </p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="flex min-h-[48px] w-full shrink-0 items-center justify-center gap-space-xs rounded-lg bg-danger px-space-lg text-body-bold text-white shadow-[var(--shadow-card)] transition-colors hover:bg-[#93000a] md:w-auto"
        >
          <UserX aria-hidden className="size-5" />
          アカウントを削除する
        </button>
      </div>
    </section>
  );
}
