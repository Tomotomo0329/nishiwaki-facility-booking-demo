"use client";

import { useId, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { ROLE_LABELS, type Member, type MemberRole } from "@/lib/organization";

const EDITABLE_ROLES: { value: MemberRole; description: string }[] = [
  {
    value: "manager",
    description: "施設の空き予約、抽選申込の確定、クレジット決済の実行が可能です。",
  },
  {
    value: "viewer",
    description: "予約状況の閲覧および入館用電子利用証（QRコード）の表示のみ可能です。",
  },
];

/** メンバーの権限（予約・決済権限 / 閲覧のみ）を変更するモーダル */
export function RoleModal({
  member,
  onClose,
  onSave,
}: {
  member: Member | null;
  onClose: () => void;
  onSave: (id: string, role: MemberRole) => void;
}) {
  const titleId = useId();
  const [selected, setSelected] = useState<MemberRole>(member?.role ?? "viewer");

  if (!member) return null;

  return (
    <Modal open={!!member} onClose={onClose} titleId={titleId} title="権限の変更">
      <p className="mb-space-md text-caption text-ink-muted">
        対象メンバー: <strong className="text-ink">{member.name}</strong>
      </p>

      <div className="space-y-2">
        {EDITABLE_ROLES.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-space-sm rounded-lg bg-canvas p-space-sm transition-colors hover:bg-line/40"
          >
            <input
              type="radio"
              name="member-role"
              value={option.value}
              checked={selected === option.value}
              onChange={() => setSelected(option.value)}
              className="mt-1 size-4 text-primary focus:ring-primary"
            />
            <div>
              <span className="block text-caption-bold text-ink">
                {ROLE_LABELS[option.value]}
              </span>
              <span className="text-xs text-ink-muted">{option.description}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-space-md flex items-center justify-end gap-space-sm">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-space-md py-2 text-caption-bold text-ink-muted transition-colors hover:bg-canvas"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={() => {
            onSave(member.id, selected);
            onClose();
          }}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-space-lg py-2 text-caption-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover"
        >
          <ShieldCheck aria-hidden className="size-[18px]" />
          保存する
        </button>
      </div>
    </Modal>
  );
}
