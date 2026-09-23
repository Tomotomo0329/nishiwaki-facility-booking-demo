import { Info, Phone, Receipt, TriangleAlert } from "lucide-react";

import { calculateFee } from "@/lib/reservation-flow";
import type { FacilityDetail } from "@/lib/demo-data";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

/** 料金内訳・キャンセルポリシー・問い合わせ先をまとめたサイドバー */
export function PriceSummarySidebar({
  facility,
  discountPercent,
  discountLabel,
  equipmentIds,
  isLottery,
}: {
  facility: FacilityDetail;
  discountPercent: number;
  discountLabel: string | null;
  equipmentIds: string[];
  isLottery: boolean;
}) {
  const fee = calculateFee({
    baseFee: facility.feePerSlot,
    discountPercent,
    equipmentIds,
  });

  // sticky はここでは付けない。呼び出し側が「このサイドバーの下に続くボタン等」も
  // まとめて同じ sticky コンテナに入れる（そうしないと、sticky なサイドバーだけが
  // 画面に張り付いた状態で、下の兄弟要素だけが普通にスクロールしてしまい、
  // スクロール位置によってはサイドバーの上にボタンが重なって見える不具合が起きる）
  return (
    <aside className="space-y-space-md">
      <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)]">
        <div className="mb-space-sm flex items-center justify-between border-b border-line pb-space-sm">
          <h2 className="flex items-center gap-1.5 text-h3 text-ink">
            <Receipt aria-hidden className="size-5 text-primary" />
            {isLottery ? "概算利用料金" : "利用料金の概算内訳"}
          </h2>
          <span className="rounded bg-canvas px-2 py-0.5 text-xs font-bold text-ink-muted">税込</span>
        </div>

        <div className="space-y-2 text-caption">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">施設基本室料</span>
            <span className="numeric font-bold">{yen(fee.roomFee)}</span>
          </div>

          {fee.discountAmount > 0 ? (
            <div className="flex items-center justify-between text-ok">
              <span className="flex items-center gap-1">{discountLabel ?? "団体減免"}</span>
              <span className="numeric font-bold">-{yen(fee.discountAmount)}</span>
            </div>
          ) : null}

          {!isLottery && fee.equipmentBreakdown.length > 0 ? (
            <>
              <div className="flex items-center justify-between border-t border-line pt-2">
                <span className="text-ink-muted">付帯設備利用料</span>
                <span className="numeric font-bold">{yen(fee.equipmentFee)}</span>
              </div>
              <ul className="space-y-0.5 pl-3 text-xs text-ink-muted">
                {fee.equipmentBreakdown.map((e) => (
                  <li key={e.id} className="flex justify-between">
                    <span>・{e.label}</span>
                    <span className="numeric">{yen(e.price)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <div className="mt-space-sm rounded-lg bg-canvas p-space-md">
            <div className="flex items-baseline justify-between">
              <span className="text-caption-bold text-ink">
                {isLottery ? "当選時のお支払い概算" : "合計請求額"}
              </span>
              <span className="text-[24px] font-bold text-primary numeric">
                {yen(isLottery ? fee.roomFeeAfterDiscount : fee.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-canvas p-space-md">
        <p className="mb-2 flex items-center gap-1.5 text-caption-bold text-ink">
          <TriangleAlert aria-hidden className="size-[18px] text-warn" />
          {isLottery ? "抽選申込に関するご注意" : "キャンセルポリシー"}
        </p>
        <p className="text-xs leading-relaxed text-ink-muted">
          {isLottery
            ? "抽選申込の取消はマイページの抽選申込一覧からいつでも可能です。当選後のキャンセルには規定のキャンセル料が発生する場合があります。"
            : "利用日の3日前までシステム上での無料取消が可能です。それ以降のキャンセルは規定のキャンセル料が発生します。"}
        </p>
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
    </aside>
  );
}
