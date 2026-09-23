/** ログイン後に戻る先を安全な内部パスだけに絞る（オープンリダイレクト対策） */
export function safeNextPath(next: string | undefined | null): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}
