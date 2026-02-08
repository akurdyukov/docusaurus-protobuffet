# Docusaurus Protobuf Plugin

#### Visit the [landing page](https://protobuffet.com/) for Protobuffet documentation.

[Docusaurus](https://docusaurus.io/) plugin for Protobuf contract documentation. Provides a set of components and MDX doc file generators for Docusaurus sites.

See [`@akurdyukov/docusaurus-protobuffet`](https://github.com/akurdyukov/docusaurus-protobuffet/tree/master/packages/docusaurus-protobuffet#usage) for details on usage.

## Compatibility

| Version | Docusaurus | React | Node.js |
|---------|-----------|-------|---------|
| 1.x     | 3.9+      | 18+   | 18+     |
| 0.x     | 2.x       | 17    | 14+     |

---

## Configuration

This plugin accepts the following options. These options are passed through [`@akurdyukov/docusaurus-protobuffet`](https://github.com/akurdyukov/docusaurus-protobuffet/tree/master/packages/docusaurus-protobuffet#configuration) preset's `protobuffet` option with some defaults applied.

| Option | Description | Required | Example |
| --- | --- | --- | --- |
| `fileDescriptorsPath` | Path to JSON file containing generated proto documentation through [protoc-gen-doc](https://github.com/pseudomuto/protoc-gen-doc). See [`docusaurus-protobuffet` usage](https://github.com/akurdyukov/docusaurus-protobuffet/tree/master/packages/docusaurus-protobuffet#generating-the-filedescriptorspath-file) for details. | ✅ | `./fixtures/proto_workspace.json` |
| `protoDocsPath` | Directory where CLI will create doc files. | ✅ | `./protodocs` |
| `sidebarPath` | Path to file where CLI will write the generated Sidebar object. | ✅ | `./sidebarsProtodocs.js` |

## Contributing

Contributions, issues and feature requests are always welcome!
