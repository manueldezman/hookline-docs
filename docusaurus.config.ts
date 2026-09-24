import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import site from './site.json';

// This file runs in Node.js. Don't use browser APIs or JSX here.

// Values derived from site.json so the build and the scripts always agree.
const ORIGIN = `https://${site.githubUser}.github.io`;
const BASE_URL = `/${site.repo}/`;
const REPO_URL = `https://github.com/${site.githubUser}/${site.repo}`;

const config: Config = {
  title: site.title,
  tagline: site.tagline,
  favicon: 'img/favicon.ico',

  future: {
    v4: true, // Opt in to Docusaurus v4 behavior early.
  },

  // Where the site is served. GitHub Pages project sites live under /<repo>/.
  url: ORIGIN,
  baseUrl: BASE_URL,
  organizationName: site.githubUser,
  projectName: site.repo,

  // Fail the build instead of shipping dead links.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Extra <head> tags: SVG favicon, iOS icon, web app manifest.
  headTags: [
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/svg+xml', href: `${BASE_URL}img/favicon.svg`}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', href: `${BASE_URL}img/apple-touch-icon.png`}},
    {tagName: 'link', attributes: {rel: 'manifest', href: `${BASE_URL}manifest.webmanifest`}},
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs', // Docs live at /docs. The agent scripts assume this.
          editUrl: `${REPO_URL}/tree/main/`,
        },
        blog: false, // Hookline has no blog.
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/hookline-social-card.png', // Shown when a page link is shared.
    metadata: [{name: 'description', content: site.summary}],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: site.name,
      logo: {
        alt: `${site.name} logo`,
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs'},
        {href: REPO_URL, label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Quick start', to: '/docs/quick-start'},
            {label: 'Send events', to: '/docs/sending-events'},
          ],
        },
        {
          title: 'For AI agents',
          items: [
            {label: 'llms.txt', href: `${ORIGIN}${BASE_URL}llms.txt`},
            {label: 'llms-full.txt', href: `${ORIGIN}${BASE_URL}llms-full.txt`},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ${site.name}. A fictional product for a docs pipeline demo. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
