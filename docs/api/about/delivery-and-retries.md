---
title: Delivery and retries
description: How Hookline delivers events, what counts as a failure, and why the same event can arrive more than once.
sidebar_position: 3
displayed_sidebar: apiSidebar
---

# Delivery and retries

Hookline delivers at least once. That sentence explains most of the behavior on this page.

## What delivery means

An endpoint acknowledges a delivery by returning any `2xx` status code within five seconds. Anything else counts as a failure. That includes a timeout, a connection reset, a TLS error, a `3xx`, and every `4xx` and `5xx`.

Hookline does not follow redirects. A `301` is recorded as a failure.

## Signing

Every delivery carries a `Hookline-Signature` header that covers the request body.

```text
Hookline-Signature: t=1700000000,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

`t` is the Unix timestamp for the moment Hookline signed. `v1` is the hex-encoded HMAC-SHA256 of the timestamp, a period, and the raw request body, keyed with the endpoint secret. A receiver computes the same digest and compares it with a constant-time function.

Signing the timestamp is what makes replay rejection possible. Reject a request whose `t` is more than five minutes from your clock, because a captured delivery could otherwise be resent indefinitely.

During a rotation window the header carries two `v1` values and either one is valid. [Rotate a signing secret](../../guides/signature-rotation.md) covers the procedure, and [Verify signatures](../../guides/verifying-signatures.md) covers the check itself.

## Retry schedule

| Attempt | Delay after the previous attempt |
| --- | --- |
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 10 minutes |
| 4 | 1 hour |
| 5 | 6 hours |
| 6 | 24 hours |

After the final attempt the delivery is marked `failed` and stays in the [delivery log](../deliveries/index.md) until you replay it or the log expires.

## Duplicates

A delivery can arrive twice with neither attempt at fault. Your endpoint may return `200`, and the response may be lost before it reaches Hookline. Hookline retries, and your endpoint receives the same event again.

Store `id` from the envelope and ignore an event you have already processed. That is the only reliable defense. Deduplicating on the `data` fields fails as soon as two real events carry identical values.

## Ordering

Hookline does not guarantee order. A retried `invoice.failed` can arrive after the `invoice.paid` that followed it. If your handler depends on sequence, compare the `created` timestamp before acting, or fetch current state instead of trusting the event alone.

## Disabling

An endpoint that fails every attempt for seven days is disabled. Hookline sends `endpoint.disabled` to the account owner first.

## Replay

A replay sends an existing event to an endpoint again. The event `id` and `data` stay the same, so your receiver can deduplicate the second copy.

Replay after you fix the cause of a failure. Find the delivery in the [delivery log](../deliveries/index.md) and note its delivery ID rather than the event ID, because one event can go to several endpoints. [Replay a delivery](../deliveries/replay.md) covers a single record. [Replay a range](../deliveries/replay-range.md) covers a window for one endpoint, and a large window runs for several minutes.

A replay does not refresh the payload. The receiver gets the data as it stood when the event was created, so a replayed event can describe state that has since changed. It also does not re-enable a disabled endpoint. Follow [Debug a failed delivery](../../guides/debug-failures.md) to fix the cause and enable the endpoint before you replay the window.

## Related

- [Delivery log](../deliveries/index.md)
- [Debug a failed delivery](../../guides/debug-failures.md)
- [Verify signatures](../../guides/verifying-signatures.md)
