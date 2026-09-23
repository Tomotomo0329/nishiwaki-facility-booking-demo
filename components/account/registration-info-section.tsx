import { BadgeCheck, Fingerprint, HelpCircle, IdCard, MapPin, PhoneCall, RefreshCw, VenusAndMars } from "lucide-react";

/**
 * 利用者登録情報（個人単位）。
 *
 * 団体の話（利用者区分・減免区分）は団体情報・メンバー管理へ移したため、
 * ここは氏名以外の本人確認情報（住所・性別・eKYCでの本人確認書類）と
 * 登録有効期限だけを扱う。
 */
export function RegistrationInfoSection() {
  return (
    <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="pb-space-md">
        <div className="flex items-center gap-space-xs">
          <h2 className="flex items-center gap-space-xs text-h2 text-primary">
            <IdCard aria-hidden className="size-6 text-primary" />
            利用者登録情報（連携済）
          </h2>
          <span className="rounded-full bg-ok-surface px-2.5 py-0.5 text-xs font-bold text-ok">
            本登録
          </span>
        </div>
        <p className="mt-1 text-caption text-ink-muted">
          eKYCによる本人確認が完了した、西脇市の正式な利用者登録情報です。住所や本人確認書類の変更には再度の確認手続きが必要です。
        </p>
      </div>

      <div className="mb-space-lg grid grid-cols-1 gap-space-sm sm:grid-cols-2">
        <div className="rounded-xl bg-canvas p-space-md">
          <span className="mb-1 flex items-center gap-1.5 text-caption text-ink-muted">
            <MapPin aria-hidden className="size-4" />
            住所
          </span>
          <p className="text-body-bold text-primary">兵庫県西脇市西脇123-4</p>
        </div>
        <div className="rounded-xl bg-canvas p-space-md">
          <span className="mb-1 flex items-center gap-1.5 text-caption text-ink-muted">
            <VenusAndMars aria-hidden className="size-4" />
            性別
          </span>
          <p className="text-body-bold text-primary">男性</p>
        </div>
        <div className="rounded-xl bg-canvas p-space-md">
          <span className="mb-1 flex items-center gap-1.5 text-caption text-ink-muted">
            <Fingerprint aria-hidden className="size-4" />
            本人確認書類（eKYC）
          </span>
          <p className="text-body-bold text-primary">マイナンバーカード</p>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-ok">
            <BadgeCheck aria-hidden className="size-3.5" />
            本人確認済み
          </span>
        </div>
        <div className="rounded-xl bg-canvas p-space-md">
          <span className="mb-1 flex items-center gap-1.5 text-caption text-ink-muted">
            登録有効期限
          </span>
          <p className="text-body-bold text-primary numeric">2027年3月31日</p>
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-ok">
            <RefreshCw aria-hidden className="size-3.5" />
            自動更新対象
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-space-md pt-space-xs sm:flex-row">
        <p className="flex items-center gap-space-xs text-caption text-ink-muted">
          <HelpCircle aria-hidden className="size-[18px] shrink-0" />
          住所・本人確認書類の変更は総合市民センター（オリナス）窓口でお手続きください
        </p>
        <a
          href="tel:0795-22-3111"
          className="flex min-h-[48px] w-full items-center justify-center gap-space-xs rounded-lg bg-canvas px-space-lg text-body-bold text-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-surface sm:w-auto"
        >
          <PhoneCall aria-hidden className="size-5" />
          変更・更新は窓口へお問い合わせ
        </a>
      </div>
    </section>
  );
}
