# Quickstart: Verifying the Docusaurus 3.9+ Upgrade

**Date**: 2026-02-08
**Feature**: 001-docusaurus-upgrade

## Prerequisites

- Node.js >= 18.0 (recommended 20+)
- npm

## Step 1: Build All Packages

```bash
npx lerna run build
```

All three packages must compile without errors.

## Step 2: Verify Demo Website

```bash
cd website
npm install
npm run start
```

Verify:
- Site starts without errors
- Proto documentation pages render at `/protodocs/`
- Message tables, enum tables, and service method tables display correctly
- Cross-reference links between proto entities navigate correctly
- Search works (if search plugin is installed)

## Step 3: Test Doc Generation

```bash
cd website
npx docusaurus generate-proto-docs
npm run build
```

Verify:
- MDX files are generated in `website/protodocs/`
- Sidebar file is generated
- Full site build succeeds with no MDX compilation errors

## Step 4: Test Init CLI

```bash
npx docusaurus-protobuffet-init init test-project
cd test-project
npm run start
```

Verify:
- Project scaffolds successfully on Docusaurus 3.9+
- Development server starts
- Sample proto documentation page renders

## Step 5: Verify Migration Guide

Read the migration guide document and confirm it covers:
- Dependency update instructions
- Configuration changes (if any)
- Breaking changes
- Step-by-step upgrade procedure
