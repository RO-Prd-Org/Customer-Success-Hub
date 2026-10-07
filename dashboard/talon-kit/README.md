# Talon UI Kit (deployable)

Declarative spec, agent skill, and audit tooling for the RedOwl Talon design system.

## Contents

| Path | Purpose |
|------|---------|
| `talon-ui-kit.yaml` | Source of truth — tokens, layout, components, semantic rules, audit config |
| `scripts/audit-ui.mjs` | Scan any codebase for UI deviations |
| `skill/SKILL.md` | Cursor agent skill — scaffolding + design rules |
| `skill/reference.md` | Component inventory and examples |

## Quick start

```bash
cd talon-kit
npm install

# Audit the reference app (parent repo)
npm run audit

# Audit any project
node scripts/audit-ui.mjs --root /path/to/your-app --fail-on error
```

## Install the Cursor skill

Copy or symlink into your project:

```bash
mkdir -p .cursor/skills
cp -r talon-kit/skill .cursor/skills/talon-ui-kit
```

Or copy the whole `talon-kit/` folder when embedding in another repository.

## YAML structure

```yaml
kit:           # metadata + stack
design_tokens: # colors, fonts, radius
layouts:       # master-pattern, page-shell, drill-down
components:    # ui + patterns registry
semantic_rules:# color, button, chart, progress rules
audit:         # regex rules + structure checks for audit-ui.mjs
```

Edit `talon-ui-kit.yaml` first when design decisions change, then update `talon/src` and re-run audit.

## CI example

```yaml
- name: Talon UI audit
  run: |
    cd talon-kit && npm ci
    node scripts/audit-ui.mjs --root .. --format json --fail-on warn
```

## Versioning

Bump `kit.version` in `talon-ui-kit.yaml` when breaking semantic or token rules change.
