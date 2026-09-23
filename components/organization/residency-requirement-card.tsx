import { ScaleIcon } from "lucide-react";

import type { Member } from "@/lib/organization";

/**
 * 西脇市条例の「市内公認団体」要件（市内在住・在勤・在学が既定割合以上）の達成状況。
 * メンバー一覧の増減に連動して自動で再計算する。
 */
export function ResidencyRequirementCard({
  members,
  requiredRatio,
}: {
  members: Member[];
  requiredRatio: number;
}) {
  const total = members.length;
  const inside = members.filter((m) => m.residency !== "outside").length;
  const outside = total - inside;
  const ratio = total === 0 ? 0 : Math.round((inside / total) * 1000) / 10;
  const meetsRequirement = ratio >= requiredRatio;
  const requiredCount = Math.ceil((requiredRatio / 100) * total);

  return (
    <div className="space-y-space-md rounded-xl bg-canvas p-space-md">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="flex items-center gap-1.5 text-caption-bold text-primary">
            <ScaleIcon aria-hidden className="size-[18px]" />
            西脇市条例 市内要件達成状況（要件：{requiredRatio}%以上）
          </span>
          <p className="mt-0.5 text-caption text-ink-muted">
            構成人数 全{total}名のうち、市内在住・在勤・在学者が{inside}名所属しています。
          </p>
        </div>
        <div className="text-right">
          <span className="text-[28px] font-bold text-ok numeric">{ratio}%</span>
          <span className="ml-1 text-xs font-bold text-ok">
            {meetsRequirement ? "基準クリア" : "基準未達"}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-l-full bg-ok transition-all duration-500"
            style={{ width: `${ratio}%` }}
          />
          <div className="h-full rounded-r-full bg-line" style={{ width: `${100 - ratio}%` }} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
          <div className="flex items-center gap-space-md">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2.5 rounded-sm bg-ok" />
              市内在住・在勤:{" "}
              <strong className="text-ink numeric">{inside}名</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="size-2.5 rounded-sm bg-line" />
              市外: <strong className="text-ink numeric">{outside}名</strong>
            </span>
          </div>
          <span>必要基準: {requiredCount}名以上</span>
        </div>
      </div>
    </div>
  );
}
