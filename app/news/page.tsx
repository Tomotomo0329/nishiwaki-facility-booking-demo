import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Megaphone } from "lucide-react";

import { NoticeToneBadge } from "@/components/news/notice-tone-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { notices } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "お知らせ一覧 | 西脇市 公共施設予約システム",
  description: "西脇市公共施設予約システムからのお知らせ・臨時休館情報・抽選受付情報の一覧です。",
};

export default function NewsListPage() {
  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[900px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb items={[{ label: "トップ", href: "/" }, { label: "お知らせ" }]} />
          </div>

          <div className="mb-space-lg">
            <h1 className="flex items-center gap-2 text-h1-mobile text-primary md:text-h1">
              <Megaphone aria-hidden className="size-7 text-primary" />
              お知らせ一覧
            </h1>
            <p className="mt-1 text-body text-ink-muted">
              抽選受付・臨時休館・各種イベントなど、西脇市公共施設予約システムからのお知らせです。
            </p>
          </div>

          <ul className="rounded-xl bg-surface border border-line shadow-[var(--shadow-card)] divide-y divide-line overflow-hidden">
            {notices.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/news/${n.id}`}
                  className="group flex flex-col gap-space-sm p-space-md hover:bg-canvas transition-colors sm:flex-row sm:items-center"
                >
                  <span className="flex items-center gap-3 shrink-0">
                    <time className="text-caption text-ink-muted numeric">{n.date}</time>
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
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
