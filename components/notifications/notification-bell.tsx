"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { useState } from "react";
import { Bell, CalendarCheck, PartyPopper, Ticket, TicketX } from "lucide-react";

import { useNotifications, type NotificationKind, type PersonalNotification } from "@/lib/notifications";

const KIND_META: Record<NotificationKind, { icon: typeof Bell; className: string }> = {
  reservation: { icon: CalendarCheck, className: "bg-primary-surface text-primary" },
  "lottery-applied": { icon: Ticket, className: "bg-primary-surface text-primary" },
  "lottery-won": { icon: PartyPopper, className: "bg-ok-surface text-ok" },
  "lottery-lost": { icon: TicketX, className: "bg-canvas text-ink-muted" },
};

/**
 * ヘッダーの通知ベル（旧「抽選」タブの置き換え）。
 * 予約・抽選申込が完了したかどうかを、ここで一元的に確認できるようにする。
 * 未読があるときだけ右上にドットを出し、パネルを開くとまとめて既読にする。
 */
export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) markAllRead();
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={unreadCount > 0 ? `お知らせ（未読${unreadCount}件）` : "お知らせ"}
          className="relative flex size-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
        >
          <Bell aria-hidden className="size-5" />
          {unreadCount > 0 ? (
            <span
              aria-hidden
              className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-danger ring-2 ring-surface"
            />
          ) : null}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="end"
          className="z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-xl border border-line bg-surface shadow-[var(--shadow-raised)] outline-none"
        >
          <div className="flex items-center justify-between border-b border-line px-space-md py-space-sm">
            <p className="text-caption-bold text-ink">お知らせ</p>
            <p className="text-xs text-ink-muted">予約・抽選の結果をお知らせします</p>
          </div>

          {notifications.length === 0 ? (
            <p className="p-space-lg text-center text-caption text-ink-muted">
              まだお知らせはありません
            </p>
          ) : (
            <ul className="max-h-[360px] divide-y divide-line overflow-y-auto">
              {notifications.map((n) => (
                <NotificationRow key={n.id} notification={n} />
              ))}
            </ul>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function NotificationRow({ notification }: { notification: PersonalNotification }) {
  const meta = KIND_META[notification.kind];
  const Icon = meta.icon;

  return (
    <li>
      <Popover.Close asChild>
        <Link
          href={notification.href}
          className="flex items-start gap-space-sm p-space-md text-left transition-colors hover:bg-canvas"
        >
          <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${meta.className}`}>
            <Icon aria-hidden className="size-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-caption-bold text-ink">{notification.title}</span>
            <span className="mt-0.5 block truncate text-xs text-ink-muted">{notification.detail}</span>
            <span className="mt-1 block text-[11px] text-ink-subtle numeric">{notification.date}</span>
          </span>
        </Link>
      </Popover.Close>
    </li>
  );
}
