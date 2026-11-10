---
title: Rate limits
description: Request limits per plan, the headers that report your remaining quota, and how to back off when you hit a 429.
sidebar_position: 8
displayed_sidebar: apiSidebar
---

# Rate limits

The API accepts a fixed number of requests per minute, set by plan.

## Limits

| Plan | Events per minute | Reads per minute |
| --- | --- | --- |
| Free | 60 | 120 |
| Team | 600 | 1,200 |
| Business | 3,000 | 6,000 |

Reads cover `GET` requests to events, deliveries, and endpoints. Writes cover everything else.

## Headers

Every response reports the current window.

| Header | Meaning |
| --- | --- |
| `X-RateLimit-Limit` | Requests allowed in this window |
| `X-RateLimit-Remaining` | Requests left |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |
| `Retry-After` | Seconds to wait, sent with `429` only |

## Handling a 429

Wait for `Retry-After`, then retry once. If the retry also fails, stop and queue the work.

```js
async function send(event) {
  const res = await fetch(url, { method: 'POST', body: JSON.stringify(event) });
  if (res.status === 429) {
    const wait = Number(res.headers.get('Retry-After') ?? 1) * 1000;
    await new Promise((r) => setTimeout(r, wait));
    return fetch(url, { method: 'POST', body: JSON.stringify(event) });
  }
  return res;
}
```

:::tip
Batch a bulk import into one event per resource rather than one request per record. The limit counts requests, not events inside a payload.
:::

## Delivery is separate

These limits apply to your calls to the API. Hookline's deliveries to your endpoint follow their own rules, described in [Delivery and retries](./delivery-and-retries.md).
