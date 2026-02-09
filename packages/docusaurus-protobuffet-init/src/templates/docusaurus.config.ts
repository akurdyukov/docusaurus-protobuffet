import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Protobuffet',
  tagline: 'Documentation Toolset for Your Protobuf Workspace',
  url: 'https://protobuffet.com',
  baseUrl: '/',
  organizationName: 'protobuffet', // Usually your GitHub org/user name.
  projectName: 'protobuffet.github.io', // Usually your repo name.
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  favicon: 'img/favicon.ico',
  themeConfig: {
    navbar: {
      title: 'Protobuffet',
      logo: {
        alt: 'Protobuffet Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'protodocs/protobuffet/example/ad/v1/ads.proto',
          activeBasePath: 'protodocs',
          label: 'Protodocs',
          position: 'left',
        },
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docusaurus',
          position: 'left',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/akurdyukov/docusaurus-protobuffet',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Protobuffet',
          items: [
            {
              label: 'Overview',
              to: 'https://protobuffet.com/docs/what/overview',
            },
            {
              label: 'Features',
              to: 'https://protobuffet.com/docs/what/features',
            },
            {
              label: 'Motivation',
              to: 'https://protobuffet.com/docs/what/motivation',
            },
          ],
        },
        {
          title: 'Guides',
          items: [
            {
              label: 'Installation',
              to: 'https://protobuffet.com/docs/how/installation',
            },
            {
              label: 'Usage',
              to: 'https://protobuffet.com/docs/how/usage',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/akurdyukov/docusaurus-protobuffet',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Protobuffet. Built with Docusaurus.`,
    },
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
    [
      '@akurdyukov/docusaurus-protobuffet',
      {
        protobuffet: {
          fileDescriptorsPath: './fixtures/proto_workspace.json',
          protoDocsPath: './protodocs',
          sidebarPath: './sidebarsProtodocs.js',
        },
      },
    ],
  ],
  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: 'protodocs',
        docsDir: 'protodocs',
        indexBlog: false,
      },
    ],
  ],
};

export default config;
