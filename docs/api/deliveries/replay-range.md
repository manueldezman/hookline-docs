---
title: Replay a range
description: "Queues every delivery in a window for one endpoint."
sidebar_label: Replay range
sidebar_custom_props: {method: POST}
sidebar_position: 5
displayed_sidebar: apiSidebar
---

import Endpoint from '@site/src/components/Endpoint';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Replay a range

<Endpoint method="POST" path="/deliveries/replay" />

Queues every delivery in a window for one endpoint. A window of ten thousand events runs for several minutes, so poll the delivery log rather than waiting on the request.

A replay does not refresh the payload. The receiver sees the data from the moment Hookline created the event.

## Request body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `endpoint_id` | string | Yes | The endpoint to resend to. |
| `created_after` | string | Yes | Start of the window. |
| `created_before` | string | No | End of the window. |
| `status` | `succeeded`, `failed`, `pending` | No | Only replay deliveries with this status. |

Example request body.

```json
{
  "endpoint_id": "ep_2201",
  "created_after": "2026-03-01T00:00:00Z"
}
```

## Request example

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X POST "https://api.hookline.example/v2/deliveries/replay" \
  -H "Authorization: Bearer $HOOKLINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"endpoint_id":"ep_2201","created_after":"2026-03-01T00:00:00Z"}'
```

</TabItem>
<TabItem value="node-js" label="Node.js">

```js
const result = await hookline.deliveries.replayRange({
  endpointId: 'ep_2201',
  createdAfter: '2026-03-01T00:00:00Z',
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
result = hookline.deliveries.replay_range(
    endpoint_id="ep_2201",
    created_after="2026-03-01T00:00:00Z",
)
```

</TabItem>
</Tabs>

## Responses

<Tabs>
<TabItem value="202" label="202 Accepted">

Hookline queued the window.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `queued` | integer | No | Deliveries added to the queue. |

Example response.

```json
{
  "queued": 1284
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
