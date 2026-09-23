import { Info } from "lucide-react";

import type { Room } from "@/lib/demo-data";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export function RoomPriceTable({
  rooms,
  note,
}: {
  rooms: Room[];
  note: string;
}) {
  return (
    <>
      {/* 狭い画面では横スクロールさせる。ページ本体は横に溢れさせない */}
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <caption className="sr-only">
            諸室ごとの面積・定員・市内料金・市外料金
          </caption>
          <thead>
            <tr className="border-b border-line bg-canvas">
              <th scope="col" className="px-4 py-3 text-caption-bold text-ink">
                諸室
              </th>
              <th scope="col" className="px-4 py-3 text-caption-bold text-ink">
                面積
              </th>
              <th scope="col" className="px-4 py-3 text-caption-bold text-ink">
                定員
              </th>
              <th scope="col" className="px-4 py-3 text-caption-bold text-ink">
                市内料金
              </th>
              <th scope="col" className="px-4 py-3 text-caption-bold text-ink">
                市外料金
              </th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.name} className="border-b border-line last:border-0">
                <th
                  scope="row"
                  className="px-4 py-3.5 text-body font-normal text-ink"
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`size-2 rounded-full ${r.primary ? "bg-primary" : "bg-line"}`}
                    />
                    {r.name}
                  </span>
                </th>
                <td className="px-4 py-3.5 text-body text-ink-muted numeric">
                  {r.areaSqm}
                </td>
                <td className="px-4 py-3.5 text-body text-ink-muted numeric">
                  {r.capacity}
                </td>
                <td className="px-4 py-3.5 text-body text-ink numeric">
                  {yen(r.inCity)}
                </td>
                <td className="px-4 py-3.5 text-body text-ink-muted numeric">
                  {yen(r.general)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-space-sm flex items-start gap-2 rounded-lg bg-canvas border border-line px-3 py-2.5 text-caption text-ink-muted">
        <Info aria-hidden className="size-4 shrink-0 mt-0.5" />
        {note}
      </p>
    </>
  );
}
