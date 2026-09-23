import { useState } from "react";
import { ArrowRight, Info, Ticket, Users } from "lucide-react";

import { FacilitySlotSummary } from "@/components/reserve/facility-slot-summary";
import { PriceSummarySidebar } from "@/components/reserve/price-summary-sidebar";
import type { DemoUser } from "@/lib/auth-context";
import type { FacilityDetail } from "@/lib/demo-data";
import type { Organization } from "@/lib/organization";
import { purposes } from "@/lib/demo-data";
import { EQUIPMENT_OPTIONS, type ReservationDraft } from "@/lib/reservation-flow";

/** 申請内容入力ステップ（Stitch「予約内容の入力」「抽選の申込」を1フォームに統合） */
export function BookingInputStep({
  facility,
  date,
  isLottery,
  draft,
  onChange,
  user,
  organizations,
  onSubmit,
}: {
  facility: FacilityDetail;
  date: Date;
  isLottery: boolean;
  draft: ReservationDraft;
  onChange: (patch: Partial<ReservationDraft>) => void;
  user: DemoUser;
  organizations: Organization[];
  onSubmit: () => void;
}) {
  const selectedOrg = organizations.find((o) => o.id === draft.organizationId) ?? null;
  const overCapacity = draft.participants > facility.capacityNumber;
  const invalidParticipants = draft.participants < 1;

  // 参加人数の表示用テキストは draft.participants（数値）と別管理する。
  // 数値に直結させると空欄が強制的に "0" 表示へ戻り、続けて入力した数字が
  // "02" のように連結されてしまうため、空欄はそのまま空欄として保持する
  const [participantsText, setParticipantsText] = useState(String(draft.participants));

  function handleParticipantsChange(raw: string) {
    if (!/^\d*$/.test(raw)) return; // 数字以外は無視
    setParticipantsText(raw);
    onChange({ participants: raw === "" ? 0 : Number(raw) });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-space-lg lg:grid-cols-12 lg:items-start">
      <div className="space-y-space-lg lg:col-span-8">
        <FacilitySlotSummary facility={facility} date={date} slotId={draft.slotId} />

        {isLottery ? (
          <div className="flex items-start gap-space-sm rounded-xl bg-warn-surface p-space-md text-warn">
            <Ticket aria-hidden className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-caption-bold">この日は抽選対象です</p>
              <p className="mt-1 text-xs leading-relaxed">
                土曜・日曜・祝日は利用希望が集中するため抽選制です。内容を送信すると「予約」ではなく「抽選申込」として受け付けられ、結果はマイページの抽選申込一覧で確認できます。
              </p>
            </div>
          </div>
        ) : null}

        {/* ---------------- 1. 申請者・登録団体情報 ---------------- */}
        <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
          <div className="mb-space-md flex items-center gap-2">
            <span aria-hidden className="h-6 w-1.5 rounded-full bg-primary" />
            <h2 className="text-h3 text-ink">1. 申請者・登録団体情報</h2>
          </div>

          <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
            <Field label="申請責任者氏名" badge="自動入力">
              <div className="flex min-h-[48px] items-center rounded-lg bg-canvas px-space-md text-body-bold text-ink">
                {user.name}（{user.kana}）
              </div>
            </Field>

            <div>
              <label htmlFor="org-select" className="mb-1 flex items-center justify-between text-caption-bold text-ink">
                団体として申請する
                <span className="rounded bg-canvas px-1.5 py-0.5 text-xs font-normal text-ink-muted">任意</span>
              </label>
              <select
                id="org-select"
                value={draft.organizationId ?? ""}
                onChange={(e) => onChange({ organizationId: e.target.value || null })}
                className="min-h-[48px] w-full rounded-lg bg-canvas px-space-md text-body text-ink focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">個人利用（団体なし）</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}（{org.feeExemptionPercent}%減免）
                  </option>
                ))}
              </select>
              {selectedOrg ? (
                <p className="mt-1 text-xs text-ok">
                  {selectedOrg.certificationLabel}として、施設基本料金が{selectedOrg.feeExemptionPercent}
                  %減免されます。
                </p>
              ) : (
                <p className="mt-1 text-xs text-ink-muted">団体を選ぶと減免が自動適用されます</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="contact-phone" className="mb-1 flex items-center justify-between text-caption-bold text-ink">
                当日の緊急連絡先電話番号
                <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-bold text-on-primary">必須</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                required
                value={draft.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="例: 090-1234-5678"
                className="min-h-[48px] w-full rounded-lg bg-canvas px-space-md text-body text-ink numeric placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-ink-muted">
                ※ 荒天時の臨時休館や施設管理者からの緊急連絡時に使用します。
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- 2. 利用目的と人数 ---------------- */}
        <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
          <div className="mb-space-md flex items-center gap-2">
            <span aria-hidden className="h-6 w-1.5 rounded-full bg-primary" />
            <h2 className="text-h3 text-ink">2. 利用目的と参加人数</h2>
          </div>

          <div className="space-y-space-md">
            <div>
              <label htmlFor="purpose-select" className="mb-1 flex items-center justify-between text-caption-bold text-ink">
                利用目的・種目
                <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-bold text-on-primary">必須</span>
              </label>
              <select
                id="purpose-select"
                required
                value={draft.purpose}
                onChange={(e) => onChange({ purpose: e.target.value })}
                className="min-h-[48px] w-full rounded-lg bg-canvas px-space-md text-body text-ink focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">選択してください</option>
                {purposes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
                <option value="その他">その他（地域行事など）</option>
              </select>
            </div>

            <div className="max-w-[220px]">
              <label htmlFor="participants-count" className="mb-1 flex items-center justify-between text-caption-bold text-ink">
                参加人数
                <span className="rounded bg-primary px-1.5 py-0.5 text-xs font-bold text-on-primary">必須</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="participants-count"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={participantsText}
                  onChange={(e) => handleParticipantsChange(e.target.value)}
                  className="min-h-[48px] w-full rounded-lg bg-canvas pl-space-md pr-10 text-body-bold text-ink numeric focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="pointer-events-none absolute right-4 text-caption-bold text-ink-muted">名</span>
              </div>
            </div>
          </div>

          <div className="mt-space-md flex items-center gap-2 rounded-lg bg-canvas p-space-sm text-caption text-ink">
            <Users aria-hidden className="size-5 text-primary" />
            <span>
              定員目安: <span className="numeric">{facility.capacityNumber}</span>名
            </span>
            <span className={`ml-auto text-xs font-bold ${overCapacity ? "text-danger" : "text-ok"}`}>
              {overCapacity ? "定員を超過しています" : "収容定員内"}
            </span>
          </div>
        </section>

        {/* ---------------- 3. 付帯設備（即時予約のみ） ---------------- */}
        {!isLottery ? (
          <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
            <div className="mb-space-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span aria-hidden className="h-6 w-1.5 rounded-full bg-primary" />
                <h2 className="text-h3 text-ink">3. 付帯設備・備品利用の選択</h2>
              </div>
              <span className="text-xs text-ink-muted">チェックで合計額に加算</span>
            </div>

            <div className="space-y-space-sm">
              {EQUIPMENT_OPTIONS.map((eq) => {
                const checked = draft.equipment.includes(eq.id);
                return (
                  <label
                    key={eq.id}
                    className="flex cursor-pointer items-start justify-between gap-space-sm rounded-xl bg-canvas p-space-md transition-colors hover:bg-line/30"
                  >
                    <div className="flex items-start gap-space-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          onChange({
                            equipment: checked
                              ? draft.equipment.filter((id) => id !== eq.id)
                              : [...draft.equipment, eq.id],
                          })
                        }
                        className="mt-1 size-5 rounded text-primary focus:ring-primary"
                      />
                      <div>
                        <span className="text-body-bold text-ink">{eq.label}</span>
                        <p className="mt-0.5 text-caption text-ink-muted">{eq.description}</p>
                      </div>
                    </div>
                    <span className="shrink-0 numeric font-bold text-primary">
                      ¥{eq.price.toLocaleString("ja-JP")}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* ---------------- 4. 特記事項 ---------------- */}
        <section className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
          <div className="mb-space-md flex items-center gap-2">
            <span aria-hidden className="h-6 w-1.5 rounded-full bg-primary" />
            <h2 className="text-h3 text-ink">{isLottery ? "3" : "4"}. 特記事項・管理者への要望</h2>
            <span className="ml-auto rounded bg-canvas px-2 py-0.5 text-xs text-ink-muted">任意入力</span>
          </div>
          <textarea
            value={draft.remarks}
            onChange={(e) => onChange({ remarks: e.target.value })}
            maxLength={200}
            rows={3}
            placeholder="借用備品の希望や駐車場利用台数など、連絡事項があればご記入ください。"
            className="w-full rounded-lg bg-canvas p-space-md text-body text-ink placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-muted">
            <span>※ 設備や鍵の受渡しは当日窓口で行います。</span>
            <span className="numeric">{draft.remarks.length} / 200 文字</span>
          </div>
        </section>
      </div>

      <div className="lg:col-span-4">
        {/* サイドバーとボタンを同じ sticky コンテナにまとめる（別々に sticky を
            付けるとボタンだけ普通にスクロールし、サイドバーに重なってしまう） */}
        <div className="lg:sticky lg:top-[100px]">
          <PriceSummarySidebar
            facility={facility}
            discountPercent={selectedOrg?.feeExemptionPercent ?? 0}
            discountLabel={selectedOrg ? `${selectedOrg.name} 減免` : null}
            equipmentIds={isLottery ? [] : draft.equipment}
            isLottery={isLottery}
          />

          <button
            type="submit"
            disabled={!draft.purpose || !draft.phone || invalidParticipants || overCapacity}
            className="mt-space-md flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLottery ? "抽選申込内容の確認へ" : "予約内容の確認へ進む"}
            <ArrowRight aria-hidden className="size-5" />
          </button>
          {!draft.purpose || !draft.phone || invalidParticipants ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
              <Info aria-hidden className="size-[14px]" />
              利用目的・連絡先電話番号・参加人数（1名以上）の入力が必要です
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  badge,
  children,
}: {
  label: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1 flex items-center justify-between text-caption-bold text-ink">
        {label}
        <span className="rounded bg-canvas px-1.5 py-0.5 text-xs font-normal text-ink-muted">{badge}</span>
      </span>
      {children}
    </div>
  );
}
