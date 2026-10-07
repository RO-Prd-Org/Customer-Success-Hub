import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import type { DataTableFeatures } from "@/components/patterns/data-table"
import { Badge } from "@/components/ui/badge"

export type RecordRow = {
  id: string
  name: string
  status: "active" | "pending" | "archived"
  owner: string
  updatedAt: string
  description: string
}

export type ReviewRow = {
  id: string
  request: string
  requester: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  details: string
}

export const records: RecordRow[] = [
  {
    id: "rec-001",
    name: "Northwind contract",
    status: "active",
    owner: "Alex Morgan",
    updatedAt: "2026-03-08",
    description:
      "Master services agreement with Northwind Traders covering procurement and vendor management for FY26.",
  },
  {
    id: "rec-002",
    name: "Q1 vendor review",
    status: "pending",
    owner: "Jamie Lee",
    updatedAt: "2026-03-07",
    description:
      "Quarterly vendor performance review including SLA compliance and renewal recommendations.",
  },
  {
    id: "rec-003",
    name: "Legacy policy archive",
    status: "archived",
    owner: "Sam Patel",
    updatedAt: "2026-03-01",
    description:
      "Archived policy documents superseded by the 2025 governance framework update.",
  },
]

export const reviews: ReviewRow[] = [
  {
    id: "rev-101",
    request: "Access request — Finance workspace",
    requester: "Taylor Reed",
    status: "pending",
    submittedAt: "2026-03-09",
    details:
      "Requesting read/write access to Finance workspace dashboards for month-end reporting.",
  },
  {
    id: "rev-102",
    request: "Vendor onboarding — Acme Ltd",
    requester: "Jordan Kim",
    status: "pending",
    submittedAt: "2026-03-08",
    details:
      "New vendor onboarding package including insurance certificates and security questionnaire.",
  },
  {
    id: "rev-103",
    request: "Policy exception — data retention",
    requester: "Casey Nguyen",
    status: "approved",
    submittedAt: "2026-03-06",
    details:
      "Temporary exception to standard retention policy for litigation hold on project Orion.",
  },
]

const recordColumnHelper = createColumnHelper<DataTableFeatures, RecordRow>()
const reviewColumnHelper = createColumnHelper<DataTableFeatures, ReviewRow>()

export const recordColumns = recordColumnHelper.columns([
  recordColumnHelper.accessor("name", { header: "Name" }),
  recordColumnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue()
      return (
        <Badge variant={status === "archived" ? "secondary" : "outline"}>
          {status}
        </Badge>
      )
    },
  }),
  recordColumnHelper.accessor("owner", { header: "Owner" }),
  recordColumnHelper.accessor("updatedAt", { header: "Updated" }),
])

export const reviewColumns = reviewColumnHelper.columns([
  reviewColumnHelper.accessor("request", { header: "Request" }),
  reviewColumnHelper.accessor("requester", { header: "Requester" }),
  reviewColumnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue()
      return (
        <Badge
          variant={
            status === "approved"
              ? "outline"
              : status === "rejected"
                ? "destructive"
                : "secondary"
          }
        >
          {status}
        </Badge>
      )
    },
  }),
  reviewColumnHelper.accessor("submittedAt", { header: "Submitted" }),
])

export const recordColumnsDef =
  recordColumns as ColumnDef<DataTableFeatures, RecordRow>[]
export const reviewColumnsDef =
  reviewColumns as ColumnDef<DataTableFeatures, ReviewRow>[]
