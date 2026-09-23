"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, X } from "lucide-react";

import { NotificationBell } from "@/components/notifications/notification-bell";
import { useAuth } from "@/lib/auth-context";

// マイページはアカウントアイコンから行けるので、ナビには重複して出さない。
// 予約・抽選の結果はナビの文字リンクではなく、通知ベル（ログイン時のみ表示）で知らせる
const nav = [
  { label: "施設をさがす", href: "/facilities" },
  { label: "空き状況", href: "/calendar" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { isLoggedIn, user } = useAuth();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // ページ遷移したらドロワーを閉じる（レンダー中に前回の pathname と比較して調整する。
  // useEffect 内で setState すると再レンダーが連鎖するため使わない）
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (drawerOpen) setDrawerOpen(false);
  }

  // ドロワーを開いている間は背景スクロールを止め、Escape キーで閉じられるようにする
  useEffect(() => {
    if (!drawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface border-b border-line shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* デモ版であることの常設表示（開発方針 §0） */}
      <div className="bg-primary text-on-primary">
        <p className="mx-auto max-w-[1200px] px-gutter-mobile md:px-gutter py-1 text-[12px] leading-5 text-center md:text-left text-on-primary/90">
          これはデモです。予約は成立せず、データはこのブラウザ内にのみ保存されます。施設画像はイメージです。
        </p>
      </div>

      <div className="h-[72px] mx-auto max-w-[1200px] px-gutter-mobile md:px-gutter flex items-center justify-between">
        {/* ロゴ・アプリ名は常に表示する */}
        <div className="flex items-center gap-space-md min-w-0">
          {/* next/image の自動最適化（sharp 未導入時のフォールバック）がこの PNG を
              パレット化して透過を潰してしまうため、元ファイルをそのまま配信する */}
          <Image
            src="/images/facilities/logo.png"
            alt=""
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 shrink-0 object-contain"
          />
          <Link
            href="/"
            className="text-h3 text-primary tracking-tight rounded-sm truncate"
          >
            <span className="hidden sm:inline">西脇市 </span>公共施設予約
          </Link>
        </div>

        <div className="flex items-center gap-space-sm md:gap-space-lg">
          <nav className="hidden md:flex items-center gap-space-lg">
            {nav.map((item) => {
              const current = pathname?.startsWith(item.href) ?? false;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={
                    current
                      ? "py-1 pb-1 text-caption-bold text-primary border-b-2 border-primary transition-colors"
                      : "py-1 text-caption text-ink-muted hover:text-ink transition-colors"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 通知ベル（予約・抽選の結果を知らせる。ログイン時のみ、モバイルでも常に見える位置に） */}
          {isLoggedIn ? <NotificationBell /> : null}

          {/* ハンバーガーメニュー（モバイルのみ。アカウントアイコンはこの外に残す） */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="メニューを開く"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
            className="flex size-10 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink transition-colors md:hidden"
          >
            <Menu aria-hidden className="size-6" />
          </button>

          {/* アカウントアイコン／ログインボタンは常に表示する */}
          {isLoggedIn && user ? (
            <div className="flex items-center gap-space-sm">
              <Link
                href="/mypage"
                className="group hidden sm:flex flex-col items-end leading-tight rounded-sm"
              >
                <span className="text-caption-bold text-ink group-hover:text-primary transition-colors">
                  {user.name}
                </span>
                <span className="text-xs text-primary underline-offset-2 group-hover:underline">
                  マイページ
                </span>
              </Link>
              <Link
                href="/mypage"
                aria-label="マイページ"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-hover transition-colors"
              >
                <User aria-hidden className="size-[18px]" />
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center min-h-[44px] px-4 sm:px-5 py-2.5 rounded-lg bg-primary text-on-primary text-caption-bold hover:bg-primary-hover transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>

      {/* ---------------- モバイル用ドロワー ---------------- */}
      {drawerOpen ? (
        <div
          aria-hidden
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      ) : null}

      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        inert={!drawerOpen}
        className={`fixed inset-y-0 right-0 z-50 w-[min(280px,80vw)] transform bg-surface shadow-[var(--shadow-raised)] transition-transform duration-200 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-line px-space-md">
          <span className="text-h3 text-ink">メニュー</span>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="メニューを閉じる"
            className="flex size-10 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
          >
            <X aria-hidden className="size-6" />
          </button>
        </div>

        <nav aria-label="メニュー" className="flex flex-col gap-1 p-space-md">
          {nav.map((item) => {
            const current = pathname?.startsWith(item.href) ?? false;
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={current ? "page" : undefined}
                onClick={() => setDrawerOpen(false)}
                className={
                  current
                    ? "flex min-h-[44px] items-center rounded-lg bg-primary-surface px-space-md text-caption-bold text-primary"
                    : "flex min-h-[44px] items-center rounded-lg px-space-md text-body text-ink hover:bg-canvas transition-colors"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
