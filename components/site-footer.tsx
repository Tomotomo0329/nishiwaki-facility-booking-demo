import Link from "next/link";

const columns = [
  {
    heading: "施設一覧",
    links: [
      { label: "総合市民センター", href: "/facilities" },
      { label: "体育館", href: "/facilities" },
      { label: "市民グラウンド", href: "/facilities" },
      { label: "地域研修室・会議室", href: "/facilities" },
    ],
  },
  {
    heading: "ご利用案内",
    links: [
      { label: "予約手順ガイド", href: "/guide" },
      { label: "施設利用料金表", href: "/fees" },
      { label: "利用者登録について", href: "/mypage" },
      { label: "よくある質問（FAQ）", href: "/faq" },
    ],
  },
  {
    heading: "自治体情報",
    links: [
      { label: "西脇市ホームページ", href: "#" },
      { label: "伝統産業・播州織のご案内", href: "#" },
      { label: "個人情報保護方針", href: "/privacy" },
      { label: "ウェブアクセシビリティ方針 (JIS AA)", href: "/accessibility" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-primary text-on-primary">
      <div className="mx-auto max-w-[1200px] px-gutter-mobile md:px-gutter pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl">
          {columns.map((col) => (
            <div key={col.heading} className="space-y-space-sm">
              <h2 className="text-h3 tracking-wide border-b border-on-primary/20 pb-space-xs">
                {col.heading}
              </h2>
              <ul className="space-y-space-xs text-caption text-on-primary/80">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block py-1 hover:text-on-primary hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-space-sm">
            <h2 className="text-h3 tracking-wide border-b border-on-primary/20 pb-space-xs">
              お問い合わせ
            </h2>
            <div className="text-caption text-on-primary/80 space-y-space-xs">
              <p className="text-caption-bold text-on-primary">
                総合市民センター窓口
              </p>
              <p>開庁時間: 平日 8:30 - 17:15</p>
              <p className="text-body-bold text-on-primary tracking-wide">
                TEL <span className="numeric">0795-22-3111</span>
              </p>
              <p className="text-on-primary/70">休館日: 毎週月曜・年末年始</p>
            </div>
          </div>
        </div>

        <div className="mt-space-xl pt-space-lg border-t border-on-primary/10 flex flex-col md:flex-row items-center justify-between gap-space-sm text-caption text-on-primary/70">
          <p>西脇市役所 〒677-8511 兵庫県西脇市下戸田128−1</p>
          <p>© Nishiwaki City. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
