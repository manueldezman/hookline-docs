---
title: Delete an endpoint
description: "Stops delivery immediately."
sidebar_label: Delete endpoint
sidebar_custom_props: {method: DELETE}
sidebar_position: 5
displayed_sidebar: apiSidebar
---

import Endpoint from '@site/src/components/Endpoint';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Delete an endpoint

<Endpoint method="DELETE" path="/endpoints/{id}" />

Stops delivery immediately. Pending retries are cancelled and recorded as `failed`.

## Path parameters

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `{id}` | path | string | Yes | The endpoint ID, such as `ep_2201`. |

## Request example

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X DELETE "https://api.hookline.example/v2/endpoints/ep_2201" \
  -H "Authorization: Bearer $HOOKLINE_API_KEY"
```

</TabItem>
<TabItem value="node-js" label="Node.js">

```js
await hookline.endpoints.delete('ep_2201');
```

</TabItem>
<TabItem value="python" label="Python">

```python
hookline.endpoints.delete("ep_2201")
```

</TabItem>
</Tabs>

## Responses

<Tabs>
<TabItem value="204" label="204 No Content">

Endpoint deleted.

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
