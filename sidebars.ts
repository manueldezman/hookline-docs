import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  homeSidebar: [
    {
      type: 'category',
      label: 'Getting started',
      link: {type: 'doc', id: 'getting-started/index'},
      collapsed: false,
      items: ['getting-started/installation', 'getting-started/quick-start'],
    },
  ],
  guidesSidebar: [
    {type: 'doc', id: 'guides/index'},
    {type: 'doc', id: 'guides/verifying-signatures'},
    {type: 'doc', id: 'guides/debug-failures'},
    {type: 'doc', id: 'guides/signature-rotation'},
    {type: 'doc', id: 'guides/migrate-from-v1'},
  ],
  apiSidebar: [
    {type: 'doc', id: 'api/index'},
    {
      type: 'category',
      label: 'About API',
      collapsed: false,
      items: [
        'api/about/authentication',
        'api/about/event-types',
        'api/about/delivery-and-retries',
        'api/about/api-versioning',
        'api/about/api-errors',
        'api/about/ip-addresses',
        'api/about/pagination',
        'api/about/rate-limits',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Events',
          link: {type: 'doc', id: 'api/events/index'},
          items: ['api/events/create', 'api/events/retrieve'],
        },
        {
          type: 'category',
          label: 'Endpoints',
          link: {type: 'doc', id: 'api/endpoints/index'},
          items: [
            'api/endpoints/list',
            'api/endpoints/create',
            'api/endpoints/update',
            'api/endpoints/delete',
          ],
        },
        {
          type: 'category',
          label: 'Deliveries',
          link: {type: 'doc', id: 'api/deliveries/index'},
          items: [
            'api/deliveries/list',
            'api/deliveries/retrieve',
            'api/deliveries/replay',
            'api/deliveries/replay-range',
          ],
        },
        {
          type: 'category',
          label: 'Account',
          link: {type: 'doc', id: 'api/account/index'},
          items: ['api/account/retrieve'],
        },
      ],
    },
    {type: 'doc', id: 'api/troubleshooting'},
  ],
  toolsSidebar: [
    {type: 'doc', id: 'tools/index'},
    {type: 'doc', id: 'tools/sdk-node'},
    {type: 'doc', id: 'tools/sdk-python'},
  ],
};

export default sidebars;
