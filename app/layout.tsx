import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/lib/auth-context";
import { NotificationsProvider } from "@/lib/notifications";

/**
 * フォントについて
 *
 * next/font/google は使わない。
 * Noto Sans JP は日本語サブセットが数百ファイルあり、ビルド時に
 * fonts.gstatic.com から全部取得しようとしてタイムアウトする。
 * また方針書 §6 の「オフラインでも動く / 商談先のネットワークに
 * 依存しない」という原則にも反する。
 *
 * 当面はOS標準の日本語ゴシックを使う（globals.css の --font-sans）。
 * 字形を Noto Sans JP に厳密に合わせる必要が出たら、
 * woff2 を public/fonts/ に置いて next/font/local に切り替える。
 */

export const metadata: Metadata = {
  title: "西脇市 公共施設予約システム",
  description:
    "西脇市の体育館・グラウンド・研修室をオンラインで予約できます。日付と目的から空き状況をすぐに確認できます。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-canvas text-ink">
        <AuthProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
