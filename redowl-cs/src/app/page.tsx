"use client";

import { useState } from "react";
import {
  BatteryPill,
  Callout,
  Divider,
  Grid,
  H1,
  H2,
  Stack,
  Stat,
  Table,
  Text,
  WeekChange,
  PipelineTrendChart,
  canvasPageStyle,
  canvasTokens,
} from "@/components/canvas-ui";
import { CustomerHealthBlock, HealthEditor } from "@/components/health-editor";
import { HealthProvider } from "@/components/health-store";

export default function Home() {
  return (
    <HealthProvider>
      <DashboardShell />
    </HealthProvider>
  );
}

function DashboardShell() {
  const [tab, setTab] = useState<"dashboard" | "health">("dashboard");
  const t = canvasTokens;

  return (
    <div style={canvasPageStyle}>
      <Stack gap={28}>
        <div style={{ display: "flex", gap: 8 }}>
          {(
            [
              ["dashboard", "Dashboard"],
              ["health", "Customer health"],
            ] as const
          ).map(([id, label]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                style={{
                  border: `1px solid ${active ? t.accent : t.strokeSecondary}`,
                  background: active ? t.accent : t.bg,
                  color: active ? "#fff" : t.text,
                  borderRadius: 999,
                  padding: "6px 14px",
                  font: "inherit",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        {tab === "health" ? <HealthEditor /> : <DashboardView />}
      </Stack>
    </div>
  );
}

function DashboardView() {
  return (
    <Stack gap={28}>
        <H1>Executive Dashboard — Business Performance — 7 October 2026</H1>

        <Callout title="Board snapshot">
          YTD ARR is $109,001, from deals in Closed. Gross pipeline is
          $4,608,008. The active opportunity base is 86, counting every deal
          that is not Closed. Six deals are in Demo/POV. 14 implementations are
          active.
        </Callout>

        <Grid columns={3} gap={16}>
          <Stat value="$109,001" label="YTD ARR" tone="warning" size="lg" />
          <Stat value="$4,608,008" size="lg" label="Gross pipeline" />
          <Stat
            value="$874,420"
            size="lg"
            label={
              <>
                Weighted pipeline ·{" "}
                <WeekChange direction="up" percent="14.6%" />
              </>
            }
          />
        </Grid>

        <Grid columns="minmax(0, 1fr) minmax(0, 1.6fr)" gap={16}>
          <Grid columns={2} gap={12}>
            <Stat value="6" label="New demos" size="md" />
            <Stat value="9" label="New opportunities" size="md" />
            <Stat value="86" size="md" label="Total 4RQ opportunities" />
            <Stat value="14" label="Implementations for 2026" size="md" />
          </Grid>
          <Stack gap={10}>
            <H2>Rolling pipeline by close month</H2>
            <Text tone="tertiary" size="small">
              Source: Pipedrive deal export · expected close date
            </Text>
            <PipelineTrendChart />
          </Stack>
        </Grid>

        <Divider />

        <Stack gap={10}>
          <H2>Build progress by customer</H2>
          <Text tone="tertiary" size="small">
            Live as at 17 Sep 2026 | Source: Implementation Tracker
          </Text>
          <Grid columns={6} gap={12}>
            <Stat value="15" label="In implementation" />
            <Stat value="1" label="Sandbox live" />
            <Stat value="48%" label="Avg build progress" />
            <Stat value="4" label="With customer" />
            <Stat value="14" label="At risk" tone="danger" />
            <Stat value="$1,390,000" label="ARR in implementation" />
          </Grid>
          <Table
            stickyHeader
            headers={[
              "Customer",
              "% Complete",
              "Stage No.",
              "Sandbox Development Stage",
              "Days in Stage",
              "RAG",
              "ARR ($)",
            ]}
            columnAlign={[
              "left",
              "left",
              "right",
              "left",
              "right",
              "left",
              "right",
            ]}
            rowTone={[
              "success",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
              "danger",
            ]}
            rows={[
              [
                "Aussie Broadband",
                <BatteryPill key="abb" percent={100} />,
                "10",
                "Sandbox Live",
                "50",
                "Complete",
                "350000",
              ],
              [
                "Vicinity Centres",
                <BatteryPill key="vic" percent={90} />,
                "9",
                "Released to Customer with Changes",
                "37",
                "Red",
                "25000",
              ],
              [
                "Police Credit Union SA & NT",
                <BatteryPill key="pcu" percent={70} />,
                "7",
                "Released to Customer for Testing",
                "45",
                "Red",
                "25000",
              ],
              [
                "Nutrimetics",
                <BatteryPill key="nut" percent={60} />,
                "6",
                "Corrections from Testing",
                "34",
                "Red",
                "25000",
              ],
              [
                "YourCFOPartner",
                <BatteryPill key="cfo" percent={30} />,
                "3",
                "Configuration to Customer SoW",
                "30",
                "Red",
                "10000",
              ],
              [
                "Northern Health",
                <BatteryPill key="nh" percent={40} />,
                "4",
                "Access - provide customer demo logins",
                "42",
                "Red",
                "300000",
              ],
              [
                "Treasury Wine Estates",
                <BatteryPill key="twe" percent={30} />,
                "3",
                "Configuration to Customer SoW",
                "36",
                "Red",
                "280000",
              ],
              [
                "QBE Insurance",
                <BatteryPill key="qbe" percent={20} />,
                "2",
                "Configuration to base level (Simple PO flow)",
                "31",
                "Red",
                "60000",
              ],
              [
                "CoolDrive Auto Parts",
                <BatteryPill key="cd" percent={50} />,
                "5",
                "Internal Testing",
                "53",
                "Red",
                "60000",
              ],
              [
                "ENGIE AU",
                <BatteryPill key="engie" percent={10} />,
                "1",
                "Engineering — environment yet to be allocated",
                "44",
                "Red",
                "50000",
              ],
              [
                "Regis Aged Care",
                <BatteryPill key="regis" percent={10} />,
                "1",
                "Engineering — environment yet to be allocated",
                "69",
                "Red",
                "50000",
              ],
              [
                "SALTA",
                <BatteryPill key="salta" percent={40} />,
                "4",
                "Access - provide customer demo logins",
                "33",
                "Red",
                "50000",
              ],
              [
                "TOGA",
                <BatteryPill key="toga" percent={20} />,
                "2",
                "Configuration to base level (Simple PO flow)",
                "39",
                "Red",
                "50000",
              ],
              [
                "Kane Construction",
                <BatteryPill key="kane" percent={80} />,
                "8",
                "Customer Config Changes Being Made",
                "29",
                "Red",
                "30000",
              ],
              [
                "ISS Data",
                <BatteryPill key="iss" percent={70} />,
                "7",
                "Released to Customer for Testing",
                "49",
                "Red",
                "25000",
              ],
            ]}
          />
          <Text tone="tertiary" size="small">
            Kane Dropped out.
          </Text>
          <Text tone="tertiary" size="small">
            Source: RedOwl Pipeline Analysis · Implementation Dashboard · Live as
            at 17 Sep 2026
          </Text>
        </Stack>

        <CustomerHealthBlock />
      </Stack>
  );
}
