"use client";

import { useState } from "react";
import { Ticket } from "lucide-react";

import { LotteryCard } from "@/components/mypage/lottery-card";
import { SegmentedTabs } from "@/components/mypage/segmented-tabs";
import { demoLotteryApplications, type LotteryApplication } from "@/lib/lottery";

type TabKey = "pending" | "result";

/** マイページの中心コンテンツ。抽選申込一覧の状態（タブ・取消操作）をここで持つ */
export function LotterySection() {
  const [applications, setApplications] =
    useState<LotteryApplication[]>(demoLotteryApplications);
  const [activeTab, setActiveTab] = useState<TabKey>("pending");

  const pending = applications
    .filter((a) => a.status === "pending")
    .sort((a, b) => a.drawDate.getTime() - b.drawDate.getTime());
  const result = applications
    .filter((a) => a.status !== "pending")
    .sort((a, b) => b.drawDate.getTime() - a.drawDate.getTime());

  const list = activeTab === "pending" ? pending : result;

  function handleWithdraw(id: string) {
    const ok = window.confirm(
      "この抽選申込を取り消しますか？（デモのため実際の取消処理は行われません）",
    );
    if (!ok) return;
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "withdrawn" } : a)),
    );
  }

  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-space-sm rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-space-xs text-h2 text-primary">
            <Ticket aria-hidden className="size-6 text-primary" />
            抽選申込一覧
          </h2>
          <p className="mt-1 text-caption text-ink-muted">
            人気の高い施設・時間帯は抽選制です。申込状況と結果を確認できます。
          </p>
        </div>
        <SegmentedTabs
          label="抽選申込の表示切り替え"
          active={activeTab}
          onChange={setActiveTab}
          tabs={[
            { key: "pending", label: "結果発表待ち", count: pending.length },
            { key: "result", label: "結果発表済み", count: result.length },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-space-sm rounded-xl border border-dashed border-line bg-surface p-space-xl text-center">
          <Ticket aria-hidden className="size-8 text-ink-subtle" />
          <p className="text-body-bold text-ink">
            {activeTab === "pending"
              ? "結果発表待ちの抽選申込はありません"
              : "発表済みの抽選結果はありません"}
          </p>
          <p className="text-caption text-ink-muted">
            人気施設は抽選での受付となる場合があります。
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {list.map((application) => (
            <LotteryCard
              key={application.id}
              application={application}
              onWithdraw={activeTab === "pending" ? handleWithdraw : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
