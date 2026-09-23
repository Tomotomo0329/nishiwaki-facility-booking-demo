import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="パンくずリスト">
      <ol className="flex flex-wrap items-center gap-1 text-caption text-ink-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-ink" : undefined} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight aria-hidden className="size-4 text-ink-subtle" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
