---
title: Overview
description: Hookline is a webhook delivery service for teams that need events to arrive reliably.
slug: /
sidebar_position: 0
---

import SectionCards, {SectionCard} from '@site/src/components/SectionCards';

# Overview

## What is Hookline?

Hookline is a webhook delivery service. It takes the events your product generates and delivers them to every subscribed endpoint, retries the ones that fail, signs each request, and keeps a delivery log you can search for thirty days.

Use Hookline when you need dependable webhooks without building your own queue, retry schedule, signing, and delivery tracking.

## Who is Hookline for?

Teams that send events to other systems and need to confirm that each request reaches the right endpoint.

- Backend developers who emit events from an app and want delivery moved out of the request path.
- Platform teams who deliver webhooks to many customer endpoints and need per-endpoint secrets and subscriptions.
- Operations engineers who trace failed deliveries, replay them, and watch endpoint health.
- Security teams who verify signatures and rotate secrets without breaking receivers.

## Choose a path

Start with the outcome that matches your goal.

<SectionCards className="gridGuideLayout">

<SectionCard title="Get started" description="Install the CLI, send your first event, and see it arrive." image="/img/cards/get-started.svg" to="/docs/getting-started/">

- [Install the CLI](/docs/getting-started/installation)
- [Quickstart](/docs/getting-started/quick-start)
- [Authentication](/docs/api/about/authentication)

</SectionCard>

<SectionCard title="Follow a guide" description="Work through the tasks that matter most to your integration." image="/img/cards/follow-a-guide.svg" to="/docs/guides">

- [Verify signatures](/docs/guides/verifying-signatures)
- [Debug a failed delivery](/docs/guides/debug-failures)
- [Rotate a signing secret](/docs/guides/signature-rotation)
- [Migrate from v1](/docs/guides/migrate-from-v1)

</SectionCard>

<SectionCard title="Look up the API" description="Search the resources, methods, and fields you need." image="/img/cards/look-up-the-api.svg" to="/docs/api/">

- [Events](/docs/api/events/)
- [Endpoints](/docs/api/endpoints/)
- [Deliveries](/docs/api/deliveries/)

</SectionCard>

<SectionCard title="Use an SDK" description="Send events from your own code with a typed client." image="/img/cards/sdk.svg" to="/docs/tools/">

- [Node.js SDK](/docs/tools/sdk-node)
- [Python SDK](/docs/tools/sdk-python)

</SectionCard>

</SectionCards>
