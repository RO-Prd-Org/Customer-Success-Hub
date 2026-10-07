import type { CSSProperties, ReactNode } from "react";

/** Cursor canvas light tokens — matches the host light theme used in the canvas. */
const t = {
  bg: "#FCFCFC",
  text: "#141414F0",
  textSecondary: "#141414BD",
  textTertiary: "#1414148A",
  textQuaternary: "#1414145C",
  fillTertiary: "#14141414",
  fillQuaternary: "#1414140F",
  strokePrimary: "#14141433",
  strokeSecondary: "#1414141F",
  strokeTertiary: "#14141414",
  accent: "#3685BF",
  warning: "#C08532",
  danger: "#CF2D56",
  success: "#1F8A65",
  orange: "#D75C4E",
};

type Align = "left" | "center" | "right";
type RowTone = "success" | "danger" | "warning" | "info" | "neutral";
type StatTone = "success" | "danger" | "warning" | "info";

function toneColor(tone?: StatTone | RowTone) {
  if (tone === "danger") return t.danger;
  if (tone === "warning") return t.warning;
  if (tone === "success") return t.success;
  if (tone === "info") return t.accent;
  return t.text;
}

export function Stack({
  children,
  gap = 0,
}: {
  children?: ReactNode;
  gap?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {children}
    </div>
  );
}

export function Grid({
  children,
  columns,
  gap = 0,
}: {
  children?: ReactNode;
  columns: number | string;
  gap?: number;
}) {
  const template =
    typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: template,
        gap,
        alignItems: "stretch",
      }}
    >
      {children}
    </div>
  );
}

export function H1({ children }: { children?: ReactNode }) {
  return (
    <h1
      style={{
        margin: 0,
        fontSize: 24,
        lineHeight: "30px",
        fontWeight: 590,
        color: t.text,
      }}
    >
      {children}
    </h1>
  );
}

export function H2({ children }: { children?: ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: 18,
        lineHeight: "24px",
        fontWeight: 590,
        color: t.text,
      }}
    >
      {children}
    </h2>
  );
}

export function Text({
  children,
  tone = "primary",
  size = "body",
  weight = "normal",
}: {
  children?: ReactNode;
  tone?: "primary" | "secondary" | "tertiary" | "quaternary";
  size?: "body" | "small";
  weight?: "normal" | "medium" | "semibold" | "bold";
}) {
  const color =
    tone === "secondary"
      ? t.textSecondary
      : tone === "tertiary"
        ? t.textTertiary
        : tone === "quaternary"
          ? t.textQuaternary
          : t.text;
  return (
    <p
      style={{
        margin: 0,
        fontSize: size === "small" ? 12 : 14,
        lineHeight: size === "small" ? "16px" : "20px",
        fontWeight:
          weight === "bold" ? 700 : weight === "semibold" ? 600 : weight === "medium" ? 500 : 400,
        color,
      }}
    >
      {children}
    </p>
  );
}

export function Divider() {
  return (
    <div style={{ height: 1, background: t.strokeTertiary, width: "100%" }} />
  );
}

function TrendMark({ direction }: { direction: "up" | "down" }) {
  const up = direction === "up";
  const stroke = up ? t.success : t.danger;
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{
        display: "inline-block",
        verticalAlign: "-2px",
        marginRight: 3,
        color: stroke,
      }}
    >
      {up ? (
        <>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </>
      ) : (
        <>
          <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
          <polyline points="16 17 22 17 22 11" />
        </>
      )}
    </svg>
  );
}

export function ChangeText({
  direction,
  children,
}: {
  direction: "up" | "down";
  children: ReactNode;
}) {
  return (
    <span style={{ color: direction === "up" ? t.success : t.danger }}>
      {children}
    </span>
  );
}

