# Implementation Plan: Proto Source Templates

**Branch**: `003-proto-source-templates` | **Date**: 2026-02-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-proto-source-templates/spec.md`

## Summary

Replace the pre-built `proto_workspace.json` template in the `docusaurus-protobuffet-init` package with 9 `.proto` source files reconstructed from the JSON descriptor. Update the init flow to copy the proto directory tree, inject a Docker-based `generate-proto-json` npm script into the generated project, and run it during setup before generating Docusaurus docs.

## Technical Context

**Language/Version**: TypeScript 5.2+ (strict mode, ES5 target, CommonJS modules)
**Primary Dependencies**: Docusaurus 3.9.2, chalk, commander, copyfiles (dev)
**Storage**: File-based (proto files as templates, JSON descriptor as generated output)
**Testing**: Manual verification (no automated test suite configured)
**Target Platform**: Node.js >= 18, macOS/Linux (Docker for proto generation)
**Project Type**: Monorepo package (`packages/docusaurus-protobuffet-init`)
**Performance Goals**: N/A (build/scaffolding tool, not runtime service)
**Constraints**: Proto files must produce structurally equivalent documentation to the existing JSON descriptor
**Scale/Scope**: 4 files modified, 9 proto files created, 1 JSON file deleted

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Monorepo Cohesion | PASS | Changes are within a single package (`docusaurus-protobuffet-init`), no cross-package dependency changes |
| II. Generated Output Correctness | PASS | Proto source files faithfully represent the same API definitions as the existing JSON; round-trip correctness is preserved |
| III. Backward Compatibility | PASS | No public API changes (preset options, plugin options, CLI commands, theme components). The init CLI still produces the same end result (a Docusaurus site with proto docs). New Docker dependency for init is additive |
| IV. Docusaurus Alignment | PASS | No Docusaurus API changes; the plugin still consumes the same `proto_workspace.json` format |
| V. Simplicity | PASS | Uses `fs.cpSync` (standard library) instead of adding dependencies. Proto files are the simplest representation of the API definitions. Docker command is a single-line npm script |

**Post-Phase 1 Re-check**: All gates still PASS. No new abstractions, dependencies, or API surface changes introduced.

## Project Structure

### Documentation (this feature)

```text
specs/003-proto-source-templates/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research output
├── data-model.md        # Phase 1 data model
├── quickstart.md        # Phase 1 quickstart guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
packages/docusaurus-protobuffet-init/
├── package.json                          # MODIFIED: build script change
├── src/
│   ├── index.ts                          # MODIFIED: init flow changes
│   └── templates/
│       ├── proto_workspace.json          # DELETED
│       ├── docusaurus.config.ts          # unchanged
│       ├── favicon.ico                   # unchanged
│       ├── landing_page.js               # unchanged
│       ├── landing_page.module.css       # unchanged
│       ├── logo.png                      # unchanged
│       └── proto/                        # NEW DIRECTORY
│           └── protobuffet/example/
│               ├── ad/v1/ads.proto                           # NEW
│               ├── carts/v1/carts.proto                      # NEW
│               ├── checkout/v1/checkout.proto                 # NEW
│               ├── common/types/v1/money.proto                # NEW
│               ├── currency/v1/currency.proto                 # NEW
│               ├── payment/v1/payment.proto                   # NEW
│               ├── productcatalog/v1/productcatalog.proto     # NEW
│               ├── recommendations/v1/recommendations.proto   # NEW
│               └── shipping/v1/shipping.proto                 # NEW
└── dist/templates/                       # Build output (mirrors src/templates/ structure)
```

**Structure Decision**: Existing monorepo package structure is preserved. New proto files are added as template assets under the existing `src/templates/` directory, organized by protobuf package path. No new packages, directories outside the init package, or architectural changes.

## Implementation Details

### Change 1: Create 9 proto files

Create `.proto` files under `src/templates/proto/protobuffet/example/` reconstructed from the existing `proto_workspace.json`. Each proto file includes:
- `syntax = "proto3";` declaration
- `package` matching the JSON descriptor's package field
- `import` statements for cross-referenced types (see data-model.md for import map)
- Messages with fields, types, labels, and doc comments
- Enums with values and doc comments
- Services with RPC methods and doc comments

### Change 2: Delete proto_workspace.json

Remove `src/templates/proto_workspace.json` — no longer needed as the JSON will be generated from proto sources.

### Change 3: Update package.json build script

Change `copy-template-fixtures` from:
```
copyfiles -f src/templates/* dist/templates/
```
to:
```
copyfiles -u 2 "src/templates/**/*" dist/templates/
```

The `-f` flag flattens directories (loses structure). The `-u 2` flag strips 2 path segments (`src/templates/`) while preserving subdirectory structure.

### Change 4: Update index.ts init flow

1. Replace `fs.copyFileSync(... 'proto_workspace.json' ...)` with `fs.cpSync(... 'proto', ..., { recursive: true })` to copy the proto directory tree
2. Add code to read the generated project's `package.json`, add `generate-proto-json` script, and write it back
3. Run `npm run generate-proto-json` before `npx docusaurus generate-proto-docs`

The `generate-proto-json` npm script value:
```
docker run --rm -v $(pwd)/proto:/protos -v $(pwd)/fixtures:/out pseudomuto/protoc-gen-doc --doc_opt=json,proto_workspace.json
```

## Complexity Tracking

No constitution violations to justify. All changes are minimal and direct.
