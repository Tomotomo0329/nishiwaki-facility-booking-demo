import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";

import { EmailVerifyPending } from "@/components/auth/email-verify-pending";
import { SignupStepIndicator } from "@/components/auth/signup-step-indicator";
import { safeNextPath } from "@/lib/url";

export const metadata: Metadata = {
  title: "メール認証 | 西脇市 公共施設予約システム",
  description: "ご登録のメールアドレス宛てに送信した認証リンクから、登録を完了してください。",
};

export default async function SignupVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; kana?: string; email?: string; next?: string }>;
}) {
  const { name, kana, email, next } = await searchParams;

  // メール認証は新規登録フォームの送信後にしか来られない導線のため、
  // 登録情報（メールアドレス）が無い直接アクセスは登録フォームへ戻す
  if (!email) redirect("/signup");

  const nextPath = safeNextPath(next);
  const params = new URLSearchParams({ name: name ?? "", kana: kana ?? "", email });
  if (nextPath !== "/") params.set("next", nextPath);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-gutter-mobile py-space-xl md:px-space-xl">
      <div className="w-full max-w-[560px]">
        <Link href="/" className="flex items-center justify-center gap-3 sm:justify-start">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Building2 aria-hidden className="size-6" />
          </span>
          <span>
            <span className="block text-caption-bold text-primary">西脇市</span>
            <span className="block text-h3 text-ink">公共施設予約システム</span>
          </span>
        </Link>

        <div className="mt-space-lg">
          <SignupStepIndicator current="verify" />
        </div>

        <div className="mt-space-lg">
          <EmailVerifyPending
            email={email}
            verifyHref={`/signup/complete?${params.toString()}`}
            editEmailHref={`/signup${nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
          />
        </div>
      </div>
    </div>
  );
}
