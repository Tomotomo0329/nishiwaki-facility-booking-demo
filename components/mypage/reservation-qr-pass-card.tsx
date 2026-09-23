"use client";

import { useState } from "react";
import { Copy, Check, Info, Phone, QrCode, Ban, History } from "lucide-react";

import { QrCodeMock } from "@/components/mypage/qr-code-mock";
import type { FacilityDetail } from "@/lib/demo-data";
import type { Reservation } from "@/lib/reservations";

/** 予約詳細の右カラム: 入館用QRコード（Stitch「入館用QRコード・利用許可書控え」参考） */
export function ReservationQrPassCard({
  reservation,
  facility,
}: {
  reservation: Reservation;
  facility: FacilityDetail;
}) {
  const [copied, setCopied] = useState(false);
  const active = reservation.status === "confirmed";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reservation.qrToken);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない環境では何もしない
    }
  }

  return (
    <div className="space-y-space-md">
      <div className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]">
        <div className="bg-primary p-space-md text-on-primary">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                active ? "bg-ok text-white" : "bg-white/15 text-white/85"
              }`}
            >
              <span aria-hidden className={`size-1.5 rounded-full bg-white ${active ? "animate-pulse" : ""}`} />
              {reservation.status === "confirmed"
                ? "入館コード（受付前）"
                : reservation.status === "completed"
                  ? "利用済み"
                  : "キャンセル済み"}
            </span>
          </div>
          <h2 className="text-h3 text-white">入館用スマートパス</h2>
          <p className="text-caption text-white/80">受付端末スキャン専用QRコード</p>
        </div>

        <div className="flex flex-col items-center gap-space-md p-space-lg text-center">
          <div className="relative rounded-xl bg-canvas p-3 shadow-[var(--shadow-card)]">
            <div className="flex size-52 items-center justify-center overflow-hidden rounded-lg bg-surface p-3">
              {active ? (
                <QrCodeMock label={`${facility.name} 入館用QRコード`} />
              ) : (
                <div className="flex flex-col items-center gap-2 text-ink-subtle">
                  {reservation.status === "completed" ? (
                    <History aria-hidden className="size-10" />
                  ) : (
                    <Ban aria-hidden className="size-10" />
                  )}
                  <p className="text-caption-bold">
                    {reservation.status === "completed" ? "この入館コードは利用済みです" : "この予約はキャンセル済みです"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <span className="text-xs text-ink-muted">端末が読み取れない場合の認証コード</span>
            <div className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-canvas px-4 py-2">
              <span className="numeric text-[18px] font-bold tracking-widest text-primary">
                {reservation.qrToken}
              </span>
              {active ? (
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="認証コードをコピー"
                  className="rounded p-1 text-ink-muted hover:text-primary"
                >
                  {copied ? <Check aria-hidden className="size-[18px]" /> : <Copy aria-hidden className="size-[18px]" />}
                </button>
              ) : null}
            </div>
            {copied ? <p className="pt-1 text-xs text-ok">コードをコピーしました</p> : null}
          </div>

          {active ? (
            <div className="w-full rounded-xl bg-canvas p-space-md text-left">
              <p className="mb-1 flex items-center gap-1.5 text-caption-bold text-ink">
                <QrCode aria-hidden className="size-[18px] text-primary" />
                窓口での入館方法
              </p>
              <p className="text-xs leading-relaxed text-ink-muted">
                {facility.name}
                受付カウンターのタッチリーダーにこのQRコードをかざしてください。自動で照合され、鍵および付帯設備の貸出札が発行されます。
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)]">
        <p className="mb-2 flex items-center gap-1.5 text-caption-bold text-ink">
          <Info aria-hidden className="size-[18px] text-primary" />
          当施設のお問い合わせ
        </p>
        <p className="text-xs leading-relaxed text-ink-muted">
          {facility.contact.office}
          <br />
          受付時間: {facility.contact.hours}
        </p>
        <a
          href={`tel:${facility.contact.tel}`}
          className="mt-2 flex items-center gap-1.5 text-caption-bold text-primary hover:underline"
        >
          <Phone aria-hidden className="size-4" />
          <span className="numeric">{facility.contact.tel}</span>
        </a>
      </div>
    </div>
  );
}
