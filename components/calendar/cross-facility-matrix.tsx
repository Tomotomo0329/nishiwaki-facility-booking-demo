import { Dumbbell, LandPlot, Presentation, Target, Waypoints } from "lucide-react";

import { slotAppearance } from "@/components/ui/slot-chip";
import {
  DEMO_TODAY,
  WEEKDAY_LABELS,
  demoStateFor,
  seedFromSlug,
  toKey,
} from "@/lib/availability";
import type { Facility } from "@/lib/demo-data";

const CATEGORY_ICONS: Record<string, typeof Dumbbell> = {
  体育館: Dumbbell,
  グラウンド: LandPlot,
  テニスコート: Target,
  "研修室・会議室": Presentation,
};

const DAYS = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(DEMO_TODAY);
  date.setDate(DEMO_TODAY.getDate() + i);
  return date;
});

/** 市内主要施設の直近7日間の空き状況を横断比較する表 */
export function CrossFacilityMatrix({
  facilities,
  selectedSlug,
  onSelectFacility,
}: {
  facilities: Facility[];
  selectedSlug: string;
  onSelectFacility: (slug: string) => void;
}) {
  const first = DAYS[0];
  const last = DAYS[DAYS.length - 1];

  return (
    <section
      id="cross-matrix-section"
      className="mt-space-sm flex scroll-mt-[100px] flex-col gap-space-md rounded-xl bg-surface p-space-md shadow-[var(--shadow-card)] lg:p-space-lg"
    >
      <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-line pb-space-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Waypoints aria-hidden className="size-[22px] text-primary" />
            <h3 className="text-h3 text-ink">
              市内主要施設の空き状況を横断して比較
            </h3>
          </div>
          <p className="text-caption text-ink-muted">
            直近7日間の全館空きステータス一覧（施設名クリックで詳細、日付クリックでその施設のカレンダーへ）
          </p>
        </div>
        <div className="flex items-center gap-2 text-caption">
          <span className="text-ink-muted">対象期間:</span>
          <span className="numeric rounded bg-canvas px-2.5 py-1 font-bold text-primary">
            {first.getMonth() + 1}/{first.getDate()}({WEEKDAY_LABELS[first.getDay()]}) 〜{" "}
            {last.getMonth() + 1}/{last.getDate()}({WEEKDAY_LABELS[last.getDay()]})
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-caption">
          <thead>
            <tr className="border-b border-line bg-canvas text-ink-muted">
              <th scope="col" className="w-[220px] py-3 px-4 font-bold">
                対象施設名
              </th>
              {DAYS.map((d) => (
                <th
                  key={toKey(d)}
                  scope="col"
                  className={`px-2 py-3 text-center font-bold ${
                    d.getDay() === 0 ? "text-danger" : d.getDay() === 6 ? "text-primary" : "text-ink"
                  }`}
                >
                  {d.getDate()}日 ({WEEKDAY_LABELS[d.getDay()]})
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {facilities.map((facility) => {
              const Icon = CATEGORY_ICONS[facility.category] ?? Dumbbell;
              const isSelected = facility.slug === selectedSlug;
              const seedOffset = seedFromSlug(facility.slug);

              return (
                <tr
                  key={facility.slug}
                  className={isSelected ? "bg-primary-surface" : "hover:bg-canvas transition-colors"}
                >
                  <td className="flex items-center gap-2 py-3.5 px-4 font-bold">
                    <Icon
                      aria-hidden
                      className={`size-[18px] ${isSelected ? "text-primary" : "text-ink-muted"}`}
                    />
                    <button
                      type="button"
                      onClick={() => onSelectFacility(facility.slug)}
                      className={`text-left hover:underline ${isSelected ? "text-primary" : "text-ink"}`}
                    >
                      {facility.name}
                    </button>
                  </td>
                  {DAYS.map((d) => {
                    const state = demoStateFor(d, seedOffset);
                    const a = slotAppearance[state];
                    return (
                      <td key={toKey(d)} className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => onSelectFacility(facility.slug)}
                          className={`inline-block rounded px-2 py-1 text-xs font-bold ${a.chip} hover:opacity-80 transition-opacity`}
                        >
                          {a.symbol} {a.label}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
