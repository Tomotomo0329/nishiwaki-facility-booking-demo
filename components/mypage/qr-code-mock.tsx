/**
 * QRコードの見た目だけのモック（Stitch「入館用QRコード・利用許可書控え」参考）。
 * デモのため実際にはデコードできない、位置検出パターン風の装飾SVG。
 */
export function QrCodeMock({ active = true, label }: { active?: boolean; label: string }) {
  return (
    <svg
      aria-label={label}
      role="img"
      className={`h-full w-full ${active ? "text-primary" : "text-ink-subtle"}`}
      viewBox="0 0 100 100"
      fill="none"
    >
      <rect width="100" height="100" fill="#ffffff" />
      {/* 四隅の位置検出パターン */}
      <rect x="0" y="0" width="28" height="28" rx="2" fill="currentColor" />
      <rect x="4" y="4" width="20" height="20" rx="1" fill="#ffffff" />
      <rect x="8" y="8" width="12" height="12" rx="1" fill="currentColor" />
      <rect x="72" y="0" width="28" height="28" rx="2" fill="currentColor" />
      <rect x="76" y="4" width="20" height="20" rx="1" fill="#ffffff" />
      <rect x="80" y="8" width="12" height="12" rx="1" fill="currentColor" />
      <rect x="0" y="72" width="28" height="28" rx="2" fill="currentColor" />
      <rect x="4" y="76" width="20" height="20" rx="1" fill="#ffffff" />
      <rect x="8" y="80" width="12" height="12" rx="1" fill="currentColor" />
      {/* タイミングパターン */}
      <rect x="34" y="6" width="6" height="6" fill="currentColor" />
      <rect x="46" y="6" width="6" height="6" fill="currentColor" />
      <rect x="58" y="6" width="6" height="6" fill="currentColor" />
      <rect x="6" y="34" width="6" height="6" fill="currentColor" />
      <rect x="6" y="46" width="6" height="6" fill="currentColor" />
      <rect x="6" y="58" width="6" height="6" fill="currentColor" />
      {/* 中央〜外周のデータセル（装飾） */}
      <rect x="34" y="34" width="8" height="8" fill="currentColor" />
      <rect x="48" y="34" width="8" height="8" fill="currentColor" />
      <rect x="62" y="34" width="6" height="6" fill="currentColor" />
      <rect x="34" y="48" width="6" height="6" fill="currentColor" />
      <rect x="46" y="48" width="12" height="12" rx="1" fill="currentColor" />
      <rect x="64" y="48" width="6" height="6" fill="currentColor" />
      <rect x="34" y="64" width="8" height="8" fill="currentColor" />
      <rect x="48" y="64" width="8" height="8" fill="currentColor" />
      <rect x="62" y="64" width="6" height="6" fill="currentColor" />
      <rect x="76" y="36" width="6" height="6" fill="currentColor" />
      <rect x="88" y="44" width="6" height="6" fill="currentColor" />
      <rect x="76" y="56" width="6" height="6" fill="currentColor" />
      <rect x="88" y="68" width="6" height="6" fill="currentColor" />
      <rect x="36" y="78" width="6" height="6" fill="currentColor" />
      <rect x="48" y="78" width="6" height="6" fill="currentColor" />
      <rect x="60" y="88" width="6" height="6" fill="currentColor" />
      <rect x="76" y="80" width="8" height="8" fill="currentColor" />
      <rect x="88" y="88" width="6" height="6" fill="currentColor" />
    </svg>
  );
}
