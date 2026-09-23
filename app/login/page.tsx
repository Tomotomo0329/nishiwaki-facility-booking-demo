import Link from "next/link";
import type { Metadata } from "next";
import { CalendarCheck, Clock, Info, Users, Building2 } from "lucide-react";

import { AuthHeroPanel } from "@/components/auth/auth-hero-panel";
import { LoginForm } from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/url";

export const metadata: Metadata = {
  title: "ログイン | 西脇市 公共施設予約システム",
  description:
    "西脇市公共施設予約システムにログインします。窓口発行の利用者カード番号でもログインできます。",
};

const FEATURES = [
  { icon: Clock, label: "24時間オンライン予約" },
  { icon: CalendarCheck, label: "リアルタイム空き枠確認" },
  { icon: Users, label: "団体・個人利用対応" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  return (
    // 左右は grid で 50/50 に固定する。
    // flex + flex-1 だと右カラムが伸びて左が min-content まで潰れ、
    // 文字が1文字ずつ折り返される。
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* ==================== 左: ビジュアル ==================== */}
      <AuthHeroPanel
        heading={
          <>
            西脇市の施設を、
            <br />
            かんたんに予約。
          </>
        }
        description="播州織のまち・日本のへそ 西脇市の公共スポーツ・文化施設予約ポータル"
        features={FEATURES}
      />

      {/* ==================== 右: 認証パネル ==================== */}
      <section className="flex min-w-0 items-center justify-center bg-surface px-gutter-mobile py-space-xl md:px-space-xl">
        <div className="w-full max-w-[420px] min-w-0">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Building2 aria-hidden className="size-6" />
            </span>
            <span>
              <span className="block text-caption-bold text-primary">西脇市</span>
              <span className="block text-h3 text-ink">公共施設予約システム</span>
            </span>
          </Link>

          <h1 className="mt-space-lg text-h2 text-ink">ログイン</h1>
          <p className="mt-1 mb-space-lg text-body text-ink-muted">
            {nextPath !== "/"
              ? "この先へ進むにはログインが必要です"
              : "アカウント情報をご入力ください"}
          </p>

          <LoginForm nextPath={nextPath} />

          {/* 窓口利用者向けの案内 */}
          <div className="mt-space-md flex gap-2 rounded-lg bg-canvas border border-line p-space-md">
            <Info aria-hidden className="size-5 shrink-0 text-ink-muted" />
            <div className="text-caption text-ink-muted">
              <p>
                ※
                施設窓口で発行された「利用者カード番号」をお持ちの方もこちらからログインできます。
              </p>
              <p className="mt-1 text-caption-bold text-ink">
                お問い合わせ: 総合市民センター（
                <a href="tel:0795-22-3111" className="numeric text-primary hover:underline">
                  0795-22-3111
                </a>
                ）
              </p>
            </div>
          </div>

          {/* デモ表示（開発方針 §0）*/}
          <p className="mt-space-md rounded-lg border border-dashed border-primary/40 bg-primary-surface px-4 py-3 text-caption text-primary">
            これはデモです。実際の認証は行いません。入力形式さえ正しければ、どの値でもログインできます。
          </p>
        </div>
      </section>
    </div>
  );
}
