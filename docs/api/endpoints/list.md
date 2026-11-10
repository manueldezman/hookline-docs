---
title: List endpoints
description: "Returns every endpoint on the account, newest first."
sidebar_label: List endpoints
sidebar_custom_props: {method: GET}
sidebar_position: 2
displayed_sidebar: apiSidebar
---

import Endpoint from '@site/src/components/Endpoint';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List endpoints

<Endpoint method="GET" path="/endpoints" />

Returns every endpoint on the account, newest first. The `secret` field is omitted.

## Query parameters

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `limit` | query | integer | No | Records per page. Between 1 and 100. Default `20`. |
| `starting_after` | query | string | No | Cursor from the previous page. |

## Request example

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X GET "https://api.hookline.example/v2/endpoints?limit=20" \
  -H "Authorization: Bearer $HOOKLINE_API_KEY"
```

</TabItem>
<TabItem value="node-js" label="Node.js">

```js
const page = await hookline.endpoints.list({ limit: 20 });
```

</TabItem>
<TabItem value="python" label="Python">

```python
page = hookline.endpoints.list(limit=20)
```

</TabItem>
</Tabs>

## Responses

<Tabs>
<TabItem value="200" label="200 OK">

A page of endpoints.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | array of endpoint | Yes | The results for this page. |
| `data[].id` | string | Yes | Unique ID for this endpoint. |
| `data[].url` | string | Yes | HTTPS URL that receives deliveries. |
| `data[].event_types` | array of string | Yes | Types this endpoint receives. A wildcard such as `invoice.*` matches one prefix. |
| `data[].description` | string | No | Label shown in the dashboard. |
| `data[].enabled` | boolean | Yes | Whether Hookline delivers to this endpoint. |
| `data[].created` | string | No | When the endpoint was created, in UTC. |
| `has_more` | boolean | Yes | Whether another page is available. |
| `next_cursor` | string | No | Value to pass as `starting_after` for the next page. Null on the last page. |

Example response.

```json
{
  "data": [
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
