---
title: Troubleshooting
description: What to do for each error code the Hookline API returns, from a malformed body to a 503.
sidebar_position: 60
displayed_sidebar: apiSidebar
---

# Troubleshooting

Every failed request returns a code and a `request_id`. Find the code below and apply the fix. If the action does not resolve it, include the `request_id` in a message to support.

| Code | What it means | Retry |
| --- | --- | --- |
| [`400`](#400-bad-request) | Malformed body or missing field | No |
| [`401`](#401-unauthorized) | Missing or invalid API key | No |
| [`403`](#403-forbidden) | Key lacks access to the resource | No |
| [`404`](#404-not-found) | Resource does not exist | No |
| [`409`](#409-conflict) | Idempotency key reused with a different body | No |
| [`413`](#413-payload-too-large) | Payload over 256 KB | No |
| [`422`](#422-unprocessable) | Field failed validation | No |
| [`429`](#429-rate-limited) | Rate limit exceeded | Yes, after `Retry-After` |
| [`500`](#500-internal-error) | Hookline error | Yes, with backoff |
| [`503`](#503-service-unavailable) | Temporarily unavailable | Yes, with backoff |

## 400 Bad request

The request never reached validation, because the body could not be parsed.

- Send `Content-Type: application/json` and a valid JSON body
- Check for a trailing comma or an unquoted value
- Confirm every required field is present in the object, not at the top level

## 401 Unauthorized

The key is missing, malformed, or revoked.

- Send the key in `Authorization: Bearer <key>`
- Confirm the key was copied whole, with no trailing whitespace
- Check which mode the key belongs to, since a test key does not work against live data
- Sign in again if the key was rotated or revoked

[Authentication](/docs/api/about/authentication) covers key modes and scopes.

## 403 Forbidden

The key is valid but cannot reach the requested resource.

- Confirm the key belongs to the account that owns the resource
- Check whether the key is scoped to reads only
- Use a key with the permission the call needs

## 404 Not found

The path or the identifier does not match a record.

- Check the path against [Resources](/docs/api/#resources)
- Confirm the identifier prefix matches the resource, for example `evt_` for events and `ep_` for endpoints
- Check whether the record was deleted, since a deleted endpoint returns `404` on later reads

## 409 Conflict

The same idempotency key arrived with a different body.

- Reuse an idempotency key only for an identical retry
- Generate a new key for a genuinely new request
- If the first request succeeded, read the result instead of sending the call again

## 413 Payload too large

The body is larger than the 256 KB limit.

- Send a reference in the payload and fetch the detail from your own system
- Split a bulk operation into one event per resource
- Compress large payloads before they reach Hookline, not inside the request

## 422 Unprocessable

The body parsed, but a field failed validation. The `message` names the field.

- Read `error.message` for the exact field and rule
- Check the field type in the resource page under [Resources](/docs/api/#resources)
- Confirm enum values match the documented ones, including case

## 429 Rate limited

The request did not run, so nothing was created. Retrying is safe after the window resets.

- Wait for the seconds in `Retry-After`, then retry once
- Stop and queue the work if the retry also returns `429`
- Avoid parallel retries, since they raise the rate at the worst moment
- Check `X-RateLimit-Remaining` on successful responses to slow down before you hit zero

Replays count as API requests, so a wide replay window is a common cause. See [Rate limits](/docs/api/about/rate-limits).

## 500 Internal error

Hookline could not complete the request. The `request_id` identifies it in Hookline logs.

- Retry with backoff, since the request may not have run
- If the call creates a resource, send the same idempotency key on the retry
- Contact support with the `request_id` if it repeats

## 503 Service unavailable

The service is temporarily unavailable, usually during maintenance.

- Wait for the seconds in `Retry-After`
- Retry with exponential backoff and a cap
- Check the status page before assuming a problem in your integration

## Related

- [Errors and status codes](/docs/api/about/api-errors) for the error object shape and retry rules
- [Debug a failed delivery](/docs/guides/debug-failures) when the failure happens after Hookline accepts the event
