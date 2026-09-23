import { useState } from "react";
import { CheckCircle2, Save, User, UserCog } from "lucide-react";

import type { DemoUser } from "@/lib/auth-context";

/** プロフィール情報（お名前・フリガナ・連絡先）の編集フォーム。保存は疑似的な確認表示のみ */
export function ProfileSection({ user }: { user: DemoUser }) {
  const [name, setName] = useState(user.name);
  const [kana, setKana] = useState(user.kana);
  const [tel, setTel] = useState(user.tel);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // デモのため保存はこの場限り（リロードで元に戻る）
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="flex flex-col gap-space-sm pb-space-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-space-xs text-h2 text-primary">
            <UserCog aria-hidden className="size-6 text-primary" />
            プロフィール情報
          </h2>
          <p className="mt-1 text-caption text-ink-muted">
            ご予約時の照会・受付照合に使用する基本連絡先です。
          </p>
        </div>
        <span className="self-start rounded-md bg-canvas px-2.5 py-1 text-xs font-bold text-ink-muted sm:self-auto">
          本人確認済み
        </span>
      </div>

      <div className="mb-space-lg flex flex-col items-center gap-space-md rounded-xl bg-canvas px-space-md py-space-md sm:flex-row">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-card)]">
          <User aria-hidden className="size-9 text-ink-subtle" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-body-bold text-ink">プロフィール画像</p>
          <p className="mt-0.5 text-caption text-ink-muted">
            JPG, PNG または GIF（最大 5MB、正方形推奨）
          </p>
        </div>
        <button
          type="button"
          className="min-h-[48px] rounded-lg bg-surface px-space-lg text-body-bold text-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-surface"
        >
          変更する
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-space-md">
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          <Field label="お名前" required help="施設利用カードに記載の氏名と一致させてください">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-[48px] w-full rounded-lg bg-canvas px-space-md text-body text-ink focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
          <Field label="フリガナ" required help="全角カタカナで入力してください">
            <input
              type="text"
              value={kana}
              onChange={(e) => setKana(e.target.value)}
              className="min-h-[48px] w-full rounded-lg bg-canvas px-space-md text-body text-ink focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
          <Field
            label="メールアドレス"
            required
            badge="認証済み"
            help="予約確定書や抽選案内を受信するアドレスです"
          >
            <div className="relative">
              <input
                type="email"
                value={user.email}
                readOnly
                className="min-h-[48px] w-full rounded-lg bg-canvas py-2 pl-space-md pr-12 text-body text-ink-muted"
              />
              <CheckCircle2
                aria-hidden
                className="absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-ok"
              />
            </div>
          </Field>
          <Field label="電話番号（日中連絡先）" required help="天候不良等による利用不可時の緊急連絡先">
            <input
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="min-h-[48px] w-full rounded-lg bg-canvas px-space-md text-body text-ink numeric focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-space-sm">
          {saved ? (
            <span className="flex items-center gap-1.5 text-caption-bold text-ok">
              <CheckCircle2 aria-hidden className="size-4" />
              保存しました（デモのため再読み込みで元に戻ります）
            </span>
          ) : null}
          <button
            type="submit"
            className="flex min-h-[48px] items-center justify-center gap-space-xs rounded-lg bg-primary px-space-xl text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover"
          >
            <Save aria-hidden className="size-5" />
            変更内容を保存
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  required,
  badge,
  help,
  children,
}: {
  label: string;
  required?: boolean;
  badge?: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-space-xs">
          <span className="text-caption-bold text-ink">{label}</span>
          {badge ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-ok-surface px-2 py-0.5 text-[11px] font-bold text-ok">
              <CheckCircle2 aria-hidden className="size-3" />
              {badge}
            </span>
          ) : null}
        </div>
        {required ? (
          <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold text-on-primary">
            必須
          </span>
        ) : null}
      </div>
      {children}
      <span className="mt-1 text-caption text-ink-muted">{help}</span>
    </div>
  );
}
