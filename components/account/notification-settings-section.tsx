import { useState } from "react";
import { BellRing, Check } from "lucide-react";

type NotificationKey = "confirmation" | "reminder" | "lottery" | "news";

const NOTIFICATIONS: {
  key: NotificationKey;
  title: string;
  description: string;
  defaultOn: boolean;
}[] = [
  {
    key: "confirmation",
    title: "予約確定・変更のお知らせ",
    description: "予約の完了や窓口変更時に、登録メールアドレス宛に控えを送信します",
    defaultOn: true,
  },
  {
    key: "reminder",
    title: "利用日前日のリマインド通知",
    description: "ご利用の前日朝8時に鍵の受け渡し場所・注意事項を含む確認通知を送ります",
    defaultOn: true,
  },
  {
    key: "lottery",
    title: "抽選結果のお知らせ",
    description: "毎月12日の抽選発表時に当選・落選をメールでお知らせします（確定手続きの締切含む）",
    defaultOn: true,
  },
  {
    key: "news",
    title: "西脇市施設からのお知らせ・メンテナンス情報",
    description: "定期点検による休館情報、避難所開設に伴う利用制限、イベント情報などを配信します",
    defaultOn: false,
  },
];

/** 通知トグル。ON/OFF はこの画面内で実際に切り替えられる（保存はデモのためこの場限り） */
export function NotificationSettingsSection() {
  const [state, setState] = useState<Record<NotificationKey, boolean>>(() =>
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.key, n.defaultOn])) as Record<
      NotificationKey,
      boolean
    >,
  );

  return (
    <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="pb-space-md">
        <h2 className="flex items-center gap-space-xs text-h2 text-primary">
          <BellRing aria-hidden className="size-6 text-primary" />
          通知・リマインド設定
        </h2>
        <p className="mt-1 text-caption text-ink-muted">
          予約完了や抽選結果、利用前日の案内メール送信設定
        </p>
      </div>

      <div className="space-y-space-sm">
        {NOTIFICATIONS.map((n) => {
          const on = state[n.key];
          return (
            <div
              key={n.key}
              className="flex items-center justify-between gap-space-md rounded-xl bg-canvas p-space-md"
            >
              <div className="flex-1 pr-space-sm">
                <p className="text-body-bold text-ink">{n.title}</p>
                <p className="mt-0.5 text-caption text-ink-muted">{n.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={n.title}
                onClick={() => setState((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
                  on ? "bg-primary" : "bg-line"
                }`}
              >
                <span
                  className={`absolute top-1 flex size-6 items-center justify-center rounded-full bg-surface shadow-[var(--shadow-card)] transition-all ${
                    on ? "left-7 text-primary" : "left-1 text-transparent"
                  }`}
                >
                  <Check aria-hidden className="size-3.5" />
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
