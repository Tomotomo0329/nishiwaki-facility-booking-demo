"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { SignupInfoStep, type AuthMethod, type ResidenceType, type UserCategory } from "./signup-info-step";
import { SignupMethodStep } from "./signup-method-step";
import { SignupStepIndicator } from "./signup-step-indicator";

type WizardStep = "method" | "info";

/**
 * 新規登録フォーム本体。
 * ステップ1（登録方法選択）→ ステップ2（基本情報入力）の2画面をこのコンポーネント内で切り替え、
 * 完了したらステップ3（メール認証・別ページ）へ遷移する。
 * ソーシャルログインを選んでも、ステップ2の基本情報（氏名・電話番号・市内区分など）は
 * 必ず入力してもらう（以前はソーシャル時のみ省略されていた不整合を解消）。
 */
export function SignupWizard({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("method");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [kana, setKana] = useState("");
  const [tel, setTel] = useState("");
  const [residenceType, setResidenceType] = useState<ResidenceType>("inside");
  const [userCategory, setUserCategory] = useState<UserCategory>("individual");
  const [submitting, setSubmitting] = useState(false);

  function handleSocial(provider: "google" | "apple" | "facebook") {
    setAuthMethod(
      provider === "google" ? "social-google" : provider === "apple" ? "social-apple" : "social-facebook",
    );
    setPassword("");
    setStep("info");
  }

  function handleEmailNext(nextEmail: string, nextPassword: string) {
    setAuthMethod("email");
    setEmail(nextEmail);
    setPassword(nextPassword);
    setStep("info");
  }

  async function handleInfoSubmit(values: {
    email: string;
    fullName: string;
    kana: string;
    tel: string;
    residenceType: ResidenceType;
    userCategory: UserCategory;
  }) {
    setEmail(values.email);
    setFullName(values.fullName);
    setKana(values.kana);
    setTel(values.tel);
    setResidenceType(values.residenceType);
    setUserCategory(values.userCategory);

    // デモのため実際の送信は行わない。擬似的な遅延のあと認証待ち画面へ
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);

    const params = new URLSearchParams({ name: values.fullName, kana: values.kana, email: values.email });
    if (nextPath) params.set("next", nextPath);
    router.push(`/signup/verify?${params.toString()}`);
  }

  return (
    <div className="space-y-space-lg">
      <SignupStepIndicator current={step} />

      {step === "method" ? (
        <SignupMethodStep email={email} password={password} onSocial={handleSocial} onEmailNext={handleEmailNext} />
      ) : (
        <SignupInfoStep
          authMethod={authMethod}
          email={email}
          fullName={fullName}
          kana={kana}
          tel={tel}
          residenceType={residenceType}
          userCategory={userCategory}
          submitting={submitting}
          onBack={() => setStep("method")}
          onSubmit={handleInfoSubmit}
        />
      )}

      {step === "method" ? (
        <p className="rounded-lg bg-canvas border border-line py-3 text-center text-caption text-ink-muted">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-caption-bold text-primary hover:underline">
            ログインはこちら
          </Link>
        </p>
      ) : null}
    </div>
  );
}
