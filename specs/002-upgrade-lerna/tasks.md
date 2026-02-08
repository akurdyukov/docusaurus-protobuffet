# Tasks: Upgrade Lerna to v9+

**Input**: Design documents from `/specs/002-upgrade-lerna/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Configuration Changes)

**Purpose**: Update monorepo configuration files to support Lerna 9 with npm workspaces

- [x] T001 [P] Add `"workspaces": ["packages/*"]` and bump `"lerna"` to `"^9.0.0"` in `package.json`
- [x] T002 [P] Add `"$schema": "node_modules/lerna/schemas/lerna-schema.json"` to `lerna.json`

---

## Phase 2: Foundational (Install & Repair)

**Purpose**: Install upgraded dependencies, regenerate lockfile, and auto-fix deprecated Lerna config

**CRITICAL**: Must complete before verifying any user stories

- [x] T003 Run `npm install` at repository root to install Lerna 9 and regenerate `package-lock.json` with workspaces
- [x] T004 Run `npx lerna repair` to auto-fix any deprecated fields in `lerna.json`

**Checkpoint**: Lerna 9 installed, workspaces active, config clean

---

## Phase 3: User Story 1 - Developer Builds All Packages (Priority: P1) MVP

**Goal**: All three packages and the demo website build successfully with the upgraded Lerna

**Independent Test**: Run `npx lerna run build` and verify all 3 packages compile. Then run `cd website && npm install && npm run build` and verify the website builds.

### Implementation for User Story 1

- [x] T005 [US1] Run `npx lerna run build` and verify all 3 packages compile without errors
- [x] T006 [US1] Run `cd website && npm install && npm run build` and verify the website builds without errors
- [x] T007 [US1] Verify no Lerna deprecation warnings appear in build output

**Checkpoint**: Local builds work — the upgrade is functionally complete

---

## Phase 4: User Story 2 - CI Pipeline Runs Successfully (Priority: P1)

**Goal**: GitHub Actions CI workflow works with Lerna 9 commands (no `lerna bootstrap`)

**Independent Test**: Review the updated CI workflow for correctness; push branch to verify build job passes.

### Implementation for User Story 2

- [x] T008 [US2] Remove "Bootstrap packages" step (`npx lerna bootstrap`) from the `build` job in `.github/workflows/ci.yml`
- [x] T009 [US2] Remove "Bootstrap packages" step (`npx lerna bootstrap`) from the `publish` job in `.github/workflows/ci.yml`
- [x] T010 [US2] Verify `lerna publish from-package --yes --no-private` command is still valid for Lerna 9 in the publish job

**Checkpoint**: CI workflow is updated — push to verify build passes

---

## Phase 5: User Story 3 - Developer Installs Dependencies Locally (Priority: P2)

**Goal**: Documentation reflects the new workflow where `npm install` replaces `lerna bootstrap`

**Independent Test**: Follow the documented build commands in `CLAUDE.md` on a fresh checkout and verify they work.

### Implementation for User Story 3

- [x] T011 [US3] Update `CLAUDE.md` build commands section to document that `npm install` at root handles workspaces linking (replacing `lerna bootstrap`)

**Checkpoint**: Documentation is accurate — new developers can follow it successfully

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all stories

- [x] T012 Run full verification sequence from quickstart.md: `npm install` → `npx lerna repair` → `npx lerna run build` → `cd website && npm install && npm run build`
- [x] T013 Verify no remaining references to `lerna bootstrap` in source files (grep across repo excluding `specs/` and `node_modules/`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. T001 and T002 are parallel (different files).
- **Foundational (Phase 2)**: Depends on Setup completion. T003 depends on T001+T002. T004 depends on T003.
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Verifies local builds.
- **User Story 2 (Phase 4)**: Depends on Setup completion only (file edits). Can proceed in parallel with US1 verification.
- **User Story 3 (Phase 5)**: Depends on Setup completion only (file edits). Can proceed in parallel with US1/US2.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 (Foundational) — needs Lerna 9 installed to verify builds
- **User Story 2 (P1)**: No dependency on US1 — CI file edits are independent. But full CI verification requires US1 passing.
- **User Story 3 (P2)**: No dependency on US1/US2 — documentation edits are independent

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T008 and T009 edit the same file but different sections — execute sequentially
- T011 is independent of T008/T009 — can run in parallel with Phase 4

---

## Parallel Example: Phase 1

```bash
# Launch both config changes together:
Task: "Add workspaces and bump lerna in package.json"
Task: "Add $schema to lerna.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Config changes (T001, T002)
2. Complete Phase 2: Install & repair (T003, T004)
3. Complete Phase 3: Verify builds (T005, T006, T007)
4. **STOP and VALIDATE**: All packages and website build successfully

### Full Delivery

1. Complete Setup + Foundational → Lerna 9 operational
2. Verify builds (US1) → Local development works
3. Update CI (US2) → Pipeline works
4. Update docs (US3) → Onboarding works
5. Polish → Final grep verification

---

## Notes

- This is a configuration-only upgrade — no source code changes to any package
- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Commit after each phase for clean rollback points
- The website is NOT part of npm workspaces (it's outside `packages/*`) — its `npm install` step remains separate
