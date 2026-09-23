import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  CalendarCheck,
  ClipboardCheck,
  Info,
  LayoutDashboard,
  User,
  UsersRound,
} from "lucide-react";

import type { DemoUser } from "@/lib/auth-context";

// マイページ（プロフィール・認証方法・通知設定・利用者登録情報）を先頭に置く。
// 利用者登録情報はページ化せず、マイページ本体内のセクションとしてのみ表示する
const MENU = [
  { label: "マイページ", href: "/mypage", icon: LayoutDashboard },
  { label: "予約一覧", href: "/mypage/reservations", icon: CalendarCheck },
  { label: "抽選申込", href: "/mypage/lottery", icon: ClipboardCheck },
  { label: "お気に入り施設", href: "/mypage/favorites", icon: Bookmark },
  { label: "団体情報・メンバー管理", href: "/mypage/organization", icon: UsersRound },
];

/** マイページ共通の左サイドバー（プロフィールカード＋メニュー＋案内） */
export function AccountSidebar({ user }: { user: DemoUser }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-space-md lg:w-[260px]">
      <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-space-sm pb-space-sm">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            <User aria-hidden className="size-6" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-h3 text-ink">{user.name}</h2>
            <span className="block text-xs text-ink-muted numeric">
              登録番号: {user.memberNo}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-ok-surface px-2.5 py-0.5 text-xs font-bold text-ok">
          <span aria-hidden className="size-1.5 rounded-full bg-ok" />
          利用者登録 承認済
        </span>
      </div>

      <nav
        aria-label="マイページメニュー"
        className="flex flex-col gap-0.5 rounded-xl bg-surface p-1 shadow-[var(--shadow-card)]"
      >
        {MENU.map((item) => {
          const current = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={
                current
                  ? "flex min-h-[44px] items-center gap-space-sm rounded-lg border-l-4 border-primary bg-primary-surface px-space-md text-caption-bold text-primary"
                  : "flex min-h-[44px] items-center gap-space-sm rounded-lg px-space-md text-caption text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
              }
            >
              <item.icon aria-hidden className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl bg-primary-surface p-space-md">
        <div className="flex items-start gap-space-xs text-primary">
          <Info aria-hidden className="mt-0.5 size-[18px] shrink-0" />
          <div>
            <p className="text-caption-bold text-primary">窓口での変更について</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              代表者名や減免資格の変更は、総合市民センター（オリナス）窓口でも受け付けております。
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
