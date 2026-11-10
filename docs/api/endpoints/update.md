---
title: Update an endpoint
description: "Changes the fields you send and leaves the rest alone."
sidebar_label: Update endpoint
sidebar_custom_props: {method: PATCH}
sidebar_position: 4
displayed_sidebar: apiSidebar
---

import Endpoint from '@site/src/components/Endpoint';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Update an endpoint

<Endpoint method="PATCH" path="/endpoints/{id}" />

Changes the fields you send and leaves the rest alone. Changing `event_types` replaces the list rather than adding to it.

## Path parameters

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `{id}` | path | string | Yes | The endpoint ID, such as `ep_2201`. |

## Request body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | No | New HTTPS URL that receives deliveries. |
| `event_types` | array of string | No | Replaces the current list rather than adding to it. |
| `description` | string | No | New label shown in the dashboard. |
| `enabled` | boolean | No | Whether Hookline delivers to this endpoint. |

Example request body.

```json
{
  "event_types": [
    "invoice.paid"
  ]
}
```

## Request example

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X PATCH "https://api.hookline.example/v2/endpoints/ep_2201" \
  -H "Authorization: Bearer $HOOKLINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"event_types":["invoice.paid"]}'
```

</TabItem>
<TabItem value="node-js" label="Node.js">

```js
await hookline.endpoints.update('ep_2201', {
  eventTypes: ['invoice.paid', 'invoice.failed'],
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
hookline.endpoints.update(
    "ep_2201",
    event_types=["invoice.paid", "invoice.failed"],
)
```

</TabItem>
</Tabs>

## Responses

<Tabs>
<TabItem value="200" label="200 OK">

The updated endpoint.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique ID for this endpoint. |
| `url` | string | Yes | HTTPS URL that receives deliveries. |
| `event_types` | array of string | Yes | Types this endpoint receives. A wildcard such as `invoice.*` matches one prefix. |
| `description` | string | No | Label shown in the dashboard. |
| `enabled` | boolean | Yes | Whether Hookline delivers to this endpoint. |
| `created` | string | No | When the endpoint was created, in UTC. |

Example response.

```json
{
  "id": "ep_2201",
  "url": "https://example.com/webhooks",
  "event_types": [
    "invoice.paid",
    "invoice.failed"
  ],
  "description": "Billing service",
  "enabled": true,
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
