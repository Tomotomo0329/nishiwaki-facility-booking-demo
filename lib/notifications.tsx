"use client";

import { createContext, useContext, useState } from "react";

/**
 * パーソナル通知（ヘッダーの旧「抽選」タブの置き換え）。
 *
 * 実際の抽選結果・予約確定はサーバー側イベントが必要だが、デモのため
 * 「抽選結果は最初から数件用意しておく」＋「予約・抽選申込フローを完了したら
 * その場で1件追加する」の2本立てにする。開発方針 §0 のとおり、
 * ページを再読み込みすると追加分は消える（localStorage には保存しない）。
 */

export type NotificationKind = "reservation" | "lottery-applied" | "lottery-won" | "lottery-lost";

export type PersonalNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  /** 表示用の日付・時刻文字列（例: "2026.09.12" や "たった今"） */
  date: string;
  href: string;
};

const SEED_NOTIFICATIONS: PersonalNotification[] = [
  {
    id: "seed-lottery-won-LOT-20260927-01",
    kind: "lottery-won",
    title: "抽選に当選しました",
    detail: "黒田庄ふれあいスタジアム（グラウンド 全面）9月27日(日) 午前",
    date: "2026.09.12",
    href: "/mypage/lottery",
  },
  {
    id: "seed-lottery-lost-LOT-20260927-02",
    kind: "lottery-lost",
    title: "抽選結果のお知らせ",
    detail: "平野テニスコート（オムニコート A面）9月27日(日) 午後は落選となりました",
    date: "2026.09.12",
    href: "/mypage/lottery",
  },
];

type NotificationsContextValue = {
  notifications: PersonalNotification[];
  unreadCount: number;
  /** 予約・抽選申込フローの完了時に1件追加する */
  addNotification: (n: Omit<PersonalNotification, "id">) => void;
  /** 通知パネルを開いたときにまとめて既読にする */
  markAllRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<PersonalNotification[]>(SEED_NOTIFICATIONS);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  function addNotification(n: Omit<PersonalNotification, "id">) {
    const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setNotifications((prev) => [{ id, ...n }, ...prev]);
  }

  function markAllRead() {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
