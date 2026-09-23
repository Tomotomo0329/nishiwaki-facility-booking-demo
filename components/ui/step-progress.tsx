import { Check, type LucideIcon } from "lucide-react";

export type StepProgressItem = { label: string; icon: LucideIcon };

/**
 * 複数ステップの手順バー（汎用）。
 * 予約フロー（reserve/progress-steps.tsx）・新規登録フローなど、
 * 「現在地」を示す横並びのステップ表示を共有する。
 */
export function StepProgress({
  steps,
  currentIndex,
  ariaLabel,
}: {
  steps: StepProgressItem[];
  currentIndex: number;
  ariaLabel: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg"
    >
      {/*
        アイコンの列を全ステップ同じ固定幅にし、間の連結線だけを ol 直下の
        flex-1 な要素として独立させる（列と連結線を同じ li の中で分け合わせると、
        連結線を持たない最後のステップだけ幅の配分が変わり、間隔がバラバラに見える）
      */}
      <ol className="flex items-start">
        {steps.flatMap((step, i) => {
          const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "pending";
          const Icon = step.icon;

          const stepItem = (
            <li key={step.label} className="flex w-14 shrink-0 flex-col items-center gap-1 sm:w-16">
              <div
                className={`relative flex size-8 shrink-0 items-center justify-center rounded-full sm:size-9 ${
                  state === "done"
                    ? "bg-ok text-white"
                    : state === "active"
                      ? "border-2 border-primary bg-primary-surface text-primary"
                      : "border border-line bg-canvas text-ink-subtle"
                }`}
              >
                {state === "done" ? (
                  <Check aria-hidden className="relative size-4" />
                ) : (
                  <Icon aria-hidden className="relative size-4" />
                )}
              </div>
              <span
                className={`w-full truncate text-center text-[10px] font-bold leading-tight tracking-tight sm:text-[11px] ${
                  state === "pending"
                    ? "text-ink-subtle"
                    : state === "active"
                      ? "text-primary"
                      : "text-ink-muted"
                }`}
              >
                {step.label}
              </span>
            </li>
          );

          if (i === steps.length - 1) return [stepItem];

          const connector = (
            <li
              key={`${step.label}-connector`}
              aria-hidden
              className={`mt-4 h-px flex-1 sm:mt-[18px] sm:h-[2px] ${i < currentIndex ? "bg-ok" : "bg-line"}`}
            />
          );
          return [stepItem, connector];
        })}
      </ol>
    </nav>
  );
}
