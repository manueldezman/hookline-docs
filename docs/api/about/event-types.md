---
title: Event types
description: The full catalog of Hookline event types, with the fields each payload carries and the types subscribers can filter on.
sidebar_position: 2
displayed_sidebar: apiSidebar
---

# Event types

Every event has a `type` string in `resource.action` form. Endpoints subscribe to one or more types, and Hookline delivers only the events those endpoints asked for.

## Naming

Types are lowercase and use a dot between the resource and the action. New actions on an existing resource keep the same prefix, so `invoice.refunded` sits alongside the other `invoice.*` types.

## Catalog

| Type | Fires when | Key fields in `data` |
| --- | --- | --- |
| `invoice.paid` | A customer payment settles | `invoiceId`, `amount`, `currency` |
| `invoice.failed` | A payment attempt fails | `invoiceId`, `reason`, `attempt` |
| `invoice.voided` | An invoice is cancelled before payment | `invoiceId`, `voidedBy` |
| `payout.sent` | Hookline sends a payout to a bank account | `payoutId`, `amount`, `bankAccountId` |
| `payout.returned` | A bank returns a payout | `payoutId`, `reason` |
| `customer.created` | A customer is added to the account | `customerId`, `email` |
| `customer.updated` | Customer details change | `customerId`, `changedFields` |
| `endpoint.disabled` | Hookline disables an endpoint after repeated failures | `endpointId`, `reason` |

## Wildcards

Subscribe to `invoice.*` to receive every invoice type. A wildcard matches one prefix only, so `*.paid` is not valid.

## Subscribing

Set the types when you create an endpoint, then change them later through [Endpoints](../endpoints/index.md) or the dashboard.

:::caution
An endpoint that fails for a week is disabled automatically. Hookline sends `endpoint.disabled` to the account owner before it stops delivering.
:::

## Related

- [Deliveries](../deliveries/index.md)
- [Create an event](../events/create.md)
