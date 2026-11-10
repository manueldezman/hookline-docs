---
title: Retrieve a delivery
description: "Returns one delivery, including the request body Hookline sent."
sidebar_label: Retrieve delivery
sidebar_custom_props: {method: GET}
sidebar_position: 3
displayed_sidebar: apiSidebar
---

import Endpoint from '@site/src/components/Endpoint';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Retrieve a delivery

<Endpoint method="GET" path="/deliveries/{id}" />

Returns one delivery, including the request body Hookline sent. It is the fastest way to compare what you expected with what arrived.

## Path parameters

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `{id}` | path | string | Yes | The delivery ID, such as `dlv_44c1`. |

## Request example

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X GET "https://api.hookline.example/v2/deliveries/dlv_44c1" \
  -H "Authorization: Bearer $HOOKLINE_API_KEY"
```

</TabItem>
<TabItem value="node-js" label="Node.js">

```js
const delivery = await hookline.deliveries.retrieve('dlv_44c1');
```

</TabItem>
<TabItem value="python" label="Python">

```python
delivery = hookline.deliveries.retrieve("dlv_44c1")
```

</TabItem>
</Tabs>

## Responses

<Tabs>
<TabItem value="200" label="200 OK">

The delivery.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique ID for this delivery, not the event. |
| `event_id` | string | Yes | The event this delivery carries. |
| `endpoint_id` | string | Yes | The endpoint Hookline sent to. |
| `status` | `succeeded`, `failed`, `pending` | Yes | Current state of the delivery. |
| `attempt` | integer | Yes | Attempt number, starting at 1. |
| `response_status` | integer | No | Status code your endpoint returned. Null when no response arrived. |
| `error` | string | No | Set when Hookline never got a response. Values include `timeout`, `dns_error`, `tls_error`, and `connection_refused`. |
| `created` | string | Yes | When the attempt started, in UTC. |
| `next_retry` | string | No | When the next attempt is due. Null once the delivery is finished. |

Example response.

```json
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

The rate limit for this window is exhausted. Retry after the delay in `Retry-After`.

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
