"use client";

import { useId, useState } from "react";
import { ArrowLeft, ArrowRight, Mail, Phone, TriangleAlert } from "lucide-react";

import { AppleIcon, FacebookIcon, GoogleIcon } from "./brand-icons";

export type ResidenceType = "inside" | "outside";
export type UserCategory = "individual" | "organization";
export type AuthMethod = "social-google" | "social-apple" | "social-facebook" | "email";

const SOCIAL_PROVIDER_LABEL: Record<Exclude<AuthMethod, "email">, string> = {
  "social-google": "Google",
  "social-apple": "Apple",
  "social-facebook": "Facebook",
};

type Errors = Partial<Record<"fullName" | "kana" | "email" | "tel" | "terms", string>>;

function validateFullName(v: string): string | undefined {
  if (!v.trim()) return "お名前を入力してください。";
  return undefined;
}

function validateKana(v: string): string | undefined {
  if (!v.trim()) return "フリガナを入力してください。";
  if (!/^[゠-ヿー\s]+$/.test(v)) return "フリガナは全角カタカナで入力してください。";
  return undefined;
}

function validateEmail(v: string): string | undefined {
  if (!v.trim()) return "メールアドレスを入力してください。";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "メールアドレスの形式で入力してください。";
  return undefined;
}

function validateTel(v: string): string | undefined {
  if (!v.trim()) return "電話番号を入力してください。";
  if (!/^0\d{9,10}$/.test(v.replace(/-/g, ""))) return "ハイフンなしの半角数字で入力してください。";
  return undefined;
}

/**
 * 新規登録 ステップ2: 基本情報の入力。
 * サインイン方法（ソーシャル／メール）に関わらず、氏名・電話番号・
 * 市内区分・利用目的区分は必ずここで入力してもらう共通ステップ。
 */
