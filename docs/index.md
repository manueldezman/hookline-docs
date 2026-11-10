---
title: Welcome to Hookline docs
description: Hookline is a webhook delivery service for teams that need events to arrive reliably.
slug: /
sidebar_position: 0
---

import Link from '@docusaurus/Link';
import SectionCards, {SectionCard} from '@site/src/components/SectionCards';

# Welcome to Hookline docs

## What is Hookline?

Hookline is a webhook delivery service. It takes the events your product generates and delivers them to every subscribed endpoint, retries the ones that fail, signs each request, and keeps a delivery log you can search for thirty days.

Use Hookline when webhooks need to be dependable and you would rather not build queueing, retry schedules, signing, and delivery tracking yourself.

## Who is Hookline for?

Teams that send events to other systems and need to know each one arrived.

- Backend developers who emit events from an application and want delivery moved out of the request path.
- Platform teams who deliver webhooks to many customer endpoints and need per-endpoint secrets and subscriptions.
- Operations engineers who trace failed deliveries, replay them, and watch endpoint health.
- Security teams who verify signatures and rotate secrets without breaking receivers.

## I want to...

Start with the outcome that matches your goal.

<SectionCards className="gridGuideLayout">

<SectionCard title="Get started" description="Install the CLI, send your first event, and see it arrive." image="/img/cards/get-started.svg" to="/docs/getting-started/">
  <ul>
    <li><Link to="/docs/getting-started/installation">Install the CLI</Link></li>
    <li><Link to="/docs/getting-started/quick-start">Quick start</Link></li>
    <li><Link to="/docs/api/about/authentication">Authentication</Link></li>
  </ul>
</SectionCard>

<SectionCard title="Follow a guide" description="Work through the tasks that matter most to your integration." image="/img/cards/follow-a-guide.svg" to="/docs/guides">
  <ul>
    <li><Link to="/docs/guides/verifying-signatures">Verify signatures</Link></li>
    <li><Link to="/docs/guides/debug-failures">Debug a failed delivery</Link></li>
    <li><Link to="/docs/guides/signature-rotation">Rotate a signing secret</Link></li>
    <li><Link to="/docs/guides/migrate-from-v1">Migrate from v1</Link></li>
  </ul>
</SectionCard>

<SectionCard title="Look up the API" description="Search the resources, methods, and fields you need." image="/img/cards/look-up-the-api.svg" to="/docs/api/">
  <ul>
    <li><Link to="/docs/api/events/">Events</Link></li>
    <li><Link to="/docs/api/endpoints/">Endpoints</Link></li>
    <li><Link to="/docs/api/deliveries/">Deliveries</Link></li>
  </ul>
</SectionCard>

<SectionCard title="Use an SDK" description="Send events from your own code with a typed client." image="/img/cards/sdk.svg" to="/docs/tools/">
  <ul>
    <li><Link to="/docs/tools/sdk-node">Node.js SDK</Link></li>
    <li><Link to="/docs/tools/sdk-python">Python SDK</Link></li>
  </ul>
</SectionCard>

</SectionCards>
