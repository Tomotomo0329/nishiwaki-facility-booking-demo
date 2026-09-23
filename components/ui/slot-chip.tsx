import type { SlotState } from "@/lib/availability";

/**
 * 空き状況の表示。
 *
 * JIS X 8341-3 AA 準拠のため、色だけで状態を区別しない。
 * 記号（● ▲ × —）と日本語テキストを必ず併用する。
 */
export const slotAppearance: Record<
  SlotState,
  { chip: string; dot: string; symbol: string; label: string }
> = {
  open: {
    chip: "bg-ok-surface text-ok border-ok-line",
    dot: "bg-ok",
    symbol: "●",
    label: "空きあり",
  },
  limited: {
    chip: "bg-warn-surface text-warn border-warn-line",
    dot: "bg-warn",
    symbol: "▲",
    label: "残りわずか",
  },
  booked: {
    chip: "bg-full-surface text-full border-full-line",
    dot: "bg-full",
    symbol: "×",
    label: "満室",
  },
  closed: {
    chip: "bg-canvas text-ink-subtle border-line border-dashed",
    dot: "bg-line",
    symbol: "—",
    label: "休館",
  },
};

export function SlotChip({
  state,
  /** 「● 空きあり」の後ろに添える補足（例: 午前） */
  suffix,
  srLabel,
  className = "",
}: {
  state: SlotState;
  suffix?: string;
  srLabel?: string;
  className?: string;
}) {
  const a = slotAppearance[state];
  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded border px-1.5 py-1 text-xs ${a.chip} ${className}`}
    >
      <span aria-hidden>{a.symbol}</span>
      <span aria-hidden>{a.label}</span>
      {suffix ? (
        <span aria-hidden className="text-[10px] opacity-70">
          {suffix}
        </span>
      ) : null}
      <span className="sr-only">{srLabel ?? `${suffix ?? ""}${a.label}`}</span>
    </span>
  );
}

/** 凡例などで使う小さな丸 */
export function SlotDot({ state }: { state: SlotState }) {
  return (
    <span aria-hidden className={`size-2 rounded-full ${slotAppearance[state].dot}`} />
  );
}
