# Migration Guide: Docusaurus 2 to Docusaurus 3.9+

This guide covers upgrading from `@akurdyukov/docusaurus-protobuffet` v0.3.x (Docusaurus 2) to v1.0.0 (Docusaurus 3.9+).

## Prerequisites

- **Node.js 18+** (Node.js 20+ recommended)
- **npm 9+**

## Step 1: Update Dependencies

Update your `package.json` dependencies:

```json
{
  "dependencies": {
    "@docusaurus/core": "^3.9.2",
    "@docusaurus/preset-classic": "^3.9.2",
    "@mdx-js/react": "^3.0.0",
    "@akurdyukov/docusaurus-protobuffet": "^1.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

If you use `@easyops-cn/docusaurus-search-local`, update it to `^0.54.0`.

## Step 2: Update TypeScript Configuration (if applicable)

If your project extends the root `tsconfig.json`, update:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx"
  }
}
```

Replace `@tsconfig/docusaurus` with `@docusaurus/tsconfig@^3.9.2` if used.

## Step 3: Update Docusaurus Configuration

The `onBrokenMarkdownLinks` option has been deprecated at the top level. Move it to the `markdown.hooks` section:

**Before:**
```js
module.exports = {
  onBrokenMarkdownLinks: 'warn',
  // ...
};
```

**After:**
```js
module.exports = {
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  // ...
};
```

All other configuration options (presets, plugins, theme config) remain compatible.

## Step 4: Install and Build

```bash
rm -rf node_modules package-lock.json
npm install
npx docusaurus generate-proto-docs
npm run build
```

## Key Changes in v1.0.0

| Area | Before (v0.3.x) | After (v1.0.0) |
|------|-----------------|-----------------|
| Docusaurus | 2.0.0-alpha.72 | 3.9.2+ |
| React | 17.x | 18.x |
| MDX | v1 | v3 |
| Node.js | 14+ | 18+ |
| TypeScript | 4.x | 5.x |
| `@mdx-js/react` | ^1.6.21 | ^3.0.0 |

## MDX v3 Compatibility

The generated MDX files from `generate-proto-docs` are compatible with MDX v3 out of the box. The generated output uses uppercase JSX component names (`<ProtoMessage>`, `<ProtoEnum>`, `<ProtoServiceMethod>`) which are valid in MDX v3.

If you have **custom MDX files** that contain curly braces `{` or angle brackets `<` in prose text (not in JSX expressions), you may need to escape them. See the [Docusaurus MDX v3 migration guide](https://docusaurus.io/docs/migration/v3#mdx-v3) for details.

## Swizzled Components

If you have swizzled the `ProtoFile` theme component, note that `React.FC` no longer implicitly includes `children` in props with React 18 types. You may need to add `children?: React.ReactNode` to your component prop interfaces.

## Init CLI Changes

The `docusaurus-protobuffet-init` CLI now uses `create-docusaurus` (replacing the removed `@docusaurus/init`) to scaffold new projects. This change is transparent to users of the CLI.

## Troubleshooting

### Multiple `@types/react` versions

If you encounter TypeScript errors like `'Link' cannot be used as a JSX component` with messages about `bigint` not assignable to `ReactNode`, you likely have conflicting `@types/react` versions. Add to your root `package.json`:

```json
{
  "overrides": {
    "@types/react": "^18.2.0"
  }
}
```

Then run `npm install` again.
