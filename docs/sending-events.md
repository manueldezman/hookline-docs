---
title: Send events
description: Send events with the Hookline API, including request fields, idempotency keys, and the retry schedule for failed deliveries.
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Send events

Create an event with `POST /v1/events`. Hookline queues the event and delivers it to every endpoint subscribed to its type.

## Request fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | string | Yes | Event name, such as `invoice.paid` |
| `payload` | object | Yes | JSON body that receivers get |
| `idempotency_key` | string | No | Prevents duplicate events on retries |

## Example request

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X POST https://api.hookline.example/v1/events \
  -H "Authorization: Bearer $HOOKLINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type":"invoice.paid","payload":{"invoiceId":"inv_1042"}}'
```

</TabItem>
<TabItem value="node" label="Node.js">

```js
const event = await hookline.events.create({
  type: 'invoice.paid',
  payload: { invoiceId: 'inv_1042' },
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
event = hookline.events.create(
    type="invoice.paid",
    payload={"invoiceId": "inv_1042"},
)
```

</TabItem>
</Tabs>

## Response

A successful request returns `202 Accepted`:

```json
{
  "id": "evt_8f2a91",
  "status": "queued"
}
```

## Idempotency

Send the same `idempotency_key` twice and Hookline creates one event. Keys expire after 24 hours.

## Retry schedule

If an endpoint doesn't return a `2xx` status code, Hookline retries the delivery.

| Attempt | Delay after previous attempt |
| --- | --- |
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 10 minutes |
| 4 | 1 hour |
| 5 | 6 hours |

After the last attempt, Hookline marks the delivery as `failed`. You can replay failed events from the dashboard.
