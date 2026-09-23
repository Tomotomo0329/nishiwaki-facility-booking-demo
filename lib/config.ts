/**
 * 機能フラグ。
 *
 * 開発方針 §5-4 のとおり、Apple / Facebook ログインは
 * 「UIに配置し、同一のハンドラに接続したうえでフラグで切り替えられる」状態にしておく。
 *
 * デモでは3種とも有効な見た目で見せる（実際の認証は行わない）。
 * Apple Developer Program や Meta のビジネス認証が未了で無効化したい場合は
 * NEXT_PUBLIC_ENABLE_APPLE_LOGIN=false のように環境変数で落とせる。
 */
export const socialLogin = {
  google: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN !== "false",
  apple: process.env.NEXT_PUBLIC_ENABLE_APPLE_LOGIN !== "false",
  facebook: process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_LOGIN !== "false",
} as const;
