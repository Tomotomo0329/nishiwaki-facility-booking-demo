import type { NoticeTone } from "@/lib/demo-data";

const noticeToneClass: Record<NoticeTone, string> = {
  important: "bg-danger-surface text-danger border-danger-line",
  maintenance: "bg-warn-surface text-warn border-warn-line",
  info: "bg-canvas text-ink-muted border-line",
};

/** お知らせの分類バッジ（重要/メンテナンス/お知らせ）。一覧・詳細で共通利用する */
export function NoticeToneBadge({ tone, label }: { tone: NoticeTone; label: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded border text-xs font-bold ${noticeToneClass[tone]}`}>
      {label}
    </span>
  );
}
