---
title: Debug a failed delivery
description: Work through the usual causes of a missing or failing delivery, from DNS and TLS to a handler that returns the wrong status.
sidebar_position: 2
displayed_sidebar: guidesSidebar
---

# Debug a failed delivery

This guide takes a delivery that failed or never arrived and gets it delivering again. You need dashboard access and the URL of the endpoint involved.

Start from the delivery log, which records the status your endpoint returned or the error that stopped Hookline reaching it.

## Steps

1. Open the event in the dashboard and look at its deliveries.

   If the event has no delivery record at all, it had no endpoint to go to. Check that the endpoint subscribes to that event type in [Event types](../api/about/event-types.md), confirm its `event_types` list matches, then replay the event.

2. Read the failure on the last attempt. [Errors and status codes](../api/about/api-errors.md#delivery-log-errors) lists what each recorded value means.

3. Fix the cause with the branch that matches the record.

   - `timeout` means no response within five seconds. Return a `2xx` before starting slow work.
   - `dns_error` means the hostname did not resolve. Correct the hostname or its DNS records.
   - `tls_error` means the certificate is invalid or expired. Renew it.
   - `connection_refused` means nothing is listening on the port. Start the service and confirm the port.
   - `401` or `403` means your app rejected the request. Check its auth rules ahead of the handler.
   - `404` means the path does not match a route. Compare the endpoint URL with your routes.
   - `500` means the handler raised. Read your app logs.

4. If every attempt reports a connection error, something blocks the request before it reaches the handler. Check the firewall and the [delivery IP addresses](../api/about/ip-addresses.md).

5. If the log shows `2xx` but your app rejects the request, the signature check is the usual cause. See [Troubleshooting](./verifying-signatures.md#troubleshooting).

6. If seven days of constant failure turned off the endpoint, re-enable it in the dashboard before you replay the delivery.

7. Replay the failed deliveries from the log. [Replay a delivery](../api/deliveries/replay.md) covers one record and [Replay a range](../api/deliveries/replay-range.md) covers a window for one endpoint.

## Troubleshooting

### Requests return 429

The request did not run, so Hookline created nothing and queued nothing. Retrying is safe after the window resets.

- Wait for the seconds in `Retry-After`, then retry once
- Queue the work instead of looping if the retry also returns `429`
- Avoid parallel retries, since a burst of clients raises the request rate exactly when the window is full
- Read `X-RateLimit-Remaining` on successful responses to slow down before you hit zero

Replays count as API requests. A wide replay window is the usual reason a quiet integration starts returning `429`. [Rate limits](../api/about/rate-limits.md) has the per-plan quotas.

### The endpoint turned off

Seven days of constant failure turns off an endpoint. The dashboard shows the date and the last error it recorded.

- Fix the cause first, since turning it back on without a fix turns it off again
- Turn the endpoint back on in the dashboard
- Replay the window after you turn it back on, because a replay does not turn it back on

### Every attempt fails with a connection error

Something blocks the request before it reaches the handler. Check the firewall rules against the [delivery IP addresses](../api/about/ip-addresses.md), then confirm the hostname still resolves.

### The log shows 2xx, but the app did not handle it

The signature check rejected the request after Hookline recorded a success. [Troubleshooting](./verifying-signatures.md#troubleshooting) covers the causes.

## Verify it worked

- The next attempt for the event shows `2xx` or `delivered`.
- Replayed records finish as `delivered` rather than `failed`.
- No new failures appear across one retry cycle, which is 24 hours.

## Rollback

If the fix makes things worse, revert the receiver deploy and replay again once the cause is clear. A replay keeps the original payload, so it stays safe to repeat.
