---
title: Introduction
description: Hookline delivers webhooks for you, with retries, signing, and a delivery log, so your app never loses an event.
sidebar_position: 1
---

# Introduction

Hookline is a webhook delivery service. Your app sends one event to the Hookline API. Hookline delivers it to every subscribed endpoint, retries failures, and records each attempt.

## What Hookline does

- Delivers events to subscriber URLs over HTTPS.
- Retries failed deliveries with exponential backoff for up to 24 hours.
- Signs every request with HMAC so receivers can verify it.
- Keeps a searchable delivery log for 30 days.

## How it works

1. Your app sends an event to `POST /v1/events`.
2. Hookline queues the event and returns a `202` response.
3. Hookline sends the event to each subscribed endpoint.
4. The receiver acknowledges with a `2xx` status code within 10 seconds.

:::note
Test keys deliver events to the CLI listener only. Use a live key to reach real endpoints.
:::

## Next steps

- Follow the [quick start](./quick-start.md) to send your first event.
- Learn how [authentication](./authentication.md) works.
- Read the [events reference](./sending-events.md).
- Protect receivers with [signature verification](./verifying-signatures.md).
