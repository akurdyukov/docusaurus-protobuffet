# Implementation Plan: Docusaurus 3.9+ Upgrade

**Branch**: `001-docusaurus-upgrade` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-docusaurus-upgrade/spec.md`

## Summary

Upgrade the entire docusaurus-protobuffet monorepo from Docusaurus
2.0.0-alpha.72 to Docusaurus 3.9.2. This is a major version upgrade
affecting all three packages (preset, plugin, init) and the demo
website. The core plugin API surface (extendCli, getThemePath, Plugin
interface) is compatible. The init package requires rewriting the
scaffolding command from `@docusaurus/init` to `create-docusaurus`.
TypeScript, React, and MDX dependencies all require version bumps.
Generated MDX output and sidebar format remain compatible.

## Technical Context

**Language/Version**: TypeScript 5.2+ (upgrading from 4.2.3)
**Primary Dependencies**: Docusaurus 3.9.2, React 18.2+, MDX 3
**Storage**: N/A (file-based generation)
**Testing**: Manual verification via demo website (no test suite)
**Target Platform**: Node.js 18+ (npm packages + Docusaurus sites)
**Project Type**: Lerna monorepo (3 packages + demo website)
**Performance Goals**: N/A (build-time tooling)
**Constraints**: Must not break existing plugin/preset option contracts
**Scale/Scope**: ~15 files to modify across 4 project areas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Monorepo Cohesion | PASS | All packages upgraded together in single PR. Shared tsconfig updated. |
| II. Generated Output Correctness | PASS | Generated MDX format unchanged. JSX components and JSON props are valid MDX v3. Sidebar CommonJS format unchanged. |
| III. Backward Compatibility | JUSTIFIED | This is a major version bump (dropping Docusaurus 2.x support). Breaking change is documented in migration guide per FR-010. Public API contracts (plugin options, preset options, CLI commands, theme components) remain unchanged. |
| IV. Docusaurus Alignment | PASS | Upgrade specifically aligns with latest Docusaurus APIs. Using official @docusaurus/* packages at v3.9.2. |
| V. Simplicity | PASS | Minimal changes — only updating what is necessary for v3 compatibility. No new abstractions or features added. |

**Post-Phase 1 Re-check**: Same results. No new violations introduced
by design decisions.

## Project Structure

### Documentation (this feature)

```text
specs/001-docusaurus-upgrade/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Existing monorepo structure (unchanged)
packages/
├── docusaurus-protobuffet/          # Preset package
│   ├── package.json                 # UPDATE: @docusaurus/types → 3.9.2
│   ├── tsconfig.json                # No changes (extends root)
│   └── src/
│       └── index.ts                 # VERIFY: LoadContext type compatibility
│
├── docusaurus-protobuffet-plugin/   # Core plugin
│   ├── package.json                 # UPDATE: @docusaurus/utils, react, @types/react
│   ├── tsconfig.json                # No changes (extends root)
│   └── src/
│       ├── index.ts                 # VERIFY: Plugin interface, validateOptions types
│       ├── parsers.ts               # No changes
│       ├── types.ts                 # No changes
│       ├── utils.ts                 # No changes
│       ├── generators.ts            # No changes
│       ├── generators/
│       │   ├── docfile.ts           # No changes (MDX generation is v3-compatible)
│       │   └── sidebar.ts           # No changes (CommonJS sidebar format)
│       └── theme/
│           └── ProtoFile.tsx        # VERIFY: React 18 compat, Link import
│
└── docusaurus-protobuffet-init/     # Init CLI
    ├── package.json                 # UPDATE: remove @docusaurus/init, update deps
    ├── tsconfig.json                # No changes (extends root)
    ├── bin/
    │   └── index.js                 # No changes
    └── src/
        ├── index.ts                 # UPDATE: create-docusaurus command
        └── templates/
            ├── docusaurus.config.js # UPDATE: v3-compatible config
            ├── landing_page.js      # VERIFY: React 18 / Docusaurus v3 hooks
            ├── landing_page.module.css  # No changes
            ├── proto_workspace.json     # No changes
            ├── logo.png                 # No changes
            └── favicon.ico              # No changes

website/                             # Demo website
├── package.json                     # UPDATE: all @docusaurus/*, react, mdx
├── docusaurus.config.js             # VERIFY: v3 config compat
├── babel.config.js                  # VERIFY: babel preset path
├── sidebars.js                      # No changes
├── sidebarsProtodocs.js             # No changes
└── src/
    └── pages/
        └── index.js                 # VERIFY: Docusaurus hooks compat

# Root configuration
package.json                         # UPDATE: all dev dependencies
tsconfig.json                        # UPDATE: target, jsx, lib
```

**Structure Decision**: Existing monorepo structure is preserved. No
new directories or packages are created. Changes are limited to
dependency versions, TypeScript config, and the init package's
scaffolding command.

## Files to Modify (Complete List)

### Dependency Updates (package.json files)

1. **`package.json`** (root) — Update @docusaurus/types,
   @docusaurus/module-type-aliases, @types/node, typescript. Replace
   @tsconfig/docusaurus with @docusaurus/tsconfig.

2. **`packages/docusaurus-protobuffet/package.json`** — Update
   @docusaurus/types devDependency. Bump package version.

3. **`packages/docusaurus-protobuffet-plugin/package.json`** — Update
   @docusaurus/utils, react, @types/react. Bump package version.

4. **`packages/docusaurus-protobuffet-init/package.json`** — Remove
   @docusaurus/init dependency. Bump package version.

5. **`website/package.json`** — Update @docusaurus/core,
   @docusaurus/preset-classic, @mdx-js/react, react, react-dom,
   @easyops-cn/docusaurus-search-local.

### TypeScript Configuration

6. **`tsconfig.json`** (root) — Change target to ES2020, jsx to
   react-jsx, lib to ["ES2020", "DOM"].

### Source Code Changes

7. **`packages/docusaurus-protobuffet-plugin/src/index.ts`** — Fix
   `validateOptions` type signature for v3 compatibility.

8. **`packages/docusaurus-protobuffet-init/src/index.ts`** — Replace
   `@docusaurus/init` execSync call with `create-docusaurus` command.
   Update `--use-npm` flag to `--package-manager npm`.

### Template Updates

9. **`packages/docusaurus-protobuffet-init/src/templates/docusaurus.config.js`**
   — Verify and update for Docusaurus 3.9+ compatibility. Update
   search plugin version reference if needed.

### Website Updates

10. **`website/babel.config.js`** — Verify babel preset path is still
    valid in @docusaurus/core v3.

### Documentation

11. **Migration guide** (new file, location TBD — likely
    `MIGRATION.md` at repo root or in package READMEs)

## Complexity Tracking

> No constitution violations to justify. All principles pass or are
> justified by the major version bump (Principle III).

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| @easyops-cn/docusaurus-search-local incompatible with v3 | Medium | Remove from init template, use v3-compatible version or remove from website |
| Proto descriptions with `{` or `<` break MDX v3 | Low | mdx1Compat flags are on by default; defer hardening to separate feature |
| validateOptions type changes cause TS errors | Low | Fix type annotation; function body unchanged |
| Users with swizzled components face breakage | Low | Document in migration guide; not controllable by this upgrade |
