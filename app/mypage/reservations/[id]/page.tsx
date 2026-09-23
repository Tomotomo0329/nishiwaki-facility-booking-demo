import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReservationDetailClient } from "@/components/mypage/reservation-detail-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { demoReservations, getReservationById } from "@/lib/reservations";

export function generateStaticParams() {
  return demoReservations.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const reservation = getReservationById(id);
  if (!reservation) return { title: "予約が見つかりません" };
  return {
    title: `予約詳細・入館用QRコード | 西脇市 公共施設予約システム`,
    description: "予約内容の詳細確認と、入館用QRコードの表示ができます。",
  };
}

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = getReservationById(id);
  if (!reservation) notFound();

  return (
    <>
      <SiteHeader />

      <main className="w-full flex-1 pt-[100px]">
        <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter">
          <div className="mb-space-md">
            <Breadcrumb
              items={[
                { label: "マイページ", href: "/mypage" },
                { label: "予約一覧", href: "/mypage/reservations" },
                { label: reservation.permitNumber },
              ]}
            />
          </div>

          <ReservationDetailClient reservation={reservation} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
