import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

import { AppleIcon, FacebookIcon, GoogleIcon } from "@/components/auth/brand-icons";
import { socialLogin } from "@/lib/config";

type ProviderKey = "google" | "apple" | "facebook";

const PROVIDERS: {
  key: ProviderKey;
  name: string;
  icon: React.ReactNode;
  defaultLinked: boolean;
  linkedDetail: string;
  unlinkedDetail: string;
  enabled: boolean;
}[] = [
  {
    key: "google",
    name: "Google アカウント",
    icon: <GoogleIcon />,
    defaultLinked: true,
    linkedDetail: "taro.nishiwaki@gmail.com",
    unlinkedDetail: "Google アカウントでワンタップログインが利用可能になります",
    enabled: socialLogin.google,
  },
  {
    key: "apple",
    name: "Apple ID",
    icon: <AppleIcon />,
    defaultLinked: false,
    linkedDetail: "連携済みの Apple ID",
    unlinkedDetail: "Apple ID でワンタップログインが利用可能になります",
    enabled: socialLogin.apple,
  },
  {
    key: "facebook",
    name: "Facebook",
    icon: <FacebookIcon />,
    defaultLinked: false,
    linkedDetail: "連携済みの Facebook アカウント",
    unlinkedDetail: "ソーシャルログインによる認証の連携",
    enabled: socialLogin.facebook,
  },
];

/** ソーシャルログイン連携とパスワードの管理。連携状態はこの画面内だけのデモ操作 */
export function AuthMethodsSection() {
  const [linked, setLinked] = useState<Record<ProviderKey, boolean>>(() =>
    Object.fromEntries(PROVIDERS.map((p) => [p.key, p.defaultLinked])) as Record<
      ProviderKey,
      boolean
    >,
  );

  return (
    <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="pb-space-md">
        <h2 className="flex items-center gap-space-xs text-h2 text-primary">
          <ShieldCheck aria-hidden className="size-6 text-primary" />
          ログイン・認証方法
        </h2>
        <p className="mt-1 text-caption text-ink-muted">
          連携中のソーシャルアカウントおよびログインパスワードの設定
        </p>
      </div>

      <div className="space-y-space-sm">
        {PROVIDERS.filter((p) => p.enabled).map((provider) => {
          const isLinked = linked[provider.key];
          return (
            <div
              key={provider.key}
              className="flex flex-col gap-space-md rounded-xl bg-canvas p-space-md transition-colors hover:bg-line/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-space-md">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface shadow-[var(--shadow-card)]">
                  {provider.icon}
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <p className="text-body-bold text-ink">{provider.name}</p>
                    {isLinked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ok-surface px-2 py-0.5 text-[11px] font-bold text-ok">
                        <span aria-hidden className="size-1.5 rounded-full bg-ok" />
                        連携済み
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-line/60 px-2 py-0.5 text-[11px] font-bold text-ink-muted">
                        未連携
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-caption text-ink-muted">
                    {isLinked ? provider.linkedDetail : provider.unlinkedDetail}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLinked((prev) => ({ ...prev, [provider.key]: !prev[provider.key] }))
                }
                className={
                  isLinked
                    ? "self-end rounded-lg px-space-md py-2 text-caption-bold text-danger transition-colors hover:bg-danger-surface sm:self-center"
                    : "self-end rounded-lg bg-surface px-space-md py-2 text-caption-bold text-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary hover:text-on-primary sm:self-center"
                }
              >
                {isLinked ? "連携解除" : "連携する"}
              </button>
            </div>
          );
        })}

        <div className="flex flex-col gap-space-md rounded-xl bg-canvas p-space-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-space-md">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface text-primary shadow-[var(--shadow-card)]">
              <KeyRound aria-hidden className="size-6" />
            </div>
            <div>
              <p className="text-body-bold text-ink">ログインパスワード</p>
              <p className="mt-0.5 text-caption text-ink-muted numeric">
                最終更新日: 2026年8月10日（90日以上安全に保持されています）
              </p>
            </div>
          </div>
          <a
            href="/reset"
            className="self-end rounded-lg bg-surface px-space-md py-2 text-caption-bold text-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary hover:text-on-primary sm:self-center"
          >
            パスワードを変更
          </a>
        </div>
      </div>
    </section>
  );
}
