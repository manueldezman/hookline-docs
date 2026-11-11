---
title: Errors and status codes
description: Every status code the Hookline API returns, the error object shape, and which failures you can retry safely.
sidebar_position: 5
displayed_sidebar: apiSidebar
---

# Errors and status codes

A failed request returns a JSON error object and a status code that tells you what to do next.

## Error object

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "The API key is missing or invalid.",
    "request_id": "req_5b1c"
  }
}
```

Include `request_id` when you contact support. It identifies the request in Hookline logs.

## Status codes

| Code | Meaning | Retry |
| --- | --- | --- |
| `400` | Malformed body or missing field | No |
| `401` | Missing or invalid API key | No |
| `403` | Key lacks access to the resource | No |
| `404` | Resource does not exist | No |
| `409` | Idempotency key reused with a different body | No |
| `413` | Payload over 256 KB | No |
| `422` | Validation failed, see `message` | No |
| `429` | Rate limit exceeded | Yes, after the delay in `Retry-After` |
| `500` | Hookline error | Yes, with backoff |
| `503` | Temporarily unavailable | Yes, with backoff |

## Common codes

| Code | Fix |
| --- | --- |
| `invalid_api_key` | Check the `Authorization` header |
| `unknown_event_type` | Send a type from [Event types](./event-types.md) |
| `endpoint_unreachable` | The URL failed DNS or TLS checks |
| `duplicate_idempotency_key` | Reuse the original body, or send a new key |

## Delivery log errors

The delivery log records the failure that stopped an attempt. These values are separate from the status codes that precede them because they describe the trip to your endpoint rather than the response to a Hookline request.

| Value | Meaning |
| --- | --- |
| `timeout` | No response within five seconds |
| `dns_error` | The hostname did not resolve |
| `tls_error` | The certificate is invalid or expired |
| `connection_refused` | Nothing is listening on the port |
| `401`, `403` | Your endpoint rejected the request |
| `404` | The path does not match a route on your endpoint |
| `500` | Your handler raised an error |

[Debug a failed delivery](../../guides/debug-failures.md) works through each one in order.

## Retrying

Retry `429`, `500`, and `503` with exponential backoff. Do not retry anything else in the `4xx` range, because the same request fails the same way.

Read `Retry-After` when it is present. [Rate limits](./rate-limits.md) explains how the window resets.
