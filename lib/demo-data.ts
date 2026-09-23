/**
 * デモデータ。
 *
 * 正式なシードは今後 data/seed/ に開発方針 §4-3 のスキーマ
 * （Data Connect の正規化テーブル）で置く。ここは画面確認用の暫定データ。
 */

import {
  getDayType,
  offeredSlots,
  toKey,
  type SlotId,
  type SlotState,
} from "./availability";

/* ============================ 施設カード ============================ */

/** 施設一覧画面の「設備・仕様」絞り込みで使うキー */
export type AmenityFilterKey = "parking" | "nightLighting" | "aircon" | "shower";

export const amenityFilterOptions: { value: AmenityFilterKey; label: string }[] = [
  { value: "parking", label: "駐車場あり" },
  { value: "nightLighting", label: "夜間照明" },
  { value: "aircon", label: "空調あり" },
  { value: "shower", label: "シャワーあり" },
];

export type Facility = {
  slug: string;
  name: string;
  area: string;
  capacity: string;
  feePerSlot: number;
  tags: string[];
  image: string;
  /** Stitch の data-alt から起こした代替テキスト（JIS AA 要件） */
  imageAlt: string;
  hasOpening: boolean;
  /** 施設一覧の「カテゴリ」絞り込みで使う分類 */
  category: string;
  /** 施設一覧の定員レンジスライダーで使う数値（人 or 面あたりの目安人数） */
  capacityNumber: number;
  /** 施設一覧の「設備・仕様」絞り込みで使うフラグ */
  amenityFilters: AmenityFilterKey[];
  /** 施設一覧カードのバッジ表示。SlotState のうち open/limited のみ使う */
  availabilityStatus: SlotState;
};

export const popularFacilities: Facility[] = [
  {
    slug: "sogo-shimin-gym",
    name: "総合市民センター 体育館",
    area: "西脇地域",
    capacity: "西脇 ・ 定員2,500人",
    feePerSlot: 1200,
    tags: ["体育館", "冷暖房完備", "駐車場あり"],
    image: "/images/facilities/sogo-shimin-gym.jpg",
    imageAlt:
      "高い天井と大きな高窓から自然光が差し込む、磨かれた木製フロアの体育館",
    hasOpening: true,
    category: "体育館",
    capacityNumber: 2500,
    amenityFilters: ["parking", "aircon", "shower"],
    availabilityStatus: "open",
  },
  {
    slug: "hino-sports-center",
    name: "日野体育センター",
    area: "日野地域",
    capacity: "日野 ・ 定員600人",
    feePerSlot: 900,
    tags: ["体育館", "卓球台多数", "駐車場あり"],
    image: "/images/facilities/hino-sports-center.jpg",
    imageAlt: "コートラインが引かれた板張りの床と観覧席のある屋内体育館",
    hasOpening: true,
    category: "体育館",
    capacityNumber: 600,
    amenityFilters: ["parking", "shower"],
    availabilityStatus: "open",
  },
  {
    slug: "kurodasho-sports-center",
    name: "黒田庄体育センター",
    area: "黒田庄地域",
    capacity: "黒田庄 ・ 定員800人",
    feePerSlot: 800,
    tags: ["バドミントン", "バスケット", "更衣室あり"],
    image: "/images/facilities/kurodasho-sports-center.jpg",
    imageAlt:
      "バドミントンコートのマットが敷かれ、鉄骨の高い天井を持つ多目的体育館",
    hasOpening: true,
    category: "体育館",
    capacityNumber: 800,
    amenityFilters: ["parking"],
    availabilityStatus: "limited",
  },
  {
    slug: "hirano-tennis",
    name: "平野テニスコート",
    area: "西脇地域",
    capacity: "西脇 ・ オムニ2面",
    feePerSlot: 600,
    tags: ["オムニコート", "夜間照明", "クラブハウス"],
    image: "/images/facilities/hirano-tennis.jpg",
    imageAlt: "緑に囲まれた砂入り人工芝のテニスコート2面",
    hasOpening: true,
    category: "テニスコート",
    capacityNumber: 40,
    amenityFilters: ["nightLighting", "parking"],
    availabilityStatus: "open",
  },
  {
    slug: "kurodasho-stadium",
    name: "黒田庄ふれあいスタジアム",
    area: "黒田庄地域",
    capacity: "黒田庄 ・ 定員3,000人",
    feePerSlot: 2400,
    tags: ["野球・ソフト", "スコアボード", "夜間照明"],
    image: "/images/facilities/kurodasho-stadium.jpg",
    imageAlt: "スコアボードと内野スタンドを備えた野球場",
    hasOpening: true,
    category: "グラウンド",
    capacityNumber: 3000,
    amenityFilters: ["nightLighting", "parking"],
    availabilityStatus: "limited",
  },
  {
    slug: "sogo-shimin-seminar",
    name: "総合市民センター 大研修室",
    area: "西脇地域",
    capacity: "西脇 ・ 定員120人",
    feePerSlot: 1500,
    tags: ["研修・会議", "プロジェクター", "Wi-Fi完備"],
    image: "/images/facilities/sogo-shimin-seminar.jpg",
    imageAlt: "長机と椅子が整然と並び、演台とスクリーンを備えた大研修室",
    hasOpening: true,
    category: "研修室・会議室",
    capacityNumber: 120,
    amenityFilters: ["parking", "aircon"],
    availabilityStatus: "open",
  },
];

