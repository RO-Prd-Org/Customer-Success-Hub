import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SLA_TIERS, severitiesForTier, type SlaTicket } from "@/lib/executive-health"
import { useHealth } from "@/views/executive/health-store"

const EMPTY = "__empty__"

const COLUMNS: { key: keyof SlaTicket; label: string; align?: "right"; width: string }[] = [
  { key: "id", label: "Ticket", width: "w-28" },
  { key: "customer", label: "Customer", width: "w-[calc(100%-113rem)] min-w-[20.5rem]" },
  { key: "tier", label: "Tier", width: "w-36" },
  { key: "severity", label: "Severity", width: "w-24" },
  { key: "loggedDate", label: "Logged", width: "w-28" },
  { key: "actualResponse", label: "Response hrs", align: "right", width: "w-36" },
  { key: "responseTarget", label: "Response target", align: "right", width: "w-40" },
  { key: "responseBreach", label: "Response breach", width: "w-40" },
  { key: "actualResolution", label: "Resolution hrs", align: "right", width: "w-36" },
  { key: "resolutionTarget", label: "Resolution target", align: "right", width: "w-44" },
  { key: "resolutionBreach", label: "Resolution breach", width: "w-44" },
  { key: "outcome", label: "Outcome", width: "w-36" },
  { key: "notes", label: "Notes", width: "w-48" },
]

function CellSelect({
  label,
  value,
  options,
  disabled = false,
  contentClassName,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  disabled?: boolean
  contentClassName?: string
  onChange: (value: string) => void
}) {
  const selected = options.includes(value) ? value : EMPTY
  return (
    <Select
      value={selected}
      disabled={disabled}
      onValueChange={(next) => onChange(!next || next === EMPTY ? "" : next)}
    >
      <SelectTrigger className="h-8 w-full" aria-label={label}>
        <SelectValue>{(current) => (!current || current === EMPTY ? "—" : current)}</SelectValue>
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        <SelectItem value={EMPTY}>—</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function SlaLogView() {
  const { customers, tickets, updateTicket, addTicket, removeTicket } = useHealth()
  const [editing, setEditing] = useState(false)
  const customerNames = [...new Set(customers.map((customer) => customer.name.trim()).filter(Boolean))]

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle>SLA log</CardTitle>
            <CardDescription>
              Tier is Enterprise or SMB. Severity follows that tier. Targets and breach flags
              update from the tier, severity, and actual hours.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={editing ? "default" : "outline"}
              onClick={() => setEditing((current) => !current)}
            >
              Edit
            </Button>
            <Button variant="outline" onClick={addTicket}>
              Add ticket
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Table className="w-full table-fixed">
          <colgroup>
            {COLUMNS.map((column) => (
              <col key={column.key} className={column.width} />
            ))}
            <col className="w-12" />
          </colgroup>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((column) => (
                <TableHead
                  key={column.key}
                  className={`${column.width} whitespace-nowrap text-left`}
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-12 px-2" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const severities = severitiesForTier(ticket.tier)
              return (
                <TableRow key={ticket.rowId} className="h-12">
                  {COLUMNS.map((column) => (
                    <TableCell key={column.key} className={column.width}>
                      {column.key === "customer" ? (
                        <CellSelect
                          label={`Customer for ${ticket.id}`}
                          value={ticket.customer}
                          options={customerNames}
                          contentClassName="min-w-[18.5rem]"
                          onChange={(value) => updateTicket(ticket.rowId, "customer", value)}
                        />
                      ) : column.key === "tier" ? (
                        <CellSelect
                          label={`Tier for ${ticket.id}`}
                          value={ticket.tier}
                          options={SLA_TIERS}
                          onChange={(value) => updateTicket(ticket.rowId, "tier", value)}
                        />
                      ) : column.key === "severity" ? (
                        <CellSelect
                          label={`Severity for ${ticket.id}`}
                          value={ticket.severity}
                          options={severities}
                          disabled={severities.length === 0}
                          onChange={(value) => updateTicket(ticket.rowId, "severity", value)}
                        />
                      ) : (
                        <Input
                          value={ticket[column.key]}
                          aria-label={`${column.label} for ${ticket.id}`}
                          onChange={(event) => updateTicket(ticket.rowId, column.key, event.target.value)}
                          className={`h-8 ${column.align === "right" ? "text-right" : ""}`}
                        />
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="w-12 px-2 text-right">
                    {editing ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${ticket.id || "ticket"}`}
                        onClick={() => removeTicket(ticket.rowId)}
                      >
                        X
                      </Button>
                    ) : (
                      <span className="inline-block size-8" />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
