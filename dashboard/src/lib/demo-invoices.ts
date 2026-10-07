import type { DemoInstanceId } from "@/lib/demo-instances"

export type InvoiceStatus = "red" | "amber" | "green"

export type LeakageFactSource = {
  dataset: string
  rowId: string
}

export type LeakageFact = {
  text: string
  source: LeakageFactSource
}

export type InvoiceIssue = {
  id: string
  findingId: string
  type: string
  amount: number
  recoverable: boolean
  facts: LeakageFact[]
}

export type Invoice = {
  id: string
  name: string
  vendor: string
  invoiceDate: string
  dueDate: string
  amount: number
  currency: string
  status: InvoiceStatus
  issues?: InvoiceIssue[]
  reasoning: string
  agentAction?: string
  conversationIds: string[]
  metadata: Record<string, string>
  analysisPending?: boolean
  analyzedAt?: string | null
  agentEvidence?: string | null
}

const fashionInvoices: Invoice[] = [
  {
    "id": "CINV-000045",
    "name": "FedEx \u2014 Cubic batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-02",
    "dueDate": "2026-03-17",
    "amount": 532.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-001",
        "findingId": "L02",
        "type": "Billed weight overcharge",
        "amount": 17.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100043"
            }
          },
          {
            "text": "Carrier invoice line CIL-001 bills excess rate on CINV-000045.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-001"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $17.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Cubic weight volumetric profile overcharge: Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3.",
    "agentAction": "Autonomously opened carrier dispute conv-f-001 and placed invoice line CIL-001 on hold pending credit.",
    "conversationIds": [
      "conv-f-001"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000045",
      "Tracking ref": "TRK-100043",
      "Parcel ID": "PCL-100043",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000130",
    "name": "DHL \u2014 Unjustified batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-03",
    "dueDate": "2026-03-18",
    "amount": 615.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-002",
        "findingId": "L05",
        "type": "Invalid residential surcharge",
        "amount": 20.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Residential fee ($6.50) applied to commercial office tower loading dock B",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100086"
            }
          },
          {
            "text": "Carrier invoice line CIL-002 bills excess rate on CINV-000130.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-002"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $20.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Unjustified residential surcharge on commercial office building: Residential fee ($6.50) applied to commercial office tower loading dock B.",
    "agentAction": "Autonomously opened carrier dispute conv-f-002 and placed invoice line CIL-002 on hold pending credit.",
    "conversationIds": [
      "conv-f-002"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000130",
      "Tracking ref": "TRK-100086",
      "Parcel ID": "PCL-100086",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000175",
    "name": "AusPost \u2014 Duplicate batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-04",
    "dueDate": "2026-03-19",
    "amount": 697.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-003",
        "findingId": "L04",
        "type": "Duplicate label charge",
        "amount": 22.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Second label line billed ($17.80) for single physical consignment handover",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100129"
            }
          },
          {
            "text": "Carrier invoice line CIL-003 bills excess rate on CINV-000175.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-003"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $22.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate shipping label charge without second handover: Second label line billed ($17.80) for single physical consignment handover.",
    "agentAction": "Autonomously opened carrier dispute conv-f-003 and placed invoice line CIL-003 on hold pending credit.",
    "conversationIds": [
      "conv-f-003"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000175",
      "Tracking ref": "TRK-100129",
      "Parcel ID": "PCL-100129",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000013",
    "name": "StarTrack \u2014 Missed batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-05",
    "dueDate": "2026-03-20",
    "amount": 780.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-004",
        "findingId": "L01",
        "type": "Missed SLA service credit",
        "amount": 25.7,
        "recoverable": true,
        "facts": [
          {
            "text": "12 parcels missed guaranteed promise window with no weather exception",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100172"
            }
          },
          {
            "text": "Carrier invoice line CIL-004 bills excess rate on CINV-000013.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-004"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $25.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Missed SLA service credit claim on late Express batch: 12 parcels missed guaranteed promise window with no weather exception.",
    "agentAction": "Autonomously opened carrier dispute conv-f-004 and placed invoice line CIL-004 on hold pending credit.",
    "conversationIds": [
      "conv-f-004"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000013",
      "Tracking ref": "TRK-100172",
      "Parcel ID": "PCL-100172",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000014",
    "name": "CouriersPlease \u2014 Avoidable batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-06",
    "dueDate": "2026-03-21",
    "amount": 862.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-005",
        "findingId": "L03",
        "type": "Avoidable multi-DC split",
        "amount": 28.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Order split across MEL and SYD DCs despite Melbourne having full stock",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100215"
            }
          },
          {
            "text": "Carrier invoice line CIL-005 bills excess rate on CINV-000014.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-005"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $28.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Avoidable multi-DC split shipment counterfactual: Order split across MEL and SYD DCs despite Melbourne having full stock.",
    "agentAction": "Autonomously opened carrier dispute conv-f-005 and placed invoice line CIL-005 on hold pending credit.",
    "conversationIds": [
      "conv-f-005"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000014",
      "Tracking ref": "TRK-100215",
      "Parcel ID": "PCL-100215",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000047",
    "name": "FedEx \u2014 Regional batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-07",
    "dueDate": "2026-03-22",
    "amount": 945.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-006",
        "findingId": "L02",
        "type": "Tariff zone error",
        "amount": 31.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100258"
            }
          },
          {
            "text": "Carrier invoice line CIL-006 bills excess rate on CINV-000047.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-006"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $31.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Regional tariff zone classification error: Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1.",
    "agentAction": "Autonomously opened carrier dispute conv-f-006 and placed invoice line CIL-006 on hold pending credit.",
    "conversationIds": [
      "conv-f-006"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000047",
      "Tracking ref": "TRK-100258",
      "Parcel ID": "PCL-100258",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000088",
    "name": "DHL \u2014 Non-conveyable batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-08",
    "dueDate": "2026-03-23",
    "amount": 1027.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-007",
        "findingId": "L05",
        "type": "Manual handling surcharge",
        "amount": 34.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Standard apparel box billed $35.00 manual handling fee due to sorter misread",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100301"
            }
          },
          {
            "text": "Carrier invoice line CIL-007 bills excess rate on CINV-000088.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-007"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $34.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Non-conveyable packaging surcharge dispute: Standard apparel box billed $35.00 manual handling fee due to sorter misread.",
    "agentAction": "Autonomously opened carrier dispute conv-f-007 and placed invoice line CIL-007 on hold pending credit.",
    "conversationIds": [
      "conv-f-007"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000088",
      "Tracking ref": "TRK-100301",
      "Parcel ID": "PCL-100301",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000090",
    "name": "AusPost \u2014 Stale batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-09",
    "dueDate": "2026-03-24",
    "amount": 1110.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-008",
        "findingId": "L02",
        "type": "Volumetric divisor mismatch",
        "amount": 36.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100344"
            }
          },
          {
            "text": "Carrier invoice line CIL-008 bills excess rate on CINV-000090.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-008"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $36.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Stale volumetric divisor applied during rating: Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor.",
    "agentAction": "Autonomously opened carrier dispute conv-f-008 and placed invoice line CIL-008 on hold pending credit.",
    "conversationIds": [
      "conv-f-008"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000090",
      "Tracking ref": "TRK-100344",
      "Parcel ID": "PCL-100344",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000132",
    "name": "StarTrack \u2014 Duplicate batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-10",
    "dueDate": "2026-03-25",
    "amount": 1192.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-009",
        "findingId": "L04",
        "type": "Duplicate EDI line item",
        "amount": 39.7,
        "recoverable": true,
        "facts": [
          {
            "text": "EDI void transmission delay caused ghost line item on carrier invoice",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100387"
            }
          },
          {
            "text": "Carrier invoice line CIL-009 bills excess rate on CINV-000132.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-009"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $39.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate pre-manifest line item ghost charge: EDI void transmission delay caused ghost line item on carrier invoice.",
    "agentAction": "Autonomously opened carrier dispute conv-f-009 and placed invoice line CIL-009 on hold pending credit.",
    "conversationIds": [
      "conv-f-009"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000132",
      "Tracking ref": "TRK-100387",
      "Parcel ID": "PCL-100387",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000177",
    "name": "CouriersPlease \u2014 Overhead batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-11",
    "dueDate": "2026-03-26",
    "amount": 1275.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-010",
        "findingId": "L02",
        "type": "Optical curtain misread",
        "amount": 42.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Hub optical curtain misread trailing plastic wrap from adjacent pallet",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100430"
            }
          },
          {
            "text": "Carrier invoice line CIL-010 bills excess rate on CINV-000177.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-010"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $42.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Overhead sorter camera calibration shift dispute: Hub optical curtain misread trailing plastic wrap from adjacent pallet.",
    "agentAction": "Autonomously opened carrier dispute conv-f-010 and placed invoice line CIL-010 on hold pending credit.",
    "conversationIds": [
      "conv-f-010"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000177",
      "Tracking ref": "TRK-100430",
      "Parcel ID": "PCL-100430",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000200",
    "name": "FedEx \u2014 Cubic batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-12",
    "dueDate": "2026-03-27",
    "amount": 1357.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-011",
        "findingId": "L02",
        "type": "Billed weight overcharge",
        "amount": 45.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100473"
            }
          },
          {
            "text": "Carrier invoice line CIL-011 bills excess rate on CINV-000200.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-011"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $45.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Cubic weight volumetric profile overcharge: Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3.",
    "agentAction": "Autonomously opened carrier dispute conv-f-011 and placed invoice line CIL-011 on hold pending credit.",
    "conversationIds": [
      "conv-f-011"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000200",
      "Tracking ref": "TRK-100473",
      "Parcel ID": "PCL-100473",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000201",
    "name": "DHL \u2014 Unjustified batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-13",
    "dueDate": "2026-03-28",
    "amount": 1440.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-012",
        "findingId": "L05",
        "type": "Invalid residential surcharge",
        "amount": 48.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Residential fee ($6.50) applied to commercial office tower loading dock B",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100516"
            }
          },
          {
            "text": "Carrier invoice line CIL-012 bills excess rate on CINV-000201.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-012"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $48.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Unjustified residential surcharge on commercial office building: Residential fee ($6.50) applied to commercial office tower loading dock B.",
    "agentAction": "Autonomously opened carrier dispute conv-f-012 and placed invoice line CIL-012 on hold pending credit.",
    "conversationIds": [
      "conv-f-012"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000201",
      "Tracking ref": "TRK-100516",
      "Parcel ID": "PCL-100516",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000202",
    "name": "AusPost \u2014 Duplicate batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-14",
    "dueDate": "2026-03-01",
    "amount": 1522.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-013",
        "findingId": "L04",
        "type": "Duplicate label charge",
        "amount": 50.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Second label line billed ($17.80) for single physical consignment handover",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100559"
            }
          },
          {
            "text": "Carrier invoice line CIL-013 bills excess rate on CINV-000202.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-013"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $50.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate shipping label charge without second handover: Second label line billed ($17.80) for single physical consignment handover.",
    "agentAction": "Autonomously opened carrier dispute conv-f-013 and placed invoice line CIL-013 on hold pending credit.",
    "conversationIds": [
      "conv-f-013"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000202",
      "Tracking ref": "TRK-100559",
      "Parcel ID": "PCL-100559",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000203",
    "name": "StarTrack \u2014 Missed batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "amount": 1605.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-014",
        "findingId": "L01",
        "type": "Missed SLA service credit",
        "amount": 53.7,
        "recoverable": true,
        "facts": [
          {
            "text": "12 parcels missed guaranteed promise window with no weather exception",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100602"
            }
          },
          {
            "text": "Carrier invoice line CIL-014 bills excess rate on CINV-000203.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-014"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $53.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Missed SLA service credit claim on late Express batch: 12 parcels missed guaranteed promise window with no weather exception.",
    "agentAction": "Autonomously opened carrier dispute conv-f-014 and placed invoice line CIL-014 on hold pending credit.",
    "conversationIds": [
      "conv-f-014"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000203",
      "Tracking ref": "TRK-100602",
      "Parcel ID": "PCL-100602",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000204",
    "name": "CouriersPlease \u2014 Avoidable batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-16",
    "dueDate": "2026-03-03",
    "amount": 1687.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-015",
        "findingId": "L03",
        "type": "Avoidable multi-DC split",
        "amount": 56.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Order split across MEL and SYD DCs despite Melbourne having full stock",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100645"
            }
          },
          {
            "text": "Carrier invoice line CIL-015 bills excess rate on CINV-000204.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-015"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $56.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Avoidable multi-DC split shipment counterfactual: Order split across MEL and SYD DCs despite Melbourne having full stock.",
    "agentAction": "Autonomously opened carrier dispute conv-f-015 and placed invoice line CIL-015 on hold pending credit.",
    "conversationIds": [
      "conv-f-015"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000204",
      "Tracking ref": "TRK-100645",
      "Parcel ID": "PCL-100645",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000205",
    "name": "FedEx \u2014 Regional batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "amount": 1770.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-016",
        "findingId": "L02",
        "type": "Tariff zone error",
        "amount": 59.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100688"
            }
          },
          {
            "text": "Carrier invoice line CIL-016 bills excess rate on CINV-000205.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-016"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $59.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Regional tariff zone classification error: Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1.",
    "agentAction": "Autonomously opened carrier dispute conv-f-016 and placed invoice line CIL-016 on hold pending credit.",
    "conversationIds": [
      "conv-f-016"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000205",
      "Tracking ref": "TRK-100688",
      "Parcel ID": "PCL-100688",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000206",
    "name": "DHL \u2014 Non-conveyable batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-18",
    "dueDate": "2026-03-05",
    "amount": 1852.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-017",
        "findingId": "L05",
        "type": "Manual handling surcharge",
        "amount": 62.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Standard apparel box billed $35.00 manual handling fee due to sorter misread",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100731"
            }
          },
          {
            "text": "Carrier invoice line CIL-017 bills excess rate on CINV-000206.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-017"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $62.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Non-conveyable packaging surcharge dispute: Standard apparel box billed $35.00 manual handling fee due to sorter misread.",
    "agentAction": "Autonomously opened carrier dispute conv-f-017 and placed invoice line CIL-017 on hold pending credit.",
    "conversationIds": [
      "conv-f-017"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000206",
      "Tracking ref": "TRK-100731",
      "Parcel ID": "PCL-100731",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000207",
    "name": "AusPost \u2014 Stale batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "amount": 1935.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-018",
        "findingId": "L02",
        "type": "Volumetric divisor mismatch",
        "amount": 64.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100774"
            }
          },
          {
            "text": "Carrier invoice line CIL-018 bills excess rate on CINV-000207.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-018"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $64.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Stale volumetric divisor applied during rating: Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor.",
    "agentAction": "Autonomously opened carrier dispute conv-f-018 and placed invoice line CIL-018 on hold pending credit.",
    "conversationIds": [
      "conv-f-018"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000207",
      "Tracking ref": "TRK-100774",
      "Parcel ID": "PCL-100774",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000208",
    "name": "StarTrack \u2014 Duplicate batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-20",
    "dueDate": "2026-03-07",
    "amount": 2017.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-019",
        "findingId": "L04",
        "type": "Duplicate EDI line item",
        "amount": 67.7,
        "recoverable": true,
        "facts": [
          {
            "text": "EDI void transmission delay caused ghost line item on carrier invoice",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100817"
            }
          },
          {
            "text": "Carrier invoice line CIL-019 bills excess rate on CINV-000208.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-019"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $67.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate pre-manifest line item ghost charge: EDI void transmission delay caused ghost line item on carrier invoice.",
    "agentAction": "Autonomously opened carrier dispute conv-f-019 and placed invoice line CIL-019 on hold pending credit.",
    "conversationIds": [
      "conv-f-019"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000208",
      "Tracking ref": "TRK-100817",
      "Parcel ID": "PCL-100817",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000209",
    "name": "CouriersPlease \u2014 Overhead batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "amount": 2100.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-020",
        "findingId": "L02",
        "type": "Optical curtain misread",
        "amount": 70.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Hub optical curtain misread trailing plastic wrap from adjacent pallet",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100860"
            }
          },
          {
            "text": "Carrier invoice line CIL-020 bills excess rate on CINV-000209.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-020"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $70.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Overhead sorter camera calibration shift dispute: Hub optical curtain misread trailing plastic wrap from adjacent pallet.",
    "agentAction": "Autonomously opened carrier dispute conv-f-020 and placed invoice line CIL-020 on hold pending credit.",
    "conversationIds": [
      "conv-f-020"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000209",
      "Tracking ref": "TRK-100860",
      "Parcel ID": "PCL-100860",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000210",
    "name": "FedEx \u2014 Cubic batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-22",
    "dueDate": "2026-03-09",
    "amount": 2182.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-021",
        "findingId": "L02",
        "type": "Billed weight overcharge",
        "amount": 73.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100903"
            }
          },
          {
            "text": "Carrier invoice line CIL-021 bills excess rate on CINV-000210.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-021"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $73.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Cubic weight volumetric profile overcharge: Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3.",
    "agentAction": "Autonomously opened carrier dispute conv-f-021 and placed invoice line CIL-021 on hold pending credit.",
    "conversationIds": [
      "conv-f-021"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000210",
      "Tracking ref": "TRK-100903",
      "Parcel ID": "PCL-100903",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000211",
    "name": "DHL \u2014 Unjustified batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-01",
    "dueDate": "2026-03-16",
    "amount": 2265.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-022",
        "findingId": "L05",
        "type": "Invalid residential surcharge",
        "amount": 76.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Residential fee ($6.50) applied to commercial office tower loading dock B",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100946"
            }
          },
          {
            "text": "Carrier invoice line CIL-022 bills excess rate on CINV-000211.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-022"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $76.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Unjustified residential surcharge on commercial office building: Residential fee ($6.50) applied to commercial office tower loading dock B.",
    "agentAction": "Autonomously opened carrier dispute conv-f-022 and placed invoice line CIL-022 on hold pending credit.",
    "conversationIds": [
      "conv-f-022"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000211",
      "Tracking ref": "TRK-100946",
      "Parcel ID": "PCL-100946",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000212",
    "name": "AusPost \u2014 Duplicate batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-02",
    "dueDate": "2026-03-17",
    "amount": 2347.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-023",
        "findingId": "L04",
        "type": "Duplicate label charge",
        "amount": 78.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Second label line billed ($17.80) for single physical consignment handover",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-100989"
            }
          },
          {
            "text": "Carrier invoice line CIL-023 bills excess rate on CINV-000212.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-023"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $78.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate shipping label charge without second handover: Second label line billed ($17.80) for single physical consignment handover.",
    "agentAction": "Autonomously opened carrier dispute conv-f-023 and placed invoice line CIL-023 on hold pending credit.",
    "conversationIds": [
      "conv-f-023"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000212",
      "Tracking ref": "TRK-100989",
      "Parcel ID": "PCL-100989",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000213",
    "name": "StarTrack \u2014 Missed batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-03",
    "dueDate": "2026-03-18",
    "amount": 2430.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-024",
        "findingId": "L01",
        "type": "Missed SLA service credit",
        "amount": 81.7,
        "recoverable": true,
        "facts": [
          {
            "text": "12 parcels missed guaranteed promise window with no weather exception",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101032"
            }
          },
          {
            "text": "Carrier invoice line CIL-024 bills excess rate on CINV-000213.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-024"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $81.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Missed SLA service credit claim on late Express batch: 12 parcels missed guaranteed promise window with no weather exception.",
    "agentAction": "Autonomously opened carrier dispute conv-f-024 and placed invoice line CIL-024 on hold pending credit.",
    "conversationIds": [
      "conv-f-024"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000213",
      "Tracking ref": "TRK-101032",
      "Parcel ID": "PCL-101032",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000214",
    "name": "CouriersPlease \u2014 Avoidable batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-04",
    "dueDate": "2026-03-19",
    "amount": 2512.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-025",
        "findingId": "L03",
        "type": "Avoidable multi-DC split",
        "amount": 84.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Order split across MEL and SYD DCs despite Melbourne having full stock",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101075"
            }
          },
          {
            "text": "Carrier invoice line CIL-025 bills excess rate on CINV-000214.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-025"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $84.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Avoidable multi-DC split shipment counterfactual: Order split across MEL and SYD DCs despite Melbourne having full stock.",
    "agentAction": "Autonomously opened carrier dispute conv-f-025 and placed invoice line CIL-025 on hold pending credit.",
    "conversationIds": [
      "conv-f-025"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000214",
      "Tracking ref": "TRK-101075",
      "Parcel ID": "PCL-101075",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000215",
    "name": "FedEx \u2014 Regional batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-05",
    "dueDate": "2026-03-20",
    "amount": 2595.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-026",
        "findingId": "L02",
        "type": "Tariff zone error",
        "amount": 87.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101118"
            }
          },
          {
            "text": "Carrier invoice line CIL-026 bills excess rate on CINV-000215.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-026"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $87.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Regional tariff zone classification error: Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1.",
    "agentAction": "Autonomously opened carrier dispute conv-f-026 and placed invoice line CIL-026 on hold pending credit.",
    "conversationIds": [
      "conv-f-026"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000215",
      "Tracking ref": "TRK-101118",
      "Parcel ID": "PCL-101118",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000216",
    "name": "DHL \u2014 Non-conveyable batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-06",
    "dueDate": "2026-03-21",
    "amount": 2677.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-027",
        "findingId": "L05",
        "type": "Manual handling surcharge",
        "amount": 90.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Standard apparel box billed $35.00 manual handling fee due to sorter misread",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101161"
            }
          },
          {
            "text": "Carrier invoice line CIL-027 bills excess rate on CINV-000216.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-027"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $90.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Non-conveyable packaging surcharge dispute: Standard apparel box billed $35.00 manual handling fee due to sorter misread.",
    "agentAction": "Autonomously opened carrier dispute conv-f-027 and placed invoice line CIL-027 on hold pending credit.",
    "conversationIds": [
      "conv-f-027"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000216",
      "Tracking ref": "TRK-101161",
      "Parcel ID": "PCL-101161",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000217",
    "name": "AusPost \u2014 Stale batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-07",
    "dueDate": "2026-03-22",
    "amount": 2760.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-028",
        "findingId": "L02",
        "type": "Volumetric divisor mismatch",
        "amount": 92.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101204"
            }
          },
          {
            "text": "Carrier invoice line CIL-028 bills excess rate on CINV-000217.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-028"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $92.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Stale volumetric divisor applied during rating: Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor.",
    "agentAction": "Autonomously opened carrier dispute conv-f-028 and placed invoice line CIL-028 on hold pending credit.",
    "conversationIds": [
      "conv-f-028"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000217",
      "Tracking ref": "TRK-101204",
      "Parcel ID": "PCL-101204",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000218",
    "name": "StarTrack \u2014 Duplicate batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-08",
    "dueDate": "2026-03-23",
    "amount": 2842.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-029",
        "findingId": "L04",
        "type": "Duplicate EDI line item",
        "amount": 95.7,
        "recoverable": true,
        "facts": [
          {
            "text": "EDI void transmission delay caused ghost line item on carrier invoice",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101247"
            }
          },
          {
            "text": "Carrier invoice line CIL-029 bills excess rate on CINV-000218.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-029"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $95.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate pre-manifest line item ghost charge: EDI void transmission delay caused ghost line item on carrier invoice.",
    "agentAction": "Autonomously opened carrier dispute conv-f-029 and placed invoice line CIL-029 on hold pending credit.",
    "conversationIds": [
      "conv-f-029"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000218",
      "Tracking ref": "TRK-101247",
      "Parcel ID": "PCL-101247",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000219",
    "name": "CouriersPlease \u2014 Overhead batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-09",
    "dueDate": "2026-03-24",
    "amount": 2925.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-030",
        "findingId": "L02",
        "type": "Optical curtain misread",
        "amount": 98.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Hub optical curtain misread trailing plastic wrap from adjacent pallet",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101290"
            }
          },
          {
            "text": "Carrier invoice line CIL-030 bills excess rate on CINV-000219.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-030"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $98.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Overhead sorter camera calibration shift dispute: Hub optical curtain misread trailing plastic wrap from adjacent pallet.",
    "agentAction": "Autonomously opened carrier dispute conv-f-030 and placed invoice line CIL-030 on hold pending credit.",
    "conversationIds": [
      "conv-f-030"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000219",
      "Tracking ref": "TRK-101290",
      "Parcel ID": "PCL-101290",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000220",
    "name": "FedEx \u2014 Cubic batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-10",
    "dueDate": "2026-03-25",
    "amount": 3007.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-031",
        "findingId": "L02",
        "type": "Billed weight overcharge",
        "amount": 101.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101333"
            }
          },
          {
            "text": "Carrier invoice line CIL-031 bills excess rate on CINV-000220.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-031"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $101.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Cubic weight volumetric profile overcharge: Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3.",
    "agentAction": "Autonomously opened carrier dispute conv-f-031 and placed invoice line CIL-031 on hold pending credit.",
    "conversationIds": [
      "conv-f-031"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000220",
      "Tracking ref": "TRK-101333",
      "Parcel ID": "PCL-101333",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000221",
    "name": "DHL \u2014 Unjustified batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-11",
    "dueDate": "2026-03-26",
    "amount": 3090.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-032",
        "findingId": "L05",
        "type": "Invalid residential surcharge",
        "amount": 104.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Residential fee ($6.50) applied to commercial office tower loading dock B",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101376"
            }
          },
          {
            "text": "Carrier invoice line CIL-032 bills excess rate on CINV-000221.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-032"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $104.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Unjustified residential surcharge on commercial office building: Residential fee ($6.50) applied to commercial office tower loading dock B.",
    "agentAction": "Autonomously opened carrier dispute conv-f-032 and placed invoice line CIL-032 on hold pending credit.",
    "conversationIds": [
      "conv-f-032"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000221",
      "Tracking ref": "TRK-101376",
      "Parcel ID": "PCL-101376",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000222",
    "name": "AusPost \u2014 Duplicate batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-12",
    "dueDate": "2026-03-27",
    "amount": 3172.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-033",
        "findingId": "L04",
        "type": "Duplicate label charge",
        "amount": 106.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Second label line billed ($17.80) for single physical consignment handover",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101419"
            }
          },
          {
            "text": "Carrier invoice line CIL-033 bills excess rate on CINV-000222.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-033"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $106.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate shipping label charge without second handover: Second label line billed ($17.80) for single physical consignment handover.",
    "agentAction": "Autonomously opened carrier dispute conv-f-033 and placed invoice line CIL-033 on hold pending credit.",
    "conversationIds": [
      "conv-f-033"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000222",
      "Tracking ref": "TRK-101419",
      "Parcel ID": "PCL-101419",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000223",
    "name": "StarTrack \u2014 Missed batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-13",
    "dueDate": "2026-03-28",
    "amount": 3255.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-034",
        "findingId": "L01",
        "type": "Missed SLA service credit",
        "amount": 109.7,
        "recoverable": true,
        "facts": [
          {
            "text": "12 parcels missed guaranteed promise window with no weather exception",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101462"
            }
          },
          {
            "text": "Carrier invoice line CIL-034 bills excess rate on CINV-000223.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-034"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $109.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Missed SLA service credit claim on late Express batch: 12 parcels missed guaranteed promise window with no weather exception.",
    "agentAction": "Autonomously opened carrier dispute conv-f-034 and placed invoice line CIL-034 on hold pending credit.",
    "conversationIds": [
      "conv-f-034"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000223",
      "Tracking ref": "TRK-101462",
      "Parcel ID": "PCL-101462",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000224",
    "name": "CouriersPlease \u2014 Avoidable batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-14",
    "dueDate": "2026-03-01",
    "amount": 3337.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-035",
        "findingId": "L03",
        "type": "Avoidable multi-DC split",
        "amount": 112.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Order split across MEL and SYD DCs despite Melbourne having full stock",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101505"
            }
          },
          {
            "text": "Carrier invoice line CIL-035 bills excess rate on CINV-000224.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-035"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $112.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Avoidable multi-DC split shipment counterfactual: Order split across MEL and SYD DCs despite Melbourne having full stock.",
    "agentAction": "Autonomously opened carrier dispute conv-f-035 and placed invoice line CIL-035 on hold pending credit.",
    "conversationIds": [
      "conv-f-035"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000224",
      "Tracking ref": "TRK-101505",
      "Parcel ID": "PCL-101505",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000225",
    "name": "FedEx \u2014 Regional batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "amount": 3420.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-036",
        "findingId": "L02",
        "type": "Tariff zone error",
        "amount": 115.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101548"
            }
          },
          {
            "text": "Carrier invoice line CIL-036 bills excess rate on CINV-000225.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-036"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $115.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Regional tariff zone classification error: Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1.",
    "agentAction": "Autonomously opened carrier dispute conv-f-036 and placed invoice line CIL-036 on hold pending credit.",
    "conversationIds": [
      "conv-f-036"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000225",
      "Tracking ref": "TRK-101548",
      "Parcel ID": "PCL-101548",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000226",
    "name": "DHL \u2014 Non-conveyable batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-16",
    "dueDate": "2026-03-03",
    "amount": 3502.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-037",
        "findingId": "L05",
        "type": "Manual handling surcharge",
        "amount": 118.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Standard apparel box billed $35.00 manual handling fee due to sorter misread",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101591"
            }
          },
          {
            "text": "Carrier invoice line CIL-037 bills excess rate on CINV-000226.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-037"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $118.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Non-conveyable packaging surcharge dispute: Standard apparel box billed $35.00 manual handling fee due to sorter misread.",
    "agentAction": "Autonomously opened carrier dispute conv-f-037 and placed invoice line CIL-037 on hold pending credit.",
    "conversationIds": [
      "conv-f-037"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000226",
      "Tracking ref": "TRK-101591",
      "Parcel ID": "PCL-101591",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000227",
    "name": "AusPost \u2014 Stale batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "amount": 3585.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-038",
        "findingId": "L02",
        "type": "Volumetric divisor mismatch",
        "amount": 120.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101634"
            }
          },
          {
            "text": "Carrier invoice line CIL-038 bills excess rate on CINV-000227.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-038"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $120.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Stale volumetric divisor applied during rating: Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor.",
    "agentAction": "Autonomously opened carrier dispute conv-f-038 and placed invoice line CIL-038 on hold pending credit.",
    "conversationIds": [
      "conv-f-038"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000227",
      "Tracking ref": "TRK-101634",
      "Parcel ID": "PCL-101634",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000228",
    "name": "StarTrack \u2014 Duplicate batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-18",
    "dueDate": "2026-03-05",
    "amount": 3667.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-039",
        "findingId": "L04",
        "type": "Duplicate EDI line item",
        "amount": 123.7,
        "recoverable": true,
        "facts": [
          {
            "text": "EDI void transmission delay caused ghost line item on carrier invoice",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101677"
            }
          },
          {
            "text": "Carrier invoice line CIL-039 bills excess rate on CINV-000228.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-039"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $123.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate pre-manifest line item ghost charge: EDI void transmission delay caused ghost line item on carrier invoice.",
    "agentAction": "Autonomously opened carrier dispute conv-f-039 and placed invoice line CIL-039 on hold pending credit.",
    "conversationIds": [
      "conv-f-039"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000228",
      "Tracking ref": "TRK-101677",
      "Parcel ID": "PCL-101677",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000229",
    "name": "CouriersPlease \u2014 Overhead batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "amount": 3750.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-040",
        "findingId": "L02",
        "type": "Optical curtain misread",
        "amount": 126.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Hub optical curtain misread trailing plastic wrap from adjacent pallet",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101720"
            }
          },
          {
            "text": "Carrier invoice line CIL-040 bills excess rate on CINV-000229.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-040"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $126.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Overhead sorter camera calibration shift dispute: Hub optical curtain misread trailing plastic wrap from adjacent pallet.",
    "agentAction": "Autonomously opened carrier dispute conv-f-040 and placed invoice line CIL-040 on hold pending credit.",
    "conversationIds": [
      "conv-f-040"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000229",
      "Tracking ref": "TRK-101720",
      "Parcel ID": "PCL-101720",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000230",
    "name": "FedEx \u2014 Cubic batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-20",
    "dueDate": "2026-03-07",
    "amount": 3832.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-041",
        "findingId": "L02",
        "type": "Billed weight overcharge",
        "amount": 129.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101763"
            }
          },
          {
            "text": "Carrier invoice line CIL-041 bills excess rate on CINV-000230.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-041"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $129.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Cubic weight volumetric profile overcharge: Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3.",
    "agentAction": "Autonomously opened carrier dispute conv-f-041 and placed invoice line CIL-041 on hold pending credit.",
    "conversationIds": [
      "conv-f-041"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000230",
      "Tracking ref": "TRK-101763",
      "Parcel ID": "PCL-101763",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000231",
    "name": "DHL \u2014 Unjustified batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "amount": 3915.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-042",
        "findingId": "L05",
        "type": "Invalid residential surcharge",
        "amount": 132.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Residential fee ($6.50) applied to commercial office tower loading dock B",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101806"
            }
          },
          {
            "text": "Carrier invoice line CIL-042 bills excess rate on CINV-000231.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-042"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $132.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Unjustified residential surcharge on commercial office building: Residential fee ($6.50) applied to commercial office tower loading dock B.",
    "agentAction": "Autonomously opened carrier dispute conv-f-042 and placed invoice line CIL-042 on hold pending credit.",
    "conversationIds": [
      "conv-f-042"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000231",
      "Tracking ref": "TRK-101806",
      "Parcel ID": "PCL-101806",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000232",
    "name": "AusPost \u2014 Duplicate batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-22",
    "dueDate": "2026-03-09",
    "amount": 3997.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-043",
        "findingId": "L04",
        "type": "Duplicate label charge",
        "amount": 134.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Second label line billed ($17.80) for single physical consignment handover",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101849"
            }
          },
          {
            "text": "Carrier invoice line CIL-043 bills excess rate on CINV-000232.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-043"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $134.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate shipping label charge without second handover: Second label line billed ($17.80) for single physical consignment handover.",
    "agentAction": "Autonomously opened carrier dispute conv-f-043 and placed invoice line CIL-043 on hold pending credit.",
    "conversationIds": [
      "conv-f-043"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000232",
      "Tracking ref": "TRK-101849",
      "Parcel ID": "PCL-101849",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000233",
    "name": "StarTrack \u2014 Missed batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-01",
    "dueDate": "2026-03-16",
    "amount": 4080.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-044",
        "findingId": "L01",
        "type": "Missed SLA service credit",
        "amount": 137.7,
        "recoverable": true,
        "facts": [
          {
            "text": "12 parcels missed guaranteed promise window with no weather exception",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101892"
            }
          },
          {
            "text": "Carrier invoice line CIL-044 bills excess rate on CINV-000233.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-044"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $137.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Missed SLA service credit claim on late Express batch: 12 parcels missed guaranteed promise window with no weather exception.",
    "agentAction": "Autonomously opened carrier dispute conv-f-044 and placed invoice line CIL-044 on hold pending credit.",
    "conversationIds": [
      "conv-f-044"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000233",
      "Tracking ref": "TRK-101892",
      "Parcel ID": "PCL-101892",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000234",
    "name": "CouriersPlease \u2014 Avoidable batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-02",
    "dueDate": "2026-03-17",
    "amount": 4162.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-045",
        "findingId": "L03",
        "type": "Avoidable multi-DC split",
        "amount": 140.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Order split across MEL and SYD DCs despite Melbourne having full stock",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101935"
            }
          },
          {
            "text": "Carrier invoice line CIL-045 bills excess rate on CINV-000234.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-045"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $140.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Avoidable multi-DC split shipment counterfactual: Order split across MEL and SYD DCs despite Melbourne having full stock.",
    "agentAction": "Autonomously opened carrier dispute conv-f-045 and placed invoice line CIL-045 on hold pending credit.",
    "conversationIds": [
      "conv-f-045"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000234",
      "Tracking ref": "TRK-101935",
      "Parcel ID": "PCL-101935",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000235",
    "name": "FedEx \u2014 Regional batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-03",
    "dueDate": "2026-03-18",
    "amount": 4245.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-046",
        "findingId": "L02",
        "type": "Tariff zone error",
        "amount": 143.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-101978"
            }
          },
          {
            "text": "Carrier invoice line CIL-046 bills excess rate on CINV-000235.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-046"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $143.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Regional tariff zone classification error: Postcode 3350 rated under Regional Tier 2 instead of contracted Tier 1.",
    "agentAction": "Autonomously opened carrier dispute conv-f-046 and placed invoice line CIL-046 on hold pending credit.",
    "conversationIds": [
      "conv-f-046"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000235",
      "Tracking ref": "TRK-101978",
      "Parcel ID": "PCL-101978",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000236",
    "name": "DHL \u2014 Non-conveyable batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-04",
    "dueDate": "2026-03-19",
    "amount": 4327.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-047",
        "findingId": "L05",
        "type": "Manual handling surcharge",
        "amount": 146.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Standard apparel box billed $35.00 manual handling fee due to sorter misread",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-102021"
            }
          },
          {
            "text": "Carrier invoice line CIL-047 bills excess rate on CINV-000236.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-047"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $146.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Non-conveyable packaging surcharge dispute: Standard apparel box billed $35.00 manual handling fee due to sorter misread.",
    "agentAction": "Autonomously opened carrier dispute conv-f-047 and placed invoice line CIL-047 on hold pending credit.",
    "conversationIds": [
      "conv-f-047"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000236",
      "Tracking ref": "TRK-102021",
      "Parcel ID": "PCL-102021",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000237",
    "name": "AusPost \u2014 Stale batch",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-05",
    "dueDate": "2026-03-20",
    "amount": 4410.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-048",
        "findingId": "L02",
        "type": "Volumetric divisor mismatch",
        "amount": 148.9,
        "recoverable": true,
        "facts": [
          {
            "text": "Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-102064"
            }
          },
          {
            "text": "Carrier invoice line CIL-048 bills excess rate on CINV-000237.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-048"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $148.90 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Stale volumetric divisor applied during rating: Rating applied 1:4000 divisor factor instead of contracted 1:5000 factor.",
    "agentAction": "Autonomously opened carrier dispute conv-f-048 and placed invoice line CIL-048 on hold pending credit.",
    "conversationIds": [
      "conv-f-048"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000237",
      "Tracking ref": "TRK-102064",
      "Parcel ID": "PCL-102064",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000238",
    "name": "StarTrack \u2014 Duplicate batch",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-06",
    "dueDate": "2026-03-21",
    "amount": 4492.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-049",
        "findingId": "L04",
        "type": "Duplicate EDI line item",
        "amount": 151.7,
        "recoverable": true,
        "facts": [
          {
            "text": "EDI void transmission delay caused ghost line item on carrier invoice",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-102107"
            }
          },
          {
            "text": "Carrier invoice line CIL-049 bills excess rate on CINV-000238.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-049"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $151.70 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Duplicate pre-manifest line item ghost charge: EDI void transmission delay caused ghost line item on carrier invoice.",
    "agentAction": "Autonomously opened carrier dispute conv-f-049 and placed invoice line CIL-049 on hold pending credit.",
    "conversationIds": [
      "conv-f-049"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000238",
      "Tracking ref": "TRK-102107",
      "Parcel ID": "PCL-102107",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000239",
    "name": "CouriersPlease \u2014 Overhead batch",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-07",
    "dueDate": "2026-03-22",
    "amount": 4575.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-050",
        "findingId": "L02",
        "type": "Optical curtain misread",
        "amount": 154.5,
        "recoverable": true,
        "facts": [
          {
            "text": "Hub optical curtain misread trailing plastic wrap from adjacent pallet",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-102150"
            }
          },
          {
            "text": "Carrier invoice line CIL-050 bills excess rate on CINV-000239.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-050"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $154.50 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Overhead sorter camera calibration shift dispute: Hub optical curtain misread trailing plastic wrap from adjacent pallet.",
    "agentAction": "Autonomously opened carrier dispute conv-f-050 and placed invoice line CIL-050 on hold pending credit.",
    "conversationIds": [
      "conv-f-050"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000239",
      "Tracking ref": "TRK-102150",
      "Parcel ID": "PCL-102150",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000240",
    "name": "FedEx \u2014 Cubic batch",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-08",
    "dueDate": "2026-03-23",
    "amount": 4657.5,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-051",
        "findingId": "L02",
        "type": "Billed weight overcharge",
        "amount": 157.3,
        "recoverable": true,
        "facts": [
          {
            "text": "Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-102193"
            }
          },
          {
            "text": "Carrier invoice line CIL-051 bills excess rate on CINV-000240.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-051"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $157.30 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Cubic weight volumetric profile overcharge: Billed 3.9 kg vs 2.1 kg dead weight measured at pack bench scale #3.",
    "agentAction": "Autonomously opened carrier dispute conv-f-051 and placed invoice line CIL-051 on hold pending credit.",
    "conversationIds": [
      "conv-f-051"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000240",
      "Tracking ref": "TRK-102193",
      "Parcel ID": "PCL-102193",
      "Payment status": "Credit requested"
    }
  },
  {
    "id": "CINV-000241",
    "name": "DHL \u2014 Unjustified batch",
    "vendor": "DHL",
    "invoiceDate": "2026-02-09",
    "dueDate": "2026-03-24",
    "amount": 4740.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-f-052",
        "findingId": "L05",
        "type": "Invalid residential surcharge",
        "amount": 160.1,
        "recoverable": true,
        "facts": [
          {
            "text": "Residential fee ($6.50) applied to commercial office tower loading dock B",
            "source": {
              "dataset": "wms_pack_events.parquet",
              "rowId": "PCL-102236"
            }
          },
          {
            "text": "Carrier invoice line CIL-052 bills excess rate on CINV-000241.",
            "source": {
              "dataset": "carrier_invoice_lines.parquet",
              "rowId": "CIL-052"
            }
          },
          {
            "text": "Master Agreement Schedule 2 specifies $160.10 lower charge.",
            "source": {
              "dataset": "contract_rate_rules.parquet",
              "rowId": "RULE-MFA"
            }
          }
        ]
      }
    ],
    "reasoning": "Unjustified residential surcharge on commercial office building: Residential fee ($6.50) applied to commercial office tower loading dock B.",
    "agentAction": "Autonomously opened carrier dispute conv-f-052 and placed invoice line CIL-052 on hold pending credit.",
    "conversationIds": [
      "conv-f-052"
    ],
    "metadata": {
      "Carrier invoice": "CINV-000241",
      "Tracking ref": "TRK-102236",
      "Parcel ID": "PCL-102236",
      "Payment status": "Credit note issued"
    }
  },
  {
    "id": "CINV-000301",
    "name": "DHL \u2014 Standard parcel delivery",
    "vendor": "DHL",
    "invoiceDate": "2026-02-03",
    "dueDate": "2026-03-18",
    "amount": 1340.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000301",
      "Payment status": "Approved"
    }
  },
  {
    "id": "CINV-000302",
    "name": "AusPost \u2014 Standard parcel delivery",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-05",
    "dueDate": "2026-03-20",
    "amount": 1480.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000302",
      "Payment status": "Approved"
    }
  },
  {
    "id": "CINV-000303",
    "name": "StarTrack \u2014 Standard parcel delivery",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-07",
    "dueDate": "2026-03-22",
    "amount": 1620.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000303",
      "Payment status": "Approved"
    }
  },
  {
    "id": "CINV-000304",
    "name": "CouriersPlease \u2014 Standard parcel delivery",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-09",
    "dueDate": "2026-03-24",
    "amount": 1760.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000304",
      "Payment status": "Approved"
    }
  },
  {
    "id": "CINV-000305",
    "name": "FedEx \u2014 Standard parcel delivery",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-11",
    "dueDate": "2026-03-26",
    "amount": 1900.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000305",
      "Payment status": "Approved"
    }
  },
  {
    "id": "CINV-000306",
    "name": "DHL \u2014 Standard parcel delivery",
    "vendor": "DHL",
    "invoiceDate": "2026-02-13",
    "dueDate": "2026-03-28",
    "amount": 2040.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000306",
      "Payment status": "Approved"
    }
  },
  {
    "id": "CINV-000307",
    "name": "AusPost \u2014 Standard parcel delivery",
    "vendor": "AusPost",
    "invoiceDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "amount": 2180.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000307",
      "Payment status": "Approved"
    }
  },
  {
    "id": "CINV-000308",
    "name": "StarTrack \u2014 Standard parcel delivery",
    "vendor": "StarTrack",
    "invoiceDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "amount": 2320.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000308",
      "Payment status": "Approved"
    }
  },
  {
    "id": "CINV-000309",
    "name": "CouriersPlease \u2014 Standard parcel delivery",
    "vendor": "CouriersPlease",
    "invoiceDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "amount": 2460.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000309",
      "Payment status": "Approved"
    }
  },
  {
    "id": "CINV-000310",
    "name": "FedEx \u2014 Standard parcel delivery",
    "vendor": "FedEx",
    "invoiceDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "amount": 2600.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Parcel dimensions, zone routing, and billing line items perfectly match WMS pack scale telemetry and contract rate cards.",
    "conversationIds": [],
    "metadata": {
      "Carrier invoice": "CINV-000310",
      "Payment status": "Approved"
    }
  }
]

const logisticsInvoices: Invoice[] = [
  {
    "id": "CLINV-000221",
    "name": "RoadLine Haulage \u2014 Unrecovered haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-02",
    "dueDate": "2026-03-17",
    "amount": 2585.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-001",
        "findingId": "P01",
        "type": "Unrecovered toll pass-through",
        "amount": 57.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100029"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-001"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered toll pass-through on metro haulage: Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3001 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-001"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000221",
      "Job ref": "JOB-200031",
      "Client": "Fashion Brand A",
      "Paid cost": "2016.30",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000006",
    "name": "Metro Freight \u2014 Fuel haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-03",
    "dueDate": "2026-03-18",
    "amount": 2770.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-002",
        "findingId": "P02",
        "type": "Fuel recovery lag",
        "amount": 69.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100058"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-002"
            }
          }
        ]
      }
    ],
    "reasoning": "Fuel surcharge index lag on interstate corridor: Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3002 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-002"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000006",
      "Job ref": "JOB-200062",
      "Client": "Fashion Brand B",
      "Paid cost": "2160.60",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000321",
    "name": "Brisbane 3PL \u2014 3P haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-04",
    "dueDate": "2026-03-19",
    "amount": 2955.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-003",
        "findingId": "P03",
        "type": "Third-party warehouse not passed through",
        "amount": 82.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100087"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-003"
            }
          }
        ]
      }
    ],
    "reasoning": "3P Warehouse handling and staging fee unbilled: Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3003 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-003"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000321",
      "Job ref": "JOB-200093",
      "Client": "Global Retail Co",
      "Paid cost": "2304.90",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000407",
    "name": "Pacific Logistics \u2014 DC haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-05",
    "dueDate": "2026-03-20",
    "amount": 3140.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-004",
        "findingId": "P04",
        "type": "DC handling allocation gap",
        "amount": 94.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100116"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-004"
            }
          }
        ]
      }
    ],
    "reasoning": "DC handling allocation gap on cross-dock consignment: Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3004 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-004"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000407",
      "Job ref": "JOB-200124",
      "Client": "Apex Consumer Goods",
      "Paid cost": "2449.20",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000590",
    "name": "Owner Drivers Pool \u2014 Subcontractor haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-06",
    "dueDate": "2026-03-21",
    "amount": 3325.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-005",
        "findingId": "P05",
        "type": "Subcontractor accessorial absorbed",
        "amount": 107.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100145"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-005"
            }
          }
        ]
      }
    ],
    "reasoning": "Subcontractor accessorial wait-time fee absorbed: Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3005 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-005"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000590",
      "Job ref": "JOB-200155",
      "Client": "Pacific Trading",
      "Paid cost": "2593.50",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000176",
    "name": "RoadLine Haulage \u2014 Unbilled haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-07",
    "dueDate": "2026-03-22",
    "amount": 3510.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-006",
        "findingId": "P01",
        "type": "Unrecovered port demurrage",
        "amount": 119.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100174"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-006"
            }
          }
        ]
      }
    ],
    "reasoning": "Unbilled container demurrage overstay at port terminal: Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3006 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-006"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000176",
      "Job ref": "JOB-200186",
      "Client": "Fashion Brand A",
      "Paid cost": "2737.80",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000480",
    "name": "Metro Freight \u2014 Uncollected haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-08",
    "dueDate": "2026-03-23",
    "amount": 3695.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-007",
        "findingId": "P05",
        "type": "Unbilled tail-lift accessorial",
        "amount": 131.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100203"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-007"
            }
          }
        ]
      }
    ],
    "reasoning": "Uncollected tail-lift specialized equipment surcharge: Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3007 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-007"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000480",
      "Job ref": "JOB-200217",
      "Client": "Fashion Brand B",
      "Paid cost": "2882.10",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000430",
    "name": "Brisbane 3PL \u2014 Saturday haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-09",
    "dueDate": "2026-03-24",
    "amount": 3880.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-008",
        "findingId": "P05",
        "type": "Unbilled weekend surcharge",
        "amount": 144.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100232"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-008"
            }
          }
        ]
      }
    ],
    "reasoning": "Saturday express delivery penalty rate unbilled: Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3008 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-008"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000430",
      "Job ref": "JOB-200248",
      "Client": "Global Retail Co",
      "Paid cost": "3026.40",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000470",
    "name": "Pacific Logistics \u2014 Multi-stop haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-10",
    "dueDate": "2026-03-25",
    "amount": 4065.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-009",
        "findingId": "P01",
        "type": "Multi-stop accessorial gap",
        "amount": 156.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100261"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-009"
            }
          }
        ]
      }
    ],
    "reasoning": "Multi-stop drop accessorial fee allocation mismatch: Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3009 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-009"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000470",
      "Job ref": "JOB-200279",
      "Client": "Apex Consumer Goods",
      "Paid cost": "3170.70",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000036",
    "name": "Owner Drivers Pool \u2014 Unrecovered haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-11",
    "dueDate": "2026-03-26",
    "amount": 4250.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-010",
        "findingId": "P03",
        "type": "Unrecovered cross-dock storage",
        "amount": 169.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100290"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-010"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered extended cross-dock storage fee: Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3010 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-010"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000036",
      "Job ref": "JOB-200310",
      "Client": "Pacific Trading",
      "Paid cost": "3315.00",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000311",
    "name": "RoadLine Haulage \u2014 Unrecovered haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-12",
    "dueDate": "2026-03-27",
    "amount": 4435.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-011",
        "findingId": "P01",
        "type": "Unrecovered toll pass-through",
        "amount": 181.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100319"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-011"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered toll pass-through on metro haulage: Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3011 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-011"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000311",
      "Job ref": "JOB-200341",
      "Client": "Fashion Brand A",
      "Paid cost": "3459.30",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000401",
    "name": "Metro Freight \u2014 Fuel haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-13",
    "dueDate": "2026-03-28",
    "amount": 4620.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-012",
        "findingId": "P02",
        "type": "Fuel recovery lag",
        "amount": 193.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100348"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-012"
            }
          }
        ]
      }
    ],
    "reasoning": "Fuel surcharge index lag on interstate corridor: Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3012 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-012"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000401",
      "Job ref": "JOB-200372",
      "Client": "Fashion Brand B",
      "Paid cost": "3603.60",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000198",
    "name": "Brisbane 3PL \u2014 3P haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-14",
    "dueDate": "2026-03-01",
    "amount": 4805.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-013",
        "findingId": "P03",
        "type": "Third-party warehouse not passed through",
        "amount": 206.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100377"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-013"
            }
          }
        ]
      }
    ],
    "reasoning": "3P Warehouse handling and staging fee unbilled: Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3013 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-013"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000198",
      "Job ref": "JOB-200403",
      "Client": "Global Retail Co",
      "Paid cost": "3747.90",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000256",
    "name": "Pacific Logistics \u2014 DC haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "amount": 4990.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-014",
        "findingId": "P04",
        "type": "DC handling allocation gap",
        "amount": 218.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100406"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-014"
            }
          }
        ]
      }
    ],
    "reasoning": "DC handling allocation gap on cross-dock consignment: Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3014 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-014"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000256",
      "Job ref": "JOB-200434",
      "Client": "Apex Consumer Goods",
      "Paid cost": "3892.20",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000381",
    "name": "Owner Drivers Pool \u2014 Subcontractor haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-16",
    "dueDate": "2026-03-03",
    "amount": 5175.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-015",
        "findingId": "P05",
        "type": "Subcontractor accessorial absorbed",
        "amount": 231.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100435"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-015"
            }
          }
        ]
      }
    ],
    "reasoning": "Subcontractor accessorial wait-time fee absorbed: Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3015 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-015"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000381",
      "Job ref": "JOB-200465",
      "Client": "Pacific Trading",
      "Paid cost": "4036.50",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "SINV-000015",
    "name": "RoadLine Haulage \u2014 Unbilled haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "amount": 5360.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-016",
        "findingId": "P01",
        "type": "Unrecovered port demurrage",
        "amount": 243.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100464"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-016"
            }
          }
        ]
      }
    ],
    "reasoning": "Unbilled container demurrage overstay at port terminal: Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3016 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-016"
    ],
    "metadata": {
      "Subcontractor invoice": "SINV-000015",
      "Job ref": "JOB-200496",
      "Client": "Fashion Brand A",
      "Paid cost": "4180.80",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "SINV-000095",
    "name": "Metro Freight \u2014 Uncollected haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-18",
    "dueDate": "2026-03-05",
    "amount": 5545.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-017",
        "findingId": "P05",
        "type": "Unbilled tail-lift accessorial",
        "amount": 255.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100493"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-017"
            }
          }
        ]
      }
    ],
    "reasoning": "Uncollected tail-lift specialized equipment surcharge: Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3017 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-017"
    ],
    "metadata": {
      "Subcontractor invoice": "SINV-000095",
      "Job ref": "JOB-200527",
      "Client": "Fashion Brand B",
      "Paid cost": "4325.10",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "SINV-000140",
    "name": "Brisbane 3PL \u2014 Saturday haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "amount": 5730.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-018",
        "findingId": "P05",
        "type": "Unbilled weekend surcharge",
        "amount": 268.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100522"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-018"
            }
          }
        ]
      }
    ],
    "reasoning": "Saturday express delivery penalty rate unbilled: Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3018 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-018"
    ],
    "metadata": {
      "Subcontractor invoice": "SINV-000140",
      "Job ref": "JOB-200558",
      "Client": "Global Retail Co",
      "Paid cost": "4469.40",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "SINV-000055",
    "name": "Pacific Logistics \u2014 Multi-stop haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-20",
    "dueDate": "2026-03-07",
    "amount": 5915.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-019",
        "findingId": "P01",
        "type": "Multi-stop accessorial gap",
        "amount": 280.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100551"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-019"
            }
          }
        ]
      }
    ],
    "reasoning": "Multi-stop drop accessorial fee allocation mismatch: Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3019 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-019"
    ],
    "metadata": {
      "Subcontractor invoice": "SINV-000055",
      "Job ref": "JOB-200589",
      "Client": "Apex Consumer Goods",
      "Paid cost": "4613.70",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "SINV-000185",
    "name": "Owner Drivers Pool \u2014 Unrecovered haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "amount": 6100.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-020",
        "findingId": "P03",
        "type": "Unrecovered cross-dock storage",
        "amount": 293.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100580"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-020"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered extended cross-dock storage fee: Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3020 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-020"
    ],
    "metadata": {
      "Subcontractor invoice": "SINV-000185",
      "Job ref": "JOB-200620",
      "Client": "Pacific Trading",
      "Paid cost": "4758.00",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000016",
    "name": "RoadLine Haulage \u2014 Unrecovered haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-22",
    "dueDate": "2026-03-09",
    "amount": 6285.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-021",
        "findingId": "P01",
        "type": "Unrecovered toll pass-through",
        "amount": 305.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100609"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-021"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered toll pass-through on metro haulage: Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3021 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-021"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000016",
      "Job ref": "JOB-200651",
      "Client": "Fashion Brand A",
      "Paid cost": "4902.30",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000056",
    "name": "Metro Freight \u2014 Fuel haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-01",
    "dueDate": "2026-03-16",
    "amount": 6470.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-022",
        "findingId": "P02",
        "type": "Fuel recovery lag",
        "amount": 317.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100638"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-022"
            }
          }
        ]
      }
    ],
    "reasoning": "Fuel surcharge index lag on interstate corridor: Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3022 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-022"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000056",
      "Job ref": "JOB-200682",
      "Client": "Fashion Brand B",
      "Paid cost": "5046.60",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000096",
    "name": "Brisbane 3PL \u2014 3P haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-02",
    "dueDate": "2026-03-17",
    "amount": 6655.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-023",
        "findingId": "P03",
        "type": "Third-party warehouse not passed through",
        "amount": 330.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100667"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-023"
            }
          }
        ]
      }
    ],
    "reasoning": "3P Warehouse handling and staging fee unbilled: Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3023 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-023"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000096",
      "Job ref": "JOB-200713",
      "Client": "Global Retail Co",
      "Paid cost": "5190.90",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000141",
    "name": "Pacific Logistics \u2014 DC haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-03",
    "dueDate": "2026-03-18",
    "amount": 6840.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-024",
        "findingId": "P04",
        "type": "DC handling allocation gap",
        "amount": 342.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100696"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-024"
            }
          }
        ]
      }
    ],
    "reasoning": "DC handling allocation gap on cross-dock consignment: Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3024 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-024"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000141",
      "Job ref": "JOB-200744",
      "Client": "Apex Consumer Goods",
      "Paid cost": "5335.20",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000186",
    "name": "Owner Drivers Pool \u2014 Subcontractor haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-04",
    "dueDate": "2026-03-19",
    "amount": 7025.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-025",
        "findingId": "P05",
        "type": "Subcontractor accessorial absorbed",
        "amount": 355.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100725"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-025"
            }
          }
        ]
      }
    ],
    "reasoning": "Subcontractor accessorial wait-time fee absorbed: Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3025 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-025"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000186",
      "Job ref": "JOB-200775",
      "Client": "Pacific Trading",
      "Paid cost": "5479.50",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000230",
    "name": "RoadLine Haulage \u2014 Unbilled haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-05",
    "dueDate": "2026-03-20",
    "amount": 7210.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-026",
        "findingId": "P01",
        "type": "Unrecovered port demurrage",
        "amount": 367.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100754"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-026"
            }
          }
        ]
      }
    ],
    "reasoning": "Unbilled container demurrage overstay at port terminal: Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3026 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-026"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000230",
      "Job ref": "JOB-200806",
      "Client": "Fashion Brand A",
      "Paid cost": "5623.80",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000600",
    "name": "Metro Freight \u2014 Uncollected haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-06",
    "dueDate": "2026-03-21",
    "amount": 7395.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-027",
        "findingId": "P05",
        "type": "Unbilled tail-lift accessorial",
        "amount": 379.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100783"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-027"
            }
          }
        ]
      }
    ],
    "reasoning": "Uncollected tail-lift specialized equipment surcharge: Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3027 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-027"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000600",
      "Job ref": "JOB-200837",
      "Client": "Fashion Brand B",
      "Paid cost": "5768.10",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000601",
    "name": "Brisbane 3PL \u2014 Saturday haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-07",
    "dueDate": "2026-03-22",
    "amount": 7580.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-028",
        "findingId": "P05",
        "type": "Unbilled weekend surcharge",
        "amount": 392.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100812"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-028"
            }
          }
        ]
      }
    ],
    "reasoning": "Saturday express delivery penalty rate unbilled: Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3028 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-028"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000601",
      "Job ref": "JOB-200868",
      "Client": "Global Retail Co",
      "Paid cost": "5912.40",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000602",
    "name": "Pacific Logistics \u2014 Multi-stop haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-08",
    "dueDate": "2026-03-23",
    "amount": 7765.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-029",
        "findingId": "P01",
        "type": "Multi-stop accessorial gap",
        "amount": 404.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100841"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-029"
            }
          }
        ]
      }
    ],
    "reasoning": "Multi-stop drop accessorial fee allocation mismatch: Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3029 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-029"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000602",
      "Job ref": "JOB-200899",
      "Client": "Apex Consumer Goods",
      "Paid cost": "6056.70",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000603",
    "name": "Owner Drivers Pool \u2014 Unrecovered haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-09",
    "dueDate": "2026-03-24",
    "amount": 7950.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-030",
        "findingId": "P03",
        "type": "Unrecovered cross-dock storage",
        "amount": 417.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100870"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-030"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered extended cross-dock storage fee: Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3030 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-030"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000603",
      "Job ref": "JOB-200930",
      "Client": "Pacific Trading",
      "Paid cost": "6201.00",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000604",
    "name": "RoadLine Haulage \u2014 Unrecovered haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-10",
    "dueDate": "2026-03-25",
    "amount": 8135.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-031",
        "findingId": "P01",
        "type": "Unrecovered toll pass-through",
        "amount": 429.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100899"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-031"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered toll pass-through on metro haulage: Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3031 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-031"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000604",
      "Job ref": "JOB-200961",
      "Client": "Fashion Brand A",
      "Paid cost": "6345.30",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000605",
    "name": "Metro Freight \u2014 Fuel haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-11",
    "dueDate": "2026-03-26",
    "amount": 8320.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-032",
        "findingId": "P02",
        "type": "Fuel recovery lag",
        "amount": 441.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100928"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-032"
            }
          }
        ]
      }
    ],
    "reasoning": "Fuel surcharge index lag on interstate corridor: Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3032 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-032"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000605",
      "Job ref": "JOB-200992",
      "Client": "Fashion Brand B",
      "Paid cost": "6489.60",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000606",
    "name": "Brisbane 3PL \u2014 3P haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-12",
    "dueDate": "2026-03-27",
    "amount": 8505.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-033",
        "findingId": "P03",
        "type": "Third-party warehouse not passed through",
        "amount": 454.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100957"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-033"
            }
          }
        ]
      }
    ],
    "reasoning": "3P Warehouse handling and staging fee unbilled: Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3033 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-033"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000606",
      "Job ref": "JOB-201023",
      "Client": "Global Retail Co",
      "Paid cost": "6633.90",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000607",
    "name": "Pacific Logistics \u2014 DC haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-13",
    "dueDate": "2026-03-28",
    "amount": 8690.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-034",
        "findingId": "P04",
        "type": "DC handling allocation gap",
        "amount": 466.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-100986"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-034"
            }
          }
        ]
      }
    ],
    "reasoning": "DC handling allocation gap on cross-dock consignment: Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3034 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-034"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000607",
      "Job ref": "JOB-201054",
      "Client": "Apex Consumer Goods",
      "Paid cost": "6778.20",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000608",
    "name": "Owner Drivers Pool \u2014 Subcontractor haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-14",
    "dueDate": "2026-03-01",
    "amount": 8875.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-035",
        "findingId": "P05",
        "type": "Subcontractor accessorial absorbed",
        "amount": 479.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101015"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-035"
            }
          }
        ]
      }
    ],
    "reasoning": "Subcontractor accessorial wait-time fee absorbed: Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3035 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-035"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000608",
      "Job ref": "JOB-201085",
      "Client": "Pacific Trading",
      "Paid cost": "6922.50",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000609",
    "name": "RoadLine Haulage \u2014 Unbilled haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "amount": 9060.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-036",
        "findingId": "P01",
        "type": "Unrecovered port demurrage",
        "amount": 491.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101044"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-036"
            }
          }
        ]
      }
    ],
    "reasoning": "Unbilled container demurrage overstay at port terminal: Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3036 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-036"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000609",
      "Job ref": "JOB-201116",
      "Client": "Fashion Brand A",
      "Paid cost": "7066.80",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000610",
    "name": "Metro Freight \u2014 Uncollected haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-16",
    "dueDate": "2026-03-03",
    "amount": 9245.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-037",
        "findingId": "P05",
        "type": "Unbilled tail-lift accessorial",
        "amount": 503.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101073"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-037"
            }
          }
        ]
      }
    ],
    "reasoning": "Uncollected tail-lift specialized equipment surcharge: Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3037 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-037"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000610",
      "Job ref": "JOB-201147",
      "Client": "Fashion Brand B",
      "Paid cost": "7211.10",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000611",
    "name": "Brisbane 3PL \u2014 Saturday haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "amount": 9430.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-038",
        "findingId": "P05",
        "type": "Unbilled weekend surcharge",
        "amount": 516.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101102"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-038"
            }
          }
        ]
      }
    ],
    "reasoning": "Saturday express delivery penalty rate unbilled: Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3038 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-038"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000611",
      "Job ref": "JOB-201178",
      "Client": "Global Retail Co",
      "Paid cost": "7355.40",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000612",
    "name": "Pacific Logistics \u2014 Multi-stop haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-18",
    "dueDate": "2026-03-05",
    "amount": 9615.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-039",
        "findingId": "P01",
        "type": "Multi-stop accessorial gap",
        "amount": 528.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101131"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-039"
            }
          }
        ]
      }
    ],
    "reasoning": "Multi-stop drop accessorial fee allocation mismatch: Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3039 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-039"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000612",
      "Job ref": "JOB-201209",
      "Client": "Apex Consumer Goods",
      "Paid cost": "7499.70",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000613",
    "name": "Owner Drivers Pool \u2014 Unrecovered haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "amount": 9800.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-040",
        "findingId": "P03",
        "type": "Unrecovered cross-dock storage",
        "amount": 541.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101160"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-040"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered extended cross-dock storage fee: Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3040 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-040"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000613",
      "Job ref": "JOB-201240",
      "Client": "Pacific Trading",
      "Paid cost": "7644.00",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000614",
    "name": "RoadLine Haulage \u2014 Unrecovered haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-20",
    "dueDate": "2026-03-07",
    "amount": 9985.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-041",
        "findingId": "P01",
        "type": "Unrecovered toll pass-through",
        "amount": 553.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101189"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-041"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered toll pass-through on metro haulage: Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3041 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-041"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000614",
      "Job ref": "JOB-201271",
      "Client": "Fashion Brand A",
      "Paid cost": "7788.30",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000615",
    "name": "Metro Freight \u2014 Fuel haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "amount": 10170.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-042",
        "findingId": "P02",
        "type": "Fuel recovery lag",
        "amount": 565.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101218"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-042"
            }
          }
        ]
      }
    ],
    "reasoning": "Fuel surcharge index lag on interstate corridor: Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3042 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-042"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000615",
      "Job ref": "JOB-201302",
      "Client": "Fashion Brand B",
      "Paid cost": "7932.60",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000616",
    "name": "Brisbane 3PL \u2014 3P haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-22",
    "dueDate": "2026-03-09",
    "amount": 10355.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-043",
        "findingId": "P03",
        "type": "Third-party warehouse not passed through",
        "amount": 578.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101247"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-043"
            }
          }
        ]
      }
    ],
    "reasoning": "3P Warehouse handling and staging fee unbilled: Subcontractor 3PL warehouse invoice $312.00 paid, but $0 pass-through billed to client account..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3043 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-043"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000616",
      "Job ref": "JOB-201333",
      "Client": "Global Retail Co",
      "Paid cost": "8076.90",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000617",
    "name": "Pacific Logistics \u2014 DC haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-01",
    "dueDate": "2026-03-16",
    "amount": 10540.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-044",
        "findingId": "P04",
        "type": "DC handling allocation gap",
        "amount": 590.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101276"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-044"
            }
          }
        ]
      }
    ],
    "reasoning": "DC handling allocation gap on cross-dock consignment: Warehouse handling allocation of $145.00 absorbed internally without contractually allowed client markup..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3044 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-044"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000617",
      "Job ref": "JOB-201364",
      "Client": "Apex Consumer Goods",
      "Paid cost": "8221.20",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000618",
    "name": "Owner Drivers Pool \u2014 Subcontractor haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-02",
    "dueDate": "2026-03-17",
    "amount": 10725.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-045",
        "findingId": "P05",
        "type": "Subcontractor accessorial absorbed",
        "amount": 603.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101305"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-045"
            }
          }
        ]
      }
    ],
    "reasoning": "Subcontractor accessorial wait-time fee absorbed: Metro driver wait time accessorial ($87.50) paid to subcontractor but excluded from client monthly invoice..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3045 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-045"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000618",
      "Job ref": "JOB-201395",
      "Client": "Pacific Trading",
      "Paid cost": "8365.50",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000619",
    "name": "RoadLine Haulage \u2014 Unbilled haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-03",
    "dueDate": "2026-03-18",
    "amount": 10910.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-046",
        "findingId": "P01",
        "type": "Unrecovered port demurrage",
        "amount": 615.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101334"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-046"
            }
          }
        ]
      }
    ],
    "reasoning": "Unbilled container demurrage overstay at port terminal: Port container detention fee ($240.00) incurred during client-requested delivery delay was not passed through..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3046 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-046"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000619",
      "Job ref": "JOB-201426",
      "Client": "Fashion Brand A",
      "Paid cost": "8509.80",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000620",
    "name": "Metro Freight \u2014 Uncollected haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-04",
    "dueDate": "2026-03-19",
    "amount": 11095.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-047",
        "findingId": "P05",
        "type": "Unbilled tail-lift accessorial",
        "amount": 627.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101363"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-047"
            }
          }
        ]
      }
    ],
    "reasoning": "Uncollected tail-lift specialized equipment surcharge: Ground-level store delivery required tail-lift vehicle ($75.00), omitted from client billing run..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3047 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-047"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000620",
      "Job ref": "JOB-201457",
      "Client": "Fashion Brand B",
      "Paid cost": "8654.10",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000621",
    "name": "Brisbane 3PL \u2014 Saturday haul",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-05",
    "dueDate": "2026-03-20",
    "amount": 11280.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-048",
        "findingId": "P05",
        "type": "Unbilled weekend surcharge",
        "amount": 640.2,
        "recoverable": true,
        "facts": [
          {
            "text": "Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101392"
            }
          },
          {
            "text": "Client rate card for Global Retail Co permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-GLO"
            }
          },
          {
            "text": "Subcontractor cost lines for Brisbane 3PL reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-048"
            }
          }
        ]
      }
    ],
    "reasoning": "Saturday express delivery penalty rate unbilled: Weekend promotional launch required Saturday delivery ($160.00 penalty), billed standard rate to client..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3048 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-048"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000621",
      "Job ref": "JOB-201488",
      "Client": "Global Retail Co",
      "Paid cost": "8798.40",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000622",
    "name": "Pacific Logistics \u2014 Multi-stop haul",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-06",
    "dueDate": "2026-03-21",
    "amount": 11465.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-049",
        "findingId": "P01",
        "type": "Multi-stop accessorial gap",
        "amount": 652.6,
        "recoverable": true,
        "facts": [
          {
            "text": "Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101421"
            }
          },
          {
            "text": "Client rate card for Apex Consumer Goods permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-APE"
            }
          },
          {
            "text": "Subcontractor cost lines for Pacific Logistics reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-049"
            }
          }
        ]
      }
    ],
    "reasoning": "Multi-stop drop accessorial fee allocation mismatch: Subcontractor billed 3 additional drop fees ($120.00), client invoice billed single destination charge..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3049 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-049"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000622",
      "Job ref": "JOB-201519",
      "Client": "Apex Consumer Goods",
      "Paid cost": "8942.70",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000623",
    "name": "Owner Drivers Pool \u2014 Unrecovered haul",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-07",
    "dueDate": "2026-03-22",
    "amount": 11650.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-050",
        "findingId": "P03",
        "type": "Unrecovered cross-dock storage",
        "amount": 665.0,
        "recoverable": true,
        "facts": [
          {
            "text": "Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101450"
            }
          },
          {
            "text": "Client rate card for Pacific Trading permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-PAC"
            }
          },
          {
            "text": "Subcontractor cost lines for Owner Drivers Pool reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-050"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered extended cross-dock storage fee: Cross-dock pallet staging exceeded 24-hr free allowance by 24 hrs ($168.00 billable), absorbed in AP..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3050 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-050"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000623",
      "Job ref": "JOB-201550",
      "Client": "Pacific Trading",
      "Paid cost": "9087.00",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "CLINV-000624",
    "name": "RoadLine Haulage \u2014 Unrecovered haul",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-08",
    "dueDate": "2026-03-23",
    "amount": 11835.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-051",
        "findingId": "P01",
        "type": "Unrecovered toll pass-through",
        "amount": 677.4,
        "recoverable": true,
        "facts": [
          {
            "text": "Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101479"
            }
          },
          {
            "text": "Client rate card for Fashion Brand A permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for RoadLine Haulage reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-051"
            }
          }
        ]
      }
    ],
    "reasoning": "Unrecovered toll pass-through on metro haulage: Toll tag recorded $186.40 across three gantry hits; client invoice missing toll pass-through charge line..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3051 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-051"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000624",
      "Job ref": "JOB-201581",
      "Client": "Fashion Brand A",
      "Paid cost": "9231.30",
      "Payment status": "Pending rebill"
    }
  },
  {
    "id": "CLINV-000625",
    "name": "Metro Freight \u2014 Fuel haul",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-09",
    "dueDate": "2026-03-24",
    "amount": 12020.0,
    "currency": "AUD",
    "status": "red",
    "issues": [
      {
        "id": "issue-l-052",
        "findingId": "P02",
        "type": "Fuel recovery lag",
        "amount": 689.8,
        "recoverable": true,
        "facts": [
          {
            "text": "Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index.",
            "source": {
              "dataset": "shipment_telemetry.parquet",
              "rowId": "SHP-101508"
            }
          },
          {
            "text": "Client rate card for Fashion Brand B permits pass-through recovery.",
            "source": {
              "dataset": "client_rate_cards.parquet",
              "rowId": "RC-FAS"
            }
          },
          {
            "text": "Subcontractor cost lines for Metro Freight reflect unrecovered fee.",
            "source": {
              "dataset": "subcontractor_invoice_lines.parquet",
              "rowId": "SIL-052"
            }
          }
        ]
      }
    ],
    "reasoning": "Fuel surcharge index lag on interstate corridor: Two fuel card swipes reflect current pump index ($22.10 delta), but client fuel line used stale prior month index..",
    "agentAction": "Autonomously generated supplemental recovery invoice CLINV-3052 and unblocked subcontractor invoice.",
    "conversationIds": [
      "conv-l-052"
    ],
    "metadata": {
      "Subcontractor invoice": "CLINV-000625",
      "Job ref": "JOB-201612",
      "Client": "Fashion Brand B",
      "Paid cost": "9375.60",
      "Payment status": "Recovery issued"
    }
  },
  {
    "id": "SINV-000401",
    "name": "Metro Freight \u2014 Standard linehaul run",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-03",
    "dueDate": "2026-03-18",
    "amount": 2020.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000401",
      "Client": "Fashion Brand B",
      "Paid cost": "1656.40",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000402",
    "name": "Brisbane 3PL \u2014 Standard linehaul run",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-05",
    "dueDate": "2026-03-20",
    "amount": 2240.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000402",
      "Client": "Global Retail Co",
      "Paid cost": "1836.80",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000403",
    "name": "Pacific Logistics \u2014 Standard linehaul run",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-07",
    "dueDate": "2026-03-22",
    "amount": 2460.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000403",
      "Client": "Apex Consumer Goods",
      "Paid cost": "2017.20",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000404",
    "name": "Owner Drivers Pool \u2014 Standard linehaul run",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-09",
    "dueDate": "2026-03-24",
    "amount": 2680.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000404",
      "Client": "Pacific Trading",
      "Paid cost": "2197.60",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000405",
    "name": "RoadLine Haulage \u2014 Standard linehaul run",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-11",
    "dueDate": "2026-03-26",
    "amount": 2900.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000405",
      "Client": "Fashion Brand A",
      "Paid cost": "2378.00",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000406",
    "name": "Metro Freight \u2014 Standard linehaul run",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-13",
    "dueDate": "2026-03-28",
    "amount": 3120.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000406",
      "Client": "Fashion Brand B",
      "Paid cost": "2558.40",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000407",
    "name": "Brisbane 3PL \u2014 Standard linehaul run",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-15",
    "dueDate": "2026-03-02",
    "amount": 3340.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000407",
      "Client": "Global Retail Co",
      "Paid cost": "2738.80",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000408",
    "name": "Pacific Logistics \u2014 Standard linehaul run",
    "vendor": "Pacific Logistics",
    "invoiceDate": "2026-02-17",
    "dueDate": "2026-03-04",
    "amount": 3560.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000408",
      "Client": "Apex Consumer Goods",
      "Paid cost": "2919.20",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000409",
    "name": "Owner Drivers Pool \u2014 Standard linehaul run",
    "vendor": "Owner Drivers Pool",
    "invoiceDate": "2026-02-19",
    "dueDate": "2026-03-06",
    "amount": 3780.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000409",
      "Client": "Pacific Trading",
      "Paid cost": "3099.60",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000410",
    "name": "RoadLine Haulage \u2014 Standard linehaul run",
    "vendor": "RoadLine Haulage",
    "invoiceDate": "2026-02-21",
    "dueDate": "2026-03-08",
    "amount": 4000.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000410",
      "Client": "Fashion Brand A",
      "Paid cost": "3280.00",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000411",
    "name": "Metro Freight \u2014 Standard linehaul run",
    "vendor": "Metro Freight",
    "invoiceDate": "2026-02-23",
    "dueDate": "2026-03-10",
    "amount": 4220.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000411",
      "Client": "Fashion Brand B",
      "Paid cost": "3460.40",
      "Payment status": "Approved"
    }
  },
  {
    "id": "SINV-000412",
    "name": "Brisbane 3PL \u2014 Standard linehaul run",
    "vendor": "Brisbane 3PL",
    "invoiceDate": "2026-02-25",
    "dueDate": "2026-03-12",
    "amount": 4440.0,
    "currency": "AUD",
    "status": "green",
    "reasoning": "Subcontractor linehaul charges align perfectly with telemetry GPS logs, rate card quotes, and client billing lines.",
    "conversationIds": [],
    "metadata": {
      "Subcontractor invoice": "SINV-000412",
      "Client": "Global Retail Co",
      "Paid cost": "3640.80",
      "Payment status": "Approved"
    }
  }
]

export function getInvoicesForDemo(demoId: DemoInstanceId): Invoice[] {
  return demoId === "fashion" ? fashionInvoices : logisticsInvoices
}

export function getVendorsForDemo(demoId: DemoInstanceId): string[] {
  const vendors = new Set(getInvoicesForDemo(demoId).map((invoice) => invoice.vendor))
  return Array.from(vendors).sort()
}

export function getInvoiceById(
  demoId: DemoInstanceId,
  invoiceId: string
): Invoice | undefined {
  return getInvoicesForDemo(demoId).find((invoice) => invoice.id === invoiceId)
}
