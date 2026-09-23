/**
 * 空き状況のドメインロジック。
 *
 * 将来バックエンドを載せたとき、このファイルはそのままサーバへ移せる
 * （開発方針 §4-1 の domain/ にあたる）。UI に依存させない。
 */

export type SlotId = "am" | "pm" | "night";
export type SlotState = "open" | "limited" | "booked" | "closed";
export type DayType = "weekday" | "saturday" | "sunday" | "holiday";

export const SLOTS: { id: SlotId; label: string; time: string }[] = [
  { id: "am", label: "午前", time: "9:00 - 12:00" },
  { id: "pm", label: "午後", time: "13:00 - 17:00" },
  { id: "night", label: "夜間", time: "18:00 - 21:30" },
];

export const slotLabels: Record<SlotId, string> = {
  am: "午前",
  pm: "午後",
  night: "夜間",
};

/** 2026年の祝日（デモに必要な範囲のみ。YYYY-MM-DD） */
const HOLIDAYS_2026 = new Set([
  "2026-09-21", // 敬老の日
  "2026-09-22", // 国民の休日（前後を祝日に挟まれた平日）
  "2026-09-23", // 秋分の日
]);

/** 祝日名。バッジ表示用（無い日は無名の「祝日」として扱う） */
export const HOLIDAY_NAMES: Record<string, string> = {
  "2026-09-21": "敬老の日",
  "2026-09-22": "国民の休日",
  "2026-09-23": "秋分の日",
};

/** デモ内で「今日」として扱う固定日付（2026-09-20・日曜） */
export const DEMO_TODAY = new Date(2026, 8, 20);

export function toKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "YYYY-MM-DD" を Date に戻す。不正な形式なら null（toKey の逆関数） */
export function fromKey(key: string | undefined | null): Date | null {
  if (!key) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getDayType(date: Date): DayType {
  if (HOLIDAYS_2026.has(toKey(date))) return "holiday";
  const day = date.getDay();
  if (day === 0) return "sunday";
  if (day === 6) return "saturday";
  return "weekday";
}

/**
 * その日に提供される時間区分を返す。
 *
 * 利用時間は 9:00〜21:30。ただし日曜・祝日は 17:00 までのため
 * 夜間区分を提供しない（開発方針 §3）。
 * 「曜日により提供枠が変わる」というこの制約が、
 * データモデルと画面の両方に効いてくる。
 */
export function offeredSlots(date: Date): SlotId[] {
  const type = getDayType(date);
  return type === "sunday" || type === "holiday"
    ? ["am", "pm"]
    : ["am", "pm", "night"];
}

export const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export type CalendarCell = {
  date: Date;
  key: string;
  day: number;
  inMonth: boolean;
  dayType: DayType;
  /** その日の総合ステータス。休館日は "closed" */
  state: SlotState;
};

/**
 * 月カレンダーのマス目を生成する（既定は日曜始まり。startDay: "monday" で月曜始まり）。
 * 前後の月にはみ出す分も返す（inMonth: false）。
 */
export function buildMonthGrid(
  year: number,
  month: number,
  resolveState: (date: Date) => SlotState,
  startDay: "sunday" | "monday" = "sunday",
): CalendarCell[] {
  const first = new Date(year, month - 1, 1);
  const start = new Date(first);
  // 週の最終曜日（日曜始まりなら土曜=6、月曜始まりなら日曜=0）
  const lastWeekday = startDay === "monday" ? 0 : 6;
  const offset =
    startDay === "monday" ? (first.getDay() + 6) % 7 : first.getDay();
  start.setDate(first.getDate() - offset);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const inMonth = date.getMonth() === month - 1;
    cells.push({
      date,
      key: toKey(date),
      day: date.getDate(),
      inMonth,
      dayType: getDayType(date),
      state: inMonth ? resolveState(date) : "closed",
    });
    // 月内の日を出し切って週の区切りまで来たら終了
    if (i >= 27 && date.getMonth() !== month - 1 && date.getDay() === lastWeekday) break;
  }
  return cells;
}

export type ClosureReason = "regular" | "maintenance";

/** 設備点検などによる臨時休館日（曜日に関わらず終日休館。YYYY-MM-DD） */
const MAINTENANCE_DAYS = new Set([
  "2026-09-28", // 電気設備点検（お知らせ §と対応）
]);

/**
 * 休館理由を返す（休館でなければ null）。
 *
 * 定休日は毎週月曜。ただし月曜が祝日の場合は特別開館する
 * （実際の公共施設の運用に合わせた振替ルール）。
 * 設備点検日は曜日に関わらず終日休館し、定休日より優先する。
 */
export function getClosureReason(date: Date): ClosureReason | null {
  if (MAINTENANCE_DAYS.has(toKey(date))) return "maintenance";
  if (date.getDay() === 1 && getDayType(date) !== "holiday") return "regular";
  return null;
}

/** 施設ごとに異なる疑似パターンを出すための簡易ハッシュ（0〜96） */
export function seedFromSlug(slug: string): number {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 97;
  return h;
}

/**
 * 日単位の疑似ステータス（カレンダーの丸バッジや施設横断比較で使用）。
 * 本番では reservation_slots の JOIN 結果に置き換わる。
 *
 * seedOffset で施設ごとに異なるパターンを出せる（seedFromSlug の戻り値を渡す）。
 */
export function demoStateFor(date: Date, seedOffset = 0): SlotState {
  if (getClosureReason(date)) return "closed";
  const seed = date.getDate() * 7 + date.getMonth() + seedOffset;
  const mod = seed % 10;
  if (mod < 5) return "open";
  if (mod < 8) return "limited";
  return "booked";
}

/**
 * 時間区分（午前/午後/夜間）単位の疑似ステータス。月間カレンダーの詳細表示で使用。
 * その区分がそもそも提供されない日（日曜・祝日の夜間など）は "closed" を返す。
 */
export function demoSlotStateFor(
  date: Date,
  slotId: SlotId,
  seedOffset = 0,
): SlotState {
  if (getClosureReason(date)) return "closed";
  if (!offeredSlots(date).includes(slotId)) return "closed";
  const slotIndex = SLOTS.findIndex((s) => s.id === slotId);
  const seed = date.getDate() * 7 + date.getMonth() + seedOffset + slotIndex * 3;
  const mod = seed % 10;
  if (mod < 5) return "open";
  if (mod < 8) return "limited";
  return "booked";
}

export function formatJpDate(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日(${WEEKDAY_LABELS[date.getDay()]})`;
}

/** 新しく選択された日付に対して、最初に選べる時間枠を決める（空きがあればそれを、無ければ最初の提供枠を仮選択） */
export function firstPickableSlot(date: Date, seedOffset = 0): SlotId {
  const offered = offeredSlots(date);
  const open = offered.find((id) => demoSlotStateFor(date, id, seedOffset) === "open");
  return open ?? offered[0] ?? "am";
}
