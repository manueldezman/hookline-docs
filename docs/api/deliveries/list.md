---
title: List deliveries
description: "Returns delivery attempts, newest first."
sidebar_label: List deliveries
sidebar_custom_props: {method: GET}
sidebar_position: 2
displayed_sidebar: apiSidebar
---

import Endpoint from '@site/src/components/Endpoint';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List deliveries

<Endpoint method="GET" path="/deliveries" />

Returns delivery attempts, newest first. Records are readable for thirty days.

## Query parameters

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `limit` | query | integer | No | Records per page. Between 1 and 100. Default `20`. |
| `starting_after` | query | string | No | Cursor from the previous page. |
| `endpoint_id` | query | string | No | Only attempts for one endpoint. |
| `event_type` | query | string | No | Only attempts for one event type. |
| `status` | query | `succeeded`, `failed`, `pending` | No | Only attempts with this status. |
| `created_after` | query | string | No | Start of the window, as an ISO 8601 timestamp. |
| `created_before` | query | string | No | End of the window, as an ISO 8601 timestamp. |

## Request example

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X GET "https://api.hookline.example/v2/deliveries?limit=20" \
  -H "Authorization: Bearer $HOOKLINE_API_KEY"
```

</TabItem>
<TabItem value="node-js" label="Node.js">

```js
const page = await hookline.deliveries.list({ status: 'failed', limit: 20 });
```

</TabItem>
<TabItem value="python" label="Python">

```python
page = hookline.deliveries.list(status="failed", limit=20)
```

</TabItem>
</Tabs>

## Responses

<Tabs>
<TabItem value="200" label="200 OK">

A page of deliveries.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | array of delivery | Yes | The results for this page. |
| `data[].id` | string | Yes | Unique ID for this delivery, not the event. |
| `data[].event_id` | string | Yes | The event this delivery carries. |
| `data[].endpoint_id` | string | Yes | The endpoint Hookline sent to. |
| `data[].status` | `succeeded`, `failed`, `pending` | Yes | Current state of the delivery. |
| `data[].attempt` | integer | Yes | Attempt number, starting at 1. |
| `data[].response_status` | integer | No | Status code your endpoint returned. Null when no response arrived. |
| `data[].error` | string | No | Set when Hookline never got a response. Values include `timeout`, `dns_error`, `tls_error`, and `connection_refused`. |
| `data[].created` | string | Yes | When the attempt started, in UTC. |
| `data[].next_retry` | string | No | When the next attempt is due. Null after Hookline finishes the delivery. |
| `has_more` | boolean | Yes | Whether another page is available. |
| `next_cursor` | string | No | Value to pass as `starting_after` for the next page. Null on the last page. |

Example response.

```json
{
  "data": [
    {
      "id": "dlv_44c1",
      "event_id": "evt_8f2a91",
      "endpoint_id": "ep_2201",
      "status": "failed",
      "attempt": 5,
      "response_status": 504,
      "error": "timeout",
      "created": "2026-03-04T10:12:44Z"
    }
  ],
  "has_more": true,
  "next_cursor": "cur_19af"
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
