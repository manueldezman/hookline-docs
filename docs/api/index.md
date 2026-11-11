---
title: API reference
description: Every Hookline API resource, its object schema, and the methods you can call.
sidebar_position: 50
displayed_sidebar: apiSidebar
---

import TopicCards from '@site/src/components/TopicCards';

# API reference

The Hookline API creates events and manages the endpoints that receive them.

Every call rests on the same building blocks.

<TopicCards topics={[{title: 'Authentication', to: '/docs/api/about/authentication', image: '/img/cards/concept-authentication.svg'}, {title: 'Event types', to: '/docs/api/about/event-types', image: '/img/cards/concept-event-types.svg'}, {title: 'Delivery and retries', to: '/docs/api/about/delivery-and-retries', image: '/img/cards/concept-delivery-and-retries.svg'}, {title: 'Versioning', to: '/docs/api/about/api-versioning', image: '/img/cards/concept-api-versioning.svg'}, {title: 'Errors and status codes', to: '/docs/api/about/api-errors', image: '/img/cards/concept-api-errors.svg'}, {title: 'Delivery IP addresses', to: '/docs/api/about/ip-addresses', image: '/img/cards/concept-ip-addresses.svg'}, {title: 'Pagination', to: '/docs/api/about/pagination', image: '/img/cards/concept-pagination.svg'}, {title: 'Rate limits', to: '/docs/api/about/rate-limits', image: '/img/cards/concept-rate-limits.svg'}]} />

## Resources

| Resource | Methods | What it covers |
| --- | --- | --- |
| [Events](./events/index.md) | 2 | An event records something that happened. Hookline queues it and delivers it to every endpoint subscribed to its type. |
| [Endpoints](./endpoints/index.md) | 4 | An endpoint is a URL that receives events. Each one has its own signing secret and its own list of subscribed types. |
| [Deliveries](./deliveries/index.md) | 4 | A delivery is one event going to one endpoint. Hookline records each attempt for thirty days, and you can query or replay it. |
| [Account](./account/index.md) | 1 | The account object reports the API version your requests use by default. |


The base URL is `https://api.hookline.example/v2`. Every request needs a bearer key in the `Authorization` header, issued in the dashboard and scoped to one account, which [Authentication](./about/authentication.md) covers. The path carries the major version, and the `Hookline-Version` header pins a dated one, which [Versioning](./about/api-versioning.md) covers. If you have not sent an event yet, start with the [quick start](../getting-started/quick-start.md).
