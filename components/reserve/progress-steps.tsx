import { CalendarDays, FileEdit, ListChecks, PartyPopper } from "lucide-react";

import { StepProgress, type StepProgressItem } from "@/components/ui/step-progress";

export type ReserveStep = "input" | "confirm" | "complete";

const STEPS: StepProgressItem[] = [
  { label: "枠選択", icon: CalendarDays },
  { label: "内容入力", icon: FileEdit },
  { label: "内容の確認", icon: ListChecks },
  { label: "完了", icon: PartyPopper },
];

const STEP_INDEX: Record<ReserveStep, number> = { input: 1, confirm: 2, complete: 3 };

/** 枠選択（カレンダー）から続く、申請〜完了までの進捗バー */
export function ProgressSteps({ current }: { current: ReserveStep }) {
  return (
    <div className="mb-space-lg">
      <StepProgress steps={STEPS} currentIndex={STEP_INDEX[current]} ariaLabel="申請の進捗" />
    </div>
  );
}
