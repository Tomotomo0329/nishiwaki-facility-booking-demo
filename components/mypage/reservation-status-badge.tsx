import type { ReservationStatus } from "@/lib/reservations";

/**
 * 予約状態のバッジ。空き状況の色使い（ok/muted/danger）を踏襲しつつ、
 * 予約一覧ならではの状態（確定・利用済み・キャンセル済み）を表す。
 */
const STATUS_META: Record<
  ReservationStatus,
  { label: string; symbol: string; className: string }
> = {
  confirmed: {
    label: "予約確定",
    symbol: "●",
    className: "bg-ok-surface text-ok border-ok-line",
  },
  completed: {
    label: "利用済み",
    symbol: "✓",
    className: "bg-canvas text-ink-muted border-line",
  },
  cancelled: {
    label: "キャンセル済み",
    symbol: "×",
    className: "bg-full-surface text-full border-full-line",
  },
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${meta.className}`}
    >
      <span aria-hidden>{meta.symbol}</span>
      {meta.label}
    </span>
  );
}
