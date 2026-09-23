/**
 * 予約申請〜抽選〜完了フローのドメインロジック。
 *
 * 実際の決済・抽選処理は行わない（開発方針 §0）。料金計算だけは
 * 実際に画面の入力に応じて動く形にし、体験としての説得力を持たせる。
 */

import { getDayType, type SlotId } from "./availability";

export type EquipmentOption = {
  id: string;
  label: string;
  description: string;
  price: number;
};

export const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: "aircon",
    label: "冷暖房設備の利用",
    description: "室内の空調（冷房・暖房）を利用します",
    price: 500,
  },
  {
    id: "audio",
    label: "音響設備の利用",
    description: "マイク・スピーカーなど館内放送設備一式",
    price: 300,
  },
  {
    id: "furniture",
    label: "備品セット（長机・椅子）",
    description: "長机10台・パイプ椅子30脚のセット貸出",
    price: 200,
  },
];

/** その日が抽選対象（土曜・日曜・祝日）かどうか。平日は先着順の即時予約 */
export function requiresLottery(date: Date): boolean {
  return getDayType(date) !== "weekday";
}

export type FeeBreakdown = {
  roomFee: number;
  discountPercent: number;
  discountAmount: number;
  roomFeeAfterDiscount: number;
  equipmentBreakdown: { id: string; label: string; price: number }[];
  equipmentFee: number;
  total: number;
};

export function calculateFee({
  baseFee,
  discountPercent,
  equipmentIds,
}: {
  baseFee: number;
  discountPercent: number;
  equipmentIds: string[];
}): FeeBreakdown {
  const discountAmount = Math.round((baseFee * discountPercent) / 100);
  const roomFeeAfterDiscount = baseFee - discountAmount;
  const equipmentBreakdown = EQUIPMENT_OPTIONS.filter((e) =>
    equipmentIds.includes(e.id),
  ).map((e) => ({ id: e.id, label: e.label, price: e.price }));
  const equipmentFee = equipmentBreakdown.reduce((sum, e) => sum + e.price, 0);

  return {
    roomFee: baseFee,
    discountPercent,
    discountAmount,
    roomFeeAfterDiscount,
    equipmentBreakdown,
    equipmentFee,
    total: roomFeeAfterDiscount + equipmentFee,
  };
}

function dateStamp(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/** デモ用の予約番号を発行する（見た目だけの疑似ID） */
export function generateReservationId(date: Date): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `NW-${dateStamp(date)}-${rand}`;
}

/** デモ用の抽選申込番号を発行する */
export function generateLotteryId(date: Date): string {
  const rand = Math.floor(10 + Math.random() * 90);
  return `LOT-${dateStamp(date)}-${rand}`;
}

export const SLOT_LABELS: Record<SlotId, string> = {
  am: "午前 9:00 〜 12:00",
  pm: "午後 13:00 〜 17:00",
  night: "夜間 18:00 〜 21:30",
};

export type PaymentMethod = "counter" | "online";

/** 申請内容入力フォームの下書き。ステップ間はこの1オブジェクトを引き回す */
export type ReservationDraft = {
  slotId: SlotId;
  phone: string;
  organizationId: string | null;
  purpose: string;
  participants: number;
  equipment: string[];
  remarks: string;
  paymentMethod: PaymentMethod;
};
