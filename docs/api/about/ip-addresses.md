---
title: Delivery IP addresses
description: The addresses Hookline delivers from, how often they change, and how to allow them through a firewall.
sidebar_position: 6
displayed_sidebar: apiSidebar
---

# Delivery IP addresses

If your endpoint sits behind a firewall or an allowlist, add the ranges Hookline delivers from.

## Ranges

| Region | Addresses |
| --- | --- |
| United States | `198.51.100.0/24`, `203.0.113.0/24` |
| Europe | `192.0.2.0/24` |

Deliveries come from the region closest to your endpoint. Add every range rather than the one you expect to see.

## Verifying the source

An allowlist is a first filter, not proof. Addresses change when infrastructure moves, and any host inside the range can send a request that looks like a delivery.

Verify the [signature](../../guides/verifying-signatures.md) on every request. That check proves Hookline sent the body and survives an address change.

## Changes

Hookline announces new ranges at least thirty days before use. An existing range stays in service for sixty days after a replacement appears, so a managed allowlist does not have to be correct on the day a range changes.

:::note
Addresses are not published per customer. Every account delivers from the same ranges in a region.
:::

## Related

- [Debug a failed delivery](../../guides/debug-failures.md)
