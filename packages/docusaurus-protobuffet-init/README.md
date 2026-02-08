# Docusaurus Project Generator with Protobuffet Preset

#### Visit the [landing page](https://protobuffet.com/) for Protobuffet documentation.

Executable project generator based on [`create-docusaurus`](https://docusaurus.io/docs/installation). This generator enhances the common template by also initializing the [`@akurdyukov/docusaurus-protobuffet`](https://github.com/akurdyukov/docusaurus-protobuffet/tree/master/packages/docusaurus-protobuffet) preset with recommended options and sample fixtures.

See [`@akurdyukov/docusaurus-protobuffet`](https://github.com/akurdyukov/docusaurus-protobuffet/tree/master/packages/docusaurus-protobuffet#usage) for details on this preset.

See [Docusaurus docs](https://docusaurus.io/docs/installation#scaffold-project-website) for details on the common template.

## Compatibility

| Version | Docusaurus | React | Node.js |
|---------|-----------|-------|---------|
| 1.x     | 3.9+      | 18+   | 18+     |
| 0.x     | 2.x       | 17    | 14+     |

## Usage

This package scaffolds a new Docusaurus project with the `@akurdyukov/docusaurus-protobuffet` preset pre-configured. If you already have an existing Docusaurus project, use [`@akurdyukov/docusaurus-protobuffet`](https://github.com/akurdyukov/docusaurus-protobuffet/tree/master/packages/docusaurus-protobuffet#installation) directly instead.

**Requirements:** Node.js 18+, npm 9+

### Quick Start

Run the generator from the parent directory where you want the project created:

```sh
npx @akurdyukov/docusaurus-protobuffet-init init <project_name>
```

This will:
1. Scaffold a Docusaurus project using `create-docusaurus` with the classic template
2. Install `@akurdyukov/docusaurus-protobuffet` and `@easyops-cn/docusaurus-search-local`
3. Copy Protobuffet config, sample fixtures, and landing page templates
4. Run `generate-proto-docs` to generate documentation from the sample fixtures

Once complete, start the development server:

```sh
cd <project_name>
npm run start
```

### Regenerating Proto Docs

Whenever you update the `fileDescriptorsPath` file (defaults to `./fixtures/proto_workspace.json`), regenerate the documentation:

```sh
npx docusaurus generate-proto-docs
```

See the [`@akurdyukov/docusaurus-protobuffet` CLI documentation](https://github.com/akurdyukov/docusaurus-protobuffet/tree/master/packages/docusaurus-protobuffet#cli-commands) for details.

### Deployment

This is a standard Docusaurus project. Follow the [Docusaurus deployment docs](https://docusaurus.io/docs/deployment) for production builds and hosting.

## Configuration
The default setup configures `fileDescriptorsPath` to `./fixtures/proto_workspace.json`. You can override this with your own Protobuf workspace file or update the options passed to `@akurdyukov/docusaurus-protobuffet` within your `docusaurus.config.js` file. Please see [`@akurdyukov/docusaurus-protobuffet` documentation](https://github.com/akurdyukov/docusaurus-protobuffet/tree/master/packages/docusaurus-protobuffet#configuration) for details.

The navbar configuration within `docusaurus.config.js` points to one of the generated files of the sample fixture. You will need to update this route when using your own Protobuf workspace file.

## Contributing

Contributions, issues and feature requests are always welcome!
