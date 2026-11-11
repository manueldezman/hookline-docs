---
title: Account
description: "The account object reports the API version your requests use by default."
sidebar_position: 5
displayed_sidebar: apiSidebar
---

# Account

The account object reports the API version your requests use by default.

**Resource URL** **`https://api.hookline.example/v2/account`**

## Methods

| Method | Path | Description |
| --- | --- | --- |
| [Retrieve the account](./retrieve.md) | `GET /account` | Returns the account and the API version it uses by default. If `api_version` differs from the version your code expects, send the `Hookline-Version` header explicitly. |

## The account object

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique ID for the account. |
| `api_version` | string | Yes | Dated API version used when a request omits the `Hookline-Version` header. |

Example.

```json
{
  "id": "acct_9930",
  "api_version": "2026-03-01"
}
```

