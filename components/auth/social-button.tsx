/**
 * ソーシャルログイン／登録の共通ボタン。
 * lib/config.ts のフラグが false のときだけ非表示にする（開発方針 §5-4）。
 */
export function SocialButton({
  enabled,
  onClick,
  className,
  icon,
  label,
}: {
  enabled: boolean;
  onClick: () => void;
  className: string;
  icon: React.ReactNode;
  label: string;
}) {
  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[48px] w-full items-center justify-center gap-3 rounded-lg px-5 text-body-bold transition-colors ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}
