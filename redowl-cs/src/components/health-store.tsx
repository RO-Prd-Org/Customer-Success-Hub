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
  healthSeed,
  scoreHealth,
  type HealthInput,
  type HealthScore,
} from "@/lib/health-score";

const STORAGE_KEY = "redowl-customer-health";

function withoutSamples(rows: HealthInput[]) {
  return rows.filter((row) => !/sample customer/i.test(row.name));
}

type HealthContextValue = {
  customers: HealthInput[];
  scores: Map<string, HealthScore>;
  updateCustomer: (id: string, patch: Partial<HealthInput>) => void;
  reset: () => void;
};

const HealthContext = createContext<HealthContextValue | null>(null);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<HealthInput[]>(() => withoutSamples(healthSeed));
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
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers, hydrated]);

  const scores = useMemo(() => {
    const map = new Map<string, HealthScore>();
    for (const customer of customers) map.set(customer.id, scoreHealth(customer));
    return map;
  }, [customers]);

  const value = useMemo<HealthContextValue>(
    () => ({
      customers,
      scores,
      updateCustomer: (id, patch) => {
        setCustomers((current) =>
          current.map((customer) =>
            customer.id === id ? { ...customer, ...patch } : customer,
          ),
        );
      },
      reset: () => {
        setCustomers(withoutSamples(healthSeed));
        localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [customers, scores],
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const value = useContext(HealthContext);
  if (!value) throw new Error("useHealth must be used within HealthProvider");
  return value;
}
