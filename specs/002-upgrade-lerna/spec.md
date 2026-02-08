# Feature Specification: Upgrade Lerna to v9+

**Feature Branch**: `002-upgrade-lerna`
**Created**: 2026-02-09
**Status**: Draft
**Input**: User description: "Upgrade lerna to latest 9+ version"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Builds All Packages (Priority: P1)

As a developer working on the monorepo, I want the build system to function correctly after the Lerna upgrade so that I can continue building all packages without disruption.

**Why this priority**: If the build breaks, no other development work can proceed. This is the foundational capability of the monorepo tooling.

**Independent Test**: Run the full package build from a clean checkout and verify all three packages compile successfully.

**Acceptance Scenarios**:

1. **Given** a clean checkout of the repository, **When** the developer installs dependencies and runs the build command, **Then** all three packages (`@akurdyukov/docusaurus-protobuffet`, `@akurdyukov/docusaurus-protobuffet-plugin`, `@akurdyukov/docusaurus-protobuffet-init`) compile without errors.
2. **Given** a clean checkout of the repository, **When** the developer installs dependencies and builds the website, **Then** the demo website builds successfully with no errors or new warnings.

---

### User Story 2 - CI Pipeline Runs Successfully (Priority: P1)

As a maintainer, I want the GitHub Actions CI workflow to work with the upgraded Lerna version so that automated builds and publishing continue to function.

**Why this priority**: CI is the gatekeeper for code quality and the publishing pipeline. If CI breaks, no releases can be made.

**Independent Test**: Push a branch and verify the CI build job passes; merge to master and verify the publish job executes correctly.

**Acceptance Scenarios**:

1. **Given** a push to any branch, **When** the CI build job runs, **Then** all build steps complete successfully with the updated Lerna commands.
2. **Given** a push to the master branch, **When** the CI publish job runs, **Then** packages are published to the GitHub npm registry without errors.

---

### User Story 3 - Developer Installs Dependencies Locally (Priority: P2)

As a developer cloning the repo for the first time, I want to install dependencies and link local packages with a single standard workflow so that I can start development quickly.

**Why this priority**: Developer onboarding experience matters but is secondary to core build and CI functionality.

**Independent Test**: Clone the repo, run the dependency installation commands documented in the project, and verify all packages resolve each other correctly.

**Acceptance Scenarios**:

1. **Given** a freshly cloned repository, **When** the developer runs the dependency installation commands documented in the project, **Then** all root and package-level dependencies are installed and local packages are symlinked correctly.
2. **Given** installed dependencies, **When** the developer builds a package that depends on another local package (e.g., the preset depends on the plugin), **Then** the dependency resolves to the local symlinked version.

---

### Edge Cases

- What happens when a developer has an old version of Lerna cached globally? The upgrade should not conflict with globally installed Lerna since it is invoked via `npx` from the project's local `node_modules`.
- What happens if `lerna bootstrap` is no longer available in Lerna 9+? The CI and build documentation must be updated to use the replacement command (e.g., `npm install` with workspaces).
- What happens if `lerna publish from-package` behavior changes? The CI publish step must be verified against the new Lerna version's CLI interface.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST use Lerna version 9 or later as the monorepo management tool.
- **FR-002**: All existing build workflows (building all packages, building individual packages) MUST continue to work after the upgrade.
- **FR-003**: The CI workflow MUST use Lerna commands compatible with version 9+ for building and publishing.
- **FR-004**: Local package linking (cross-package dependencies within the monorepo) MUST work correctly after the upgrade.
- **FR-005**: The publish workflow MUST continue to publish scoped packages to the GitHub npm registry on master branch pushes.
- **FR-006**: Project documentation (CLAUDE.md, README files) MUST reflect any command changes resulting from the upgrade.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All three packages build successfully from a clean checkout using the upgraded Lerna commands.
- **SC-002**: The demo website builds successfully after packages are built and linked.
- **SC-003**: The CI build job passes on all configured Node.js versions (20, 22, 24).
- **SC-004**: The CI publish job completes without errors when triggered on the master branch.
- **SC-005**: No Lerna deprecation warnings appear during standard build or publish operations.

## Assumptions

- Lerna 9+ uses npm workspaces for local package linking instead of the deprecated `lerna bootstrap` command.
- The `lerna publish from-package` command is still available in Lerna 9+ (or has a direct equivalent).
- The `lerna run build` command is still available in Lerna 9+ for running scripts across packages.
- The `lerna.json` configuration format is compatible or has a documented migration path.
- The root `package.json` may need a `workspaces` field added if Lerna 9+ delegates linking to npm workspaces.
