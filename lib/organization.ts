/**
 * マイページ（団体情報・メンバー管理）のデモデータ。
 *
 * 1アカウントが複数団体に所属できる想定で、団体は id で管理する。
 * lib/reservations.ts と同じ考え方で、Stitch の「団体情報・メンバー管理」画面
 * を土台にしたモックをここに置く。市内在住・在勤・在学比率などの条例要件は
 * メンバー一覧から動的に算出する（メンバー編集後も数値の整合が崩れないように）。
 */

export type MemberRole = "representative" | "manager" | "viewer";
export type ResidencyType = "inside_live" | "inside_work" | "outside";
export type MemberStatus = "verified" | "pending";

export type Member = {
  id: string;
  name: string;
  /** アバター代わりに表示する頭文字 */
  initial: string;
  email: string;
  title?: string;
  role: MemberRole;
  residency: ResidencyType;
  status: MemberStatus;
};

export const ROLE_LABELS: Record<MemberRole, string> = {
  representative: "代表管理者",
  manager: "予約・決済権限あり",
  viewer: "閲覧のみ",
};

export const RESIDENCY_LABELS: Record<ResidencyType, string> = {
  inside_live: "市内在住",
  inside_work: "市内在勤・在学",
  outside: "市外在住",
};

export type Organization = {
  id: string;
  name: string;
  category: string;
  certificationLabel: string;
  exemptionNo: string;
  feeExemptionLabel: string;
  registrationExpiry: Date;
  establishedDate: Date;
  representativeName: string;
  representativeTel: string;
  requiredResidencyRatio: number;
  /** このアカウントの、この団体における立場。代表者以外はメンバー管理を閲覧のみにする */
  myRole: "representative" | "member";
  /** 予約申請時、施設基本料金からこの割合が自動減免される（feeExemptionLabel の数値表現） */
  feeExemptionPercent: number;
};

export const demoOrganizations: Organization[] = [
  {
    id: "nishiwaki-basketball",
    name: "西脇バスケットボールクラブ",
    category: "スポーツ振興団体",
    certificationLabel: "市民公認団体",
    exemptionNo: "N-2018-084",
    feeExemptionLabel: "使用料50%免除 適用中",
    registrationExpiry: new Date(2027, 2, 31),
    establishedDate: new Date(2018, 3, 1),
    representativeName: "西脇 太郎",
    representativeTel: "090-1234-5678",
    requiredResidencyRatio: 70,
    myRole: "representative",
    feeExemptionPercent: 50,
  },
  {
    id: "nishiwaki-tennis-circle",
    name: "西脇ミニテニスサークル",
    category: "生涯スポーツサークル",
    certificationLabel: "市民公認団体",
    exemptionNo: "N-2022-031",
    feeExemptionLabel: "使用料30%免除 適用中",
    registrationExpiry: new Date(2027, 5, 30),
    establishedDate: new Date(2022, 6, 1),
    representativeName: "中井 美咲",
    representativeTel: "080-9876-5432",
    requiredResidencyRatio: 70,
    myRole: "member",
    feeExemptionPercent: 30,
  },
];

export function getOrganization(id: string): Organization | undefined {
  return demoOrganizations.find((o) => o.id === id);
}

const basketballMembers: Member[] = [
  {
    id: "MEM-001",
    name: "西脇 太郎",
    initial: "西",
    email: "taro.nishiwaki@example.jp",
    title: "代表者",
    role: "representative",
    residency: "inside_live",
    status: "verified",
  },
  {
    id: "MEM-002",
    name: "足立 健一",
    initial: "足",
    email: "adachi.k@example.jp",
    title: "副代表",
    role: "manager",
    residency: "inside_live",
    status: "verified",
  },
  {
    id: "MEM-003",
    name: "藤原 誠",
    initial: "藤",
    email: "m-fujiwara@example.jp",
    title: "会計・広報",
    role: "viewer",
    residency: "inside_live",
    status: "verified",
  },
  {
    id: "MEM-004",
    name: "笹倉 敬子",
    initial: "笹",
    email: "keiko.sasakura@example.jp",
    role: "viewer",
    residency: "inside_work",
    status: "verified",
  },
  {
    id: "MEM-005",
    name: "丹波 浩二",
    initial: "丹",
    email: "k-tamba@example.jp",
    role: "viewer",
    residency: "outside",
    status: "pending",
  },
];

const tennisCircleMembers: Member[] = [
  {
    id: "MEM-101",
    name: "中井 美咲",
    initial: "中",
    email: "misaki.nakai@example.jp",
    title: "代表者",
    role: "representative",
    residency: "inside_live",
    status: "verified",
  },
  {
    id: "MEM-102",
    name: "西脇 太郎",
    initial: "西",
    email: "taro.nishiwaki@example.jp",
    title: "会員",
    role: "viewer",
    residency: "inside_live",
    status: "verified",
  },
  {
    id: "MEM-103",
    name: "岸本 玲奈",
    initial: "岸",
    email: "r-kishimoto@example.jp",
    role: "viewer",
    residency: "inside_work",
    status: "verified",
  },
];

export const demoMembersByOrganization: Record<string, Member[]> = {
  "nishiwaki-basketball": basketballMembers,
  "nishiwaki-tennis-circle": tennisCircleMembers,
};

export type OrganizationDocument = {
  name: string;
  sizeLabel: string;
  updatedLabel: string;
};

export const demoDocumentsByOrganization: Record<string, OrganizationDocument[]> = {
  "nishiwaki-basketball": [
    { name: "2026年度_団体規約・会則.pdf", sizeLabel: "420 KB", updatedLabel: "2026/04/02 承認済" },
    { name: "メンバー名簿_最新.pdf", sizeLabel: "312 KB", updatedLabel: "2026/05/10 提出" },
  ],
  "nishiwaki-tennis-circle": [
    { name: "サークル会則.pdf", sizeLabel: "180 KB", updatedLabel: "2026/07/01 承認済" },
  ],
};
