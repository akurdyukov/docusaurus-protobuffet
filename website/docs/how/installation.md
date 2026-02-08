---
title: Installation
slug: /how/installation
---

This section assumes installing [`@akurdyukov/docusaurus-protobuffet`](https://github.com/akurdyukov/docusaurus-protobuffet/tree/master/packages/docusaurus-protobuffet) in an existing Docusaurus project. For those without an existing project, you can **use [`@akurdyukov/docusaurus-protobuffet-init`](/docs/how/usage#akurdyukovdocusaurus-protobuffet-init) to scaffold a Docusaurus project with this preset** installed.

:::tip
These commands should be run at the root of your Docusaurus project directory.
:::

Install this preset.

```sh
npm install --save @akurdyukov/docusaurus-protobuffet
```

Generate a JSON representation of your Protobuf files. This depends on the [`protoc-gen-doc`](https://github.com/pseudomuto/protoc-gen-doc) compiler plugin. Find details and installation steps in the [usage section](/docs/how/usage#generating-the-filedescriptorspath-file).

```sh
protoc --doc_out=./fixtures --doc_opt=json,proto_workspace.json protos/**/*.proto
```

Add the preset to your project's `docusaurus.config.js` file. View the [configuration section](/docs/how/usage#configuration) for all available options.

```js
// file: docusaurus.config.js
module.exports = {
  // ...
  presets: [
    [
      '@akurdyukov/docusaurus-protobuffet',
      {
        protobuffet: {
          fileDescriptorsPath: './fixtures/proto_workspace.json'
        }
      }
    ]
  ],
  // ...
}
```

Invoke the CLI command [`generate-proto-docs`](/docs/how/usage#generate-proto-docs) to generate your MDX doc files.

```sh
npx docusaurus generate-proto-docs
```

Update your `docusaurus.config.js` to link to your new documentation from the navbar. You will need to configure one of the generated doc files as the route. A homepage will be introduced to replace this in the future.

```js
// file: docusaurus.config.js
module.exports = {
  themeConfig: {
    navbar: {
      items: [
        // ...
        {
          to: 'protodocs/Booking.proto',
          activeBasePath: 'protodocs',
          label: 'Protodocs',
          position: 'left',
        }
        // ...
      ]
    }
  }
}
```

Boot up your Docusaurus server to view the new Protobuf documentation space.

```sh
npm run start
```
