# Feature Specification: Docusaurus 3.9+ Upgrade

**Feature Branch**: `001-docusaurus-upgrade`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "Update this project to latest Docusaurus 3.9+"

## Clarifications

### Session 2026-02-08

- Q: Should this upgrade include a migration guide documenting breaking changes for existing users? → A: Yes, include a migration guide as part of this feature scope.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Existing Users Upgrade Without Breakage (Priority: P1)

A developer currently using docusaurus-protobuffet with Docusaurus 2.x
upgrades to the new version. After updating their package dependencies,
their existing proto documentation site continues to build and render
correctly without requiring manual changes to their configuration or
generated content.

**Why this priority**: The majority of value in this upgrade is ensuring
current users can migrate smoothly. If existing sites break, the upgrade
fails its primary purpose.

**Independent Test**: Install the upgraded packages into a Docusaurus 3.9+
project using the preset with default configuration, run
`generate-proto-docs`, build the site, and verify all proto documentation
pages render correctly with cross-reference links intact.

**Acceptance Scenarios**:

1. **Given** a project using docusaurus-protobuffet preset with default
   options, **When** the user upgrades all packages to the new version and
   runs `npm run build`, **Then** the site builds successfully with no
   errors.
2. **Given** generated MDX proto documentation files from the previous
   version, **When** the user upgrades packages and rebuilds, **Then** all
   existing proto pages render with correct message tables, enum tables,
   service method tables, and cross-reference links.
3. **Given** a user's `docusaurus.config.js` using the protobuffet preset,
   **When** they upgrade, **Then** the preset configuration continues to
   work without requiring config file changes.

---

### User Story 2 - New Users Scaffold a Project (Priority: P2)

A developer new to Protobuffet runs the init CLI tool
(`npx docusaurus-protobuffet-init init <name>`) to create a fresh
Docusaurus site with proto documentation pre-configured. The scaffolded
project uses Docusaurus 3.9+ and builds successfully out of the box.

**Why this priority**: New user onboarding is critical for adoption but
secondary to not breaking existing users.

**Independent Test**: Run the init CLI, verify the generated project
installs dependencies, builds, and serves a working proto documentation
site on Docusaurus 3.9+.

**Acceptance Scenarios**:

1. **Given** a developer with Node.js installed, **When** they run
   `npx docusaurus-protobuffet-init init my-proto-docs`, **Then** a new
   Docusaurus 3.9+ project is created with protobuffet preset configured
   and a sample proto documentation page.
2. **Given** a freshly scaffolded project, **When** the user runs
   `npm run start`, **Then** the development server starts and proto
   documentation pages are browsable.

---

### User Story 3 - Demo Website Builds and Serves (Priority: P3)

A contributor clones the monorepo and runs the demo website to verify
their changes. The demo website in `website/` builds and serves on the
latest Docusaurus version.

**Why this priority**: The demo website serves as both documentation and
a validation tool for contributors, but it is internal-facing.

**Independent Test**: Run `cd website && npm run start` and verify the
site loads with all proto documentation pages functional.

**Acceptance Scenarios**:

1. **Given** the monorepo with all packages built, **When** a contributor
   runs the demo website, **Then** the website starts without errors and
   displays proto documentation pages.

---

### Edge Cases

- What happens when a user has customized (swizzled) theme components
  from the plugin? Swizzled components may need manual updates if the
  component API changed.
- What happens when a user's project still has Docusaurus 2.x peer
  dependencies alongside the upgraded plugin? Dependency conflicts MUST
  produce clear error messages rather than silent failures.
- What happens when the `protoc-gen-doc` JSON file uses older field
  formats? The parser MUST continue to accept the same JSON format
  without regressions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All three packages (preset, plugin, init) MUST be
  compatible with Docusaurus 3.9+.
- **FR-002**: The plugin MUST continue to register the
  `generate-proto-docs` CLI command and produce valid MDX output for
  Docusaurus 3.9+.
- **FR-003**: The preset MUST configure `@docusaurus/plugin-content-docs`
  using the API surface available in Docusaurus 3.9+.
- **FR-004**: All theme components (ProtoMessage, ProtoEnum, ProtoService,
  ProtoServiceMethod, ProtoMessageFields) MUST render correctly in
  Docusaurus 3.9+ with their existing behavior preserved.
- **FR-005**: The init CLI MUST scaffold projects targeting Docusaurus
  3.9+ with compatible dependencies and configuration.
- **FR-006**: Cross-reference links between proto entities (messages,
  enums, services) MUST continue to resolve correctly in the generated
  documentation.
- **FR-007**: The sidebar generation MUST produce output compatible with
  the Docusaurus 3.9+ sidebar format.
- **FR-008**: Generated MDX files MUST comply with the MDX version
  supported by Docusaurus 3.9+ (MDX 3).
- **FR-009**: All packages MUST declare correct peer dependency version
  ranges for Docusaurus 3.9+.
- **FR-010**: A migration guide MUST be included documenting all
  breaking changes, required dependency updates, configuration changes,
  and step-by-step upgrade instructions for users migrating from the
  Docusaurus 2.x version of these packages.

### Key Entities

- **FileDescriptor**: The parsed representation of a protoc-gen-doc JSON
  file. Contains messages, enums, services, and their nested types.
  Format is unchanged by this upgrade.
- **Generated MDX File**: Output file per proto source file. Must use
  MDX syntax compatible with Docusaurus 3.9+.
- **Sidebar Module**: Generated JavaScript module defining the sidebar
  structure. Must match Docusaurus 3.9+ sidebar item format.
- **Preset Configuration**: The options object passed to the Docusaurus
  preset. Must use configuration keys valid in Docusaurus 3.9+.

### Assumptions

- The proto JSON file descriptor format produced by `protoc-gen-doc` is
  unchanged and does not need modification.
- The project will drop support for Docusaurus 2.x (this is a major
  version upgrade for the packages).
- Node.js version requirements will align with Docusaurus 3.9+ minimum
  requirements (Node.js 18+).
- TypeScript configuration may need updating to target a newer ECMAScript
  version if required by Docusaurus 3.9+.
- Third-party dependencies used in the demo website (e.g.,
  `@easyops-cn/docusaurus-search-local`) will either be upgraded to
  compatible versions or replaced with alternatives.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All three packages build successfully with `npx lerna run
  build` producing zero errors.
- **SC-002**: The demo website starts and serves all proto documentation
  pages without errors or visual regressions.
- **SC-003**: A freshly scaffolded project via the init CLI builds and
  runs on the first attempt.
- **SC-004**: All existing plugin configuration options
  (`fileDescriptorsPath`, `protoDocsPath`, `sidebarPath`) continue to
  work with their documented behavior.
- **SC-005**: Generated proto documentation pages display all messages,
  enums, and services from the test fixture JSON file with working
  cross-reference links.
- **SC-006**: A migration guide is available that covers all breaking
  changes and allows an existing user to upgrade their project by
  following the documented steps without external assistance.
