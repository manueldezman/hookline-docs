---
title: Create an endpoint
description: "Registers a URL to receive events."
sidebar_label: Create endpoint
sidebar_custom_props: {method: POST}
sidebar_position: 3
displayed_sidebar: apiSidebar
---

import Endpoint from '@site/src/components/Endpoint';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create an endpoint

<Endpoint method="POST" path="/endpoints" />

Registers a URL to receive events. The response includes `secret` once. Store it before you close the connection.

## Request body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | HTTPS URL that receives deliveries. |
| `event_types` | array of string | Yes | Types to deliver, or a wildcard such as `invoice.*`. |
| `description` | string | No | Label shown in the dashboard. |
| `enabled` | boolean | No | Whether to start delivering immediately. Defaults to `true`. |

Example request body.

```json
{
  "url": "https://example.com/webhooks",
  "event_types": [
    "invoice.paid",
    "invoice.failed"
  ]
}
```

## Request example

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X POST "https://api.hookline.example/v2/endpoints" \
  -H "Authorization: Bearer $HOOKLINE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/webhooks","event_types":["invoice.paid","invoice.failed"]}'
```

</TabItem>
<TabItem value="node-js" label="Node.js">

```js
const endpoint = await hookline.endpoints.create({
  url: 'https://example.com/webhooks',
  eventTypes: ['invoice.paid'],
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
endpoint = hookline.endpoints.create(
    url="https://example.com/webhooks",
    event_types=["invoice.paid"],
)
```

</TabItem>
</Tabs>

## Responses

<Tabs>
<TabItem value="201" label="201 Created">

Endpoint created.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique ID for this endpoint. |
| `url` | string | Yes | HTTPS URL that receives deliveries. |
| `event_types` | array of string | Yes | Types this endpoint receives. A wildcard such as `invoice.*` matches one prefix. |
| `description` | string | No | Label shown in the dashboard. |
| `enabled` | boolean | Yes | Whether Hookline delivers to this endpoint. |
| `created` | string | No | When Hookline created the endpoint, in UTC. |
| `secret` | string | Yes | Signing secret. Returned once and never again. |

Example response.

```json
{
  "id": "ep_2201",
  "url": "https://example.com/webhooks",
  "event_types": [
    "invoice.paid",
    "invoice.failed"
  ],
  "secret": "whsec_9f2c",
  "enabled": true
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
