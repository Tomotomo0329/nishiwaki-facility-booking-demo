import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronRight,
  ExternalLink,
  Zap,
} from "lucide-react";

import { FacilityCard } from "@/components/facility-card";
import { HeroSearchForm } from "@/components/home/hero-search-form";
import { NoticeToneBadge } from "@/components/news/notice-tone-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SectionTitle } from "@/components/ui/section-title";
import { SlotChip, SlotDot } from "@/components/ui/slot-chip";
import { slotLabels } from "@/lib/availability";
import { buildWeeklyStrip, notices, popularFacilities, purposes } from "@/lib/demo-data";

export default function Home() {
  const week = buildWeeklyStrip();

  return (
    <>
      <SiteHeader />

      <main className="flex-1 w-full pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile md:px-gutter py-space-lg">
          {/* ============================ ヒーロー ============================ */}
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-surface via-surface to-primary-surface/50 border border-line p-space-lg md:p-space-xl mb-space-xl">
            {/* 播州織の経糸・緯糸を模した装飾グリッド */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-[0.07] [background-image:radial-gradient(#16386b_1px,transparent_1px),linear-gradient(to_right,#16386b_1px,transparent_1px),linear-gradient(to_bottom,#16386b_1px,transparent_1px)] [background-size:24px_24px,12px_12px,12px_12px]"
            />

            <div className="relative z-10 mx-auto max-w-5xl flex flex-col items-center text-center">
              <p className="inline-flex items-center gap-space-xs px-3 py-1 mb-space-sm rounded-full bg-primary/10 text-primary text-caption-bold">
                <Building2 aria-hidden className="size-4" />
                兵庫県西脇市 公式施設予約ポータル
              </p>

              <h1 className="text-h1-mobile md:text-h1 text-primary mb-space-xs">
                いつ、なにを、しますか。
              </h1>
              <p className="text-lead text-ink-muted max-w-2xl mb-space-xl">
                西脇市の体育館・グラウンド・研修室を、オンラインで予約できます。
              </p>

              {/* ------------------------ 検索カード ------------------------ */}
              <HeroSearchForm />

              {/* ---------------------- 人気の目的チップ ---------------------- */}
              <div className="w-full mt-space-md flex items-center gap-space-xs overflow-x-auto pb-2">
                <span className="flex items-center gap-1 mr-1 text-caption-bold text-ink-muted whitespace-nowrap">
                  <Zap aria-hidden className="size-4" />
                  人気の目的:
                </span>
                <div className="flex gap-2">
                  {purposes.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="px-3 py-1.5 rounded-full bg-canvas border border-line text-caption text-ink whitespace-nowrap hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ============================ 人気の施設 ============================ */}
          <section className="mb-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
              <SectionTitle
                title="人気の施設"
                description="西脇市民によく利用されている施設"
              />
              <Link
                href="/facilities"
                className="group mt-2 md:mt-0 flex items-center gap-1 text-caption-bold text-primary hover:underline"
              >
                施設一覧をすべてみる
                <ArrowRight
                  aria-hidden
                  className="size-4 group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {popularFacilities.map((f) => (
                <li key={f.slug}>
                  <FacilityCard facility={f} />
                </li>
              ))}
            </ul>
          </section>

          {/* ========================== 今週の空き状況 ========================== */}
          <section className="mb-space-xl rounded-xl bg-surface border border-line shadow-[var(--shadow-card)] p-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm mb-space-md pb-space-sm border-b border-line">
              <SectionTitle
                title="今週の空き状況"
                description="主要体育施設の週間予約ステータス（総合市民センター 体育館）"
              />
              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="flex items-center gap-4 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <SlotDot state="open" />
                    空き枠あり
                  </span>
                  <span className="flex items-center gap-1">
                    <SlotDot state="booked" />
                    満室
                  </span>
                </div>
                <Link
                  href="/calendar?facility=sogo-shimin-gym"
                  className="group flex items-center gap-1 text-caption-bold text-primary hover:underline"
                >
                  月間カレンダーで見る
                  <ArrowRight
                    aria-hidden
                    className="size-4 group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-space-sm">
              {week.map((day) => (
                <li
                  key={day.label}
                  className="flex flex-col rounded-lg bg-canvas border border-line p-space-sm text-center"
                >
                  <p className="mb-2 pb-1 border-b border-line">
                    <span className="block text-sm font-bold numeric">
                      {day.label}
                    </span>
                    <span
                      className={`text-xs ${day.isRed ? "text-danger" : "text-ink-muted"}`}
                    >
                      {day.weekday}
                    </span>
                  </p>

                  <div className="flex flex-col gap-1.5">
                    {day.slots.map((slot) => (
                      <SlotChip
                        key={slot.id}
                        state={slot.state}
                        suffix={slotLabels[slot.id]}
                        srLabel={`${day.label} ${slotLabels[slot.id]}`}
                      />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ============================= お知らせ ============================= */}
          <section className="mb-space-lg">
            <div className="flex items-center justify-between mb-space-md">
              <SectionTitle title="お知らせ" />
              <Link
                href="/news"
                className="group flex items-center gap-1 text-caption-bold text-primary hover:underline"
              >
                すべてのお知らせ
                <ArrowRight
                  aria-hidden
                  className="size-4 group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>

            <ul className="rounded-xl bg-surface border border-line shadow-[var(--shadow-card)] divide-y divide-line overflow-hidden">
              {notices.map((n) => (
                <li key={n.id}>
                  <Link
                    href={`/news/${n.id}`}
                    className="group flex flex-col sm:flex-row sm:items-center gap-space-sm p-space-md hover:bg-canvas transition-colors"
                  >
                    <span className="flex items-center gap-3 shrink-0">
                      <time className="text-caption text-ink-muted numeric">
                        {n.date}
                      </time>
                      <NoticeToneBadge tone={n.tone} label={n.label} />
                    </span>
                    <span className="flex-1 text-body text-ink group-hover:text-primary transition-colors">
                      {n.title}
                    </span>
                    <ChevronRight
                      aria-hidden
                      className="size-5 text-ink-subtle group-hover:text-primary group-hover:translate-x-1 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* ========================= 初めての方へ ========================= */}
          <section className="mb-space-xl rounded-xl bg-gradient-to-r from-primary to-primary-hover text-on-primary shadow-[var(--shadow-card)] p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <BadgeCheck aria-hidden className="size-5 text-ok-line" />
                <h3 className="text-h3 text-on-primary">
                  初めてご利用になる方へ
                </h3>
              </div>
              <p className="text-caption text-on-primary/80">
                西脇市公共施設予約システムの利用者登録手順や、抽選申込の流れをご確認いただけます。
              </p>
            </div>

            <div className="flex items-center gap-space-sm shrink-0">
              <Link
                href="/guide"
                className="min-h-[44px] px-5 py-2 rounded-lg bg-surface text-primary text-caption-bold flex items-center gap-1 hover:bg-primary-surface transition-colors shadow-[var(--shadow-card)]"
              >
                ご利用ガイド
                <ExternalLink aria-hidden className="size-4" />
              </Link>
              <Link
                href="/fees"
                className="min-h-[44px] px-5 py-2 rounded-lg bg-white/10 text-on-primary border border-on-primary/20 text-caption-bold flex items-center gap-1 hover:bg-white/20 transition-colors"
              >
                料金表を見る
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
