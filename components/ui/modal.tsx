"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/** 汎用モーダル。背景クリック・✕ボタン・Escapeキーで閉じる */
export function Modal({
  open,
  onClose,
  titleId,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 bg-black/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-xl bg-surface p-space-lg shadow-[var(--shadow-raised)]"
      >
        <div className="mb-space-md flex items-center justify-between gap-2">
          <h2 id={titleId} className="text-h3 text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
