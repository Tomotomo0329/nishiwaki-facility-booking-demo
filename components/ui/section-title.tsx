/** 見出しの左に藍色のバーを立てる、全画面共通のセクション見出し */
export function SectionTitle({
  title,
  description,
  as: As = "h2",
}: {
  title: string;
  description?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span aria-hidden className="w-1.5 h-6 rounded-full bg-primary" />
        <As className={As === "h2" ? "text-h2 text-ink" : "text-h3 text-ink"}>
          {title}
        </As>
      </div>
      {description ? (
        <p className="text-body text-ink-muted mt-1">{description}</p>
      ) : null}
    </div>
  );
}
