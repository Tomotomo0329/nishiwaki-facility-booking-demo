import Image from "next/image";
import { Images } from "lucide-react";

import type { Photo } from "@/lib/demo-data";

/**
 * 施設写真。左に主写真（60%）、右に 2×2 のサムネイル（40%）。
 * 写真が1枚しかない施設では主写真のみを全幅で出す。
 */
export function PhotoGallery({
  photos,
  photoCount,
}: {
  photos: Photo[];
  photoCount: number;
}) {
  const [main, ...subs] = photos;
  if (!main) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 rounded-xl overflow-hidden">
      <figure className="relative lg:col-span-3 aspect-video lg:aspect-auto lg:min-h-[420px] overflow-hidden rounded-lg">
        <Image
          src={main.src}
          alt={main.alt}
          fill
          priority
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover"
        />
        <figcaption className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-3 py-1.5 text-caption-bold text-white backdrop-blur-sm">
          {main.caption}
        </figcaption>
      </figure>

      {subs.length > 0 ? (
        <div className="lg:col-span-2 grid grid-cols-2 gap-2">
          {subs.slice(0, 4).map((p, i) => {
            const isLast = i === 3 || i === subs.length - 1;
            return (
              <figure
                key={p.src}
                className="relative aspect-4/3 lg:aspect-auto lg:min-h-[206px] overflow-hidden rounded-lg"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 240px, 50vw"
                  className="object-cover"
                />
                {isLast ? (
                  <>
                    <span aria-hidden className="absolute inset-0 bg-black/35" />
                    <button
                      type="button"
                      className="absolute inset-0 m-auto flex h-11 w-fit items-center gap-2 rounded-lg bg-surface/95 px-4 text-caption-bold text-ink shadow-[var(--shadow-card)] hover:bg-surface"
                    >
                      <Images aria-hidden className="size-4" />
                      写真をすべて見る ({photoCount}枚)
                    </button>
                  </>
                ) : (
                  <figcaption className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                    {p.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
