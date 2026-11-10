---
title: Get started
description: Install the Hookline CLI, send your first event, and confirm it arrives on your machine.
sidebar_position: 1
displayed_sidebar: homeSidebar
---

import SectionCards, {SectionCard} from '@site/src/components/SectionCards';

# Get started

Hookline delivers webhooks with retries, signing, and a delivery log. You can send a working event in about two minutes, then check the delivery log to confirm it arrived.

## Core use cases

- **Ship webhooks without building the pipeline.** Emit events from your application and let Hookline queue, sign, deliver, and track them, so webhooks never sit in your request path.
- **Reach every subscribed endpoint at once.** Publish one event and Hookline fans it out to every endpoint that subscribes to that type, each with its own secret and filters.
- **Trust what arrives at your receiver.** Check the signature before acting on a payload, so only requests Hookline signed can change state in your system.
- **Recover from failures without losing data.** See the exact status code or error for every attempt, retry on a fixed schedule, and replay the failed window once you fix the cause.

## Start with the Basics

<SectionCards>

<SectionCard title="Install the CLI" description="Install Hookline on macOS, Linux, or Windows, then sign in with a test key." image="/img/cards/install-cli.svg" to="/docs/getting-started/installation" />

<SectionCard title="Quickstart" description="Send one event and confirm it was accepted, with curl or the CLI. About two minutes, no code." image="/img/cards/quickstart.svg" to="/docs/getting-started/quick-start" />

</SectionCards>
