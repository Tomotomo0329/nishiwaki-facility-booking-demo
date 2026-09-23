"use client";

import { useId, useState } from "react";
import { Send } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import type { MemberRole, ResidencyType } from "@/lib/organization";

export type InviteInput = {
  email: string;
  residency: ResidencyType;
  role: MemberRole;
};

/** 新規メンバー招待モーダル。送信すると「承認待ち」状態でメンバー一覧に加わる */
export function InviteMemberModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean;
  onClose: () => void;
  onInvite: (input: InviteInput) => void;
}) {
  const titleId = useId();
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [residency, setResidency] = useState<ResidencyType>("inside_live");
  const [role, setRole] = useState<MemberRole>("viewer");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite({ email: email.trim(), residency, role });
    setEmail("");
    setResidency("inside_live");
    setRole("viewer");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} titleId={titleId} title="新規メンバー招待">
      <form onSubmit={handleSubmit} className="space-y-space-md">
        <div>
          <label htmlFor={emailId} className="block text-caption-bold text-ink">
            招待相手のメールアドレス <span className="text-danger">*</span>
          </label>
          <input
            id={emailId}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="例: member@example.jp"
            className="mt-1 min-h-[44px] w-full rounded-lg bg-canvas px-space-md text-body text-ink placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-ink-muted">
            西脇市の利用者アカウントをお持ちでない場合は、会員登録案内が同時に送信されます。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
          <div>
            <label className="block text-caption-bold text-ink">
              居住・勤務区分 <span className="text-danger">*</span>
            </label>
            <select
              value={residency}
              onChange={(e) => setResidency(e.target.value as ResidencyType)}
              className="mt-1 min-h-[44px] w-full rounded-lg bg-canvas px-space-md text-caption text-ink focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="inside_live">西脇市在住</option>
              <option value="inside_work">西脇市在勤・在学</option>
              <option value="outside">市外在住</option>
            </select>
          </div>
          <div>
            <label className="block text-caption-bold text-ink">
              付与権限 <span className="text-danger">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              className="mt-1 min-h-[44px] w-full rounded-lg bg-canvas px-space-md text-caption text-ink focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="viewer">閲覧のみ（一般メンバー）</option>
              <option value="manager">予約・決済権限あり</option>
            </select>
          </div>
        </div>

        <p className="rounded-lg bg-canvas p-space-sm text-xs text-ink-muted">
          招待URLの有効期間は発行から7日間です。承認完了時に自動で団体名簿に反映されます。
        </p>

        <div className="flex items-center justify-end gap-space-sm pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-space-md py-2 text-caption-bold text-ink-muted transition-colors hover:bg-canvas"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-space-lg py-2 text-caption-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover"
          >
            <Send aria-hidden className="size-[18px]" />
            招待メールを送信
          </button>
        </div>
      </form>
    </Modal>
  );
}
