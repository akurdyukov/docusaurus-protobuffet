# Feature Specification: Proto Source Templates

**Feature Branch**: `003-proto-source-templates`
**Created**: 2026-02-09
**Status**: Draft
**Input**: User description: "Current template in docusaurus-protobuffet-init assumes that @src/templates/proto_workspace.json was created beforehand. Update docusaurus-protobuffet-init project to include only proto files, not JSON version of it"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Scaffolded project includes proto source files (Priority: P1)

A developer runs the `docusaurus-protobuffet-init` CLI to scaffold a new documentation site. Instead of receiving a pre-built JSON file descriptor, the generated project contains the original `.proto` source files in a `proto/` directory. This gives the developer a real-world example of how to organize their own proto files and generate documentation from source.

**Why this priority**: This is the core change. Without proto source files in the generated project, the developer has no example of the source-to-docs workflow and cannot regenerate or modify the sample documentation.

**Independent Test**: Run the init CLI and verify that the generated project contains `.proto` files under a `proto/` directory with the correct directory structure matching protobuf package conventions, and that no `proto_workspace.json` template file is shipped.

**Acceptance Scenarios**:

1. **Given** a developer runs the init CLI, **When** the project is created, **Then** a `proto/` directory exists in the project root containing `.proto` files organized by package path (e.g., `proto/protobuffet/example/ad/v1/ads.proto`).
2. **Given** a developer runs the init CLI, **When** the project is created, **Then** no pre-built `proto_workspace.json` is copied from the init package templates.
3. **Given** the init package is built, **When** the build output is examined, **Then** the `dist/templates/proto/` directory preserves the full subdirectory structure of the proto files.

---

### User Story 2 - Generated project can regenerate JSON descriptor from proto sources (Priority: P1)

After scaffolding, the developer has a working command to regenerate the JSON file descriptor from the shipped proto sources. The generated project includes a pre-configured npm script that invokes `protoc-gen-doc` via Docker to produce `fixtures/proto_workspace.json` from the `proto/` directory.

**Why this priority**: Without a generation script, the proto source files are inert. The developer needs a clear, runnable path from source to JSON descriptor to complete the documentation pipeline.

**Independent Test**: In a scaffolded project with Docker available, run the generation script and verify that `fixtures/proto_workspace.json` is produced and contains valid protoc-gen-doc output.

**Acceptance Scenarios**:

1. **Given** a scaffolded project, **When** the developer inspects `package.json`, **Then** a `generate-proto-json` script is present that uses Docker to run `protoc-gen-doc` against the `proto/` directory.
2. **Given** a scaffolded project with Docker running, **When** the developer runs `npm run generate-proto-json`, **Then** a valid `proto_workspace.json` file is created in the `fixtures/` directory.
3. **Given** the init CLI runs end-to-end with Docker available, **When** the process completes, **Then** the generated site has both the proto sources and a generated `proto_workspace.json`, and the Docusaurus proto docs are successfully generated.

---

### User Story 3 - Init process generates docs from proto sources during setup (Priority: P2)

During the init process, after copying proto source files and adding the generation script, the CLI automatically runs the JSON generation and then the Docusaurus doc generation, so the developer gets a fully working site out of the box (assuming Docker is available).

**Why this priority**: This provides a seamless out-of-the-box experience but depends on Docker being available, which may not always be the case.

**Independent Test**: Run the full init flow end-to-end and verify the generated site starts and shows proto documentation pages.

**Acceptance Scenarios**:

1. **Given** Docker is running, **When** the developer runs the init CLI, **Then** the JSON descriptor is generated from proto sources before Docusaurus doc generation runs.
2. **Given** Docker is not running, **When** the developer runs the init CLI, **Then** the process fails with a clear error at the JSON generation step (not silently or with a confusing error).

---

### Edge Cases

- What happens when Docker is not installed or not running? The `generate-proto-json` script will fail with a Docker error. The init process should surface this error clearly.
- What happens when the build system copies templates? The directory structure must be preserved (not flattened), so proto files end up in the correct nested paths.
- What happens if the user modifies or adds proto files after scaffolding? They can re-run `npm run generate-proto-json` to regenerate the JSON descriptor and then `npx docusaurus generate-proto-docs` to update the documentation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The init package MUST include `.proto` source files as templates instead of a pre-built `proto_workspace.json`.
- **FR-002**: The proto source files MUST be organized in a directory structure matching their protobuf package paths (e.g., `proto/protobuffet/example/ad/v1/ads.proto`).
- **FR-003**: The init package build process MUST preserve the subdirectory structure of proto template files in the build output.
- **FR-004**: The generated project MUST include a `generate-proto-json` npm script that uses Docker and `protoc-gen-doc` to produce the JSON file descriptor from proto sources.
- **FR-005**: The init CLI MUST copy the proto source directory tree into the generated project.
- **FR-006**: The init CLI MUST add the `generate-proto-json` script to the generated project's `package.json`.
- **FR-007**: The init CLI MUST run the `generate-proto-json` script during setup before running `docusaurus generate-proto-docs`.
- **FR-008**: The init package MUST NOT include or ship the pre-built `proto_workspace.json` template file.
- **FR-009**: The proto source files MUST faithfully represent the same API definitions that were previously described in the `proto_workspace.json` (9 proto files covering ads, carts, checkout, common types, currency, payment, product catalog, recommendations, and shipping domains).

### Key Entities

- **Proto source files**: The `.proto` files containing protobuf service, message, and enum definitions organized by domain and version.
- **JSON file descriptor**: The `proto_workspace.json` output produced by `protoc-gen-doc` from the proto source files, consumed by the Docusaurus plugin.
- **Generation script**: The npm script (`generate-proto-json`) that bridges proto sources to the JSON descriptor using Docker.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The init package build completes successfully and produces all 9 proto files in the correct directory structure under `dist/templates/proto/`.
- **SC-002**: A developer can scaffold a new project and run `npm run generate-proto-json` to produce a valid JSON descriptor from the shipped proto sources.
- **SC-003**: The end-to-end init flow (with Docker available) produces a working Docusaurus site with proto documentation identical in structure to the previous pre-built JSON approach.
- **SC-004**: The init package no longer ships the 67KB pre-built `proto_workspace.json` template file.

## Assumptions

- Docker is available on the developer's machine during the init process and when regenerating the JSON descriptor. This is a reasonable assumption for protobuf-based development workflows.
- The `pseudomuto/protoc-gen-doc` Docker image is publicly available and produces compatible JSON output.
- The proto source files do not import `google/protobuf/wrappers.proto` and therefore do not need it bundled; `protoc-gen-doc` includes standard Google proto definitions automatically.
- The `generate-proto-json` script uses a `$(pwd)`-based volume mount, which works on macOS and Linux. Windows users using Docker Desktop with WSL2 should also be supported.
