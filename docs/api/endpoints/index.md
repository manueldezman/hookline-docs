---
title: Endpoints
description: "An endpoint is a URL that receives events. Each one has its own signing secret and its own list of subscribed types."
sidebar_position: 3
displayed_sidebar: apiSidebar
---

# Endpoints

An endpoint is a URL that receives events. Each one has its own signing secret and its own list of subscribed types.

Hookline checks a new URL before it accepts it. The URL must use HTTPS, resolve publicly, and answer a `HEAD` request with a `2xx`.

**Resource URL** **`https://api.hookline.example/v2/endpoints`**

## Methods

| Method | Path | Description |
| --- | --- | --- |
| [List endpoints](./list.md) | `GET /endpoints` | Returns every endpoint on the account, newest first. Hookline omits the `secret` field. |
| [Create an endpoint](./create.md) | `POST /endpoints` | Registers a URL to receive events. The response includes `secret` once. Store it before you close the connection. |
| [Update an endpoint](./update.md) | `PATCH /endpoints/{id}` | Changes the fields you send and leaves the rest alone. Changing `event_types` replaces the list rather than adding to it. |
| [Delete an endpoint](./delete.md) | `DELETE /endpoints/{id}` | Stops delivery immediately. Hookline cancels pending retries and records them as `failed`. |

## The endpoint object

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Unique ID for this endpoint. |
| `url` | string | Yes | HTTPS URL that receives deliveries. |
| `event_types` | array of string | Yes | Types this endpoint receives. A wildcard such as `invoice.*` matches one prefix. |
| `description` | string | No | Label shown in the dashboard. |
| `enabled` | boolean | Yes | Whether Hookline delivers to this endpoint. |
| `created` | string | No | When Hookline created the endpoint, in UTC. |

Example.

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

## Secrets

Hookline returns the `secret` field once, when it creates the endpoint. It never returns it again. If you lose it, start a rotation from the dashboard. Rotating keeps the old secret active until you finish, so Hookline does not reject any delivery during the switch.

