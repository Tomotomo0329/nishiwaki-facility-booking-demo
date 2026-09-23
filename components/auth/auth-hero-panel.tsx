import Image from "next/image";
import { MapPin, type LucideIcon } from "lucide-react";

/**
 * ログイン・新規登録など認証系ページ共通の左カラム（ビジュアル・訴求）。
 * 見出し・説明文・特徴リストだけをページごとに差し替える。
 */
export function AuthHeroPanel({
  heading,
  description,
  features,
}: {
  heading: React.ReactNode;
  description: string;
  features: { icon: LucideIcon; label: string }[];
}) {
  return (
    // 左右は grid で 50/50 に固定する。
    // flex + flex-1 だと右カラムが伸びて左が min-content まで潰れ、
    // 文字が1文字ずつ折り返される（呼び出し側の grid と組み合わせて使う）。
    <section className="relative isolate flex min-h-[320px] min-w-0 flex-col justify-between overflow-hidden p-space-lg md:p-space-xl lg:min-h-screen">
      <Image
        src="/images/auth/login-hero.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="-z-20 object-cover"
      />
      {/* 藍のスクリム */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/85 via-primary/75 to-[#0a1b33]/90"
      />
      {/* 播州織の経糸・緯糸 */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:28px_28px]"
      />

      {/* 上段 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-caption-bold text-white backdrop-blur-sm">
          <MapPin aria-hidden className="size-4" />
          東経135° 北緯35° 日本のへそ
        </p>
        <p className="rounded-full bg-white/10 px-3 py-1.5 text-caption text-white/90 backdrop-blur-sm">
          播州織のまち
        </p>
      </div>

      {/* 中段 */}
      {/* flex-1 で上下の余白を吸収し、justify-center で左エリアの
          縦中央へ。mx-auto + max-w-3xl で横方向も中央に置く。 */}
      <div className="my-space-lg flex flex-1 flex-col justify-center mx-auto w-full max-w-3xl">
        {/* 親が flex-col のため inline-block は無効化される。
            self-start で stretch を打ち消し、文字幅ぴったりにする。 */}
        <p className="self-start rounded bg-ok px-2.5 py-1 text-caption-bold text-white">
          西脇市公式サービス
        </p>
        <h2 className="mt-space-sm text-h1-mobile md:text-h1 text-white">{heading}</h2>
        <p className="mt-space-sm text-lead text-white/85">{description}</p>

        <ul className="mt-space-lg flex flex-wrap gap-2">
          {features.map((f) => (
            <li
              key={f.label}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-caption text-white backdrop-blur-sm"
            >
              <f.icon aria-hidden className="size-4 text-ok-line" />
              {f.label}
            </li>
          ))}
        </ul>
      </div>

      {/* 下段 */}
      {/* 中段のテキストブロックと同じ幅・同じ中央揃えに合わせる */}
      <div className="mx-auto w-full max-w-3xl flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/25 px-4 py-3 backdrop-blur-sm">
        <p className="flex items-center gap-2 text-caption-bold text-white">
          <span aria-hidden className="size-2 rounded-full bg-ok-line" />
          システム稼働状況: 正常
        </p>
        <p className="text-caption text-white/80">本日の即時予約受付中</p>
      </div>
    </section>
  );
}
