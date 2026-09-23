import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  BadgeCheck,
  BookOpen,
  ExternalLink,
  LayoutGrid,
  MapPin,
  Ruler,
  Train,
  Users,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionTitle } from "@/components/ui/section-title";
import { AmenityGrid } from "@/components/facility/amenity-grid";
import { BookingPanel } from "@/components/facility/booking-panel";
import { PhotoGallery } from "@/components/facility/photo-gallery";
import { RoomPriceTable } from "@/components/facility/room-price-table";
import { DEMO_TODAY } from "@/lib/availability";
import { facilityDetails, getFacilityDetail } from "@/lib/demo-data";

/** 施設は固定データなので全件を事前生成する（将来の静的書き出しに備える） */
export function generateStaticParams() {
  return Object.keys(facilityDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const facility = getFacilityDetail(slug);
  if (!facility) return { title: "施設が見つかりません" };
  return {
    title: `${facility.name} | 西脇市 公共施設予約システム`,
    description: facility.description.slice(0, 110),
  };
}

const TABS = [
  { label: "施設概要", icon: BadgeCheck, href: "#overview" },
  { label: "諸室・料金", icon: LayoutGrid, href: "#rooms" },
  { label: "アクセス", icon: Train, href: "#access" },
  { label: "利用案内", icon: BookOpen, href: "/guide" },
];

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const facility = getFacilityDetail(slug);
  if (!facility) notFound();

  // 選択中の日付。2026-09-20 は日曜のため夜間区分が閉じる
  const selectedDate = DEMO_TODAY;
  const primaryRoom = facility.rooms.find((r) => r.primary) ?? facility.rooms[0];

  return (
    <>
      <SiteHeader />

      <main className="flex-1 w-full pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile md:px-gutter py-space-lg">
          <div className="mb-space-md">
            <Breadcrumb
              items={[
                { label: "ホーム", href: "/" },
                { label: "施設をさがす", href: "/facilities" },
                { label: facility.name },
              ]}
            />
          </div>

          <div className="mb-space-lg">
            <PhotoGallery
              photos={facility.photos}
              photoCount={facility.photoCount}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-space-lg items-start">
            {/* ==================== 左カラム ==================== */}
            <div className="min-w-0">
              {/* バッジ */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary-surface px-2.5 py-1 text-xs font-bold text-primary">
                  {facility.category}
                </span>
                {facility.instantBooking ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-ok-line bg-ok-surface px-2.5 py-1 text-xs font-bold text-ok">
                    <BadgeCheck aria-hidden className="size-3.5" />
                    ネット即時予約対象
                  </span>
                ) : null}
                <span className="rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-ink-muted">
                  施設ID: <span className="numeric">{facility.facilityId}</span>
                </span>
              </div>

              <h1 className="mt-space-sm text-h1-mobile md:text-h1 text-ink">
                {facility.name}
              </h1>

              {/* メタ情報 */}
              <ul className="mt-space-sm flex flex-wrap items-center gap-x-space-lg gap-y-1 text-caption text-ink-muted">
                <li className="flex items-center gap-1.5">
                  <MapPin aria-hidden className="size-4" />
                  {facility.address}
                </li>
                <li className="flex items-center gap-1.5">
                  <Users aria-hidden className="size-4" />
                  {facility.headcountLabel}
                </li>
                <li className="flex items-center gap-1.5">
                  <Ruler aria-hidden className="size-4" />
                  <span className="numeric">{facility.sizeLabel}</span>
                </li>
              </ul>

              {/* タブ（現状はページ内アンカー） */}
              <nav
                aria-label="施設情報"
                className="mt-space-md flex gap-1 overflow-x-auto rounded-lg border border-line bg-surface p-1"
              >
                {TABS.map((tab, i) => (
                  <a
                    key={tab.label}
                    href={tab.href}
                    aria-current={i === 0 ? "true" : undefined}
                    className={`flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-lg px-4 text-caption-bold transition-colors ${
                      i === 0
                        ? "bg-primary-surface text-primary"
                        : "text-ink-muted hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    <tab.icon aria-hidden className="size-4" />
                    {tab.label}
                  </a>
                ))}
              </nav>

              {/* ---------------- 施設概要 ---------------- */}
              <section
                id="overview"
                className="mt-space-md scroll-mt-[120px] rounded-xl border border-line bg-surface p-space-lg"
              >
                <SectionTitle title="施設の特徴と設備" as="h3" />
                <p className="mt-space-sm text-body text-ink-muted">
                  {facility.description}
                </p>

                <h4 className="mt-space-lg mb-space-sm text-caption-bold text-ink">
                  主要設備・バリアフリー対応
                </h4>
                <AmenityGrid amenities={facility.amenities} />
              </section>

              {/* ---------------- 諸室・料金 ---------------- */}
              <section id="rooms" className="mt-space-xl scroll-mt-[120px]">
                <div className="mb-space-sm flex flex-col sm:flex-row sm:items-end justify-between gap-1">
                  <SectionTitle title="諸室一覧・利用料金表" as="h3" />
                  <p className="text-caption text-ink-muted">
                    ※ 1時間あたりの税込み基本料金
                  </p>
                </div>
                <RoomPriceTable
                  rooms={facility.rooms}
                  note={facility.pricingNote}
                />
              </section>

              {/* ---------------- アクセス ---------------- */}
              <section id="access" className="mt-space-xl scroll-mt-[120px]">
                <SectionTitle title="所在地・交通案内" as="h3" />
                <div className="mt-space-sm relative overflow-hidden rounded-xl border border-line">
                  <Image
                    src={facility.mapImage}
                    alt={`${facility.name}周辺の地図`}
                    width={1280}
                    height={1280}
                    className="h-[240px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm p-space-md">
                    <ul className="space-y-0.5 text-white">
                      {facility.access.map((a, i) => (
                        <li
                          key={a}
                          className={
                            i === 0 ? "text-body-bold" : "text-caption opacity-90"
                          }
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(facility.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 self-start sm:self-auto rounded-lg bg-surface px-4 text-caption-bold text-ink shadow-[var(--shadow-card)] hover:bg-canvas"
                    >
                      地図アプリ
                      <ExternalLink aria-hidden className="size-4" />
                    </a>
                  </div>
                </div>
              </section>
            </div>

            {/* ==================== 右カラム（追従） ==================== */}
            <aside className="lg:sticky lg:top-[116px]">
              <BookingPanel
                slug={facility.slug}
                roomLabel={facility.primaryRoomLabel}
                fee={primaryRoom.inCity}
                selectedDate={selectedDate}
                contact={facility.contact}
              />
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