export function WeekChange({
  direction,
  percent,
}: {
  direction: "up" | "down";
  percent: string;
}) {
  return (
    <ChangeText direction={direction}>
      <TrendMark direction={direction} />
      {percent} vs last week
    </ChangeText>
  );
}

export function Stat({
  value,
  label,
  tone,
  size = "default",
}: {
  value: ReactNode;
  label: ReactNode;
  tone?: StatTone;
  size?: "default" | "md" | "lg";
}) {
  const boxFill =
    tone === "danger"
      ? "#CF2D5614"
      : tone === "warning"
        ? "#C0853214"
        : t.fillTertiary;
  const boxStroke =
    tone === "danger"
      ? "#CF2D5633"
      : tone === "warning"
        ? "#C0853233"
        : t.strokeTertiary;
  const large = size === "lg";
  const medium = size === "md";

  return (
    <div
      style={{
        height: "100%",
        minHeight: large ? 128 : undefined,
        boxSizing: "border-box",
        background: boxFill,
        border: `1px solid ${boxStroke}`,
        borderRadius: large ? 10 : 8,
        padding: large ? "22px 24px" : medium ? "16px 18px" : "12px 14px",
        display: medium ? "flex" : undefined,
        flexDirection: medium ? "column" : undefined,
        justifyContent: medium ? "center" : undefined,
        alignItems: medium ? "center" : undefined,
        textAlign: medium ? "center" : undefined,
      }}
    >
      <div
        style={{
          fontSize: large ? 36 : medium ? 28 : 24,
          lineHeight: large ? "40px" : medium ? "34px" : "30px",
          fontWeight: 590,
          color: toneColor(tone),
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: large ? 8 : medium ? 6 : 4,
          fontSize: large ? 14 : medium ? 13 : 12,
          lineHeight: large ? "20px" : medium ? "18px" : "16px",
          fontWeight: 700,
          color: t.textTertiary,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function Callout({
  title,
  children,
}: {
  title?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        padding: "10px 12px",
        background: t.fillTertiary,
        border: `1px solid ${t.strokeTertiary}`,
        borderRadius: 8,
      }}
    >
      {title ? (
        <div
          style={{
            fontSize: 14,
            lineHeight: "20px",
            fontWeight: 600,
            color: t.text,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
      ) : null}
      <div
        style={{
          fontSize: 14,
          lineHeight: "20px",
          color: t.textSecondary,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function UsageBar({
  total,
  segments,
  topLeftLabel,
  topRightLabel,
}: {
  total: number;
  segments: { id: string; value: number; color?: string }[];
  topLeftLabel?: ReactNode;
  topRightLabel?: ReactNode;
}) {
  const used = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          fontSize: 12,
          lineHeight: "16px",
          color: t.textTertiary,
        }}
      >
        <span>{topLeftLabel}</span>
        <span>{topRightLabel}</span>
      </div>
      <div
        style={{
          display: "flex",
          height: 8,
          borderRadius: 999,
          overflow: "hidden",
          background: t.fillTertiary,
        }}
      >
        {segments.map((s) => (
          <div
            key={s.id}
            style={{
              width: `${(s.value / total) * 100}%`,
              background: s.color === "orange" ? t.orange : t.accent,
              borderRadius: 999,
            }}
          />
        ))}
        <div style={{ flex: 1, minWidth: total > used ? 0 : undefined }} />
      </div>
    </div>
  );
}

export function Table({
  headers,
  rows,
  columnAlign,
  rowTone,
  stickyHeader,
}: {
  headers: ReactNode[];
  rows: ReactNode[][];
  columnAlign?: Array<Align | undefined>;
  rowTone?: Array<RowTone | undefined>;
  stickyHeader?: boolean;
}) {
  return (
    <div
      style={{
        border: `1px solid ${t.strokeTertiary}`,
        borderRadius: 8,
        overflow: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          lineHeight: "20px",
        }}
      >
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                style={{
                  textAlign: columnAlign?.[i] ?? "left",
                  padding: "8px 12px",
                  fontSize: 12,
                  lineHeight: "16px",
                  fontWeight: 700,
                  color: t.textTertiary,
                  borderBottom: `1px solid ${t.strokeTertiary}`,
                  background: t.bg,
                  position: stickyHeader ? "sticky" : undefined,
                  top: stickyHeader ? 0 : undefined,
                  zIndex: stickyHeader ? 1 : undefined,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {headers.map((_, c) => (
                <td
                  key={c}
                  style={{
                    textAlign: columnAlign?.[c] ?? "left",
                    padding: "8px 12px",
                    color: t.text,
                    borderBottom:
                      r === rows.length - 1
                        ? "none"
                        : `1px solid ${t.strokeTertiary}`,
                    verticalAlign: "middle",
                  }}
                >
                  {c === 0 && rowTone?.[r] ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: toneColor(rowTone[r]),
                          flexShrink: 0,
                        }}
                      />
                      {row[c]}
                    </span>
                  ) : (
                    row[c]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BatteryPill({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        minWidth: 118,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 72,
            height: 16,
            borderRadius: 999,
            border: `1px solid ${t.strokeSecondary}`,
            background: t.fillTertiary,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${clamped}%`,
              height: "100%",
              background: t.accent,
              borderRadius: 999,
            }}
          />
        </div>
        <div
          style={{
            width: 3,
            height: 7,
            marginLeft: 2,
            borderRadius: "0 2px 2px 0",
            background: t.strokeSecondary,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          lineHeight: "16px",
          color: t.textSecondary,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {clamped}%
      </span>
    </div>
  );
}

export type HealthBand = "Healthy" | "Watch" | "At Risk";

export type HealthResultRow = {
  name: string;
  tier: string;
  risk: string;
  health: string;
  band: HealthBand;
};

const bandFill: Record<HealthBand, { row: string; cell: string; text: string }> = {
  Healthy: { row: "transparent", cell: "#E8F5E9", text: t.success },
  Watch: { row: "transparent", cell: "#FFE082", text: t.warning },
  "At Risk": { row: "transparent", cell: "#FFCDD2", text: t.danger },
};

export function HealthResultTable({ rows }: { rows: HealthResultRow[] }) {
  const th: CSSProperties = {
    padding: "8px 12px",
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 700,
    textAlign: "center",
    border: `1px solid ${t.strokePrimary}`,
    background: t.bg,
    color: t.text,
  };
  const td: CSSProperties = {
    padding: "8px 12px",
    fontSize: 14,
    lineHeight: "20px",
    border: `1px solid ${t.strokeTertiary}`,
  };

  return (
    <div style={{ border: `1px solid ${t.strokeTertiary}`, borderRadius: 8, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>Customer Name</th>
            <th style={{ ...th, textAlign: "left" }}>Customer Tier</th>
            <th style={th}>TOTAL RISK SCORE</th>
            <th style={th}>HEALTH %</th>
            <th style={th}>HEALTH BAND</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const fill = bandFill[row.band];
            return (
              <tr key={row.name} style={{ background: fill.row }}>
                <td style={{ ...td, color: t.text }}>{row.name}</td>
                <td style={{ ...td, color: row.tier === "Enterprise" ? t.accent : t.text }}>
                  {row.tier}
                </td>
                <td style={{ ...td, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                  {row.risk} / 24
                </td>
                <td
                  style={{
                    ...td,
                    textAlign: "center",
                    background: fill.cell,
                    color: fill.text,
                    fontWeight: 590,
                  }}
                >
                  {row.health}
                </td>
                <td
                  style={{
                    ...td,
                    textAlign: "center",
                    background: fill.cell,
                    color: fill.text,
                    fontWeight: 590,
                  }}
                >
                  {row.band}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const pipelineByMonth = [
  { month: "Mar 26", rolling: 1 },
  { month: "Apr 26", rolling: 60001 },
  { month: "May 26", rolling: 60001 },
  { month: "Jun 26", rolling: 60001 },
  { month: "Jul 26", rolling: 60001 },
  { month: "Aug 26", rolling: 145001 },
  { month: "Sep 26", rolling: 339001 },
  { month: "Oct 26", rolling: 552601 },
  { month: "Nov 26", rolling: 1157601 },
  { month: "Dec 26", rolling: 1627617 },
  { month: "Jan 27", rolling: 1737617 },
  { month: "Feb 27", rolling: 1861817 },
  { month: "Mar 27", rolling: 2291817 },
  { month: "May 27", rolling: 2436817 },
  { month: "Jun 27", rolling: 2521817 },
] as const;

function formatArrAxis(value: number) {
  if (value === 0) return "$0";
  const millions = value / 1_000_000;
  return `$${millions.toFixed(1)}M`;
}

export function PipelineTrendChart() {
  const width = 920;
  const height = 320;
  const left = 56;
  const right = 16;
  const top = 16;
  const bottom = 52;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const yMax = 2_600_000;
  const yTicks = [0, 650000, 1300000, 1950000, 2600000];
  const series = [
    { key: "rolling" as const, name: "Rolling Pipeline", color: t.accent },
  ];
  const x = (i: number) => left + (plotW / (pipelineByMonth.length - 1)) * i;
  const y = (v: number) => top + plotH - (v / yMax) * plotH;

  return (
    <div
      style={{
        border: `1px solid ${t.strokeTertiary}`,
        borderRadius: 8,
        padding: "12px 14px 8px",
        background: t.bg,
      }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="auto"
        role="img"
        aria-label="Rolling pipeline by close month"
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={width - right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={t.strokeTertiary}
            />
            <text
              x={left - 8}
              y={y(tick) + 4}
              textAnchor="end"
              fontSize="11"
              fill={t.textTertiary}
            >
              {formatArrAxis(tick)}
            </text>
          </g>
        ))}
        <line
          x1={left}
          x2={width - right}
          y1={top + plotH}
          y2={top + plotH}
          stroke={t.strokeSecondary}
        />
        <text
          x={left + plotW / 2}
          y={height - 4}
          textAnchor="middle"
          fontSize="11"
          fill={t.textTertiary}
        >
          Close month
        </text>
        <text
          x={14}
          y={top + plotH / 2}
          textAnchor="middle"
          fontSize="11"
          fill={t.textTertiary}
          transform={`rotate(-90 14 ${top + plotH / 2})`}
        >
          ARR ($)
        </text>
        {series.map((s) => {
          const points = pipelineByMonth
            .map((row, i) => `${x(i)},${y(row[s.key])}`)
            .join(" ");
          return (
            <g key={s.key}>
              <polyline
                points={points}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
              />
              {pipelineByMonth.map((row, i) => (
                <circle
                  key={`${s.key}-${row.month}`}
                  cx={x(i)}
                  cy={y(row[s.key])}
                  r="3"
                  fill={s.color}
                />
              ))}
            </g>
          );
        })}
        {pipelineByMonth.map((row, i) => (
          <text
            key={row.month}
            x={x(i)}
            y={top + plotH + 16}
            textAnchor="end"
            fontSize="10"
            fill={t.textTertiary}
            transform={`rotate(-40 ${x(i)} ${top + plotH + 16})`}
          >
            {row.month}
          </text>
        ))}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginTop: 4,
          fontSize: 12,
          lineHeight: "16px",
          fontWeight: 700,
          color: t.textTertiary,
        }}
      >
        {series.map((s) => (
          <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 14,
                height: 2,
                background: s.color,
                display: "inline-block",
              }}
            />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export const canvasTokens = t;

export const canvasPageStyle: CSSProperties = {
  minHeight: "100%",
  background: t.bg,
  color: t.text,
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  padding: 24,
};
