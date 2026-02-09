# Quickstart: Proto Source Templates

## Prerequisites

- Node.js >= 18
- Docker (for generating JSON from proto sources)
- npm

## Build the init package

```bash
cd packages/docusaurus-protobuffet-init
npm run build
```

Verify proto files are in the build output:

```bash
ls dist/templates/proto/protobuffet/example/ad/v1/ads.proto
```

## Test the full init flow

```bash
npx ./packages/docusaurus-protobuffet-init init test-project
```

This will:
1. Create a Docusaurus project via `create-docusaurus`
2. Install `@akurdyukov/docusaurus-protobuffet` preset
3. Copy proto source files to `test-project/proto/`
4. Add `generate-proto-json` script to `test-project/package.json`
5. Run `npm run generate-proto-json` (requires Docker)
6. Run `npx docusaurus generate-proto-docs`

## Verify the generated project

```bash
cd test-project
npm run start
```

The site should show proto documentation pages for all 9 proto files.

## Regenerate proto JSON (in the generated project)

```bash
npm run generate-proto-json
npx docusaurus generate-proto-docs
```
