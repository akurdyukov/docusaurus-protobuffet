# Research: Docusaurus 3.9+ Upgrade

**Date**: 2026-02-08
**Feature**: 001-docusaurus-upgrade

## R1: Docusaurus 2→3 Breaking Changes

**Decision**: Upgrade all @docusaurus/* packages to 3.9.2 (latest stable).

**Rationale**: Docusaurus 3.9.2 is the current stable release with the
most mature v3 API. Jumping directly from 2.0.0-alpha.72 to 3.9.2
skips all intermediate alpha/beta/RC churn.

**Key Breaking Changes Identified**:

1. **MDX v1 → v3**: `{`, `<`, `:` in markdown context are now parsed
   as JSX/JS expressions. Generated MDX must ensure proto descriptions
   containing these characters don't break compilation. Docusaurus v3
   includes `mdx1Compat` flags enabled by default that mitigate some
   issues.

2. **React 17 → 18**: Automatic JSX runtime (`react-jsx` instead of
   `react`). `import React from 'react'` becomes optional but is
   still valid.

3. **@docusaurus/init removed**: Package does not exist for v3.
   Replaced by `create-docusaurus`.

4. **TypeScript 4 → 5+**: Minimum TS 5.1 required. `@tsconfig/docusaurus`
   replaced by `@docusaurus/tsconfig`.

5. **Node.js 14 → 18+**: Minimum Node.js 18.0 (recommended 20+).

6. **@mdx-js/react v1 → v3**: Website dependency must update.

**Alternatives Considered**:
- Upgrade to Docusaurus 3.0 (rejected: 3.9 is stable with more fixes)
- Maintain dual v2/v3 compatibility (rejected: adds complexity, v2 is
  alpha and unmaintained)

## R2: Plugin API Compatibility

**Decision**: The existing plugin API usage is compatible with v3 with
minor type adjustments.

**Rationale**: Research confirms that `Plugin`, `LoadContext`,
`extendCli()`, and `getThemePath()` all exist in @docusaurus/types v3
with the same signatures. The `validateOptions` function works but its
type annotation for the `validate` parameter is incorrect (declares
`() => void` but v3 expects Joi-based signature). Since the code never
calls `validate()`, this is a type-only fix.

**Alternatives Considered**:
- Rewrite plugin using new v3-specific APIs (rejected: unnecessary,
  existing APIs are stable)

## R3: MDX Generation Safety

**Decision**: Generated MDX is safe without changes. Proto descriptions
embedded in markdown context may need escaping in a future hardening
pass, but the current generation pattern (JSX components with JSON
props) is valid MDX v3.

**Rationale**: The generated MDX uses uppercase component names
(`<ProtoMessage>`, `<ProtoEnum>`, `<ProtoServiceMethod>`) which are
valid JSX in MDX v3. JSON props inside `{}` are valid JS expressions.
The only risk is `${fileDescriptor.description}` being interpolated
into raw markdown — if a proto description contains `{`, `<`, or `:`
it could break. This is a pre-existing limitation and not introduced
by the upgrade. The `mdx1Compat` flags mitigate most issues.

**Alternatives Considered**:
- Escape all descriptions (rejected for now: would change generated
  output, deferred to a separate hardening feature)
- Switch to MDX v1 compat mode explicitly (rejected: compat flags are
  already on by default)

## R4: Init Package Rewrite

**Decision**: Replace `@docusaurus/init` with `create-docusaurus` in
the init package.

**Rationale**: `@docusaurus/init` was never published beyond
2.0.0-beta.6 and does not exist for v3. The replacement command is
`npx create-docusaurus@latest <name> <template> --package-manager npm`.
The `--use-npm` flag changed to `--package-manager npm`.

**Alternatives Considered**:
- Remove the init package entirely (rejected: it provides user value
  for bootstrapping)
- Call `create-docusaurus` as a library (rejected: it's designed as a
  CLI tool, shell exec is simpler and more reliable)

## R5: Third-Party Dependencies

**Decision**: Evaluate `@easyops-cn/docusaurus-search-local` for v3
compatibility. If no compatible version exists, remove from the init
template and make optional in the demo website.

**Rationale**: This package is a community plugin. Version 0.40+ supports
Docusaurus v3. The init template and website config reference it.

**Alternatives Considered**:
- Replace with Algolia (rejected: requires external service, adds
  complexity)
- Remove search entirely (rejected: degrades user experience)

## R6: TypeScript Configuration

**Decision**: Update root tsconfig.json to target ES2020, use
`react-jsx` for JSX, and replace `@tsconfig/docusaurus` with
`@docusaurus/tsconfig`.

**Rationale**: Docusaurus 3.9 requires TypeScript 5.1+ and targets
modern Node.js (18+). ES5 target is unnecessary and limits available
JS features. The `react-jsx` transform is required for React 18's
automatic runtime.

**Alternatives Considered**:
- Extend `@docusaurus/tsconfig` directly (rejected: the root tsconfig
  is shared across packages with different concerns; keeping manual
  config with updated values is clearer)

## R7: Lerna Version

**Decision**: Keep Lerna 4 for now. Upgrade is orthogonal to the
Docusaurus migration.

**Rationale**: Lerna 4 works for running builds across packages. A
Lerna upgrade (to v7+/Nx-managed) is a separate concern and should
not be bundled with the Docusaurus upgrade to reduce risk.

**Alternatives Considered**:
- Upgrade Lerna to v7 (rejected: separate concern, increases scope)
- Switch to npm workspaces (rejected: separate concern)

## R8: Babel Configuration

**Decision**: The `babel.config.js` path
`@docusaurus/core/lib/babel/preset` should be verified against v3.
If it changed, update accordingly.

**Rationale**: Docusaurus v3 still ships a Babel preset but the
internal path may have changed. The website's `babel.config.js`
references this path directly.

**Alternatives Considered**:
- Remove babel.config.js (rejected: Docusaurus may still require it)
