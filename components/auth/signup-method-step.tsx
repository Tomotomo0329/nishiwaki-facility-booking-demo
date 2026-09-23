"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail, TriangleAlert } from "lucide-react";

import { socialLogin } from "@/lib/config";
import { AppleIcon, FacebookIcon, GoogleIcon } from "./brand-icons";
import { SocialButton } from "./social-button";

type Errors = { email?: string; password?: string };

function validateEmail(v: string): string | undefined {
  if (!v.trim()) return "メールアドレスを入力してください。";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "メールアドレスの形式で入力してください。";
  return undefined;
}

function validatePassword(v: string): string | undefined {
  if (!v) return "パスワードを入力してください。";
  if (v.length < 8) return "パスワードは8文字以上で入力してください。";
  return undefined;
}

/**
 * 新規登録 ステップ1: サインイン方法の選択。
 * ソーシャルログインを選んだ場合も、次のステップ2で氏名・電話番号・
 * 市内区分などの基本情報は必ず入力してもらう（ソーシャルだけ入力が
 * 省略されていた不整合を解消）。
 */
export function SignupMethodStep({
  email,
  password,
  onSocial,
  onEmailNext,
}: {
  email: string;
  password: string;
  onSocial: (provider: "google" | "apple" | "facebook") => void;
  onEmailNext: (email: string, password: string) => void;
}) {
  const [localEmail, setLocalEmail] = useState(email);
  const [localPassword, setLocalPassword] = useState(password);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {
      email: validateEmail(localEmail),
      password: validatePassword(localPassword),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    onEmailNext(localEmail.trim(), localPassword);
  }

  return (
    <div className="space-y-space-md">
      <div>
        <h2 className="text-h3 text-ink">登録方法を選択してください</h2>
        <p className="mt-1 text-caption text-ink-muted">
          ソーシャルアカウント、またはメールアドレスとパスワードでアカウントを作成できます。
        </p>
      </div>

      {/* -------------------- ソーシャル登録 -------------------- */}
      <div className="flex flex-col gap-2">
        <SocialButton
          enabled={socialLogin.google}
          onClick={() => onSocial("google")}
          className="border border-line bg-canvas text-ink hover:bg-primary-surface"
          icon={<GoogleIcon />}
          label="Googleで登録"
        />
        <SocialButton
          enabled={socialLogin.apple}
          onClick={() => onSocial("apple")}
          className="bg-[#1c1c1e] text-white hover:bg-black"
          icon={<AppleIcon />}
          label="Appleで登録"
        />
        <SocialButton
          enabled={socialLogin.facebook}
          onClick={() => onSocial("facebook")}
          className="bg-[#1877F2] text-white hover:bg-[#1465d8]"
          icon={<FacebookIcon />}
          label="Facebookで登録"
        />
      </div>

      {/* -------------------- 区切り -------------------- */}
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px flex-1 bg-line" />
        <span className="text-caption text-ink-muted">またはメールアドレスで登録</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>

      {/* -------------------- メールアドレス登録 -------------------- */}
      <form onSubmit={handleSubmit} noValidate className="space-y-space-md">
        <div>
          <label className="flex items-center justify-between text-caption-bold text-ink">
            メールアドレス
            <span className="rounded border border-danger-line bg-danger-surface px-2 py-0.5 text-xs font-bold text-danger">
              必須
            </span>
          </label>
          <div className="relative mt-1 flex items-center">
            <Mail aria-hidden className="pointer-events-none absolute left-3 size-[18px] text-ink-subtle" />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="user@example.jp"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              className={`${inputClass(!!errors.email)} pl-10`}
            />
          </div>
          {errors.email ? <ErrorText>{errors.email}</ErrorText> : null}
        </div>

        <div>
          <label className="flex items-center justify-between text-caption-bold text-ink">
            パスワード（8文字以上・英数混在）
            <span className="rounded border border-danger-line bg-danger-surface px-2 py-0.5 text-xs font-bold text-danger">
              必須
            </span>
          </label>
          <div className="relative mt-1 flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="半角英数字8文字以上"
              value={localPassword}
              onChange={(e) => setLocalPassword(e.target.value)}
              aria-invalid={errors.password ? true : undefined}
              className={`${inputClass(!!errors.password)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示する"}
              aria-pressed={showPassword}
              className="absolute right-1 flex size-11 items-center justify-center rounded-lg text-ink-muted hover:text-ink"
            >
              {showPassword ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
            </button>
          </div>
          {errors.password ? <ErrorText>{errors.password}</ErrorText> : null}
        </div>

        <button
          type="submit"
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover"
        >
          次へ（基本情報の入力）
          <ArrowRight aria-hidden className="size-5" />
        </button>
      </form>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `min-h-[48px] w-full rounded-lg border bg-surface px-3 text-body text-ink placeholder:text-ink-subtle ${
    hasError ? "border-2 border-danger" : "border-line"
  }`;
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-1 flex items-center gap-1.5 text-caption text-danger">
      <TriangleAlert aria-hidden className="size-4 shrink-0" />
      {children}
    </p>
  );
}
