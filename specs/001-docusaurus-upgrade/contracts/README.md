# Contracts: Docusaurus 3.9+ Upgrade

This feature does not introduce new APIs or endpoints. The existing
contracts (plugin options, preset options, CLI commands, theme
component props) remain unchanged.

## Preserved Contracts

### Plugin Options (unchanged)

```typescript
interface PluginOptions {
  fileDescriptorsPath: string;
  protoDocsPath: string;
  sidebarPath: string;
  routeBasePath: string;
}
```

### Preset Options (unchanged)

```typescript
interface PresetOptions {
  protobuffet: {
    fileDescriptorsPath: string;
    protoDocsPath?: string;
    sidebarPath?: string;
  };
  docs?: {
    routeBasePath?: string;
    sidebarPath?: string;
  };
}
```

### CLI Command (unchanged)

```
npx docusaurus generate-proto-docs
```

### Theme Components (unchanged exports)

```typescript
// @theme/ProtoFile exports:
export const ProtoMessage: React.FC<{ message: Message }>;
export const ProtoEnum: React.FC<{ enumb: Enum }>;
export const ProtoService: React.FC<{ service: Service }>;
export const ProtoServiceMethod: React.FC<{ method: ServiceMethod }>;
export default ProtoFile;
```

### Init CLI (command unchanged, internal implementation changes)

```
npx docusaurus-protobuffet-init init <siteName>
```

Internally changes from `@docusaurus/init` to `create-docusaurus`.
