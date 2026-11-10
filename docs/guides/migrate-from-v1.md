---
title: Migrate from v1
description: Move an integration from the original v1 API to the current version, with the field, header, and retry changes that matter.
sidebar_position: 4
displayed_sidebar: guidesSidebar
---

# Migrate from v1

This guide moves a working v1 integration to the current API without a delivery gap. You need a live v1 integration, dashboard access, and the ability to deploy your receiver.

The field, header, and naming differences are listed in the change table on [Versioning](../api/about/api-versioning.md#v1-to-current). The steps below put them in an order that keeps deliveries arriving.

## Steps

1. Make the receiver accept both envelopes. The current envelope always carries `type` and `data`, so branch on those fields and keep the v1 parse path unchanged.

2. Accept both signature headers. `X-Hookline-Signature` and `Hookline-Signature` use different signed content, so each needs its own verification path. See [Verify signatures](./verifying-signatures.md).

3. Create the endpoint on the current API and subscribe it to the same event types as the v1 hook. A v1 hook and a current endpoint are separate objects with separate secrets, so expect a second copy of every event while both exist.

4. Switch the code that creates events to the new names from the change table, one event type at a time.

5. Move endpoint management to `/v2/endpoints`.

6. Disable the v1 hook once the current endpoint has delivered every subscribed type successfully. The v2 endpoint keeps receiving events.

7. Remove the v1 branches from the receiver.

## Verify it worked

- The current endpoint's delivery log shows `2xx` for every subscribed event type.
- The v1 hook's delivery log goes quiet after step 6.
- One test event per type, sent after step 7, arrives once and verifies.
- `GET /v2/account` reports the `api_version` you expect.

## Rollback

Keep the v1 hook enabled until step 7. If the current endpoint starts failing, re-enable the v1 hook, fix the cause, and disable it again once deliveries succeed.
