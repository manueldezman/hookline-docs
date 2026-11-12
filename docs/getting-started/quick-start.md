---
title: Quickstart
description: Send your first Hookline event in about two minutes, with curl or the Hookline CLI.
sidebar_position: 2
displayed_sidebar: homeSidebar
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

Send one event and confirm Hookline accepted it. Pick the path that matches how you want to work. Both take about two minutes.

<Tabs>
<TabItem value="curl" label="curl">

## 1. Set your test key

```bash
export HOOKLINE_API_KEY=hl_test_replace_me
```

## 2. Send an event

```bash
curl https://api.hookline.example/v2/events \
  -H "Authorization: Bearer $HOOKLINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type":"invoice.paid","payload":{"invoiceId":"inv_1042","amount":4900,"currency":"USD"}}'
```

## 3. Read the response

```text title="Output"
HTTP/2 202
content-type: application/json
x-ratelimit-limit: 60
x-ratelimit-remaining: 59
x-ratelimit-reset: 1772616780

{
  "id": "evt_8f2a91",
  "type": "invoice.paid",
  "created": "2026-03-04T10:12:44Z",
  "status": "queued",
  "data": {
    "invoiceId": "inv_1042",
    "amount": 4900,
    "currency": "USD"
  }
}
```

:::note
Test keys deliver to the CLI listener only, so the event stays on your machine. If you want to watch it arrive, use the CLI tab.
:::

</TabItem>
<TabItem value="cli" label="Hookline CLI">

The CLI lives in [Install the CLI](./installation.md). If you skipped that page, complete it first.

## 1. Start the listener

Open a terminal and leave this running.

```bash
hookline listen
```

## 2. Send an event

Open a second terminal and send the same event.

```bash
hookline events send invoice.paid \
  --payload '{"invoiceId":"inv_1042","amount":4900,"currency":"USD"}'
```

```text title="Output"
Sent evt_8f2a91 (queued)
```

## 3. Watch it arrive

Switch back to the listener terminal. The event appears with its type, ID, and payload.

```text title="Output"
$ hookline listen
Listening for test events on this machine...

invoice.paid  evt_8f2a91  queued
{
  "invoiceId": "inv_1042",
  "amount": 4900,
  "currency": "USD"
}
```

</TabItem>
</Tabs>

## Troubleshooting

### Hookline rejects the request

A `4xx` response means Hookline never created the event and queued nothing.

| Response | What it means | Fix |
| --- | --- | --- |
| `401` or `403` | The key is wrong or lacks access | Check the key in `hookline whoami` |
| `422` | The payload failed validation | Read `error.message` for the field |
| `429` | The request never ran | Wait for `Retry-After`, then retry once |

### Hookline accepts the event, but nothing arrives

A `202` means Hookline queued the event. If nothing arrives, the problem is the subscription, not the send.

- Confirm an endpoint subscribes to the event type, since no match means no delivery
- Check whether the endpoint uses a wildcard and what it expands to
- Keep the listener running before you send, because a test event needs it open

### The delivery log shows a failure

The event reached an endpoint and the endpoint failed. Read the last attempt in the log.

| Recorded value | Likely cause |
| --- | --- |
| `timeout` | The handler takes longer than five seconds |
| `dns_error` or `tls_error` | The endpoint URL is unreachable |
| `connection_refused` | Nothing is listening on the port |
| `401` or `403` from your app | Your own auth rules rejected the request |

For a full walk through the log, use [Debug a failed delivery](../guides/debug-failures.md).

## Next

- Forward events to a local server with `hookline listen --forward-to http://localhost:3000/webhooks`
- Read [Authentication](../api/about/authentication.md) before you move to live keys
- Read [Event types](../api/about/event-types.md) to name your own events
