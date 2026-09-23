#!/usr/bin/env python3
"""Refresh src/data/dashboard.json from the Excel source files in the parent folder."""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
SOURCE = WORKSPACE / "Source of Truth.xlsx"
OUTPUT = ROOT / "src" / "data" / "dashboard.json"


def iso(value):
    if pd.isna(value):
        return None
    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d")
    return str(value)


def num(value, default=0.0):
    if pd.isna(value):
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def txt(value):
    if pd.isna(value):
        return ""
    return str(value).strip()


def norm_stage(value):
    stage = txt(value)
    return "Prospect" if stage.lower() == "propsect" else stage


def main():
    pipe = pd.read_excel(SOURCE, sheet_name="Pipeline")
    impl = pd.read_excel(SOURCE, sheet_name="Implementation Tracker")

    pipeline = []
    for _, row in pipe.iterrows():
        name = txt(row["Opportunity"])
        if not name:
            continue
        pipeline.append(
            {
                "opportunity": name,
                "value": num(row["Value"]),
                "stage": norm_stage(row["Stage"]),
                "probability": num(row["% Probability"]),
                "createdDate": iso(row["Created Date"]),
                "closeMonth": iso(row["Close Month"]),
                "useCase": txt(row["Use Case"]),
                "forecastType": txt(row["Forecast Type"]) or "Unassigned",
                "customerType": txt(row["Customer Type"]) or "—",
                "statusComments": txt(row["Status Comments"]),
                "dealCycleMonths": num(row["Deal Cycle (Months)"]),
                "weightedArr": num(row["Weighted ARR"]),
            }
        )

    implementations = []
    for _, row in impl.iterrows():
        name = txt(row["Customer"])
        if not name:
            continue
        rag = txt(row["RAG Status"])
        pct = num(row["% Complete"])
        if not rag:
            rag = "Complete" if pct >= 1 else "Red"
        implementations.append(
            {
                "customer": name,
                "salesStage": txt(row["Sales Stage"]),
                "salesRank": int(num(row["Sales Rank"])),
                "inImplementation": txt(row["In Implementation?"]) == "Yes",
                "sandboxStage": txt(row["Sandbox Development Stage"]),
                "sandboxStageNo": int(num(row["Sandbox Stage No."])),
                "pctComplete": pct,
                "owner": txt(row["Implementation Owner"]),
                "sandboxStart": iso(row["Sandbox Start"]),
                "lastStageChange": iso(row["Last Stage Change"]),
                "targetLive": iso(row["Target Sandbox Live"]),
                "daysInStage": int(num(row["Days in Current Stage"])),
                "daysToTarget": None
                if pd.isna(row["Days to Target"])
                else int(num(row["Days to Target"])),
                "rag": rag,
                "arr": num(row["ARR ($)"]),
                "blocker": txt(row["Blocker / Next Action"]),
            }
        )

    current = json.loads(OUTPUT.read_text())
    current["pipeline"] = pipeline
    current["implementations"] = implementations
    current["meta"]["source"] = "Source of Truth.xlsx + Pipeline Analysis V1"
    OUTPUT.write_text(json.dumps(current, indent=2) + "\n")
    print(f"Updated {OUTPUT} ({len(pipeline)} pipeline, {len(implementations)} implementations)")


if __name__ == "__main__":
    main()
