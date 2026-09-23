"use client";

import { useMemo, useState } from "react";
import { Building, Home, MapPinned, RotateCw, Search, Trash2, UserPlus } from "lucide-react";

import { InviteMemberModal, type InviteInput } from "@/components/organization/invite-member-modal";
import { RoleModal } from "@/components/organization/role-modal";
import {
  ROLE_LABELS,
  RESIDENCY_LABELS,
  type Member,
  type MemberRole,
} from "@/lib/organization";

const RESIDENCY_ICON = { inside_live: Home, inside_work: Building, outside: MapPinned };

function nextMemberId(members: Member[]) {
  const max = members.reduce((m, member) => {
    const n = Number(member.id.replace("MEM-", ""));
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `MEM-${String(max + 1).padStart(3, "0")}`;
}

/** 登録メンバー一覧テーブル。検索・絞り込み・招待・権限変更・削除をすべてこの中で完結する */
export function MemberTable({
  members,
  onChange,
  organizationName,
  canManage,
}: {
  members: Member[];
  onChange: (next: Member[]) => void;
  organizationName: string;
  /** 代表者以外は閲覧のみ（招待・権限変更・削除ができない） */
  canManage: boolean;
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<MemberRole | "all">("all");
  const [residencyFilter, setResidencyFilter] = useState<"all" | "inside" | "outside">("all");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (q && !`${m.name}${m.email}`.toLowerCase().includes(q)) return false;
      if (roleFilter !== "all" && m.role !== roleFilter) return false;
      if (residencyFilter === "inside" && m.residency === "outside") return false;
      if (residencyFilter === "outside" && m.residency !== "outside") return false;
      return true;
    });
  }, [members, query, roleFilter, residencyFilter]);

  function handleResetFilters() {
    setQuery("");
    setRoleFilter("all");
    setResidencyFilter("all");
  }

  function handleSaveRole(id: string, role: MemberRole) {
    onChange(members.map((m) => (m.id === id ? { ...m, role } : m)));
  }

  function handleDelete(member: Member) {
    const ok = window.confirm(
      `${member.name} さんを${organizationName}の所属メンバーから解除しますか？\n（注：市内要件の比率が再計算されます）`,
    );
    if (!ok) return;
    onChange(members.filter((m) => m.id !== member.id));
  }

  function handleInvite(input: InviteInput) {
    const newMember: Member = {
      id: nextMemberId(members),
      name: input.email.split("@")[0],
      initial: input.email.charAt(0).toUpperCase(),
      email: input.email,
      role: input.role,
      residency: input.residency,
      status: "pending",
    };
    onChange([...members, newMember]);
  }

  return (
    <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:p-space-lg">
      <div className="flex flex-col gap-space-sm pb-space-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-space-xs text-h3 text-ink">
            登録メンバー一覧
            <span className="text-caption font-normal text-ink-muted numeric">
              （全{members.length}名）
            </span>
          </h2>
          <p className="mt-0.5 text-caption text-ink-muted">
            {canManage
              ? "施設のオンライン予約・抽選申請および使用料支払権限を割り当てることができます。"
              : "代表者のみが招待・権限変更・削除を行えます。"}
          </p>
        </div>
        {canManage ? (
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary-surface px-4 text-caption-bold text-primary transition-colors hover:bg-primary hover:text-on-primary"
          >
            <UserPlus aria-hidden className="size-[18px]" />
            新規メンバー招待
          </button>
        ) : null}
      </div>

      {/* ---------------- 検索・絞り込み ---------------- */}
      <div className="mb-space-md flex flex-col items-stretch gap-space-sm rounded-lg bg-canvas p-space-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-ink-subtle"
          />
          <label htmlFor="member-search" className="sr-only">
            氏名・メールアドレスで検索
          </label>
          <input
            id="member-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="氏名・メールアドレスで検索…"
            className="min-h-[40px] w-full rounded-md bg-surface pl-10 pr-3 text-caption text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as MemberRole | "all")}
            className="min-h-[40px] shrink-0 rounded-md bg-surface px-3 text-caption text-ink focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">すべての権限</option>
            <option value="representative">代表管理者</option>
            <option value="manager">予約・決済権限</option>
            <option value="viewer">閲覧のみ</option>
          </select>
          <select
            value={residencyFilter}
            onChange={(e) => setResidencyFilter(e.target.value as "all" | "inside" | "outside")}
            className="min-h-[40px] shrink-0 rounded-md bg-surface px-3 text-caption text-ink focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">すべての居住区分</option>
            <option value="inside">西脇市内在住・在勤</option>
            <option value="outside">市外</option>
          </select>
          <button
            type="button"
            onClick={handleResetFilters}
            aria-label="フィルターをリセット"
            title="フィルターをリセット"
            className="flex size-10 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-surface hover:text-ink transition-colors"
          >
            <RotateCw aria-hidden className="size-[18px]" />
          </button>
        </div>
      </div>

      {/* ---------------- テーブル ---------------- */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="bg-canvas text-caption-bold text-ink-muted">
              <th className="rounded-l-lg py-3 px-4">メンバー氏名 / 役職</th>
              <th className="py-3 px-3">居住区分</th>
              <th className="py-3 px-3">予約システム権限</th>
              <th className="py-3 px-3">ステータス</th>
              <th className="rounded-r-lg py-3 px-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-body">
            {filtered.map((member) => {
              const ResidencyIcon = RESIDENCY_ICON[member.residency];
              const isRepresentative = member.role === "representative";
              return (
                <tr key={member.id} className="hover:bg-canvas/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-caption-bold ${
                          isRepresentative
                            ? "bg-primary text-on-primary"
                            : "bg-canvas text-ink"
                        }`}
                      >
                        {member.initial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-body-bold text-ink">{member.name}</span>
                          {member.title ? (
                            <span
                              className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                                isRepresentative
                                  ? "bg-primary text-on-primary"
                                  : "bg-canvas text-ink-muted"
                              }`}
                            >
                              {member.title}
                            </span>
                          ) : null}
                        </div>
                        <span className="text-xs text-ink-muted">{member.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center gap-1 text-caption-bold text-ink">
                      <ResidencyIcon
                        aria-hidden
                        className={`size-4 ${member.residency === "outside" ? "text-ink-subtle" : "text-ok"}`}
                      />
                      {RESIDENCY_LABELS[member.residency]}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-bold ${
                        isRepresentative
                          ? "bg-primary-surface text-primary"
                          : member.role === "manager"
                            ? "bg-ok-surface text-ok"
                            : "bg-canvas text-ink-muted"
                      }`}
                    >
                      {ROLE_LABELS[member.role]}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        member.status === "verified"
                          ? "bg-ok-surface text-ok"
                          : "bg-warn-surface text-warn"
                      }`}
                    >
                      {member.status === "verified" ? "本人確認済" : "承認待ち"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {isRepresentative || !canManage ? (
                      <span
                        title={
                          isRepresentative
                            ? "代表者の権限は変更・削除できません"
                            : "メンバーの管理は代表者のみが行えます"
                        }
                        className="inline-block rounded bg-canvas px-2 py-1 text-xs text-ink-subtle"
                      >
                        編集不可
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingMember(member)}
                          className="rounded px-2.5 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary-surface"
                        >
                          権限変更
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(member)}
                          aria-label={`${member.name}をメンバーから削除`}
                          title="メンバーから削除"
                          className="rounded p-1 text-ink-subtle transition-colors hover:bg-danger-surface hover:text-danger"
                        >
                          <Trash2 aria-hidden className="size-[18px]" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 ? (
          <p className="py-space-lg text-center text-caption text-ink-muted">
            条件に一致するメンバーが見つかりませんでした。
          </p>
        ) : null}
      </div>

      <RoleModal
        key={editingMember?.id ?? "none"}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleSaveRole}
      />
      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}
