---
title: SDKs
description: Choose the SDK that fits your workflow and get started with Hookline quickly.
sidebar_position: 1
displayed_sidebar: toolsSidebar
---

import SectionCards, {SectionCard} from '@site/src/components/SectionCards';

# SDKs

Use an SDK when you want typed requests, retries, and signature helpers inside your own code, and use raw HTTP when you want no dependency. For the exact request and response contract use the [API reference](/docs/api/), and for delivery, signing, and retry behavior start with [Delivery and retries](/docs/api/about/delivery-and-retries).

## SDK or raw HTTP

| Choose | When |
| --- | --- |
| SDK | You are writing an application and want retries, pagination, and signature verification handled for you |
| Raw HTTP | You are scripting, working in a language without an SDK, or debugging a single request |

## Start here

<SectionCards className="gridGuideLayout">

<SectionCard title="Node.js SDK" description="Create events, manage endpoints, and verify webhook signatures in JavaScript and TypeScript, on Node.js 20 or later." image="/img/cards/sdk-node.svg" to="/docs/tools/sdk-node" />

<SectionCard title="Python SDK" description="Send events, inspect delivery records, and verify signatures in your Python service." image="/img/cards/sdk-python.svg" to="/docs/tools/sdk-python" />

</SectionCards>
