import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Info, Phone } from "lucide-react";

import { NoticeToneBadge } from "@/components/news/notice-tone-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getNotice, notices } from "@/lib/demo-data";

export function generateStaticParams() {
  return notices.map((n) => ({ id: n.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const notice = getNotice(id);
  if (!notice) return { title: "お知らせが見つかりません" };
  return {
    title: `${notice.title} | 西脇市 公共施設予約システム`,
    description: notice.body[0],
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = getNotice(id);
  if (!notice) notFound();

  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[900px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb
              items={[
                { label: "トップ", href: "/" },
                { label: "お知らせ", href: "/news" },
                { label: notice.title },
              ]}
            />
          </div>

          <article className="rounded-xl bg-surface border border-line shadow-[var(--shadow-card)] p-space-lg md:p-space-xl">
            <div className="mb-space-sm flex items-center gap-3">
              <NoticeToneBadge tone={notice.tone} label={notice.label} />
              <time className="numeric text-caption text-ink-muted">{notice.date}</time>
            </div>

            <h1 className="text-h2 text-ink md:text-h1">{notice.title}</h1>

            <div className="mt-space-lg space-y-space-md border-t border-line pt-space-lg text-body leading-relaxed text-ink">
              {notice.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-space-lg flex gap-space-sm rounded-lg bg-canvas p-space-md">
              <Info aria-hidden className="size-5 shrink-0 text-ink-muted" />
              <div className="text-caption text-ink-muted">
                <p className="text-caption-bold text-ink">お問い合わせ</p>
                <p className="mt-0.5">西脇市総合市民センター</p>
                <a
                  href="tel:0795-22-3111"
                  className="mt-1 flex items-center gap-1.5 text-caption-bold text-primary hover:underline"
                >
                  <Phone aria-hidden className="size-4" />
                  <span className="numeric">0795-22-3111</span>
                </a>
              </div>
            </div>
          </article>

          <Link
            href="/news"
            className="mt-space-md inline-flex items-center gap-1.5 text-caption-bold text-primary hover:underline"
          >
            <ArrowLeft aria-hidden className="size-4" />
            お知らせ一覧へ戻る
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