/* ============================ 施設詳細 ============================ */

export type AmenityKey =
  | "parking"
  | "locker"
  | "shower"
  | "aircon"
  | "wifi"
  | "accessible"
  | "lighting"
  | "projector";

export type Photo = { src: string; alt: string; caption: string };

export type Room = {
  name: string;
  areaSqm: string;
  capacity: string;
  inCity: number;
  general: number;
  primary?: boolean;
};

export type FacilityDetail = Facility & {
  facilityId: string;
  category: string;
  instantBooking: boolean;
  address: string;
  headcountLabel: string;
  sizeLabel: string;
  description: string;
  amenities: { key: AmenityKey; label: string; note: string }[];
  rooms: Room[];
  pricingNote: string;
  photos: Photo[];
  photoCount: number;
  mapImage: string;
  access: string[];
  contact: { office: string; tel: string; hours: string };
  /** 詳細画面のカレンダーが対象にする諸室 */
  primaryRoomLabel: string;
};

const GYM_PHOTOS: Photo[] = [
  {
    src: "/images/facilities/sogo-shimin-gym/arena-main.jpg",
    alt: "バスケットゴールとバレーボールネットが設置された、木製フロアの広いメインアリーナ",
    caption: "メインアリーナ (全面コート)",
  },
  {
    src: "/images/facilities/sogo-shimin-gym/exterior.jpg",
    alt: "木を基調とした低層の市民体育館の外観と、前庭の植栽",
    caption: "施設外観",
  },
  {
    src: "/images/facilities/sogo-shimin-gym/entrance.jpg",
    alt: "木の受付カウンターと案内モニターが並ぶエントランスロビー",
    caption: "エントランス受付",
  },
  {
    src: "/images/facilities/sogo-shimin-gym/court-detail.jpg",
    alt: "ニス塗りの床に引かれた競技用コートラインの接写",
    caption: "コート設備",
  },
  {
    src: "/images/facilities/sogo-shimin-gym/locker.jpg",
    alt: "ステンレス製ロッカーが整然と並ぶ清潔な更衣室",
    caption: "更衣室・シャワー",
  },
];

const gymDetail: FacilityDetail = {
  ...popularFacilities[0],
  facilityId: "NW-014",
  category: "屋内スポーツ施設",
  instantBooking: true,
  address: "西脇市下戸田44-1",
  headcountLabel: "定員 約2,500人",
  sizeLabel: "1,280㎡ (32m × 40m)",
  primaryRoomLabel: "体育館 全面",
  description:
    "西脇市の中心的な屋内スポーツ施設です。公式バスケットボールコート2面、バレーボールコート3面、バドミントンコート8面が確保可能。照明設備・音響設備完備。更衣室および温水シャワー室を備えています。市民大会や各種サークル活動、健康増進レクリエーションまで幅広くご利用いただけます。",
  amenities: [
    { key: "parking", label: "駐車場", note: "80台無料" },
    { key: "locker", label: "更衣室", note: "男女完備" },
    { key: "shower", label: "シャワー", note: "温水あり" },
    { key: "aircon", label: "空調設備", note: "冷暖房完備" },
    { key: "wifi", label: "Wi-Fi", note: "公衆無線LAN" },
    { key: "accessible", label: "バリアフリー", note: "多目的トイレ有" },
  ],
  rooms: [
    {
      name: "体育館 全面",
      areaSqm: "1,280㎡",
      capacity: "2,500人",
      inCity: 1200,
      general: 2400,
      primary: true,
    },
    {
      name: "体育館 半面",
      areaSqm: "640㎡",
      capacity: "1,200人",
      inCity: 600,
      general: 1200,
    },
    {
      name: "武道館",
      areaSqm: "480㎡",
      capacity: "500人",
      inCity: 800,
      general: 1600,
    },
    {
      name: "大研修室",
      areaSqm: "180㎡",
      capacity: "120人",
      inCity: 500,
      general: 1000,
    },
  ],
  pricingNote:
    "西脇市内に在住・在勤・在学の方は「市内料金」が適用されます。冷暖房をご利用の際は別途基本料金の30%が加算されます。",
  photos: GYM_PHOTOS,
  photoCount: 18,
  mapImage: "/images/facilities/sogo-shimin-gym/map.png",
  access: [
    "JR加古川線「西脇市駅」より徒歩約12分",
    "コミュニティバス「のぎくバス」総合市民センター前下車すぐ",
  ],
  contact: {
    office: "総合市民センター 管理課",
    tel: "0795-22-3111",
    hours: "平日 8:30 - 17:15（休館日を除く）",
  },
};

