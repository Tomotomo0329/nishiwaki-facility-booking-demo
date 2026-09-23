"use client";

import { useState } from "react";
import { CalendarX2 } from "lucide-react";

import { ReservationCard } from "@/components/mypage/reservation-card";
import { SegmentedTabs } from "@/components/mypage/segmented-tabs";
import { DEMO_TODAY } from "@/lib/availability";
import { demoReservations, type Reservation } from "@/lib/reservations";

type TabKey = "upcoming" | "history";

/** マイページの中心コンテンツ。予約一覧の状態（タブ・キャンセル操作）をここで持つ */
export function ReservationsSection() {
  const [reservations, setReservations] = useState<Reservation[]>(demoReservations);
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");

  const upcoming = reservations
    .filter((r) => r.status === "confirmed" && r.date >= DEMO_TODAY)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const history = reservations
    .filter((r) => r.status !== "confirmed" || r.date < DEMO_TODAY)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const list = activeTab === "upcoming" ? upcoming : history;

  function handleCancel(id: string) {
    const ok = window.confirm(
      "この予約をキャンセルしますか？（デモのため実際のキャンセル処理は行われません）",
    );
    if (!ok) return;
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
    );
  }

  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-space-sm rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2 text-primary">予約一覧</h2>
          <p className="mt-1 text-caption text-ink-muted">
            ご自身の予約状況・利用履歴を確認できます。
          </p>
        </div>
        <SegmentedTabs
          label="予約の表示切り替え"
          active={activeTab}
          onChange={setActiveTab}
          tabs={[
            { key: "upcoming", label: "今後の予約", count: upcoming.length },
            { key: "history", label: "利用履歴", count: history.length },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-space-sm rounded-xl border border-dashed border-line bg-surface p-space-xl text-center">
          <CalendarX2 aria-hidden className="size-8 text-ink-subtle" />
          <p className="text-body-bold text-ink">
            {activeTab === "upcoming" ? "今後の予約はありません" : "利用履歴はありません"}
          </p>
          <p className="text-caption text-ink-muted">
            施設一覧から空き状況を確認して、ご予約ください。
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {list.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={activeTab === "upcoming" ? handleCancel : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
