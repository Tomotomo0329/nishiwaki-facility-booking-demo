"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Info,
  Phone,
  Route,
  Search,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import type { Facility } from "@/lib/demo-data";

/** 登録完了画面（Stitch「メール認証・登録完了」参考） */
export function SignupComplete({
  name,
  kana,
  email,
  nextPath,
  facilities,
}: {
  name: string;
  kana: string;
  email: string;
  nextPath: string;
  facilities: Facility[];
}) {
  const { login, user } = useAuth();

  useEffect(() => {
    // デモのため実際の本人確認は行わない。認証リンクのクリック＝ログイン状態にする
    login();
  }, [login]);

  const displayName = name || user?.name || "西脇 太郎";
  const displayKana = kana || user?.kana || "ニシワキ タロウ";
  const displayEmail = email || user?.email || "taro.nishiwaki@example.jp";
  const memberNo = user?.memberNo ?? "U-004721";
  // デモでは入力内容にかかわらず、以降の画面は共通のデモ用アカウントとして表示される
  const isDemoAccount = user ? displayName !== user.name : false;

  return (
    <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12 lg:items-start">
      {/* ==================== 左（メイン）: お祝い・施設案内 ==================== */}
      <div className="space-y-space-lg lg:col-span-7">
        <section className="relative overflow-hidden rounded-xl bg-surface p-space-lg shadow-[var(--shadow-card)] sm:p-space-xl">
          <div
            aria-hidden
            className="absolute -right-12 -top-12 size-48 rounded-full bg-ok-surface opacity-70 blur-2xl"
          />
          <div className="relative flex flex-col items-start gap-space-md sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="flex size-16 items-center justify-center rounded-full bg-ok-surface text-ok sm:size-20">
                <Sparkles aria-hidden className="size-8 sm:size-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-primary text-on-primary shadow-[var(--shadow-card)]">
                <BadgeCheck aria-hidden className="size-4" />
              </div>
            </div>
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-ok-surface px-3 py-1 text-caption-bold text-ok">
                <span aria-hidden className="size-2 animate-ping rounded-full bg-ok" />
                本人認証完了・本登録有効
              </p>
              <h1 className="mt-1 text-h2 text-primary">アカウント作成が完了しました</h1>
            </div>
          </div>

          <div className="relative mt-space-md space-y-space-sm">
            <p className="text-lead text-ink">
              西脇市公共施設予約システムへようこそ、<span className="font-bold text-primary">{displayName}</span> 様。
            </p>
            <p className="text-body text-ink-muted">
              ご登録いただいたメールアドレス{" "}
              <span className="numeric rounded bg-canvas px-2 py-0.5 font-bold text-ink">{displayEmail}</span>{" "}
              宛てに登録完了の控えを送信いたしました。
            </p>
            {isDemoAccount ? (
              <p className="flex items-start gap-1.5 rounded-lg border border-dashed border-primary/40 bg-primary-surface px-3 py-2 text-caption text-primary">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                これはデモです。以降の画面はデモ用アカウント「{user?.name}」として表示されます。
              </p>
            ) : null}
          </div>

          <div className="relative mt-space-lg flex flex-col gap-space-sm sm:flex-row">
            <Link
              href={nextPath}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-space-lg text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover"
            >
              マイページへ進む
              <ArrowRight aria-hidden className="size-5" />
            </Link>
            <Link
              href="/facilities"
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-canvas px-space-lg text-body-bold text-ink transition-colors hover:bg-line/60"
            >
              <Search aria-hidden className="size-5" />
              施設をさがす・空き枠を確認
            </Link>
          </div>
        </section>

        {/* ---------------- 施設案内 ---------------- */}
        <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)]">
          <div className="mb-space-sm flex items-center justify-between">
            <h2 className="text-h3 text-ink">市民利用施設のご案内</h2>
            <span className="rounded-full bg-ok-surface px-2.5 py-1 text-xs font-bold text-ok">即時予約対象</span>
          </div>
          <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
            {facilities.map((f) => (
              <Link
                key={f.slug}
                href={`/facilities/${f.slug}`}
                className="group relative block aspect-video overflow-hidden rounded-lg bg-canvas"
              >
                <Image
                  src={f.image}
                  alt={f.imageAlt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/85 via-primary/10 to-transparent p-space-sm">
                  <span className="text-caption-bold text-white">{f.name}</span>
                  <span className="text-xs text-white/85">{f.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ==================== 右: アカウント情報・次のステップ ==================== */}
      <div className="space-y-space-lg lg:col-span-5">
        <section className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between bg-canvas px-space-lg py-space-sm">
            <h2 className="flex items-center gap-1.5 text-h3 text-ink">
              <BadgeCheck aria-hidden className="size-5 text-primary" />
              登録アカウント情報
            </h2>
            <span className="rounded-full bg-ok-surface px-2.5 py-0.5 text-xs font-bold text-ok">利用可能</span>
          </div>
          <dl className="space-y-space-sm p-space-lg">
            <SummaryRow label="氏名 / フリガナ">
              {displayName} <span className="text-caption text-ink-muted">（{displayKana}）</span>
            </SummaryRow>
            <SummaryRow label="メールアドレス">
              <span className="numeric">{displayEmail}</span>
            </SummaryRow>
            <SummaryRow label="ユーザーID / 整理番号">
              <span className="numeric font-bold text-primary">{memberNo}</span>
            </SummaryRow>
            <SummaryRow label="アカウントステータス">
              <span className="flex items-center justify-end gap-1.5">
                <span aria-hidden className="size-2 rounded-full bg-ok" />
                有効（本登録完了）
              </span>
            </SummaryRow>
          </dl>
          <div className="mx-space-lg mb-space-lg flex items-start gap-2 rounded-lg bg-canvas p-space-sm text-xs text-ink-muted">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-subtle" />
            整理番号は各体育館の受付窓口や自動受付機での本人照会にも使用できます。大切にお控えください。
          </div>
        </section>

        <section className="rounded-xl bg-surface p-space-lg shadow-[var(--shadow-card)]">
          <h3 className="mb-space-md flex items-center gap-1.5 text-h3 text-ink">
            <Route aria-hidden className="size-5 text-ok" />
            今後のご利用ステップ
          </h3>
          <div className="space-y-space-sm">
            <GuideItem n={1} title="即時予約可能な一般枠の予約">
              今すぐ「空き枠検索」から総合市民センター・総合体育館・地域公民館等の通常利用予約・抽選申込がご利用いただけます。
            </GuideItem>
            <GuideItem n={2} title="市内団体登録・使用料減免申請">
              スポーツ少年団、文化サークル、市民ボランティア等の優先抽選・使用料減免を受けるには、マイページ内の「団体情報・メンバー管理」から申請してください。
              <Link
                href="/mypage/organization"
                className="mt-1.5 flex w-fit items-center gap-1 text-caption-bold text-primary hover:underline"
              >
                団体登録の手続き案内を見る
                <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            </GuideItem>
          </div>
        </section>
      </div>

      {/* ==================== 下: お問い合わせ ==================== */}
      <div className="flex flex-col gap-space-md rounded-xl bg-canvas p-space-lg shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between lg:col-span-12">
        <div className="flex items-start gap-space-sm">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface text-primary shadow-[var(--shadow-card)]">
            <Info aria-hidden className="size-5" />
          </span>
          <div>
            <h4 className="text-body-bold text-ink">ご登録・予約手続きに関するお問い合わせ</h4>
            <p className="mt-0.5 text-caption text-ink-muted">
              ご不明な点がある場合は、西脇市役所 まちづくり課 または 総合市民センターまでお気軽にお問い合わせください。
            </p>
          </div>
        </div>
        <a
          href="tel:0795-22-3111"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-surface px-4 py-2.5 text-body-bold text-primary shadow-[var(--shadow-card)] hover:underline"
        >
          <Phone aria-hidden className="size-[18px] text-ok" />
          <span className="numeric">0795-22-3111</span>
          <span className="text-xs font-normal text-ink-muted">平日 8:30〜17:15</span>
        </a>
      </div>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-0.5 sm:flex-row sm:items-center">
      <dt className="text-caption text-ink-muted">{label}</dt>
      <dd className="text-right text-body-bold text-ink">{children}</dd>
    </div>
  );
}

function GuideItem({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-canvas p-space-md">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary numeric">
          {n}
        </span>
        <h4 className="text-body-bold text-primary">{title}</h4>
      </div>
      <div className="pl-8 text-caption text-ink-muted leading-relaxed">{children}</div>
    </div>
  );
}