/**
 * 総合市民センター 体育館だけが Stitch で詳細まで設計されている。
 * 他の施設はカード情報から妥当な詳細を組み立てて、リンク切れを防ぐ。
 */
function deriveDetail(f: Facility, index: number): FacilityDetail {
  const isOutdoor = ["hirano-tennis", "kurodasho-stadium"].includes(f.slug);
  const isMeeting = f.slug === "sogo-shimin-seminar";
  return {
    ...f,
    facilityId: `NW-${String(20 + index).padStart(3, "0")}`,
    category: isMeeting
      ? "研修・会議施設"
      : isOutdoor
        ? "屋外スポーツ施設"
        : "屋内スポーツ施設",
    instantBooking: true,
    address: `西脇市（${f.area}）`,
    headcountLabel: f.capacity.split("・")[1]?.trim() ?? f.capacity,
    sizeLabel: f.tags[0],
    primaryRoomLabel: f.name,
    description: `${f.name}の詳細情報です。${f.tags.join("・")}を備えています。市民大会やサークル活動、地域行事に幅広くご利用いただけます。`,
    amenities: [
      { key: "parking", label: "駐車場", note: "あり" },
      { key: "locker", label: "更衣室", note: "男女完備" },
      isOutdoor
        ? { key: "lighting" as const, label: "夜間照明", note: "利用可" }
        : { key: "aircon" as const, label: "空調設備", note: "完備" },
      isMeeting
        ? { key: "projector" as const, label: "プロジェクター", note: "貸出可" }
        : { key: "shower" as const, label: "シャワー", note: "温水あり" },
      { key: "wifi", label: "Wi-Fi", note: "公衆無線LAN" },
      { key: "accessible", label: "バリアフリー", note: "多目的トイレ有" },
    ],
    rooms: [
      {
        name: f.name,
        areaSqm: "—",
        capacity: f.capacity.split("・")[1]?.trim() ?? "—",
        inCity: f.feePerSlot,
        general: f.feePerSlot * 2,
        primary: true,
      },
    ],
    pricingNote:
      "西脇市内に在住・在勤・在学の方は「市内料金」が適用されます。",
    photos: [{ src: f.image, alt: f.imageAlt, caption: f.name }],
    photoCount: 1,
    mapImage: "/images/facilities/sogo-shimin-gym/map.png",
    access: ["JR加古川線「西脇市駅」より路線バス"],
    contact: {
      office: "総合市民センター 管理課",
      tel: "0795-22-3111",
      hours: "平日 8:30 - 17:15（休館日を除く）",
    },
  };
}

export const facilityDetails: Record<string, FacilityDetail> = {
  [gymDetail.slug]: gymDetail,
  ...Object.fromEntries(
    popularFacilities
      .slice(1)
      .map((f, i) => [f.slug, deriveDetail(f, i + 1)] as const),
  ),
};

export function getFacilityDetail(slug: string): FacilityDetail | undefined {
  return facilityDetails[slug];
}

/* ====================== トップページ 週間空き状況 ====================== */

export type DayAvailability = {
  date: Date;
  label: string;
  weekday: string;
  isRed: boolean;
  slots: { id: SlotId; state: SlotState }[];
};

