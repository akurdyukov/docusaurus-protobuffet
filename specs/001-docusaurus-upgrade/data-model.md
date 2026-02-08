# Data Model: Docusaurus 3.9+ Upgrade

**Date**: 2026-02-08
**Feature**: 001-docusaurus-upgrade

## Overview

This is a dependency upgrade feature. No new data entities are
introduced. The existing data model (FileDescriptors, Messages, Enums,
Services) is unchanged. This document captures the configuration and
dependency entities that change.

## Dependency Version Map

| Package | Current Version | Target Version | Location |
|---------|----------------|----------------|----------|
| @docusaurus/types | ^2.0.0-alpha.72 | ^3.9.2 | root, preset |
| @docusaurus/module-type-aliases | ^2.0.0-alpha.72 | ^3.9.2 | root |
| @docusaurus/utils | ^2.0.0-alpha.72 | ^3.9.2 | plugin |
| @docusaurus/core | ^2.0.0-alpha.72 | ^3.9.2 | website |
| @docusaurus/preset-classic | ^2.0.0-alpha.72 | ^3.9.2 | website |
| @docusaurus/init | ^2.0.0-alpha.72 | REMOVED | init |
| create-docusaurus | N/A | ^3.9.2 | init (via npx) |
| @tsconfig/docusaurus | ^1.0.2 | REMOVED | root |
| @docusaurus/tsconfig | N/A | ^3.9.2 | root |
| @mdx-js/react | ^1.6.21 | ^3.0.0 | website |
| react | ^17.0.1 | ^18.2.0 | website, plugin (dev) |
| react-dom | ^17.0.1 | ^18.2.0 | website |
| @types/react | ^17.0.3 | ^18.2.0 | plugin (dev) |
| @types/node | ^14.14.37 | ^20.0.0 | root |
| typescript | ^4.2.3 | ^5.2.0 | root |
| @easyops-cn/docusaurus-search-local | ^0.15.0 | ^0.40.0 | website, init template |

## Configuration Changes

### tsconfig.json (root)

| Field | Old Value | New Value |
|-------|-----------|-----------|
| target | es5 | ES2020 |
| module | commonjs | commonjs |
| lib | ["es6"] | ["ES2020", "DOM"] |
| jsx | react | react-jsx |
| types | ["node", "@docusaurus/module-type-aliases"] | ["node", "@docusaurus/module-type-aliases"] |

### Init CLI Command

| Aspect | Old | New |
|--------|-----|-----|
| Package | @docusaurus/init | create-docusaurus |
| Command | `npx @docusaurus/init@latest init --use-npm <name> classic` | `npx create-docusaurus@latest <name> classic --package-manager npm` |
| Dependency in package.json | `"@docusaurus/init": "^2.0.0-alpha.72"` | Removed (called via npx) |

## Unchanged Entities

- **FileDescriptor** — JSON structure from protoc-gen-doc (no changes)
- **Generated MDX** — Import paths and component usage unchanged
- **Sidebar Module** — CommonJS export format unchanged
- **Plugin Options** — Same three options (fileDescriptorsPath, protoDocsPath, sidebarPath)
- **Preset Options** — Same structure (protobuffet + docs sections)
