#!/usr/bin/env node
/**
 * Talon UI Kit audit — scan any codebase for deviations from talon-ui-kit.yaml
 *
 * Usage:
 *   node talon-kit/scripts/audit-ui.mjs --root /path/to/project
 *   node talon-kit/scripts/audit-ui.mjs --root . --kit talon-kit/talon-ui-kit.yaml --format json
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, relative, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { parse as parseYaml } from "yaml"

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_KIT = resolve(__dirname, "../talon-ui-kit.yaml")

const SEVERITY_ORDER = { error: 0, warn: 1, info: 2 }

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    kit: DEFAULT_KIT,
    format: "text",
    failOn: "error",
  }

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--root" && argv[i + 1]) args.root = resolve(argv[++i])
    else if (arg === "--kit" && argv[i + 1]) args.kit = resolve(argv[++i])
    else if (arg === "--format" && argv[i + 1]) args.format = argv[++i]
    else if (arg === "--fail-on" && argv[i + 1]) args.failOn = argv[++i]
    else if (arg === "--help" || arg === "-h") {
      console.log(`Talon UI Kit audit

Options:
  --root <path>     Project root to scan (default: cwd)
  --kit <path>      Path to talon-ui-kit.yaml (default: bundled)
  --format text|json
  --fail-on error|warn|info  Exit code 1 when findings at or above level
`)
      process.exit(0)
    }
  }

  return args
}

function loadKit(kitPath) {
  if (!existsSync(kitPath)) {
    console.error(`Kit file not found: ${kitPath}`)
    process.exit(1)
  }
  return parseYaml(readFileSync(kitPath, "utf8"))
}

function globToRegExp(glob) {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "{{GLOBSTAR}}")
    .replace(/\*/g, "[^/]*")
    .replace(/{{GLOBSTAR}}/g, ".*")
  return new RegExp(`^${escaped}$`)
}

function matchesGlob(filePath, glob) {
  return globToRegExp(glob).test(filePath.replace(/\\/g, "/"))
}

function shouldInclude(relativePath, auditConfig) {
  const normalized = relativePath.replace(/\\/g, "/")
  const include = auditConfig.file_globs?.include ?? ["**/*.{tsx,ts,css}"]
  const exclude = auditConfig.file_globs?.exclude ?? []

  if (!include.some((g) => matchesGlob(normalized, g))) return false
  if (exclude.some((g) => matchesGlob(normalized, g))) return false
  return true
}

function walkDir(dir, root, auditConfig, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const full = join(dir, entry.name)
    const rel = relative(root, full).replace(/\\/g, "/")

    if (entry.isDirectory()) {
      if (shouldInclude(`${rel}/**`, auditConfig) || readdirSync(full).length) {
        walkDir(full, root, auditConfig, files)
      }
    } else if (entry.isFile() && shouldInclude(rel, auditConfig)) {
      files.push(full)
    }
  }
  return files
}

function isAllowedPath(relativePath, allowedGlobs) {
  if (!allowedGlobs?.length) return false
  const normalized = relativePath.replace(/\\/g, "/")
  return allowedGlobs.some((g) => matchesGlob(normalized, g))
}

function scanFile(content, relativePath, rules) {
  const lines = content.split("\n")
  const findings = []

  for (const rule of rules) {
    const allowedPaths = rule.allowed_paths ?? []
    if (isAllowedPath(relativePath, allowedPaths)) continue

    for (const pattern of rule.patterns ?? []) {
      const regex = new RegExp(pattern, "g")
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex]
        regex.lastIndex = 0
        let match
        while ((match = regex.exec(line)) !== null) {
          findings.push({
            ruleId: rule.id,
            severity: rule.severity ?? "warn",
            description: rule.description ?? rule.id,
            file: relativePath,
            line: lineIndex + 1,
            column: match.index + 1,
            match: match[0],
          })
        }
      }
    }
  }

  return findings
}

function checkCssTokens(root, structureChecks) {
  const findings = []
  const cssCandidates = [
    join(root, "src/index.css"),
    join(root, "talon/src/index.css"),
    join(root, "index.css"),
  ]

  const cssPath = cssCandidates.find((p) => existsSync(p))
  if (!cssPath) {
    findings.push({
      ruleId: "has-theme-css",
      severity: "warn",
      description: "No index.css found — Talon design tokens may be missing",
      file: relative(root, root) || ".",
      line: 0,
      column: 0,
      match: "missing index.css",
    })
    return findings
  }

  const css = readFileSync(cssPath, "utf8")
  const rel = relative(root, cssPath).replace(/\\/g, "/")
  const check = structureChecks?.find((c) => c.id === "has-theme-css")
  const required = check?.required_css_vars ?? ["--brand", "--foreground", "--background"]

  for (const token of required) {
    if (!css.includes(token)) {
      findings.push({
        ruleId: "has-theme-css",
        severity: "error",
        description: `Missing required CSS variable ${token}`,
        file: rel,
        line: 0,
        column: 0,
        match: token,
      })
    }
  }

  return findings
}

function formatTextReport(findings, kitMeta, root) {
  const lines = [
    `Talon UI Kit audit — ${kitMeta.name} v${kitMeta.version}`,
    `Root: ${root}`,
    "",
  ]

  if (findings.length === 0) {
    lines.push("✓ No deviations found.")
    return lines.join("\n")
  }

  const grouped = { error: [], warn: [], info: [] }
  for (const f of findings) grouped[f.severity]?.push(f)

  for (const severity of ["error", "warn", "info"]) {
    const items = grouped[severity]
    if (!items?.length) continue
    lines.push(`${severity.toUpperCase()} (${items.length})`)
    for (const f of items) {
      const loc = f.line > 0 ? `${f.file}:${f.line}:${f.column}` : f.file
      lines.push(`  [${f.ruleId}] ${loc}`)
      lines.push(`    ${f.description}`)
      lines.push(`    → ${f.match}`)
    }
    lines.push("")
  }

  lines.push(
    `Total: ${findings.length} (${grouped.error.length} errors, ${grouped.warn.length} warnings, ${grouped.info.length} info)`
  )
  return lines.join("\n")
}

function shouldFail(findings, failOn) {
  const threshold = SEVERITY_ORDER[failOn] ?? 0
  return findings.some((f) => (SEVERITY_ORDER[f.severity] ?? 99) <= threshold)
}

function main() {
  const args = parseArgs(process.argv)
  const kit = loadKit(args.kit)
  const auditConfig = kit.audit ?? {}
  const rules = auditConfig.rules ?? []

  const files = walkDir(args.root, args.root, auditConfig)
  const findings = []

  for (const file of files) {
    const rel = relative(args.root, file).replace(/\\/g, "/")
    const content = readFileSync(file, "utf8")
    findings.push(...scanFile(content, rel, rules))
  }

  findings.push(...checkCssTokens(args.root, auditConfig.structure_checks))

  findings.sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99) ||
      a.file.localeCompare(b.file) ||
      a.line - b.line
  )

  const kitMeta = kit.kit ?? { name: "talon-ui-kit", version: "?" }

  if (args.format === "json") {
    console.log(JSON.stringify({ kit: kitMeta, root: args.root, findings }, null, 2))
  } else {
    console.log(formatTextReport(findings, kitMeta, args.root))
  }

  if (shouldFail(findings, args.failOn)) {
    process.exit(1)
  }
}

main()