export function SignupInfoStep({
  authMethod,
  email,
  fullName,
  kana,
  tel,
  residenceType,
  userCategory,
  submitting,
  onBack,
  onSubmit,
}: {
  authMethod: AuthMethod;
  email: string;
  fullName: string;
  kana: string;
  tel: string;
  residenceType: ResidenceType;
  userCategory: UserCategory;
  submitting: boolean;
  onBack: () => void;
  onSubmit: (values: {
    email: string;
    fullName: string;
    kana: string;
    tel: string;
    residenceType: ResidenceType;
    userCategory: UserCategory;
  }) => void;
}) {
  const emailId = useId();
  const fullNameId = useId();
  const kanaId = useId();
  const telId = useId();

  const [localEmail, setLocalEmail] = useState(email);
  const [localFullName, setLocalFullName] = useState(fullName);
  const [localKana, setLocalKana] = useState(kana);
  const [localTel, setLocalTel] = useState(tel);
  const [localResidenceType, setLocalResidenceType] = useState(residenceType);
  const [localUserCategory, setLocalUserCategory] = useState(userCategory);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {
      fullName: validateFullName(localFullName),
      kana: validateKana(localKana),
      email: validateEmail(localEmail),
      tel: validateTel(localTel),
      terms: agreeTerms ? undefined : "利用規約への同意が必要です。",
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    onSubmit({
      email: localEmail.trim(),
      fullName: localFullName.trim(),
      kana: localKana.trim(),
      tel: localTel.trim(),
      residenceType: localResidenceType,
      userCategory: localUserCategory,
    });
  }

  return (
    <div className="space-y-space-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h3 text-ink">基本情報を入力してください</h2>
          <p className="mt-1 text-caption text-ink-muted">
            予約・抽選申込の際に利用する連絡先や区分の情報です。
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex shrink-0 items-center gap-1 text-caption-bold text-primary hover:underline"
        >
          <ArrowLeft aria-hidden className="size-4" />
          戻る
        </button>
      </div>

      {authMethod !== "email" ? (
        <p className="flex items-center gap-2 rounded-lg bg-ok-surface px-3 py-2.5 text-caption-bold text-ok">
          {authMethod === "social-google" ? (
            <GoogleIcon className="size-4" />
          ) : authMethod === "social-apple" ? (
            <AppleIcon className="size-4" />
          ) : (
            <FacebookIcon className="size-4" />
          )}
          {SOCIAL_PROVIDER_LABEL[authMethod]}
          アカウントと連携します（デモのため実際の連携は行いません）
        </p>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-space-md">
        <Field
          label="メールアドレス（連絡用・認証用）"
          htmlFor={emailId}
          error={errors.email}
          hint="※ 予約確定通知や施設利用前のリマインドメールが届きます。"
        >
          <div className="relative flex items-center">
            <Mail aria-hidden className="pointer-events-none absolute left-3 size-[18px] text-ink-subtle" />
            <input
              id={emailId}
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
        </Field>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          <Field label="お名前（漢字フルネーム）" htmlFor={fullNameId} error={errors.fullName}>
            <input
              id={fullNameId}
              type="text"
              autoComplete="name"
              placeholder="例: 西脇 太郎"
              value={localFullName}
              onChange={(e) => setLocalFullName(e.target.value)}
              aria-invalid={errors.fullName ? true : undefined}
              className={inputClass(!!errors.fullName)}
            />
          </Field>
          <Field label="フリガナ（全角カナ）" htmlFor={kanaId} error={errors.kana}>
            <input
              id={kanaId}
              type="text"
              placeholder="例: ニシワキ タロウ"
              value={localKana}
              onChange={(e) => setLocalKana(e.target.value)}
              aria-invalid={errors.kana ? true : undefined}
              className={inputClass(!!errors.kana)}
            />
          </Field>
        </div>

        <Field label="電話番号（日中連絡先・緊急連絡用）" htmlFor={telId} error={errors.tel}>
          <div className="relative flex items-center">
            <Phone aria-hidden className="pointer-events-none absolute left-3 size-[18px] text-ink-subtle" />
            <input
              id={telId}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="09012345678（ハイフン不要）"
              value={localTel}
              onChange={(e) => setLocalTel(e.target.value)}
              aria-invalid={errors.tel ? true : undefined}
              className={`${inputClass(!!errors.tel)} pl-10`}
            />
          </div>
        </Field>

        <RadioGroup
          legend="市内・市外区分（料金区分判定）"
          name="residenceType"
          value={localResidenceType}
          onChange={(v) => setLocalResidenceType(v as ResidenceType)}
          options={[
            { value: "inside", title: "西脇市内在住・在勤・在学", note: "市民割引料金 ＆ 優先枠適用" },
            { value: "outside", title: "市外利用者", note: "一般枠として予約可能" },
          ]}
        />

        <RadioGroup
          legend="利用目的・アカウント区分"
          name="userCategory"
          value={localUserCategory}
          onChange={(v) => setLocalUserCategory(v as UserCategory)}
          options={[
            { value: "individual", title: "個人利用", note: "一般の個人練習・個人登録" },
            { value: "organization", title: "団体・サークル利用", note: "登録後にマイページから団体登録できます" },
          ]}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-space-sm rounded-xl bg-canvas p-space-sm">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              aria-invalid={errors.terms ? true : undefined}
              className="mt-0.5 size-5 shrink-0 rounded text-primary focus:ring-primary"
            />
            <span className="text-caption text-ink">
              西脇市公共施設予約システムの
              <a href="#" className="mx-1 font-bold text-primary underline hover:no-underline">
                利用規約
              </a>
              および
              <a href="#" className="mx-1 font-bold text-primary underline hover:no-underline">
                プライバシーポリシー（個人情報保護方針）
              </a>
              に同意する。
            </span>
          </label>
          {errors.terms ? <ErrorText>{errors.terms}</ErrorText> : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover disabled:opacity-70"
        >
          {submitting ? "送信しています…" : "確認して認証メールを送信"}
          {!submitting ? <ArrowRight aria-hidden className="size-5" /> : null}
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

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="flex items-center justify-between text-caption-bold text-ink">
        {label}
        <span className="rounded border border-danger-line bg-danger-surface px-2 py-0.5 text-xs font-bold text-danger">
          必須
        </span>
      </label>
      <div className="mt-1">{children}</div>
      {error ? <ErrorText>{error}</ErrorText> : hint ? <p className="mt-1 text-caption text-ink-muted">{hint}</p> : null}
    </div>
  );
}

function RadioGroup({
  legend,
  name,
  value,
  onChange,
  options,
}: {
  legend: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; title: string; note: string }[];
}) {
  return (
    <fieldset>
      <legend className="mb-space-sm flex w-full items-center justify-between text-caption-bold text-ink">
        {legend}
        <span className="rounded border border-danger-line bg-danger-surface px-2 py-0.5 text-xs font-bold text-danger">
          必須
        </span>
      </legend>
      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-space-sm rounded-xl p-space-sm transition-colors ${
                checked ? "bg-primary-surface ring-2 ring-primary" : "bg-canvas hover:bg-line/30"
              }`}
            >
              <input
                type="radio"
                name={name}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-1 size-4 shrink-0 text-primary focus:ring-primary"
              />
              <span>
                <span className="block text-caption-bold text-ink">{opt.title}</span>
                <span className="mt-0.5 block text-xs text-ink-muted">{opt.note}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
