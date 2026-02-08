# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Docusaurus Protobuffet is a Docusaurus toolset for generating browsable API documentation from Protocol Buffer file descriptors (JSON output from `protoc-gen-doc`).

## Build Commands

This is a Lerna monorepo. There are no root-level build/test/lint scripts.

**Build all packages:**
```bash
npx lerna run build
```

**Build individual packages:**
```bash
cd packages/docusaurus-protobuffet && npm run build        # tsc
cd packages/docusaurus-protobuffet-plugin && npm run build  # tsc
cd packages/docusaurus-protobuffet-init && npm run build    # tsc + copy template fixtures
```

**Run the demo website:**
```bash
cd website && npm run start
```

**No test suite or linting is configured.** All package test scripts are placeholders.

## Architecture

Three packages plus a demo website:

### `@akurdyukov/docusaurus-protobuffet` (Preset)
Entry point for users. Configures the plugin + `@docusaurus/plugin-content-docs` with sensible defaults. Depends on the plugin package.

### `@akurdyukov/docusaurus-protobuffet-plugin` (Core Plugin)
Contains all core logic:
- **`src/index.ts`** — Docusaurus plugin export. Registers the `generate-proto-docs` CLI command, validates options, provides theme path for React components.
- **`src/parsers.ts`** — Parses the proto file descriptor JSON. Builds cross-reference link maps for messages, services, and enums, then enriches type references with navigable links.
- **`src/generators/docfile.ts`** — Generates MDX files per proto file. Each MDX imports React components from `@theme/ProtoFile` and passes serialized JSON as props.
- **`src/generators/sidebar.ts`** — Generates a sidebar JS module from file paths. Includes a compaction algorithm that collapses single-nested directories.
- **`src/theme/ProtoFile.tsx`** — React components (`ProtoMessage`, `ProtoEnum`, `ProtoService`, `ProtoServiceMethod`, `ProtoMessageFields`) that render proto documentation as HTML tables with cross-reference links.
- **`src/types.ts`** — TypeScript interfaces for FileDescriptor, Message, Service, Enum, and their nested types.

### `@akurdyukov/docusaurus-protobuffet-init` (Project Generator)
Standalone CLI (`npx @akurdyukov/docusaurus-protobuffet-init init <name>`) that scaffolds a new Docusaurus site with Protobuffet pre-configured. Runs `@docusaurus/init`, installs dependencies, copies templates from `src/templates/`, and runs initial doc generation.

### Data Flow
1. User runs `protoc-gen-doc` to produce a JSON file descriptor (e.g., `fixtures/proto_workspace.json`)
2. `generate-proto-docs` CLI command reads the JSON via `parseFileDescriptors()`
3. Parser enriches types with cross-reference links
4. `generateDocFiles()` produces MDX files in the configured `protoDocsPath`
5. `generateSidebarFileContents()` creates sidebar structure
6. Docusaurus serves the generated MDX using the theme components

## Key Configuration Options

Plugin options (set via preset or plugin directly):
- `fileDescriptorsPath` — path to the JSON file from protoc-gen-doc
- `protoDocsPath` — output directory for generated MDX files
- `sidebarPath` — path for the generated sidebar JS file

## TypeScript

Root `tsconfig.json` targets ES5 with CommonJS modules, strict mode, JSX react. Each package extends root and sets `outDir: ./dist`, `rootDir: ./src`.

## Active Technologies
- TypeScript 5.2+ (upgrading from 4.2.3) + Docusaurus 3.9.2, React 18.2+, MDX 3 (001-docusaurus-upgrade)
- N/A (file-based generation) (001-docusaurus-upgrade)

## Recent Changes
- 001-docusaurus-upgrade: Added TypeScript 5.2+ (upgrading from 4.2.3) + Docusaurus 3.9.2, React 18.2+, MDX 3
