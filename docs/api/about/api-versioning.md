---
title: Versioning
description: How Hookline versions the API, how to pin a version, and what happens when a version is deprecated.
sidebar_position: 4
displayed_sidebar: apiSidebar
---

# Versioning

The path carries the major version, such as `/v2/events`. The `Hookline-Version` header carries a dated version that controls smaller changes.

## Pinning

```text
Hookline-Version: 2026-03-01
```

Every account has a default version, set when the account was created. Send the header on each request to pin a specific one. A request without the header uses the account default.

## What a version changes

A new dated version ships when a change alters behavior your code can observe. That covers new required fields, changed defaults, and renamed response properties.

These changes never need a version.

- Adding an optional request field.
- Adding a response field.
- Adding an event type.
- Fixing a bug that returned the wrong status code.

## v1 to current

| Area | v1 | Current |
| --- | --- | --- |
| Envelope | `{ event, payload }` | `{ id, type, created, data }` |
| Signature header | `X-Hookline-Signature` | `Hookline-Signature` |
| Timestamp | Not included | Included as `t` in the header |
| Endpoints | `/v1/hooks` | `/v2/endpoints` |
| Retry limit | 24 hours, 4 attempts | 24 hours, 6 attempts |
| Event names | `invoice_paid` | `invoice.paid` |

A v1 hook and a current endpoint are separate objects with separate secrets, so both exist side by side until the old one is removed. [Migrate from v1](../../guides/migrate-from-v1.md) covers the order of work.

## Deprecation

Versions stay supported for at least twelve months after a successor ships. Hookline sends a `deprecation` header on responses during the final ninety days.

```text
Deprecation: true
Sunset: Wed, 01 Apr 2027 00:00:00 GMT
```

## Checking your version

Call `GET /v2/account` and read `api_version`. If it differs from the version your code expects, set the header explicitly before you change anything else. See [Retrieve the account](../account/retrieve.md).

## Related

- [Changelog](../../changelog.md)
- [Migrate from v1](../../guides/migrate-from-v1.md)
- [Errors and status codes](./api-errors.md)
