"use client";

import { useState } from "react";
import { Heart, HeartCrack } from "lucide-react";

import { FavoriteFacilityCard } from "@/components/mypage/favorite-facility-card";
import { popularFacilities } from "@/lib/demo-data";
import { demoFavoriteSlugs } from "@/lib/favorites";

/** マイページの中心コンテンツ。お気に入り施設の状態（解除操作）をここで持つ */
export function FavoritesSection() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>(demoFavoriteSlugs);
  const favorites = popularFacilities.filter((f) => favoriteSlugs.includes(f.slug));

  function handleRemove(slug: string) {
    setFavoriteSlugs((prev) => prev.filter((s) => s !== slug));
  }

  return (
    <section className="flex flex-col gap-space-md">
      <div className="rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)]">
        <h2 className="flex items-center gap-space-xs text-h2 text-primary">
          <Heart aria-hidden className="size-6 fill-current text-primary" />
          お気に入り施設
        </h2>
        <p className="mt-1 text-caption text-ink-muted">
          気になる施設をお気に入りに登録しておくと、ここから空き状況をすぐに確認できます。
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-space-sm rounded-xl border border-dashed border-line bg-surface p-space-xl text-center">
          <HeartCrack aria-hidden className="size-8 text-ink-subtle" />
          <p className="text-body-bold text-ink">お気に入りの施設はありません</p>
          <p className="text-caption text-ink-muted">
            施設一覧から気になる施設を探してみましょう。
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {favorites.map((facility) => (
            <FavoriteFacilityCard
              key={facility.slug}
              facility={facility}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}
