import type { Bucket } from "../../lib/api/admin.functions";

/**
 * One measure per chart, so every mark carries the same single hue and no
 * legend is needed. Text stays in ink tokens; only the marks are coloured.
 */
const ACCENT = "#1F3FB8";
const TRACK = "#E4E4DF";
const GRID = "#DCDCD6";

export function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="border-b border-[#DCDCD6] px-5 py-6 sm:border-b-0 sm:border-s sm:first:border-s-0">
      <p className="text-[13px] text-[#6E767C]">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#111619]">{value}</p>
      {sub ? <p className="mt-1 text-[12px] text-[#6E767C]">{sub}</p> : null}
    </div>
  );
}

function niceCeil(n: number) {
  if (n <= 5) return 5;
  const mag = Math.pow(10, Math.floor(Math.log10(n)));
  return Math.ceil(n / mag) * mag;
}

/** Views per day. Columns, capped thickness, rounded cap, square baseline. */
export function DayColumns({ data, label }: { data: { day: string; n: number }[]; label: string }) {
  const peak = Math.max(1, ...data.map((d) => d.n));
  const top = niceCeil(peak);
  const ticks = [top, Math.round(top / 2), 0];

  return (
    <figure className="m-0">
      <figcaption className="text-[13px] text-[#6E767C]">{label}</figcaption>

      <div className="relative mt-5 h-[190px]">
        {ticks.map((tick) => (
          <div
            key={tick}
            className="absolute inset-x-0 flex items-center gap-3"
            style={{ bottom: (tick / top) * 100 + "%" }}
          >
            <span className="k-mono w-9 shrink-0 text-end text-[11px] text-[#6E767C]">{tick}</span>
            <span className="h-px flex-1" style={{ background: GRID }} />
          </div>
        ))}

        <div className="absolute inset-0 flex items-end gap-[2px] ps-12">
          {data.map((d) => (
            <div key={d.day} className="group relative flex h-full flex-1 items-end justify-center">
              <div
                className="w-full max-w-[24px] transition-opacity group-hover:opacity-80"
                style={{
                  height: Math.max(d.n > 0 ? 3 : 0, (d.n / top) * 100) + "%",
                  background: ACCENT,
                  borderRadius: "4px 4px 0 0",
                }}
              />
              <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap border border-[#111619] bg-[#111619] px-2.5 py-1.5 text-[11px] text-[#F2F2EF] group-hover:block"
              >
                <span className="k-mono" dir="ltr">
                  {d.day}
                </span>
                <span className="mx-1.5 opacity-40">/</span>
                <span className="k-mono">{d.n}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-between ps-12 text-[11px] text-[#6E767C]">
        <span className="k-mono" dir="ltr">
          {data[0]?.day}
        </span>
        <span className="k-mono" dir="ltr">
          {data[data.length - 1]?.day}
        </span>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-[12px] text-[#6E767C] underline">
          عرض الأرقام كجدول
        </summary>
        <table className="mt-3 w-full text-[12px]">
          <tbody>
            {data.map((d) => (
              <tr key={d.day} className="border-b border-[#DCDCD6]">
                <td className="k-mono py-1.5 text-[#6E767C]" dir="ltr">
                  {d.day}
                </td>
                <td className="k-mono py-1.5 text-end tabular-nums text-[#111619]">{d.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

/** Magnitude across named categories. Ordered high to low, one hue. */
export function BarList({
  title,
  rows,
  renderKey,
  empty,
}: {
  title: string;
  rows: Bucket[];
  renderKey?: (key: string) => string;
  empty: string;
}) {
  const peak = Math.max(1, ...rows.map((r) => r.n));

  return (
    <figure className="m-0">
      <figcaption className="text-[13px] text-[#6E767C]">{title}</figcaption>
      {rows.length === 0 ? (
        <p className="mt-4 text-[13px] text-[#6E767C]">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3.5">
          {rows.map((r) => (
            <li key={r.key} className="group">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[14px] text-[#111619]">
                  {renderKey ? renderKey(r.key) : r.key}
                </span>
                <span className="k-mono text-[13px] tabular-nums text-[#6E767C]">{r.n}</span>
              </div>
              <div className="mt-1.5 h-[10px] w-full" style={{ background: TRACK }}>
                <div
                  className="k-bar h-full transition-opacity group-hover:opacity-80"
                  style={{ width: Math.max(3, (r.n / peak) * 100) + "%", background: ACCENT }}
                  title={String(r.n)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
