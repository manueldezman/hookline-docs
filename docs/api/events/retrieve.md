---
title: Retrieve an event
description: "Returns the event with the same fields it delivered, plus its current `status`."
sidebar_label: Retrieve event
sidebar_custom_props: {method: GET}
sidebar_position: 3
displayed_sidebar: apiSidebar
---

import Endpoint from '@site/src/components/Endpoint';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Retrieve an event

<Endpoint method="GET" path="/events/{id}" />

Returns the event with the same fields it delivered, plus its current `status`. Use it when a receiver needs the full record after a replay.

## Path parameters

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `{id}` | path | string | Yes | The event ID, such as `evt_8f2a91`. |

## Request example

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X GET "https://api.hookline.example/v2/events/evt_8f2a91" \
  -H "Authorization: Bearer $HOOKLINE_API_KEY"
```

</TabItem>
<TabItem value="node-js" label="Node.js">

```js
const event = await hookline.events.retrieve('evt_8f2a91');
```

</TabItem>
<TabItem value="python" label="Python">

```python
event = hookline.events.retrieve("evt_8f2a91")
```

</TabItem>
</Tabs>

## Responses

<Tabs>
<TabItem value="200" label="200 OK">

The event.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Stable across every delivery and retry of this event. |
| `type` | string | Yes | The event type, in `resource.action` form. |
| `created` | string | Yes | When Hookline created the event, in UTC. |
| `status` | `queued`, `delivered`, `failed` | No | Current delivery state of the event. |
| `data` | object | Yes | Payload fields for this event type. The fields below show the `invoice.paid` shape. Other types carry different fields, listed on [Event types](../about/event-types.md). |
| `data.invoiceId` | string | No | The invoice this event refers to. |
| `data.amount` | integer | No | Amount in the smallest currency unit. |
| `data.currency` | string | No | ISO 4217 currency code. |

Example response.

```json
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

</TabItem>
<TabItem value="401" label="401 Unauthorized">

The API key is missing or invalid.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `error` | object | Yes | The error container. |
| `error.code` | string | Yes | Machine-readable error code. |
| `error.message` | string | Yes | Human-readable explanation. |
| `error.request_id` | string | No | Include this when you contact support. |

Example response.

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "The API key is missing or invalid.",
    "request_id": "req_5b1c"
  }
}
```

</TabItem>
<TabItem value="404" label="404 Not Found">

The resource does not exist.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `error` | object | Yes | The error container. |
| `error.code` | string | Yes | Machine-readable error code. |
| `error.message` | string | Yes | Human-readable explanation. |
| `error.request_id` | string | No | Include this when you contact support. |

Example response.

```json
{
  "error": {
    "code": "not_found",
    "message": "The resource does not exist.",
    "request_id": "req_5b1c"
  }
}
```

</TabItem>
<TabItem value="429" label="429 Too Many Requests">

This window hit the rate limit. Retry after the delay in `Retry-After`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `error` | object | Yes | The error container. |
| `error.code` | string | Yes | Machine-readable error code. |
| `error.message` | string | Yes | Human-readable explanation. |
| `error.request_id` | string | No | Include this when you contact support. |

Example response.

```json
{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests. Retry after 30 seconds.",
    "request_id": "req_7d2e"
  }
}
```

</TabItem>
</Tabs>
