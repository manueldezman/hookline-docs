---
title: Node.js SDK
description: Install the Hookline Node.js SDK, create events and endpoints, and verify signatures with the bundled helper.
sidebar_position: 1
displayed_sidebar: toolsSidebar
---

# Node.js SDK

The SDK wraps the HTTP API, retries on `429` and `5xx`, and includes a signature helper. Node.js 20 or later is required.

## Install

```bash
npm install @hookline/sdk
```

## Set up

```js
import { Hookline } from '@hookline/sdk';

const hookline = new Hookline(process.env.HOOKLINE_API_KEY, {
  version: '2026-03-01',
  timeout: 10_000,
});
```

## Events

```js
const event = await hookline.events.create({
  type: 'invoice.paid',
  payload: { invoiceId: 'inv_1042', amount: 4900 },
});

const same = await hookline.events.retrieve(event.id);
```

Pass `idempotencyKey` to make a retry safe.

```js
await hookline.events.create(body, { idempotencyKey: 'inv_1042-paid' });
```

## Endpoints

```js
const endpoint = await hookline.endpoints.create({
  url: 'https://example.com/webhooks',
  eventTypes: ['invoice.paid'],
});
```

The response includes `secret`. Store it now, because the SDK never returns it again.

## Deliveries

```js
const page = await hookline.deliveries.list({ status: 'failed', limit: 50 });
await hookline.deliveries.replay(page.data[0].id);
```

## Verify signatures

```js
import { verifySignature } from '@hookline/sdk';

const ok = verifySignature(rawBody, req.get('Hookline-Signature'), secret);
```

The helper checks the timestamp window and compares in constant time. Passing a parsed object instead of the raw body makes it return `false`.

## Errors

```js
try {
  await hookline.events.create(body);
} catch (err) {
  if (err.code === 'rate_limited') await sleep(err.retryAfter);
  else throw err;
}
```

Every error carries `code`, `status`, and `requestId`. See [Errors and status codes](../api/about/api-errors.md).

## Related

- [Quick start](../getting-started/quick-start.md)
- [Create an event](../api/events/create.md)
