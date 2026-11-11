import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import site from './site.json';

const ORIGIN =
  process.env.SITE_ORIGIN ||
  process.env.DEPLOY_PRIME_URL ||
  `https://${site.githubUser}.github.io`;
/* GitHub Pages serves the site under /<repo>/, Netlify serves it from the
   domain root. Netlify sets SITE_BASE_URL=/ in netlify.toml. */
const BASE_URL = process.env.SITE_BASE_URL || `/${site.repo}/`;
const REPO_URL = `https://github.com/${site.githubUser}/${site.repo}`;

const config: Config = {
  title: site.title,
  tagline: site.tagline,
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: ORIGIN,
  baseUrl: BASE_URL,
  organizationName: site.githubUser,
  projectName: site.repo,

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

  headTags: [
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/svg+xml', href: `${BASE_URL}img/favicon.svg`}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', href: `${BASE_URL}img/apple-touch-icon.png`}},
    {tagName: 'link', attributes: {rel: 'manifest', href: `${BASE_URL}manifest.webmanifest`}},
  ],

  clientModules: ['./src/clientModules/searchEmptyState.js'],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        docsRouteBasePath: '/docs',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 60,
        searchBarShortcut: true,
        searchBarShortcutHint: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: `${REPO_URL}/tree/main/`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/hookline-social-card.png',
    metadata: [{name: 'description', content: site.summary}],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: `${site.name} logo`,
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'html',
          position: 'left',
          value: `<a href="${BASE_URL}docs/" class="docsHeader" aria-label="Hookline Docs">Hookline<span class="docsHeaderDivider" aria-hidden="true"></span><span class="docsHeaderDocs">Docs</span></a>`,
        },
        {
          type: 'html',
          position: 'left',
          className: 'navBreakRow',
          value: '<span class="navBreak" aria-hidden="true"></span>',
        },
        {
          to: '/docs/getting-started/',
          label: 'Getting started',
          position: 'left',
        },
        {to: '/docs/guides', label: 'Guides', position: 'left'},
        {to: '/docs/api/', label: 'API reference', position: 'left'},
        {to: '/docs/tools/', label: 'SDK', position: 'left'},
        {
          to: '/docs/changelog',
          label: 'Changelog',
          position: 'right',
          className: 'navAction navActionFirst',
        },
        {
          href: 'mailto:support@hookline.dev',
          label: 'Support',
          position: 'right',
          className: 'navAction',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} ${site.name}. A fictional product for a docs pipeline demo. Built with Docusaurus. <a class="footerGitHub" href="${REPO_URL}" aria-label="${site.name} on GitHub"><svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg></a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
