import { Map } from "lucide-react";

/** マップ表示切り替え時のプレースホルダー（デモではマップ連携は未実装） */
export function MapViewPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-space-sm rounded-xl border border-dashed border-line bg-surface p-space-xl text-center">
      <Map aria-hidden className="size-10 text-ink-subtle" />
      <p className="text-body-bold text-ink">マップ表示は準備中です</p>
      <p className="text-caption text-ink-muted">
        現在はリスト表示のみご利用いただけます。表示切り替えから「リスト表示」に戻してください。
      </p>
    </div>
  );
}
