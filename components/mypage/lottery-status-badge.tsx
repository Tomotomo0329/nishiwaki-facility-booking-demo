import type { LotteryStatus } from "@/lib/lottery";

/** 抽選結果のバッジ。予約ステータスバッジ（ok/muted/danger）と同じ色使いを踏襲する */
const STATUS_META: Record<
  LotteryStatus,
  { label: string; symbol: string; className: string }
> = {
  pending: {
    label: "結果発表待ち",
    symbol: "▲",
    className: "bg-warn-surface text-warn border-warn-line",
  },
  won: {
    label: "当選",
    symbol: "●",
    className: "bg-ok-surface text-ok border-ok-line",
  },
  lost: {
    label: "落選",
    symbol: "×",
    className: "bg-full-surface text-full border-full-line",
  },
  withdrawn: {
    label: "申込取消済み",
    symbol: "×",
    className: "bg-canvas text-ink-muted border-line",
  },
};

export function LotteryStatusBadge({ status }: { status: LotteryStatus }) {
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
