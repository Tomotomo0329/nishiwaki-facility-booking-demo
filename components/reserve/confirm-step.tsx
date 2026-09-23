import { useState } from "react";
import { ArrowLeft, Loader2, Lock, Phone, User } from "lucide-react";

import { FacilitySlotSummary } from "@/components/reserve/facility-slot-summary";
import { PriceSummarySidebar } from "@/components/reserve/price-summary-sidebar";
import type { DemoUser } from "@/lib/auth-context";
import type { FacilityDetail } from "@/lib/demo-data";
import type { Organization } from "@/lib/organization";
import { EQUIPMENT_OPTIONS, type ReservationDraft } from "@/lib/reservation-flow";

/** 内容確認ステップ（Stitch「予約確認」相当。抽選申込では支払い方法・QR前提を省く） */
export function ConfirmStep({
  facility,
  date,
  draft,
  onDraftChange,
  user,
  organization,
  isLottery,
  submitting,
  onBack,
  onConfirm,
}: {
  facility: FacilityDetail;
  date: Date;
  draft: ReservationDraft;
  onDraftChange: (patch: Partial<ReservationDraft>) => void;
  user: DemoUser;
  organization: Organization | null;
  isLottery: boolean;
  submitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [agreeRules, setAgreeRules] = useState(false);
  const [agreeCleaning, setAgreeCleaning] = useState(false);
  const canSubmit = agreeRules && agreeCleaning && !submitting;

  const equipmentSelected = EQUIPMENT_OPTIONS.filter((e) => draft.equipment.includes(e.id));

  return (
    <div className="space-y-space-lg">
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12 lg:items-start">
        <div className="space-y-space-lg lg:col-span-8">
          <ReviewCard title="施設・日程情報" onEdit={onBack}>
            <FacilitySlotSummary facility={facility} date={date} slotId={draft.slotId} />
          </ReviewCard>

          <ReviewCard title="申請者・利用目的" onEdit={onBack}>
            <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
              <div className="space-y-space-sm">
                <InfoRow icon={User} label="申請責任者">
                  {user.name}（{user.kana}）
                </InfoRow>
                <InfoRow icon={Phone} label="緊急連絡先">
                  <span className="numeric">{draft.phone}</span>
                </InfoRow>
                <InfoRow label="申請団体">
                  {organization ? (
                    <span className="flex items-center gap-1.5">
                      {organization.name}
                      <span className="rounded bg-primary-surface px-1.5 py-0.5 text-[11px] font-bold text-primary">
                        {organization.feeExemptionPercent}%減免
                      </span>
                    </span>
                  ) : (
                    "個人利用（団体指定なし）"
                  )}
                </InfoRow>
              </div>
              <div className="space-y-space-sm rounded-lg bg-canvas p-space-md">
                <InfoRow label="利用目的">{draft.purpose}</InfoRow>
                <InfoRow label="参加人数">
                  <span className="numeric">{draft.participants}</span>名
                </InfoRow>
                {draft.remarks ? <InfoRow label="特記事項">{draft.remarks}</InfoRow> : null}
              </div>
            </div>
          </ReviewCard>

          {!isLottery && equipmentSelected.length > 0 ? (
            <ReviewCard title="選択した付帯設備・備品" onEdit={onBack}>
              <ul className="divide-y divide-line">
                {equipmentSelected.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-space-md py-space-sm">
                    <div>
                      <p className="text-caption-bold text-ink">{e.label}</p>
                      <p className="text-xs text-ink-muted">{e.description}</p>
                    </div>
                    <span className="numeric font-bold text-ink">¥{e.price.toLocaleString("ja-JP")}</span>
                  </li>
                ))}
              </ul>
            </ReviewCard>
          ) : null}
        </div>

        <div className="lg:col-span-4">
          {/* サイドバーと支払い方法を同じ sticky コンテナにまとめる（分けると
              下の要素だけ普通にスクロールしてサイドバーに重なってしまう） */}
          <div className="lg:sticky lg:top-[100px]">
            <PriceSummarySidebar
              facility={facility}
              discountPercent={organization?.feeExemptionPercent ?? 0}
              discountLabel={organization ? `${organization.name} 減免` : null}
              equipmentIds={isLottery ? [] : draft.equipment}
              isLottery={isLottery}
            />

            {!isLottery ? (
              <div className="mt-space-md rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)]">
                <fieldset>
                  <legend className="mb-space-sm flex items-center gap-1 text-caption-bold text-ink">
                    お支払い方法
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-bold text-on-primary">必須</span>
                  </legend>
                  <div className="space-y-2">
                    <PaymentOption
                      id="pay-counter"
                      label="現地窓口決済"
                      description="利用当日、施設窓口にて現金または各種キャッシュレス決済でお支払い。"
                      checked={draft.paymentMethod === "counter"}
                      onSelect={() => onDraftChange({ paymentMethod: "counter" })}
                    />
                    <PaymentOption
                      id="pay-online"
                      label="オンライン即時決済"
                      description="予約完了後、クレジットカード情報入力画面へ進みます（デモのため実際の決済は行われません）。"
                      checked={draft.paymentMethod === "online"}
                      onSelect={() => onDraftChange({ paymentMethod: "online" })}
                    />
                  </div>
                </fieldset>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
        <div className="mb-space-md flex items-center gap-2 border-b border-line pb-space-sm">
          <h2 className="text-h3 text-ink">利用規約および条例遵守の同意</h2>
          <span className="ml-auto rounded bg-danger px-2 py-0.5 text-[11px] font-bold text-white">必須確認</span>
        </div>

        <div className="mb-space-md max-h-40 space-y-space-sm overflow-y-auto rounded-lg bg-canvas p-space-md text-xs leading-relaxed text-ink-muted">
          <p>
            <strong className="text-ink">第1条（施設条例・管理規則の遵守）</strong>
            <br />
            利用者は西脇市公の施設利用条例および施行規則を遵守し、施設管理者の指示に従わなければなりません。
          </p>
          <p>
            <strong className="text-ink">第2条（原状回復および清掃美化の義務）</strong>
            <br />
            利用終了後は直ちに器具備品を原状に復帰し、清掃を行ってください。ゴミは利用者が責任をもってお持ち帰りください。
          </p>
          <p>
            <strong className="text-ink">第3条（安全管理・事故責任）</strong>
            <br />
            利用中の事故および貴重品の盗難・紛失について、市に重大な過失がある場合を除き、市および施設管理者は責任を負いません。
          </p>
        </div>

        <div className="space-y-space-sm rounded-lg bg-canvas p-space-md">
          <label className="flex cursor-pointer items-start gap-space-sm">
            <input
              type="checkbox"
              checked={agreeRules}
              onChange={(e) => setAgreeRules(e.target.checked)}
              className="mt-1 size-5 rounded text-primary focus:ring-primary"
            />
            <span className="text-caption text-ink">
              <strong>【必須】</strong>西脇市公の施設条例および上記利用規約をすべて確認し、これに同意します。
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-space-sm">
            <input
              type="checkbox"
              checked={agreeCleaning}
              onChange={(e) => setAgreeCleaning(e.target.checked)}
              className="mt-1 size-5 rounded text-primary focus:ring-primary"
            />
            <span className="text-caption text-ink">
              <strong>【必須】</strong>ゴミの持ち帰り、退館前の清掃および設備の原状復帰を誓約します。
            </span>
          </label>
        </div>
      </section>

      {/* 固定表示（sticky/fixed）はやめて、規約同意のすぐ下に通常の要素として置く */}
      <div className="flex flex-col items-center justify-between gap-space-md sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-canvas px-space-lg text-body-bold text-ink transition-colors hover:bg-line/60 sm:w-auto"
        >
          <ArrowLeft aria-hidden className="size-[18px]" />
          入力内容を修正する
        </button>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={onConfirm}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-space-xl text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden className="size-5 animate-spin" />
              処理中...
            </>
          ) : (
            <>
              <Lock aria-hidden className="size-5" />
              {isLottery ? "抽選に申し込む" : "予約を確定する"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="mb-space-md flex items-center justify-between border-b border-line pb-space-sm">
        <h2 className="text-h3 text-ink">{title}</h2>
        <button
          type="button"
          onClick={onEdit}
          className="text-caption-bold text-primary hover:underline"
        >
          変更する
        </button>
      </div>
      {children}
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon?: typeof User;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-xs text-ink-muted">{label}</span>
      <p className="flex items-center gap-1.5 text-body-bold text-ink">
        {Icon ? <Icon aria-hidden className="size-4 text-primary" /> : null}
        {children}
      </p>
    </div>
  );
}

function PaymentOption({
  id,
  label,
  description,
  checked,
  onSelect,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-space-sm rounded-lg p-space-sm transition-colors ${
        checked ? "bg-primary-surface ring-2 ring-primary" : "bg-canvas hover:bg-line/30"
      }`}
    >
      <input
        id={id}
        type="radio"
        name="payment-method"
        checked={checked}
        onChange={onSelect}
        className="mt-1 size-4 text-primary focus:ring-primary"
      />
      <div>
        <span className="text-caption-bold text-ink">{label}</span>
        <p className="mt-0.5 text-xs leading-snug text-ink-muted">{description}</p>
      </div>
    </label>
  );
}
