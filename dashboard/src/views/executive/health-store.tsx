"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  blankSlaTicket,
  deriveSlaTicket,
  healthSeed,
  scoreHealth,
  slaLogSeed,
  type HealthInput,
  type HealthScore,
  type SlaTicket,
} from "@/lib/executive-health";

const STORAGE_KEY = "talon-executive-health";
const SLA_STORAGE_KEY = "talon-sla-log";

function withoutSamples(rows: HealthInput[]) {
  return rows.filter((row) => !/sample customer/i.test(row.name));
}

type HealthContextValue = {
  customers: HealthInput[];
  scores: Map<string, HealthScore>;
  tickets: SlaTicket[];
  updateCustomer: (id: string, patch: Partial<HealthInput>) => void;
  updateTicket: (rowId: string, key: keyof SlaTicket, value: string) => void;
  addTicket: () => void;
  removeTicket: (rowId: string) => void;
  reset: () => void;
};

const HealthContext = createContext<HealthContextValue | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<HealthInput[]>(() => withoutSamples(healthSeed));
  const [tickets, setTickets] = useState<SlaTicket[]>(slaLogSeed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as HealthInput[];
        if (Array.isArray(parsed) && parsed.every((row) => row && row.id && row.name)) {
          setCustomers(withoutSamples(parsed));
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    try {
      const savedTickets = localStorage.getItem(SLA_STORAGE_KEY);
      if (savedTickets) {
        const parsed = JSON.parse(savedTickets) as SlaTicket[];
        if (Array.isArray(parsed) && parsed.every((row) => row && row.id)) {
          setTickets(
            parsed.map((row, index) => ({
              rowId: row.rowId || `row-${row.id || index}`,
              id: row.id,
              customer: row.customer ?? "",
              tier: row.tier ?? "",
              severity: row.severity ?? "",
              loggedDate: row.loggedDate ?? "",
              actualResponse: row.actualResponse ?? "",
              actualResolution: row.actualResolution ?? "",
              responseTarget: row.responseTarget ?? "",
              resolutionTarget: row.resolutionTarget ?? "",
              responseBreach: row.responseBreach ?? "",
              resolutionBreach: row.resolutionBreach ?? "",
              outcome: row.outcome ?? "",
              notes: row.notes ?? "",
            })),
          );
        }
      }
    } catch {
      localStorage.removeItem(SLA_STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SLA_STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets, hydrated]);

  const scores = useMemo(() => {
    const map = new Map<string, HealthScore>();
    for (const customer of customers) map.set(customer.id, scoreHealth(customer, tickets));
    return map;
  }, [customers, tickets]);

  const value = useMemo<HealthContextValue>(
    () => ({
      customers,
      scores,
      tickets,
      updateCustomer: (id, patch) => {
        setCustomers((current) =>
          current.map((customer) =>
            customer.id === id ? { ...customer, ...patch } : customer,
          ),
        );
      },
      updateTicket: (rowId, key, value) => {
        setTickets((current) =>
          current.map((ticket) =>
            ticket.rowId === rowId ? deriveSlaTicket({ ...ticket, [key]: value }, key) : ticket,
          ),
        );
      },
      addTicket: () => {
        setTickets((current) => [...current, blankSlaTicket(current)]);
      },
      removeTicket: (rowId) => {
        setTickets((current) => current.filter((ticket) => ticket.rowId !== rowId));
      },
      reset: () => {
        setCustomers(withoutSamples(healthSeed));
        localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [customers, scores, tickets],
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const value = useContext(HealthContext);
  if (!value) throw new Error("useHealth must be used within HealthProvider");
  return value;
}