/** 2026-09-15 から7日分。曜日は実際の暦から求める（モックの曜日は誤っていた） */
export function buildWeeklyStrip(): DayAvailability[] {
  const weekdayChars = ["日", "月", "火", "水", "木", "金", "土"];
  const pattern: Record<string, SlotState[]> = {
    "2026-09-15": ["open", "booked", "open"],
    "2026-09-16": ["open", "open", "open"],
    "2026-09-17": ["booked", "open", "booked"],
    "2026-09-18": ["open", "open", "open"],
    "2026-09-19": ["open", "booked", "booked"],
    "2026-09-20": ["open", "booked", "closed"],
    "2026-09-21": ["booked", "limited", "closed"],
  };

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2026, 8, 15 + i);
    const key = toKey(date);
    const type = getDayType(date);
    const offered = offeredSlots(date);
    const states = pattern[key] ?? ["open", "open", "open"];

    return {
      date,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      weekday:
        type === "holiday"
          ? `${weekdayChars[date.getDay()]}・祝`
          : weekdayChars[date.getDay()],
      isRed: type === "sunday" || type === "holiday",
      slots: (["am", "pm", "night"] as SlotId[]).map((id, idx) => ({
        id,
        // 提供されない区分は必ず休館として描く（日曜・祝日の夜間）
        state: offered.includes(id) ? states[idx] : ("closed" as SlotState),
      })),
    };
  });
}

/* ============================== お知らせ ============================== */

export type NoticeTone = "important" | "maintenance" | "info";

export type Notice = {
  id: string;
  date: string;
  tone: NoticeTone;
  label: string;
  title: string;
  /** 詳細画面の本文（段落ごとに区切って表示） */
  body: string[];
};

export const notices: Notice[] = [
  {
    id: "2026-10-lottery",
    date: "2026.09.10",
    tone: "important",
    label: "重要",
    title: "10月分抽選申込の受付期間について (10/1〜10/10)",
    body: [
      "10月にご利用いただく施設の抽選申込受付を、10月1日(木)から10月10日(土)まで実施します。対象は土曜・日曜・祝日枠のご利用です。",
      "抽選申込はマイページの「抽選申込」からいつでも行えます。結果発表は10月12日(月・祝)を予定しており、当選された方には登録メールアドレス宛てに通知いたします。",
      "1つの枠に対して複数の団体・個人からお申込みがあった場合のみ抽選となります。申込多数の場合はご希望に添えないことがございますので、あらかじめご了承ください。",
    ],
  },
  {
    id: "2026-09-sogo-shimin-maintenance",
    date: "2026.09.05",
    tone: "maintenance",
    label: "メンテナンス",
    title: "総合市民センター 電気設備点検に伴う臨時休館のお知らせ (9/28)",
    body: [
      "法定点検のため、下記日程で西脇市総合市民センターを臨時休館いたします。ご利用予定の皆さまにはご不便をおかけしますが、ご理解のほどよろしくお願いいたします。",
      "臨時休館日: 2026年9月28日(月) ※曜日にかかわらず終日休館します。",
      "既に同日でご予約をいただいている場合は、窓口または電話にて日程変更のご案内をいたします。",
    ],
  },
  {
    id: "2026-08-autumn-sports-priority",
    date: "2026.08.25",
    tone: "info",
    label: "お知らせ",
    title: "秋季市民スポーツ大会開催に伴う優先利用枠の公開",
    body: [
      "10月下旬に開催予定の「西脇市秋季市民スポーツ大会」に向けて、出場団体向けの優先利用枠を公開しました。",
      "対象となるのは西脇市総合市民センター体育館および総合体育館の一部時間帯です。優先枠のご利用には、事前の団体登録と大会エントリーの確認が必要です。",
      "詳しい対象時間帯や申込方法については、総合市民センター窓口までお問い合わせください。",
    ],
  },
];

/** お知らせIDから1件を取得する（お知らせ詳細画面用） */
export function getNotice(id: string): Notice | undefined {
  return notices.find((n) => n.id === id);
}

export const purposes = [
  "バスケットボール",
  "バレーボール",
  "バドミントン",
  "卓球",
  "テニス",
  "野球",
  "サッカー",
  "会議・研修",
  "音楽",
  "武道",
];

export const areas = ["すべて", "西脇地域", "日野地域", "黒田庄地域", "比延地域"];

/**
 * ホーム検索フォームの「目的」から施設一覧の「カテゴリ」フィルターへの対応表。
 * 一致するカテゴリが無い目的（例: 音楽）は絞り込みをかけず一覧をそのまま表示する。
 */
export const purposeToCategory: Partial<Record<string, string>> = {
  バスケットボール: "体育館",
  バレーボール: "体育館",
  バドミントン: "体育館",
  卓球: "体育館",
  武道: "体育館",
  テニス: "テニスコート",
  野球: "グラウンド",
  サッカー: "グラウンド",
  "会議・研修": "研修室・会議室",
};
