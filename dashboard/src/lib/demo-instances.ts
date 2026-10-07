export type DemoInstanceId = "fashion" | "logistics"

export type DemoDataFile = {
  id: string
  label: string
  path: string
  description: string
  group: string
}

export type DemoFileGroup = {
  id: string
  label: string
  files: DemoDataFile[]
}

export type DemoInstance = {
  id: DemoInstanceId
  name: string
  description: string
  dataPrefix: string
  files: DemoDataFile[]
  fileGroupOrder: string[]
}

export const DEMO_INSTANCES: DemoInstance[] = [
  {
    id: "fashion",
    name: "Fashion Retailer",
    description: "Last-mile delivery leakage",
    dataPrefix: "/data/fashion",
    fileGroupOrder: ["Data", "Contracts"],
    files: [
      {
        id: "commerce_orders",
        label: "Commerce orders",
        path: "commerce_orders.parquet",
        description: "Customer orders from commerce platform",
        group: "Data",
      },
      {
        id: "order_promises",
        label: "Order promises",
        path: "order_promises.parquet",
        description: "Accepted delivery promises at checkout",
        group: "Data",
      },
      {
        id: "oms_allocations",
        label: "OMS allocations",
        path: "oms_allocations.parquet",
        description: "Fulfilment allocation decisions",
        group: "Data",
      },
      {
        id: "wms_pick_events",
        label: "WMS pick events",
        path: "wms_pick_events.parquet",
        description: "Warehouse pick task scans",
        group: "Data",
      },
      {
        id: "wms_pack_events",
        label: "WMS pack events",
        path: "wms_pack_events.parquet",
        description: "Depot weigh-in and dimensions",
        group: "Data",
      },
      {
        id: "tms_rate_quotes",
        label: "TMS rate quotes",
        path: "tms_rate_quotes.parquet",
        description: "Carrier rate shopping results",
        group: "Data",
      },
      {
        id: "tms_labels",
        label: "TMS labels",
        path: "tms_labels.parquet",
        description: "Shipping label versions",
        group: "Data",
      },
      {
        id: "tms_manifests",
        label: "TMS manifests",
        path: "tms_manifests.parquet",
        description: "Manifest close events",
        group: "Data",
      },
      {
        id: "carrier_tracking",
        label: "Carrier tracking",
        path: "carrier_tracking.parquet",
        description: "Carrier tracking event stream",
        group: "Data",
      },
      {
        id: "proof_of_delivery",
        label: "Proof of delivery",
        path: "proof_of_delivery.parquet",
        description: "POD photos and residential flags",
        group: "Data",
      },
      {
        id: "contract_rate_rules",
        label: "Contract rate rules",
        path: "contract_rate_rules.parquet",
        description: "Procurement rate card rules",
        group: "Contracts",
      },
      {
        id: "surcharge_rules",
        label: "Surcharge rules",
        path: "surcharge_rules.parquet",
        description: "Contractual surcharge caps",
        group: "Contracts",
      },
      {
        id: "carrier_invoices",
        label: "Carrier invoices",
        path: "carrier_invoices.parquet",
        description: "Carrier invoice headers",
        group: "Contracts",
      },
      {
        id: "carrier_invoice_lines",
        label: "Carrier invoice lines",
        path: "carrier_invoice_lines.parquet",
        description: "Carrier invoice charge lines",
        group: "Data",
      },
    ],
  },
  {
    id: "logistics",
    name: "Freight Logistics",
    description: "Cost pass-through leakage",
    dataPrefix: "/data/logistics",
    fileGroupOrder: ["3rd party costs", "Direct costs", "Revenue data"],
    files: [
      {
        id: "client_bookings",
        label: "Client bookings",
        path: "client_bookings.parquet",
        description: "Shipper booking and quotes",
        group: "Revenue data",
      },
      {
        id: "client_rate_cards",
        label: "Client rate cards",
        path: "client_rate_cards.parquet",
        description: "Pass-through and markup rules",
        group: "Revenue data",
      },
      {
        id: "shipment_telemetry",
        label: "Shipment telemetry",
        path: "shipment_telemetry.parquet",
        description: "GPS, wait time, and POD events",
        group: "Direct costs",
      },
      {
        id: "subcontractor_invoices",
        label: "Subcontractor invoices",
        path: "subcontractor_invoices.parquet",
        description: "Subcontractor invoice headers",
        group: "3rd party costs",
      },
      {
        id: "subcontractor_invoice_lines",
        label: "Subcontractor invoice lines",
        path: "subcontractor_invoice_lines.parquet",
        description: "Linehaul and accessorial charges",
        group: "3rd party costs",
      },
      {
        id: "fuel_card_transactions",
        label: "Fuel card transactions",
        path: "fuel_card_transactions.parquet",
        description: "Fuel card swipes by vehicle",
        group: "Direct costs",
      },
      {
        id: "toll_events",
        label: "Toll events",
        path: "toll_events.parquet",
        description: "Toll tag gantry hits",
        group: "Direct costs",
      },
      {
        id: "warehouse_owned_allocations",
        label: "Owned warehouse allocations",
        path: "warehouse_owned_allocations.parquet",
        description: "Internal warehouse cost allocations",
        group: "Direct costs",
      },
      {
        id: "warehouse_third_party_invoices",
        label: "3P warehouse invoices",
        path: "warehouse_third_party_invoices.parquet",
        description: "Third-party warehouse bills",
        group: "3rd party costs",
      },
      {
        id: "client_invoices",
        label: "Client invoices",
        path: "client_invoices.parquet",
        description: "Receivables invoice headers",
        group: "Revenue data",
      },
      {
        id: "client_invoice_lines",
        label: "Client invoice lines",
        path: "client_invoice_lines.parquet",
        description: "Recovered pass-through line items",
        group: "Revenue data",
      },
    ],
  },
]

export function getDemoInstance(id: DemoInstanceId): DemoInstance {
  const instance = DEMO_INSTANCES.find((demo) => demo.id === id)
  if (!instance) {
    throw new Error(`Unknown demo instance: ${id}`)
  }
  return instance
}

export function getInvoicesNavLabel(demoId: DemoInstanceId): string {
  return demoId === "logistics" ? "Customer invoices" : "Invoices"
}

export function getDemoFileGroups(demo: DemoInstance): DemoFileGroup[] {
  const grouped = new Map<string, DemoDataFile[]>()
  for (const file of demo.files) {
    const files = grouped.get(file.group) ?? []
    files.push(file)
    grouped.set(file.group, files)
  }

  return demo.fileGroupOrder
    .filter((label) => grouped.has(label))
    .map((label) => ({
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label,
      files: grouped.get(label) ?? [],
    }))
}
