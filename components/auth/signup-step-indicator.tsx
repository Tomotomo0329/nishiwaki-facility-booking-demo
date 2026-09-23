import { FileEdit, LogIn, MailCheck, PartyPopper } from "lucide-react";

import { StepProgress, type StepProgressItem } from "@/components/ui/step-progress";

export type SignupStep = "method" | "info" | "verify" | "complete";

// ラベルは短く（省略記号での欠落を避けるため）
const STEPS: StepProgressItem[] = [
  { label: "登録方法", icon: LogIn },
  { label: "基本情報", icon: FileEdit },
  { label: "メール認証", icon: MailCheck },
  { label: "登録完了", icon: PartyPopper },
];

const STEP_INDEX: Record<SignupStep, number> = { method: 0, info: 1, verify: 2, complete: 3 };

/** 新規登録〜メール認証〜登録完了に共通の手順バー */
export function SignupStepIndicator({ current }: { current: SignupStep }) {
  return <StepProgress steps={STEPS} currentIndex={STEP_INDEX[current]} ariaLabel="登録手順" />;
}
