---
title: Events
description: "An event records something that happened. Hookline queues it and delivers it to every endpoint subscribed to its type."
sidebar_position: 2
displayed_sidebar: apiSidebar
---

# Events

An event records something that happened. Hookline queues it and delivers it to every endpoint subscribed to its type.

The account can send the event types listed on the [Event types](../about/event-types.md) page.

**Resource URL** **`https://api.hookline.example/v2/events`**

## Methods

| Method | Path | Description |
| --- | --- | --- |
| [Create an event](./create.md) | `POST /events` | Queues an event and delivers it to every endpoint subscribed to its type. |
| [Retrieve an event](./retrieve.md) | `GET /events/{id}` | Returns the event with the same fields it delivered, plus its current `status`. Use it when a receiver needs the full record after a replay. |

## The event object

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | Stable across every delivery and retry of this event. |
| `type` | string | Yes | The event type, in `resource.action` form. |
| `created` | string | Yes | When Hookline created the event, in UTC. |
| `status` | `queued`, `delivered`, `failed` | No | Current delivery state of the event. |
| `data` | object | Yes | Payload fields for this event type. The fields below show the `invoice.paid` shape. Other types carry different fields, listed on [Event types](../about/event-types.md). |
| `data.invoiceId` | string | No | The invoice this event refers to. |
| `data.amount` | integer | No | Amount in the smallest currency unit. |
| `data.currency` | string | No | ISO 4217 currency code. |

Example.

```json
{
  "id": "evt_8f2a91",
  "type": "invoice.paid",
  "created": "2026-03-04T10:12:44Z",
  "status": "queued",
  "data": {
    "invoiceId": "inv_1042",
    "amount": 4900,
    "currency": "USD"
  }
}
```

## What an event becomes

One event can produce several deliveries, one per subscribed endpoint. The event keeps its `id` across every delivery and every retry, which is what lets a receiver ignore a duplicate.

