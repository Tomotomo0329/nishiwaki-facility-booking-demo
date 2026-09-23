"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { FilterFields, type FilterFieldsProps } from "@/components/facilities/filter-sidebar";
import { Modal } from "@/components/ui/modal";

/** スマホ向け：検索条件をアイコン付きボタン＋モーダルで開閉する（タブレット以上では非表示） */
export function FilterModalButton({
  resultCount,
  activeFilterCount,
  ...fields
}: FilterFieldsProps & {
  resultCount: number;
  activeFilterCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-space-md md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-[48px] w-full items-center justify-center gap-space-xs rounded-xl bg-surface px-4 text-body-bold text-ink shadow-[var(--shadow-card)]"
      >
        <SlidersHorizontal aria-hidden className="size-5 text-primary" />
        <span>絞り込み</span>
        {activeFilterCount > 0 && (
          <span className="numeric inline-flex size-5 items-center justify-center rounded-full bg-primary text-caption-bold text-on-primary">
            {activeFilterCount}
          </span>
        )}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        titleId="mobile-filter-modal-title"
        title="検索条件"
      >
        <FilterFields {...fields} />

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-space-md flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-body-bold text-on-primary shadow-[var(--shadow-card)] transition-colors hover:bg-primary-hover"
        >
          この条件で表示する（{resultCount}件）
        </button>
      </Modal>
    </div>
  );
}
