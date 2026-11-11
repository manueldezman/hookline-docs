---
title: Changelog
description: Every change to the Hookline API, the dashboard, and the delivery pipeline, newest first.
sidebar_position: 7
---

# Changelog

Newest first. Each entry says what changed and whether you need to do anything.

## 2026-10-14

- **Two-secret rotation.** Endpoints can sign with two secrets during a rotation. Start one from the dashboard and both values appear in `Hookline-Signature`. See [Rotate a signing secret](./guides/signature-rotation.md).
- **Retry timing in the log.** Every delivery reports `next_retry`, so a failed attempt shows when the next one is due.
- No action required.

## 2026-08-03

- **New event types.** `payout.returned` fires when a bank returns a payout, and `endpoint.disabled` fires before Hookline stops delivering to a failing endpoint. Subscribe through [Endpoints](./api/endpoints/index.md).
- **Wildcard subscriptions.** `invoice.*` matches every invoice type. A wildcard still matches one prefix only.

## 2026-05-19

- **Six retries over 24 hours.** The schedule grew from four attempts to six, with the last two at 6 and 24 hours. See [Delivery and retries](./api/about/delivery-and-retries.md).
- **Attempt header.** Every delivery now reports `Hookline-Attempt`, counted from 1.

## 2026-03-01

- **Version 2026-03-01.** New accounts default to this version. Pin it with the `Hookline-Version` header. See [Versioning](./api/about/api-versioning.md).
- **Python SDK 2.0.** The SDK adds idempotency keys and a signature helper. See [Python SDK](./tools/sdk-python.md).

## 2026-02-10

- **API v2.** Every resource moved from `/v1` to `/v2`, with `/v2/endpoints` replacing `/v1/hooks`. Dated versions stay the same, and `Hookline-Version` still selects one.
- **v1 sunset.** The v1 API stops accepting requests on April 1, 2027. See [Migrate from v1](./guides/migrate-from-v1.md).
- **Action required.** Update base URLs and the endpoint path before the sunset.

## 2025-11-20

- **Delivery log.** Hookline records every attempt for thirty days, and you can query it by endpoint, type, and status. See [Delivery log](./api/deliveries/index.md).

## 2025-06-02

- **Signature header rename.** `X-Hookline-Signature` became `Hookline-Signature`, and the signature now covers the timestamp as well as the body. The old header stays supported for twelve months. See [Migrate from v1](./guides/migrate-from-v1.md).
