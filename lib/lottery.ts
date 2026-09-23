/**
 * マイページ（抽選申込）のデモデータ。
 *
 * lib/reservations.ts と同じ考え方で、既存の施設データと整合する形の
 * モックをここに置く。抽選は毎月12日に発表される想定（アカウント設定の
 * 通知文言と対応）で、DEMO_TODAY（2026-09-20）を基準に発表待ち／発表済みが
 * 両方出るように組んである。
 */

import { getFacilityDetail } from "./demo-data";

export type LotteryStatus = "pending" | "won" | "lost" | "withdrawn";

export type LotteryApplication = {
  id: string;
  facilitySlug: string;
  roomLabel: string;
  /** 抽選対象の利用日 */
  targetDate: Date;
  slotLabel: string;
  /** 抽選結果の発表日 */
  drawDate: Date;
  status: LotteryStatus;
  fee: number;
};

export const demoLotteryApplications: LotteryApplication[] = [
  {
    id: "LOT-20261018-01",
    facilitySlug: "sogo-shimin-gym",
    roomLabel: "体育館 全面",
    targetDate: new Date(2026, 9, 18),
    slotLabel: "午後 13:00 - 17:00",
    drawDate: new Date(2026, 9, 12),
    status: "pending",
    fee: 1200,
  },
  {
    id: "LOT-20260927-01",
    facilitySlug: "kurodasho-stadium",
    roomLabel: "グラウンド 全面",
    targetDate: new Date(2026, 8, 27),
    slotLabel: "午前 9:00 - 12:00",
    drawDate: new Date(2026, 8, 12),
    status: "won",
    fee: 2400,
  },
  {
    id: "LOT-20260927-02",
    facilitySlug: "hirano-tennis",
    roomLabel: "オムニコート A面",
    targetDate: new Date(2026, 8, 27),
    slotLabel: "午後 13:00 - 17:00",
    drawDate: new Date(2026, 8, 12),
    status: "lost",
    fee: 600,
  },
];

/** 抽選申込に紐づく施設情報を取得する（一覧表示用） */
export function getLotteryFacility(facilitySlug: string) {
  return getFacilityDetail(facilitySlug);
}
