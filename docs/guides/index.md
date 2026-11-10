---
title: Guides
description: Task-focused walkthroughs that combine API calls, dashboard changes, and receiver code into one working result.
sidebar_position: 1
displayed_sidebar: guidesSidebar
---

import SectionCards, {SectionCard} from '@site/src/components/SectionCards';

# Guides

Each guide walks one job from start to a result you can check. If you need the model behind a behavior, read the [About API](/docs/api/about/authentication) pages. If you need the exact fields for a single call, use the [API reference](/docs/api/).

## Pick a guide

<SectionCards className="gridGuideLayout">

<SectionCard title="Verify signatures" description="Verify the HMAC signature on every Hookline webhook so your receiver only accepts events that Hookline sent." image="/img/cards/guide-signatures.svg" to="/docs/guides/verifying-signatures" />

<SectionCard title="Debug a failed delivery" description="Work through the usual causes of a missing or failing delivery, from DNS and TLS to a handler that returns the wrong status." image="/img/cards/guide-delivery.svg" to="/docs/guides/debug-failures" />

<SectionCard title="Rotate a signing secret" description="Replace an endpoint secret without dropping deliveries, using the two-secret window Hookline provides." image="/img/cards/guide-rotation.svg" to="/docs/guides/signature-rotation" />

<SectionCard title="Migrate from v1" description="Move an integration from the original v1 API to the current version, with the field, header, and retry changes that matter." image="/img/cards/guide-migration.svg" to="/docs/guides/migrate-from-v1" />

</SectionCards>
