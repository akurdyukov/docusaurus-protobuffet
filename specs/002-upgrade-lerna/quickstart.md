# Quickstart: Upgrade Lerna to v9+

## What Changes

4 files modified, 0 files created:

| File | Change |
|------|--------|
| `package.json` | Add `"workspaces": ["packages/*"]`, bump `"lerna": "^9.0.0"` |
| `lerna.json` | Add `$schema` field |
| `.github/workflows/ci.yml` | Remove `lerna bootstrap` steps (2 occurrences) |
| `CLAUDE.md` | Update build commands documentation |

## Verification

After making changes:

```bash
# Install dependencies (replaces lerna bootstrap)
npm install

# Auto-fix deprecated lerna config
npx lerna repair

# Build all packages
npx lerna run build

# Build website
cd website && npm install && npm run build
```

All commands should complete without errors or deprecation warnings.
