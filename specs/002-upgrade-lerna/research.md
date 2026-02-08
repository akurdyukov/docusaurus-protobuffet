# Research: Upgrade Lerna to v9+

**Date**: 2026-02-09
**Branch**: `002-upgrade-lerna`

## Decision 1: Target Lerna Version

**Decision**: Lerna `^9.0.0` (latest stable: 9.0.3, released 2025-11-27)

**Rationale**: v9 is the current major release line with active maintenance. It drops Node 18 support (requiring `^20.19.0 || ^22.12.0 || >=24.0.0`) which aligns with the project's CI matrix (20, 22, 24).

**Alternatives considered**:
- Lerna 8.x: Still maintained but would leave us one major version behind; Node 18 support is unnecessary since CI already targets 20+.
- Drop Lerna entirely (use npm workspaces only): Would lose `lerna run` (topological build ordering) and `lerna publish from-package` (registry-aware multi-package publishing). Not worth the reimplementation effort.

## Decision 2: Replacement for `lerna bootstrap`

**Decision**: Replace `lerna bootstrap` with `npm install`. Add `"workspaces": ["packages/*"]` to root `package.json`.

**Rationale**: `lerna bootstrap` was removed in Lerna 7 and the legacy fallback (`@lerna/legacy-package-management`) was removed in Lerna 9. npm workspaces is the official replacement. With workspaces configured, `npm install` at the root automatically installs all package dependencies and creates symlinks for local cross-references.

**Alternatives considered**:
- Stay on Lerna 4.x: Keeps `lerna bootstrap` working but accumulates technical debt and misses Nx task runner improvements.
- Use `@lerna/legacy-package-management` with Lerna 8: Temporary workaround that was removed in v9 anyway.

## Decision 3: `lerna.json` Configuration

**Decision**: Keep `packages` field in `lerna.json` (redundant with workspaces but harmless). Add `$schema` for IDE support. Keep `version` field.

**Rationale**: Lerna 9 reads `packages` from `lerna.json` first, then falls back to workspaces config. Keeping both is explicitly supported and avoids risk. Run `npx lerna repair` after upgrade to auto-clean any deprecated fields.

**Target `lerna.json`**:
```json
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "packages": ["packages/*"],
  "version": "1.0.0"
}
```

## Decision 4: Nx Dependency

**Decision**: Accept Nx as a transitive dependency (installed automatically with Lerna 9). Do not add `nx.json` or configure caching.

**Rationale**: Nx is bundled with Lerna 9 (`"nx": ">=21.5.3 < 23.0.0"` as a direct dependency). It powers `lerna run` by default (`useNx: true` is the default). Adding `nx.json` for caching is optional and unnecessary for this small monorepo (3 packages, <2s total build time).

**Alternatives considered**:
- Set `useNx: false` in lerna.json: Possible but no benefit; Nx task runner handles topological ordering correctly.
- Add `nx.json` with caching: Overkill for 3 packages with sub-second builds.

## Decision 5: Node.js Version Constraints

**Decision**: No change to CI matrix (already [20, 22, 24]). Update `engines` in package.json files if needed.

**Rationale**: Lerna 9 requires `^20.19.0 || ^22.12.0 || >=24.0.0`. The CI matrix already uses Node 20, 22, and 24. The existing package `engines` fields specify `>=18.0.0` which is broader than what Lerna 9 supports, but since Lerna is a devDependency (not a runtime dependency of the packages), the package engines do not need to change.

## Decision 6: CI Workflow Changes

**Decision**: Replace `npx lerna bootstrap` steps with standard `npm install` (which is already the first step via `npm ci`). Remove the separate bootstrap step entirely since `npm ci` with workspaces handles linking.

**Rationale**: With workspaces in root `package.json`, `npm ci` installs all dependencies across all packages and creates symlinks. The separate `lerna bootstrap` step becomes redundant.

**Note on website**: The website uses `file:../packages/docusaurus-protobuffet` reference. With npm workspaces at root, the website is NOT part of workspaces (it's outside `packages/*`). Website `npm install` step must remain separate.
