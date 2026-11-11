---
title: Authentication
description: Authenticate Hookline API requests with bearer API keys, and learn the difference between test and live keys.
sidebar_position: 1
displayed_sidebar: apiSidebar
---

# Authentication

Every request to the Hookline API needs an API key in the `Authorization` header.

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `Authorization` | header | string | Yes | Bearer key. Send `Bearer hl_live_...` or `Bearer hl_test_...`. Each key belongs to one account. |

```text
Authorization: Bearer hl_live_9f2c4d
```

## Key types

| Prefix | Mode | Behavior |
| --- | --- | --- |
| `hl_test_` | Test | Delivers events to the CLI listener only |
| `hl_live_` | Live | Delivers events to real endpoints |

## Create and rotate keys

1. Open the dashboard and select **Settings**, then **API keys**.
2. Select **Create key** and choose a mode.
3. Copy the key. Hookline shows it once.

To rotate a key, create a new one, deploy it, and revoke the old key after the new key is active.

:::warning
Never commit API keys to source control or expose them in browser code. Store them in environment variables or a secrets manager.
:::

## Error responses

A missing or invalid key returns a `401` response:

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "The API key is missing or invalid."
  }
}
```

A valid key without access to the resource returns `403`.
