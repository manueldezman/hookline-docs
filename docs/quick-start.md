---
title: Quick start
description: Install the Hookline SDK, send your first event, and receive it locally with the CLI listener in about five minutes.
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick start

This guide sends one event and receives it on your machine.

## Prerequisites

- Node.js 20 or later
- A Hookline account and a test API key

## Install the SDK

<Tabs>
<TabItem value="npm" label="npm">

```bash
npm install @hookline/sdk
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```bash
pnpm add @hookline/sdk
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add @hookline/sdk
```

</TabItem>
</Tabs>

## Send your first event

Create a file named `send.mjs`:

```js
import { Hookline } from '@hookline/sdk';

const hookline = new Hookline(process.env.HOOKLINE_API_KEY);

const event = await hookline.events.create({
  type: 'invoice.paid',
  payload: { invoiceId: 'inv_1042', amount: 4900 },
});

console.log(event.id, event.status);
```

Run it with your test key:

```bash
HOOKLINE_API_KEY=hl_test_replace_me node send.mjs
```

The output is an event ID and the status `queued`.

## Receive the event locally

Start the CLI listener in a second terminal:

```bash
npx hookline listen --forward-to http://localhost:3000/webhooks
```

The listener prints each event and forwards it to your local server.

:::tip
Keep the listener running while you build. Each retry appears in the same terminal.
:::

## Next steps

Read [authentication](./authentication.md) before you move to live keys.
