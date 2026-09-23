"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Mail, MailCheck, RotateCw, ShieldCheck } from "lucide-react";

/**
 * メール認証（認証待ち）画面。
 * Stitch にデザインが無いため、既存の予約完了系画面（bg-ok の丸バッジ、
 * bg-canvas の説明ボックス、破線カードのデモ表示）と同じトーンで自作した。
 * デモのため実際にはメールを送信しない。「認証を完了する」ボタンで
 * メール内リンクのクリックを模擬し、登録完了画面へ進む。
 */
export function EmailVerifyPending({
  email,
  verifyHref,
  editEmailHref,
}: {
  email: string;
  verifyHref: string;
  editEmailHref: string;
}) {
  const router = useRouter();
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function handleResend() {
    setResending(true);
    setResent(false);
    await new Promise((r) => setTimeout(r, 600));
    setResending(false);
    setResent(true);
  }

  async function handleVerifyNow() {
    setVerifying(true);
    // デモのため実際の認証は行わない。メール内リンクのクリックを模擬する遅延だけ挟む
    await new Promise((r) => setTimeout(r, 700));
    router.push(verifyHref);
  }

  return (
    <div className="rounded-xl bg-surface p-space-lg shadow-[var(--shadow-card)] sm:p-space-xl">
      <div className="flex flex-col items-center text-center">
        <div className="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-surface text-primary">
          <span aria-hidden className="absolute inline-flex size-full animate-ping rounded-full bg-primary/20" />
          <Mail aria-hidden className="relative size-8" />
        </div>

        <h1 className="mt-space-md text-h2 text-ink">認証メールを送信しました</h1>
        <p className="mt-space-sm max-w-md text-body text-ink-muted">
          下記のメールアドレス宛てに、登録を完了するための認証リンクをお送りしました。メール内のリンクを開いて登録を完了してください。
        </p>

        <p className="mt-space-md inline-flex items-center gap-2 rounded-lg bg-canvas px-4 py-2.5 text-body-bold text-ink">
          <Mail aria-hidden className="size-[18px] text-ink-muted" />
          {email || "ご登録のメールアドレス"}
        </p>
      </div>

      <div className="mt-space-lg space-y-space-sm rounded-lg bg-canvas p-space-md">
        <p className="flex items-center gap-1.5 text-caption-bold text-ink">
          <ShieldCheck aria-hidden className="size-[18px] text-primary" />
          メールが届かない場合
        </p>
        <ul className="list-disc space-y-1 pl-5 text-caption text-ink-muted">
          <li>迷惑メールフォルダに振り分けられていないかご確認ください。</li>
          <li>数分待っても届かない場合は、下のボタンから再送信できます。</li>
          <li>
            メールアドレスに誤りがある場合は
            <a href={editEmailHref} className="mx-1 font-bold text-primary hover:underline">
              入力内容を修正
            </a>
            してください。
          </li>
        </ul>
        <div className="flex flex-wrap items-center gap-space-sm pt-1">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex min-h-[40px] items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 text-caption-bold text-ink transition-colors hover:bg-primary-surface disabled:opacity-60"
          >
            <RotateCw aria-hidden className={`size-4 ${resending ? "animate-spin" : ""}`} />
            {resending ? "再送信しています…" : "認証メールを再送信する"}
          </button>
          {resent ? (
            <span className="flex items-center gap-1 text-caption-bold text-ok">
              <MailCheck aria-hidden className="size-4" />
              再送信しました
            </span>
          ) : null}
        </div>
      </div>

      {/* デモ用ショートカット（開発方針 §0）。実運用ではメール内リンクの遷移先そのもの */}
      <div className="mt-space-lg rounded-lg border border-dashed border-primary/40 bg-primary-surface p-space-md">
        <p className="text-caption text-primary">
          これはデモです。実際のメール送信は行われません。下のボタンでメール内リンクのクリックを再現し、登録完了画面へ進みます。
        </p>
        <button
          type="button"
          onClick={handleVerifyNow}
          disabled={verifying}
          className="mt-space-sm flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover disabled:opacity-70 sm:w-auto"
        >
          {verifying ? "認証を確認しています…" : "認証を完了する（デモ用）"}
          {!verifying ? <ArrowRight aria-hidden className="size-5" /> : null}
        </button>
      </div>
    </div>
  );
}
