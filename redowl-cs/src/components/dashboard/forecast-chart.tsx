import type { MonthlyForecast } from "@/lib/dashboard";
import { formatMoney } from "@/lib/format";

const NAVY = "#1e3a6e";
const SKY = "#8ec5ff";
const ORANGE = "#e67a22";
const AXIS = "#9aa3ad";
const GRID = "#ececec";
const MAX = 800000;

function monthTick(label: string) {
  const [month, year] = label.split(" ");
  return `${month} ${year.slice(2)}`;
}

export function ForecastChart({ data }: { data: MonthlyForecast[] }) {
  const rows: MonthlyForecast[] = [
    ...data.slice(0, 4),
    {
      month: "2027-01",
      label: "Jan 2027",
      mostLikely: 0,
      upside: 0,
      total: 0,
      weighted: 0,
      count: 0,
    },
    ...data.slice(4),
  ];

  const width = 920;
  const height = 400;
  const left = 64;
  const right = 24;
  const top = 20;
  const bottom = 72;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const barW = plotW / rows.length / 1.7;
  const yTicks = [0, 200000, 400000, 600000, 800000];

  const x = (index: number) =>
    left + (plotW / rows.length) * (index + 0.5);
  const y = (value: number) => top + plotH - (value / MAX) * plotH;

  const linePoints = rows
    .map((row, index) => `${x(index)},${y(row.weighted)}`)
    .join(" ");

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Pipeline forecast by close month"
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={width - right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={GRID}
            />
            <text
              x={left - 10}
              y={y(tick) + 4}
              textAnchor="end"
              fontSize="12"
              fill={AXIS}
            >
              {tick === 0 ? "0" : formatMoney(tick, true)}
            </text>
          </g>
        ))}

        <line
          x1={left}
          x2={left}
          y1={top}
          y2={top + plotH}
          stroke="#d0d0d0"
        />
        <line
          x1={left}
          x2={width - right}
          y1={top + plotH}
          y2={top + plotH}
          stroke="#d0d0d0"
        />

        {rows.map((row, index) => {
          const cx = x(index);
          const upsideH = (row.upside / MAX) * plotH;
          const likelyH = (row.mostLikely / MAX) * plotH;
          const upsideY = y(row.upside);
          const likelyY = y(row.upside + row.mostLikely);

          return (
            <g key={row.month}>
              {row.upside > 0 ? (
                <rect
                  x={cx - barW / 2}
                  y={upsideY}
                  width={barW}
                  height={upsideH}
                  fill={SKY}
                />
              ) : null}
              {row.mostLikely > 0 ? (
                <rect
                  x={cx - barW / 2}
                  y={likelyY}
                  width={barW}
                  height={likelyH}
                  fill={NAVY}
                />
              ) : null}
              <text
                x={cx}
                y={top + plotH + 22}
                textAnchor="middle"
                fontSize="12"
                fill={AXIS}
              >
                {monthTick(row.label)}
              </text>
            </g>
          );
        })}

        <polyline
          points={linePoints}
          fill="none"
          stroke={ORANGE}
          strokeWidth="2.5"
        />
        {rows.map((row, index) => (
          <circle
            key={`${row.month}-dot`}
            cx={x(index)}
            cy={y(row.weighted)}
            r="4"
            fill={ORANGE}
          />
        ))}

        <text
          x={left + plotW / 2}
          y={height - 8}
          textAnchor="middle"
          fontSize="12"
          fill={AXIS}
        >
          Close Month
        </text>
      </svg>

      <div className="mt-1 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-5 bg-[#e67a22]" />
          Weighted Value
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-[#1e3a6e]" />
          Most Likely ARR
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-[#8ec5ff]" />
          Upside ARR
        </span>
      </div>
    </div>
  );
}
