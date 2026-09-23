"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth, type DemoUser } from "@/lib/auth-context";

/**
 * マイページ配下（/mypage 以下）で共通利用する認証ゲート。
 *
 * ログイン状態は localStorage 依存のためサーバー側では判定できず、
 * クライアントで判定してから未ログインならログイン画面へリダイレクトする。
 */
export function RequireLogin({
  redirectTo,
  children,
}: {
  /** 未ログイン時の遷移先。ログイン後にここへ戻ってこられるよう /login の next に渡す */
  redirectTo: string;
  children: (user: DemoUser) => React.ReactNode;
}) {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(`/login?next=${encodeURIComponent(redirectTo)}`);
    }
  }, [isLoggedIn, router, redirectTo]);

  if (!isLoggedIn || !user) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-space-sm rounded-xl bg-surface p-space-xl text-center shadow-[var(--shadow-card)]">
        <Loader2 aria-hidden className="size-6 animate-spin text-primary" />
        <p className="text-body text-ink-muted">ログインへ移動しています…</p>
      </div>
    );
  }

  return <>{children(user)}</>;
}
