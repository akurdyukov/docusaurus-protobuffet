# Implementation Plan: Upgrade Lerna to v9+

**Branch**: `002-upgrade-lerna` | **Date**: 2026-02-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-upgrade-lerna/spec.md`

## Summary

Upgrade Lerna from v4.0.0 to v9.0.0+ to eliminate deprecated commands (`lerna bootstrap`), adopt npm workspaces for package linking, and modernize the monorepo tooling. The core changes are: add `workspaces` to root `package.json`, bump the `lerna` dependency, remove `lerna bootstrap` from CI, and update documentation.

## Technical Context

**Language/Version**: TypeScript 5.2+ (no change)
**Primary Dependencies**: Lerna ^9.0.0 (upgrading from ^4.0.0), Nx >=21.5.3 (transitive via Lerna)
**Storage**: N/A
**Testing**: Manual verification (no test suite exists); `npx lerna run build` + `cd website && npm run build`
**Target Platform**: Node.js ^20.19.0 || ^22.12.0 || >=24.0.0
**Project Type**: Lerna monorepo (3 packages + demo website)
**Performance Goals**: N/A (build tooling upgrade)
**Constraints**: Must not break existing build, CI, or publish workflows
**Scale/Scope**: 3 packages, 1 CI workflow, 1 documentation file (CLAUDE.md)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Monorepo Cohesion | PASS | Upgrade preserves Lerna monorepo. npm workspaces strengthens cohesion by making package linking native. |
| II. Generated Output Correctness | PASS | No changes to parsers, generators, or MDX output. |
| III. Backward Compatibility | PASS | No changes to public APIs, preset/plugin options, CLI commands, or generated file formats. Lerna is a devDependency only. |
| IV. Docusaurus Alignment | PASS | No changes to Docusaurus integration. |
| V. Simplicity | PASS | Removes the deprecated `lerna bootstrap` step, simplifying the workflow. npm workspaces is a native npm feature requiring no additional tooling. |

No violations. All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/002-upgrade-lerna/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research output
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (files to modify)

```text
package.json                    # Add "workspaces", bump lerna to ^9.0.0
lerna.json                      # Add $schema field
.github/workflows/ci.yml        # Remove "lerna bootstrap" steps
CLAUDE.md                       # Update build commands documentation
```

**Structure Decision**: No new files or directories. This is a configuration-only change touching 4 existing files at the repository root level.

## Implementation Steps

### Step 1: Update root `package.json`

Add npm workspaces configuration and bump Lerna version:

```json
{
  "name": "docusaurus-protobuffet-root",
  "private": true,
  "workspaces": ["packages/*"],
  "devDependencies": {
    "lerna": "^9.0.0",
    ...
  }
}
```

### Step 2: Update `lerna.json`

Add JSON schema for IDE support. Keep existing `packages` and `version` fields:

```json
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "packages": ["packages/*"],
  "version": "1.0.0"
}
```

### Step 3: Update `.github/workflows/ci.yml`

Remove `lerna bootstrap` steps from both `build` and `publish` jobs. With npm workspaces, `npm ci` already handles dependency installation and local package symlinking.

**Build job**: Remove the "Bootstrap packages" step.
**Publish job**: Remove the "Bootstrap packages" step.

### Step 4: Run `npm install` to regenerate lockfile

Run `npm install` at root to install Lerna 9 and regenerate `package-lock.json` with workspaces.

### Step 5: Run `npx lerna repair`

Run `npx lerna repair` to auto-fix any deprecated config in `lerna.json`.

### Step 6: Verify builds

1. `npx lerna run build` — all 3 packages must compile
2. `cd website && npm install && npm run build` — website must build

### Step 7: Update `CLAUDE.md`

Update the build commands section to remove any reference to `lerna bootstrap` and document that `npm install` at root handles workspaces linking.

## Complexity Tracking

No constitution violations to justify. This is a straightforward dependency upgrade with configuration changes only.
