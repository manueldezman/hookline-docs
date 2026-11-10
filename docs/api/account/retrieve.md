---
title: Retrieve the account
description: "Returns the account and the API version it uses by default."
sidebar_label: Retrieve account
sidebar_custom_props: {method: GET}
sidebar_position: 2
displayed_sidebar: apiSidebar
---

import Endpoint from '@site/src/components/Endpoint';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Retrieve the account

<Endpoint method="GET" path="/account" />

Returns the account and the API version it uses by default. If `api_version` differs from the version your code expects, send the `Hookline-Version` header explicitly.

## Request example

<Tabs>
<TabItem value="curl" label="curl">

```bash
curl -X GET "https://api.hookline.example/v2/account" \
  -H "Authorization: Bearer $HOOKLINE_API_KEY"
```

</TabItem>
<TabItem value="node-js" label="Node.js">

```js
const account = await hookline.account.retrieve();
```

</TabItem>
<TabItem value="python" label="Python">

```python
account = hookline.account.retrieve()
```

</TabItem>
</Tabs>

## Responses

<Tabs>
<TabItem value="200" label="200 OK">

The account.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique ID for the account. |
| `api_version` | string | Yes | Dated API version used when a request omits the `Hookline-Version` header. |

Example response.

```json
{
  "id": "acct_9930",
  "api_version": "2026-03-01"
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
