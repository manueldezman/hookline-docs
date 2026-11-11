---
title: Deliveries
description: "A delivery is one event going to one endpoint. Hookline records each attempt for thirty days, and you can query or replay it."
sidebar_position: 4
displayed_sidebar: apiSidebar
---

# Deliveries

A delivery is one event going to one endpoint. Hookline records each attempt for thirty days, and you can query or replay it.

**Resource URL** **`https://api.hookline.example/v2/deliveries`**

## Methods

| Method | Path | Description |
| --- | --- | --- |
| [List deliveries](./list.md) | `GET /deliveries` | Returns delivery attempts, newest first. Records are readable for thirty days. |
| [Retrieve a delivery](./retrieve.md) | `GET /deliveries/{id}` | Returns one delivery, including the request body Hookline sent. It is the fastest way to compare what you expected with what arrived. |
| [Replay a delivery](./replay.md) | `POST /deliveries/{id}/replay` | Sends an existing event to an endpoint again. The event `id` and `data` stay the same, so the receiver can deduplicate. The original delivery stays in the log with its history intact. |
| [Replay a range](./replay-range.md) | `POST /deliveries/replay` | Queues every delivery in a window for one endpoint. A window of ten thousand events runs for several minutes, so poll the delivery log rather than waiting on the request. |

## The delivery object

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
| `next_retry` | string | No | When the next attempt is due. Null after Hookline finishes the delivery. |

Example.

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

## What Hookline sends

Hookline sends a JSON POST to the endpoint URL. The body is the event envelope and the headers carry the signature.

| Header | Purpose |
| --- | --- |
| `Hookline-Event` | The event type, such as `invoice.paid` |
| `Hookline-Delivery` | Unique ID for this attempt, stable across retries |
| `Hookline-Signature` | Timestamp and HMAC signature |
| `Hookline-Attempt` | Attempt number, starting at 1 |
| `Content-Type` | Always `application/json` |

```json
{
  "id": "evt_8f2a91",
  "type": "invoice.paid",
  "created": "2026-03-04T10:12:44Z",
  "data": {
    "invoiceId": "inv_1042",
    "amount": 4900,
    "currency": "USD"
  }
}
```

Hookline caps bodies at 256 KB. Read the raw body, verify the signature, then parse. A body that your framework parsed and re-serialized does not match the signature.

## What counts as success

Any `2xx` returned within five seconds acknowledges a delivery. A timeout, a connection reset, a `3xx`, and every `4xx` and `5xx` count as failures. Hookline does not follow redirects.

Hookline turns off an endpoint after it fails every attempt for seven days.

## Duplicates and ordering

Delivery is at least once. The same event can arrive twice because Hookline lost a `2xx` response on the way back and retried. Store `id` from the envelope and ignore an event you have already processed.

Order is not guaranteed. A retried event can arrive after one that followed it. Compare the `created` timestamp before acting on sequence, or fetch current state.

