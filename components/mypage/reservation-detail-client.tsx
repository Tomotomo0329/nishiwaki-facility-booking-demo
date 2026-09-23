"use client";

import { notFound } from "next/navigation";

import { AccountSidebar } from "@/components/account/account-sidebar";
import { ReservationDetailSection } from "@/components/mypage/reservation-detail-section";
import { RequireLogin } from "@/components/mypage/require-login";
import { getReservationFacility, type Reservation } from "@/lib/reservations";

/** 予約詳細画面の本体。未ログインなら RequireLogin がログイン画面へ誘導する */
export function ReservationDetailClient({ reservation }: { reservation: Reservation }) {
  const facility = getReservationFacility(reservation.facilitySlug);
  if (!facility) notFound();

  return (
    <RequireLogin redirectTo={`/mypage/reservations/${reservation.id}`}>
      {(user) => (
        <div className="flex w-full flex-col items-start gap-space-lg lg:flex-row">
          <AccountSidebar user={user} />
          <div className="w-full min-w-0 flex-1">
            <ReservationDetailSection reservation={reservation} facility={facility} user={user} />
          </div>
        </div>
      )}
    </RequireLogin>
  );
}
