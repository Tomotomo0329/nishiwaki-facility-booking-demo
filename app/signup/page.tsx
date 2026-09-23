import Link from "next/link";
import type { Metadata } from "next";
import { Building2, DoorOpen, Info, ShieldCheck, Timer } from "lucide-react";

import { AuthHeroPanel } from "@/components/auth/auth-hero-panel";
import { SignupWizard } from "@/components/auth/signup-wizard";
import { safeNextPath } from "@/lib/url";

export const metadata: Metadata = {
  title: "アカウント新規登録 | 西脇市 公共施設予約システム",
  description:
    "西脇市公共施設予約システムのアカウントを新規登録します。登録後、体育館・会議室・テニスコートなどをオンライン予約できます。",
};

const FEATURES = [
  { icon: DoorOpen, label: "市内団体・個人の予約優遇対応" },
  { icon: Timer, label: "24時間いつでもWeb申請" },
  { icon: ShieldCheck, label: "JIS X 8341-3 AA 適合・安心設計" },
];

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  return (
    // ログイン画面と同じ 50/50 グリッド構成（開発方針 §0 のとおり同一トーンで揃える）
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* ==================== 左: ビジュアル ==================== */}
      <AuthHeroPanel
        heading={
          <>
            西脇市の公共施設を、
            <br />
            もっと身近に。
          </>
        }
        description="播州織のまち・日本のへそ 西脇市の公共スポーツ・文化施設予約ポータル。いつでもスムーズにWeb申請いただけます。"
        features={FEATURES}
      />

      {/* ==================== 右: 登録フォームパネル ==================== */}
      <section className="flex min-w-0 items-center justify-center bg-surface px-gutter-mobile py-space-xl md:px-space-xl">
        <div className="w-full max-w-[560px] min-w-0">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Building2 aria-hidden className="size-6" />
            </span>
            <span>
              <span className="block text-caption-bold text-primary">西脇市</span>
              <span className="block text-h3 text-ink">公共施設予約システム</span>
            </span>
          </Link>

          <h1 className="mt-space-lg text-h2 text-ink">アカウント新規登録（市民・利用者）</h1>
          <p className="mt-1 mb-space-lg text-body text-ink-muted">
            アカウントを作成して、西脇市内の体育館・会議室・テニスコートを予約しましょう。
          </p>

          <SignupWizard nextPath={nextPath !== "/" ? nextPath : undefined} />

          {/* 窓口利用者向けの案内 */}
          <div className="mt-space-md flex gap-2 rounded-lg bg-canvas border border-line p-space-md">
            <Info aria-hidden className="size-5 shrink-0 text-ink-muted" />
            <div className="text-caption text-ink-muted">
              <p>
                ※
                施設窓口で発行された「西脇市施設利用者カード」をお持ちの方は、アカウント登録後にマイページよりカード番号連携が可能です。
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

          {/* デモ表示（開発方針 §0） */}
          <p className="mt-space-md rounded-lg border border-dashed border-primary/40 bg-primary-surface px-4 py-3 text-caption text-primary">
            これはデモです。実際のメール送信・本人確認は行いません。入力形式さえ正しければ、どの値でも登録を完了できます。
          </p>
        </div>
      </section>
    </div>
  );
}
