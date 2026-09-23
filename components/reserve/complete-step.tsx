"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  Check,
  CircleCheck,
  Copy,
  MapPin,
  Ticket,
} from "lucide-react";

import { formatJpDate } from "@/lib/availability";
import type { FacilityDetail } from "@/lib/demo-data";
import type { Organization } from "@/lib/organization";
import { calculateFee, SLOT_LABELS, type ReservationDraft } from "@/lib/reservation-flow";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/** 完了ステップ（Stitch「予約完了」相当）。抽選申込時は決済・入館案内を省いた簡易版になる */
export function CompleteStep({
  facility,
  date,
  draft,
  organization,
  isLottery,
  referenceId,
}: {
  facility: FacilityDetail;
  date: Date;
  draft: ReservationDraft;
  organization: Organization | null;
  isLottery: boolean;
  referenceId: string;
}) {
  const [copied, setCopied] = useState(false);
  const fee = calculateFee({
    baseFee: facility.feePerSlot,
    discountPercent: organization?.feeExemptionPercent ?? 0,
    equipmentIds: isLottery ? [] : draft.equipment,
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない環境では何もしない
    }
  }

  return (
    <div className="space-y-space-lg">
      {/* ---------------- 成功バナー ---------------- */}
      <div className="flex flex-col gap-space-md rounded-xl bg-gradient-to-r from-ok-surface via-canvas to-ok-surface p-space-lg shadow-[var(--shadow-card)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-space-md">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ok text-white">
            <CircleCheck aria-hidden className="size-8" />
          </div>
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="rounded bg-ok px-2 py-0.5 text-xs font-bold text-white">
                {isLottery ? "抽選申込 受付完了" : "申請受付完了"}
              </span>
            </div>
            <h1 className="text-h2 text-ink">
              {isLottery ? "抽選申込を受け付けました" : "施設利用の予約が完了しました"}
            </h1>
            <p className="mt-1 text-caption text-ink-muted">
              {isLottery
                ? "抽選結果はマイページの抽選申込一覧で確認できます。当選した場合は結果発表後にお手続きが必要です。"
                : "利用当日は下記予約番号を窓口でご提示ください。"}
            </p>
          </div>
        </div>
        <div className="flex min-w-[220px] flex-col gap-1 rounded-lg bg-surface p-space-md shadow-[var(--shadow-card)]">
          <span className="text-xs uppercase tracking-wider text-ink-muted">
            {isLottery ? "抽選申込番号" : "予約照会番号"}
          </span>
          <span className="numeric text-[22px] font-bold tracking-widest text-primary">{referenceId}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-1 flex items-center gap-1 text-caption-bold text-primary hover:underline"
          >
            {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
            {copied ? "コピーしました" : "番号をコピー"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12 lg:items-start">
        <div className="space-y-space-lg lg:col-span-8">
          {/* ---------------- 予約内容サマリー ---------------- */}
          <article className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 bg-canvas px-space-lg py-space-sm">
              <Ticket aria-hidden className="size-5 text-primary" />
              <h2 className="text-h3 text-ink">
                {isLottery ? "抽選申込内容サマリー" : "予約内容サマリー"}
              </h2>
            </div>
            <div className="flex flex-col gap-space-md p-space-lg sm:flex-row">
              <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg sm:w-44">
                <Image src={facility.image} alt={facility.imageAlt} fill sizes="176px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-caption text-ink-muted">
                  <MapPin aria-hidden className="size-4" />
                  {facility.address}
                </p>
                <h3 className="text-h2 text-ink">{facility.primaryRoomLabel}</h3>

                <div className="mt-space-sm grid grid-cols-1 gap-space-sm sm:grid-cols-2">
                  <div className="rounded-lg bg-canvas p-space-sm">
                    <span className="text-xs text-ink-muted">利用予定日時</span>
                    <p className="text-body-bold text-ink numeric">{formatJpDate(date)}</p>
                    <p className="text-[15px] font-bold text-primary">{SLOT_LABELS[draft.slotId]}</p>
                  </div>
                  <div className="rounded-lg bg-canvas p-space-sm">
                    <span className="text-xs text-ink-muted">
                      {isLottery ? "当選時のお支払い概算" : "施設使用料（概算合計）"}
                    </span>
                    <p className="numeric text-[20px] font-bold text-ink">
                      {yen(isLottery ? fee.roomFeeAfterDiscount : fee.total)}
                    </p>
                  </div>
                </div>

                <div className="mt-space-sm grid grid-cols-1 gap-space-sm sm:grid-cols-2">
                  <div className="rounded bg-canvas p-space-sm">
                    <span className="text-xs text-ink-muted">利用目的</span>
                    <p className="text-caption-bold text-ink">{draft.purpose}</p>
                  </div>
                  <div className="rounded bg-canvas p-space-sm">
                    <span className="text-xs text-ink-muted">申請者名義</span>
                    <p className="text-caption-bold text-ink">
                      {organization ? `${organization.name}` : "個人利用"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ---------------- 次のアクション ---------------- */}
          <section className="rounded-xl bg-surface p-space-lg shadow-[var(--shadow-card)]">
            <h2 className="mb-space-md text-h3 text-ink">次のアクション</h2>
            <div className="flex flex-col gap-space-sm sm:flex-row">
              <Link
                href="/calendar"
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-canvas px-space-lg text-body-bold text-ink transition-colors hover:bg-line/60"
              >
                <CalendarPlus aria-hidden className="size-5" />
                続けて別の枠を予約する
              </Link>
              <Link
                href={isLottery ? "/mypage/lottery" : "/mypage/reservations"}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-space-lg text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover"
              >
                {isLottery ? "マイページで抽選申込一覧を確認" : "マイページで予約一覧を確認"}
                <ArrowRight aria-hidden className="size-5" />
              </Link>
            </div>
          </section>
        </div>

        <aside className="space-y-space-md lg:col-span-4">
          {!isLottery ? (
            <div className="rounded-xl bg-surface p-space-lg shadow-[var(--shadow-card)]">
              <h2 className="mb-space-sm text-h3 text-ink">利用当日のご案内</h2>
              <ol className="space-y-space-sm">
                <GuideItem n={1} title="入館・鍵の受け取り">
                  利用開始の10分前より受付窓口にて予約確認および解錠を行います。
                </GuideItem>
                <GuideItem n={2} title="室内用シューズの持参">
                  フロアは土足厳禁です。専用の室内シューズをご持参ください。
                </GuideItem>
                <GuideItem n={3} title="原状回復と清掃">
                  利用後は器具の片付けと清掃を行い、利用日誌を受付へご返却ください。
                </GuideItem>
              </ol>
            </div>
          ) : null}

          <div className="rounded-xl bg-canvas p-space-md">
            <h3 className="mb-1 text-caption-bold text-ink">
              {isLottery ? "抽選申込の取消について" : "変更およびキャンセル規定"}
            </h3>
            <p className="text-xs leading-relaxed text-ink-muted">
              {isLottery
                ? "抽選申込の取消はマイページの抽選申込一覧からいつでも行えます。"
                : "オンラインでの取消・枠変更は、利用日の3日前23:59までマイページからペナルティなしで行えます。"}
            </p>
          </div>

          <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)]">
            <span className="text-xs text-ink-muted">施設管轄窓口</span>
            <p className="text-caption-bold text-ink">{facility.contact.office}</p>
            <a href={`tel:${facility.contact.tel}`} className="numeric text-primary hover:underline">
              {facility.contact.tel}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function GuideItem({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-space-sm">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-surface text-xs font-bold text-primary numeric">
        {n}
      </span>
      <div>
        <p className="text-caption-bold text-ink">{title}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{children}</p>
      </div>
    </li>
  );
}
