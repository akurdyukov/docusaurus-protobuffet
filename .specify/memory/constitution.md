<!--
  Sync Impact Report
  ==================
  Version change: N/A (initial) → 1.0.0
  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (5 principles)
    - Technical Standards
    - Development Workflow
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md — ✅ No updates needed
      (Constitution Check section is generic and will be filled per-feature)
    - .specify/templates/spec-template.md — ✅ No updates needed
      (Template is requirement-agnostic)
    - .specify/templates/tasks-template.md — ✅ No updates needed
      (Task categorization is flexible)
    - .specify/templates/checklist-template.md — ✅ No updates needed
    - .specify/templates/agent-file-template.md — ✅ No updates needed
  Follow-up TODOs: None
-->

# Docusaurus Protobuffet Constitution

## Core Principles

### I. Monorepo Cohesion

All packages (preset, plugin, init) MUST remain in a single Lerna
monorepo and share a common TypeScript configuration. Cross-package
dependencies MUST use workspace references. Changes that affect
multiple packages MUST be coordinated in a single PR to prevent
version drift.

**Rationale**: The three packages have tight coupling (preset depends
on plugin, init scaffolds projects using both). Independent repos
would introduce synchronization overhead disproportionate to the
project's scale.

### II. Generated Output Correctness

Every code path that produces MDX files, sidebar modules, or
cross-reference link maps MUST preserve round-trip correctness:
parsing a valid protoc-gen-doc JSON descriptor and generating docs
MUST produce valid, renderable Docusaurus content. Generators MUST
NOT silently drop proto entities (messages, enums, services, methods,
fields).

**Rationale**: Users rely on generated documentation to match their
proto definitions exactly. Silent data loss undermines trust and
defeats the tool's purpose.

### III. Backward Compatibility

Public APIs (preset options, plugin options, CLI commands, theme
component names) MUST NOT introduce breaking changes without a major
version bump. When adding new configuration options, defaults MUST
preserve existing behavior. Generated file formats (MDX structure,
sidebar shape) MUST remain compatible with previously generated
content within the same major version.

**Rationale**: Users integrate Protobuffet into CI pipelines and
existing Docusaurus sites. Unexpected breakage forces manual
migration work.

### IV. Docusaurus Alignment

All theme components, plugin lifecycle hooks, and preset
configurations MUST follow Docusaurus conventions and use official
Docusaurus APIs. Custom solutions MUST NOT be introduced when a
Docusaurus-native mechanism exists. The plugin MUST work with the
currently supported Docusaurus v2 API surface.

**Rationale**: Deviating from Docusaurus patterns creates maintenance
burden as Docusaurus evolves, and confuses users familiar with the
Docusaurus ecosystem.

### V. Simplicity

Prefer direct, minimal implementations over abstractions. New features
MUST solve a demonstrated user need — no speculative functionality.
Each package MUST have a clear, single responsibility: preset
(configuration), plugin (generation + rendering), init (scaffolding).
Avoid adding dependencies unless they provide substantial value that
cannot be achieved with reasonable effort using existing dependencies.

**Rationale**: This is a focused toolset, not a framework. Complexity
in documentation tooling directly impedes adoption.

## Technical Standards

- **Language**: TypeScript (strict mode), targeting ES5 with CommonJS
  modules as defined in the root tsconfig.json.
- **Build**: Each package MUST compile cleanly with `tsc`. No custom
  bundlers or build steps beyond what is currently configured.
- **Dependencies**: Docusaurus peer dependencies MUST match the
  currently supported Docusaurus version range. Runtime dependencies
  MUST be kept minimal.
- **React Components**: Theme components in `src/theme/` MUST be
  swizzle-compatible per Docusaurus conventions. Components MUST NOT
  use external CSS frameworks; styling MUST use Docusaurus theming.
- **File Descriptors**: The parser MUST accept the JSON format
  produced by `protoc-gen-doc`. Changes to supported descriptor
  fields MUST be documented.

## Development Workflow

- **Branching**: Feature branches off `master`. PRs MUST target
  `master`.
- **Building**: Run `npx lerna run build` to verify all packages
  compile before submitting changes.
- **Validation**: Since no automated test suite exists, contributors
  MUST manually verify changes against the demo website
  (`cd website && npm run start`) before submitting PRs.
- **Versioning**: Lerna manages package versions. Version bumps MUST
  follow semver. All three packages SHOULD be versioned together.
- **Commits**: Commit messages MUST be descriptive. Prefer
  conventional commit prefixes (feat, fix, docs, refactor, chore).

## Governance

This constitution defines the non-negotiable principles for the
Docusaurus Protobuffet project. All contributions, reviews, and
architectural decisions MUST comply with these principles.

- **Amendments**: Changes to this constitution require documentation
  of the rationale, an updated version number following semver
  (MAJOR for principle removals/redefinitions, MINOR for new
  principles or material expansions, PATCH for clarifications), and
  an updated Sync Impact Report.
- **Compliance Review**: PRs SHOULD be reviewed against these
  principles. The plan template's "Constitution Check" section MUST
  reference applicable principles by number (I through V).
- **Conflict Resolution**: When principles conflict, Backward
  Compatibility (III) takes precedence unless a major version bump
  is planned. Simplicity (V) breaks ties between otherwise equal
  approaches.

**Version**: 1.0.0 | **Ratified**: 2026-02-08 | **Last Amended**: 2026-02-08
