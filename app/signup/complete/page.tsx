import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";

import { SignupComplete } from "@/components/auth/signup-complete";
import { SignupStepIndicator } from "@/components/auth/signup-step-indicator";
import { popularFacilities } from "@/lib/demo-data";
import { safeNextPath } from "@/lib/url";

export const metadata: Metadata = {
  title: "アカウント作成完了 | 西脇市 公共施設予約システム",
  description: "アカウント作成が完了しました。施設の予約・抽選申込がご利用いただけます。",
};

export default async function SignupCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; kana?: string; email?: string; next?: string }>;
}) {
  const { name, kana, email, next } = await searchParams;

  // メール認証を経ずに来られる導線は無いため、必須情報が無い直接アクセスは登録フォームへ戻す
  if (!email) redirect("/signup");

  const nextPath = safeNextPath(next) !== "/" ? safeNextPath(next) : "/mypage";
  const facilities = popularFacilities.filter((f) => f.category === "体育館").slice(0, 2);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1200px] px-gutter-mobile py-space-lg md:px-gutter md:py-space-xl">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-on-primary">
            <Building2 aria-hidden className="size-6" />
          </span>
          <span>
            <span className="block text-caption-bold text-primary">西脇市</span>
            <span className="block text-h3 text-ink">公共施設予約システム</span>
          </span>
        </Link>

        <div className="mx-auto mt-space-lg max-w-2xl">
          <SignupStepIndicator current="complete" />
        </div>

        <div className="mt-space-lg">
          <SignupComplete
            name={name ?? ""}
            kana={kana ?? ""}
            email={email}
            nextPath={nextPath}
            facilities={facilities}
          />
        </div>
      </div>
    </div>
  );
}
