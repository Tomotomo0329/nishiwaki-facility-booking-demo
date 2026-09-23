import { FileText } from "lucide-react";

import type { OrganizationDocument } from "@/lib/organization";

/** 提出済みの会則・名簿書類の一覧（表示のみ。差し替え等の実装は未対応） */
export function DocumentAttachments({ documents }: { documents: OrganizationDocument[] }) {
  return (
    <div className="space-y-space-sm pt-2">
      <h3 className="flex items-center gap-1.5 text-caption-bold text-ink">
        <FileText aria-hidden className="size-[18px] text-primary" />
        提出済み会則・名簿書類（更新手続き用）
      </h3>
      <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
        {documents.map((doc) => (
          <div
            key={doc.name}
            className="flex items-center gap-space-sm rounded-lg bg-canvas p-space-sm"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded bg-danger-surface text-danger">
              <FileText aria-hidden className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-caption-bold text-ink">{doc.name}</p>
              <p className="text-xs text-ink-muted numeric">
                {doc.sizeLabel} ・ {doc.updatedLabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
