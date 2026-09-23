"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, Eye, EyeOff, TriangleAlert } from "lucide-react";

import { socialLogin } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";
import { AppleIcon, FacebookIcon, GoogleIcon } from "./brand-icons";
import { SocialButton } from "./social-button";

type Errors = { account?: string; password?: string };

/** メールアドレス、または窓口発行の利用者カード番号（8〜12桁） */
function validateAccount(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "メールアドレスまたは利用者番号を入力してください。";
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isCardNo = /^\d{8,12}$/.test(v);
  if (!isEmail && !isCardNo)
    return "メールアドレスの形式、または8〜12桁の利用者番号で入力してください。";
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return "パスワードを入力してください。";
  if (value.length < 8) return "パスワードは8文字以上で入力してください。";
  return undefined;
}

export function LoginForm({ nextPath = "/" }: { nextPath?: string }) {
  const router = useRouter();
  const { login } = useAuth();
  const accountId = useId();
  const passwordId = useId();

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleSocialLogin() {
    // デモのため認証は行わない。疑似ログイン状態にして遷移する。
    login();
    router.push(nextPath);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {
      account: validateAccount(account),
      password: validatePassword(password),
    };
    setErrors(next);
    if (next.account || next.password) return;

    // デモのため認証は行わない。擬似的な遅延を挟んでからログイン状態にする。
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    login();
    router.push(nextPath);
  }

  return (
    <div className="space-y-space-md">
      {/* -------------------- ソーシャルログイン -------------------- */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleSocialLogin}
          className="flex min-h-[48px] w-full items-center justify-center gap-3 rounded-lg border border-line bg-canvas px-5 text-body-bold text-ink transition-colors hover:bg-primary-surface"
        >
          <GoogleIcon />
          Google でログイン
        </button>

        <SocialButton
          enabled={socialLogin.apple}
          onClick={handleSocialLogin}
          className="bg-[#1c1c1e] text-white hover:bg-black"
          icon={<AppleIcon />}
          label="Apple でログイン"
        />
        <SocialButton
          enabled={socialLogin.facebook}
          onClick={handleSocialLogin}
          className="bg-[#1877F2] text-white hover:bg-[#1465d8]"
          icon={<FacebookIcon />}
          label="Facebook でログイン"
        />
      </div>

      {/* -------------------- 区切り -------------------- */}
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px flex-1 bg-line" />
        <span className="text-caption text-ink-muted">または</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>

      {/* -------------------- 入力フォーム -------------------- */}
      <form onSubmit={handleSubmit} noValidate className="space-y-space-md">
        <div>
          <label
            htmlFor={accountId}
            className="flex items-center justify-between text-caption-bold text-ink"
          >
            メールアドレス / 利用者番号
            <span className="rounded border border-danger-line bg-danger-surface px-2 py-0.5 text-xs font-bold text-danger">
              必須
            </span>
          </label>
          <input
            id={accountId}
            type="text"
            inputMode="email"
            autoComplete="username"
            placeholder="example@city.nishiwaki.hyogo.jp"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            aria-invalid={errors.account ? true : undefined}
            aria-describedby={
              errors.account ? `${accountId}-error` : `${accountId}-help`
            }
            className={`mt-1 min-h-[48px] w-full rounded-lg border bg-surface px-3 text-body text-ink placeholder:text-ink-subtle ${
              errors.account ? "border-2 border-danger" : "border-line"
            }`}
          />
          {errors.account ? (
            <p
              id={`${accountId}-error`}
              role="alert"
              className="mt-1 flex items-center gap-1.5 text-caption text-danger"
            >
              <TriangleAlert aria-hidden className="size-4 shrink-0" />
              {errors.account}
            </p>
          ) : (
            <p id={`${accountId}-help`} className="mt-1 text-caption text-ink-muted">
              窓口発行の「利用者カード番号」も入力可能です
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={passwordId}
            className="flex items-center justify-between text-caption-bold text-ink"
          >
            パスワード
            <span className="rounded border border-danger-line bg-danger-surface px-2 py-0.5 text-xs font-bold text-danger">
              必須
            </span>
          </label>
          <div className="relative mt-1 flex items-center">
            <input
              id={passwordId}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              placeholder="8文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={
                errors.password ? `${passwordId}-error` : undefined
              }
              className={`min-h-[48px] w-full rounded-lg border bg-surface pl-3 pr-12 text-body text-ink placeholder:text-ink-subtle ${
                errors.password ? "border-2 border-danger" : "border-line"
              }`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "パスワードを隠す" : "パスワードを表示する"}
              aria-pressed={show}
              className="absolute right-1 flex size-11 items-center justify-center rounded-lg text-ink-muted hover:text-ink"
            >
              {show ? (
                <EyeOff aria-hidden className="size-5" />
              ) : (
                <Eye aria-hidden className="size-5" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p
              id={`${passwordId}-error`}
              role="alert"
              className="mt-1 flex items-center gap-1.5 text-caption text-danger"
            >
              <TriangleAlert aria-hidden className="size-4 shrink-0" />
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-caption text-ink">
            <input
              type="checkbox"
              className="size-5 rounded border-line accent-[#16386b]"
            />
            ログイン状態を保持する
          </label>
          <Link
            href="/reset"
            className="text-caption-bold text-primary hover:underline"
          >
            パスワードをお忘れですか?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover disabled:opacity-70"
        >
          {submitting ? "ログインしています…" : "ログイン"}
          {!submitting ? <ArrowRight aria-hidden className="size-5" /> : null}
        </button>
      </form>

      {/* -------------------- 新規登録 -------------------- */}
      <p className="rounded-lg bg-canvas border border-line py-3 text-center text-caption text-ink-muted">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-caption-bold text-primary hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}

