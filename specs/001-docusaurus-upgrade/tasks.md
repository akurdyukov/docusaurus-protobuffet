# Tasks: Docusaurus 3.9+ Upgrade

**Input**: Design documents from `/specs/001-docusaurus-upgrade/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No test tasks included — no test suite exists and none was requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Update root-level configuration and shared dependencies that all packages depend on.

- [x] T001 Update root TypeScript configuration: change `target` from `es5` to `ES2020`, `jsx` from `react` to `react-jsx`, `lib` from `["es6"]` to `["ES2020", "DOM"]` in `tsconfig.json`
- [x] T002 Update root dependencies in `package.json`: change `@docusaurus/types` to `^3.9.2`, `@docusaurus/module-type-aliases` to `^3.9.2`, `@types/node` to `^20.0.0`, `typescript` to `^5.2.0`, replace `@tsconfig/docusaurus` with `@docusaurus/tsconfig` at `^3.9.2`
- [x] T003 Run `npm install` at root to update lock file and verify dependency resolution

**Checkpoint**: Root configuration updated. Package-level upgrades can now begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update all package.json files across the three packages so they reference Docusaurus 3.9.2 dependencies. MUST complete before any source code changes.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 [P] Update `packages/docusaurus-protobuffet/package.json`: change `@docusaurus/types` devDependency to `^3.9.2`, bump package version to `1.0.0`
- [x] T005 [P] Update `packages/docusaurus-protobuffet-plugin/package.json`: change `@docusaurus/utils` to `^3.9.2`, `react` devDependency to `^18.2.0`, `@types/react` devDependency to `^18.2.0`, bump package version to `1.0.0`
- [x] T006 [P] Update `packages/docusaurus-protobuffet-init/package.json`: remove `@docusaurus/init` from dependencies, bump package version to `1.0.0`
- [x] T007 Run `npx lerna bootstrap` or `npm install` in each package to verify dependency resolution across all three packages

**Checkpoint**: All package dependencies updated. Source code and template changes can now proceed.

---

## Phase 3: User Story 1 - Existing Users Upgrade Without Breakage (Priority: P1)

**Goal**: Ensure the preset, plugin, and theme components work correctly with Docusaurus 3.9.2. Existing users who upgrade their dependencies can build and render proto docs without config changes.

**Independent Test**: Build all three packages with `npx lerna run build`, then verify the demo website renders proto docs correctly.

### Implementation for User Story 1

- [x] T008 [P] [US1] Verify and fix `validateOptions` type signature in `packages/docusaurus-protobuffet-plugin/src/index.ts` — update `validate` parameter type from `() => void` to match v3 Joi-based signature (or use a generic type that is compatible). Do NOT change function body logic.
- [x] T009 [P] [US1] Verify `LoadContext` import compatibility in `packages/docusaurus-protobuffet/src/index.ts` — confirm the preset function signature compiles against `@docusaurus/types` v3.9.2 without changes. Fix only if TypeScript errors occur.
- [x] T010 [P] [US1] Verify React 18 and `@docusaurus/Link` compatibility in `packages/docusaurus-protobuffet-plugin/src/theme/ProtoFile.tsx` — confirm the component compiles and the `Link` import resolves. The existing `import React from 'react'` is still valid and should remain since `React.CSSProperties` and `React.FC` types require it.
- [x] T011 [US1] Run `npx lerna run build` to compile all three packages and verify zero TypeScript errors
- [x] T012 [US1] Verify generated MDX compatibility by inspecting output of `packages/docusaurus-protobuffet-plugin/src/generators/docfile.ts` — confirm the generated `import { ProtoMessage, ProtoServiceMethod, ProtoEnum } from '@theme/ProtoFile'` path and JSX component syntax are valid MDX v3. No code changes expected.
- [x] T013 [US1] Verify sidebar generation compatibility by inspecting output of `packages/docusaurus-protobuffet-plugin/src/generators/sidebar.ts` — confirm the `module.exports = {...}` CommonJS format and `type: 'category'` / `type: 'doc'` sidebar items are valid for Docusaurus 3.9.2. No code changes expected.

**Checkpoint**: All three packages compile. Plugin, preset, and theme components are Docusaurus 3.9.2 compatible. Generated output formats are verified.

---

## Phase 4: User Story 2 - New Users Scaffold a Project (Priority: P2)

**Goal**: The init CLI creates a working Docusaurus 3.9+ project with Protobuffet pre-configured.

**Independent Test**: Run `npx docusaurus-protobuffet-init init test-project`, then `cd test-project && npm run start` and verify proto docs render.

### Implementation for User Story 2

- [x] T014 [US2] Update scaffolding command in `packages/docusaurus-protobuffet-init/src/index.ts`: replace `npx @docusaurus/init@latest init --use-npm ${siteName} ${DEFAULT_TEMPLATE}` with `npx create-docusaurus@latest ${siteName} ${DEFAULT_TEMPLATE} --package-manager npm`
- [x] T015 [US2] Update the template config file `packages/docusaurus-protobuffet-init/src/templates/docusaurus.config.js` — verify it works with Docusaurus 3.9.2. Update `@easyops-cn/docusaurus-search-local` config if needed for v3 compatibility, or remove the search plugin from the template if no v3-compatible version is available.
- [x] T016 [US2] Verify the landing page template `packages/docusaurus-protobuffet-init/src/templates/landing_page.js` — confirm `@docusaurus/useDocusaurusContext`, `@docusaurus/useBaseUrl`, `@docusaurus/Link`, and `@theme/Layout` imports work with Docusaurus 3.9.2. Fix the `const {siteConfig = {}} = context` pattern if v3 changed the hook return shape.
- [x] T017 [US2] Update the `npm install` command in `packages/docusaurus-protobuffet-init/src/index.ts` — ensure `docusaurus-protobuffet` and `@easyops-cn/docusaurus-search-local` are installed at v3-compatible versions. If search plugin is removed from template, remove it from the install command too.
- [x] T018 [US2] Build the init package with `cd packages/docusaurus-protobuffet-init && npm run build` and verify it compiles and copies templates successfully

**Checkpoint**: Init CLI scaffolds a Docusaurus 3.9+ project that builds and serves proto docs.

---

## Phase 5: User Story 3 - Demo Website Builds and Serves (Priority: P3)

**Goal**: The demo website in `website/` builds and runs on Docusaurus 3.9.2.

**Independent Test**: Run `cd website && npm run start` and verify all proto documentation pages load.

### Implementation for User Story 3

- [x] T019 [US3] Update `website/package.json`: change `@docusaurus/core` to `^3.9.2`, `@docusaurus/preset-classic` to `^3.9.2`, `@mdx-js/react` to `^3.0.0`, `react` to `^18.2.0`, `react-dom` to `^18.2.0`, `@easyops-cn/docusaurus-search-local` to `^0.40.0`, update `docusaurus-protobuffet` to `1.0.0`
- [x] T020 [US3] Verify `website/docusaurus.config.js` compatibility with Docusaurus 3.9.2 — confirm the `module.exports` CJS format, `require.resolve()` calls, preset configuration, and `gtag` plugin config are all valid. Fix any deprecated options.
- [x] T021 [US3] Verify `website/babel.config.js` — confirm `@docusaurus/core/lib/babel/preset` path exists in v3.9.2. If the path changed, update to the correct preset path.
- [x] T022 [US3] Verify `website/src/pages/index.js` — confirm `useDocusaurusContext`, `useBaseUrl`, `Link`, and `Layout` imports work with v3.9.2. Fix if needed.
- [x] T023 [US3] Run `cd website && npm install` to resolve all dependencies
- [x] T024 [US3] Run `cd website && npx docusaurus generate-proto-docs` to regenerate proto docs and verify the CLI command still works
- [x] T025 [US3] Run `cd website && npm run build` to verify a full production build succeeds with no MDX compilation errors

**Checkpoint**: Demo website builds and serves all proto documentation pages on Docusaurus 3.9.2.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Migration guide and final validation across all user stories.

- [x] T026 Write migration guide at `MIGRATION.md` in repository root documenting: required dependency version changes, TypeScript configuration changes (ES2020 target, react-jsx), Node.js 18+ requirement, React 18 requirement, MDX 3 compatibility notes, step-by-step upgrade instructions, and any known issues with swizzled components
- [x] T027 Run full build validation: `npx lerna run build` followed by `cd website && npm run build` to verify everything works end-to-end
- [x] T028 Review all package.json files to ensure `engines.node` field specifies `>=18.0.0` where appropriate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion. Can run in parallel with US1 but benefits from US1 completing first (confirms plugin/preset work).
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion. Benefits from US1 completing first (packages must compile).
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Independently testable but init installs packages from US1, so US1 should complete first
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Website uses local packages from US1, so US1 should complete first

### Within Each User Story

- Verify/fix tasks marked [P] can run in parallel
- Build verification tasks must follow all code changes
- US1 T008-T010 are independent verifications that can run in parallel
- US2 T014-T017 are sequential (init flow depends on earlier changes)
- US3 T019-T022 config changes can partially overlap, but T023-T025 are sequential

### Parallel Opportunities

- T004, T005, T006 (Phase 2 package.json updates) — all different files
- T008, T009, T010 (US1 verifications) — all different source files
- T026, T028 (Polish) — independent documentation tasks

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (root config)
2. Complete Phase 2: Foundational (package.json updates)
3. Complete Phase 3: User Story 1 (plugin/preset/theme verification)
4. **STOP and VALIDATE**: `npx lerna run build` succeeds with zero errors
5. Packages are ready for users to consume

### Incremental Delivery

1. Complete Setup + Foundational → Root and package configs updated
2. Complete User Story 1 → Packages compile and generate correct output (MVP!)
3. Complete User Story 2 → Init CLI scaffolds v3 projects
4. Complete User Story 3 → Demo website runs on v3
5. Complete Polish → Migration guide published, full validation done

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks included — project has no test suite
- Verification tasks (T012, T013) are code review tasks, not code change tasks
- The upgrade is primarily dependency/config changes with minimal source code modifications
- Commit after each phase or logical group
- Stop at any checkpoint to validate independently
