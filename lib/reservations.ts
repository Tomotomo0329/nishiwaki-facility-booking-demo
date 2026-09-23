/**
 * マイページ（予約一覧）のデモデータ。
 *
 * 正式な予約データは Stitch 未設計のため、既存の施設データ（demo-data.ts）と
 * 整合する形でこのファイルにモックを置く。日付は DEMO_TODAY（2026-09-20）を
 * 基準に、今後の予約と利用履歴が両方出るように組んである。
 *
 * 予約詳細・入館用QRコード画面（Stitch「入館用QRコード・利用許可書控え」参考）で
 * 使う付帯情報（利用目的・団体・付帯設備など）もここに保持する。
 */

import type { SlotId } from "./availability";
import { getFacilityDetail } from "./demo-data";
import type { PaymentMethod } from "./reservation-flow";

export type ReservationStatus = "confirmed" | "completed" | "cancelled";

export type Reservation = {
  id: string;
  facilitySlug: string;
  roomLabel: string;
  date: Date;
  slotId: SlotId;
  slotLabel: string;
  status: ReservationStatus;
  fee: number;
  purpose: string;
  participants: number;
  equipmentIds: string[];
  organizationId: string | null;
  paymentMethod: PaymentMethod;
  /** 予約詳細画面に表示する整理番号（見た目だけの疑似ID） */
  permitNumber: string;
  /** 入館用QRコードに埋め込む想定のトークン（読み取れない場合の控え表示にも使う） */
  qrToken: string;
};

export const demoReservations: Reservation[] = [
  {
    id: "RSV-20260926-01",
    facilitySlug: "sogo-shimin-gym",
    roomLabel: "体育館 全面",
    date: new Date(2026, 8, 26),
    slotId: "pm",
    slotLabel: "午後 13:00 - 17:00",
    status: "confirmed",
    fee: 1400,
    purpose: "市民スポーツ親善練習",
    participants: 24,
    equipmentIds: ["aircon", "audio"],
    organizationId: "nishiwaki-basketball",
    paymentMethod: "counter",
    permitNumber: "NW-20260926-7731",
    qrToken: "NW-7731-TOKEN",
  },
  {
    id: "RSV-20261003-01",
    facilitySlug: "hirano-tennis",
    roomLabel: "オムニコート A面",
    date: new Date(2026, 9, 3),
    slotId: "am",
    slotLabel: "午前 9:00 - 12:00",
    status: "confirmed",
    fee: 600,
    purpose: "個人練習",
    participants: 2,
    equipmentIds: [],
    organizationId: null,
    paymentMethod: "online",
    permitNumber: "NW-20261003-4415",
    qrToken: "NW-4415-TOKEN",
  },
  {
    id: "RSV-20260906-01",
    facilitySlug: "hino-sports-center",
    roomLabel: "体育館",
    date: new Date(2026, 8, 6),
    slotId: "am",
    slotLabel: "午前 9:00 - 12:00",
    status: "completed",
    fee: 900,
    purpose: "地域スポーツ教室",
    participants: 15,
    equipmentIds: [],
    organizationId: null,
    paymentMethod: "counter",
    permitNumber: "NW-20260906-2208",
    qrToken: "NW-2208-TOKEN",
  },
  {
    id: "RSV-20260829-01",
    facilitySlug: "kurodasho-sports-center",
    roomLabel: "競技場",
    date: new Date(2026, 7, 29),
    slotId: "pm",
    slotLabel: "午後 13:00 - 17:00",
    status: "completed",
    fee: 800,
    purpose: "少年野球チーム練習",
    participants: 18,
    equipmentIds: [],
    organizationId: null,
    paymentMethod: "counter",
    permitNumber: "NW-20260829-9012",
    qrToken: "NW-9012-TOKEN",
  },
  {
    id: "RSV-20260913-01",
    facilitySlug: "sogo-shimin-seminar",
    roomLabel: "大研修室",
    date: new Date(2026, 8, 13),
    slotId: "pm",
    slotLabel: "午後 13:00 - 17:00",
    status: "cancelled",
    fee: 1500,
    purpose: "地域サークル定例会",
    participants: 12,
    equipmentIds: [],
    organizationId: null,
    paymentMethod: "counter",
    permitNumber: "NW-20260913-5540",
    qrToken: "NW-5540-TOKEN",
  },
];

/** 予約に紐づく施設情報を取得する（一覧表示用） */
export function getReservationFacility(facilitySlug: string) {
  return getFacilityDetail(facilitySlug);
}

/** 予約IDから1件を取得する（予約詳細・QRコード画面用） */
export function getReservationById(id: string): Reservation | undefined {
  return demoReservations.find((r) => r.id === id);
}
