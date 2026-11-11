---
title: Install the CLI
description: Install the Hookline CLI on macOS, Linux, or Windows, sign in with a test key, and confirm the binary runs.
sidebar_position: 1
displayed_sidebar: homeSidebar
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Install the Hookline CLI

The CLI sends events, listens for deliveries, and replays failures from your terminal. Install it before the quick start.

This page covers installation only. You do not need an SDK, and you do not need to write code.

## Install

<Tabs>
<TabItem value="maclinux" label="macOS and Linux">

```bash
curl -fsSL https://hookline.example/install.sh | sh
```

</TabItem>
<TabItem value="brew" label="Homebrew">

```bash
brew install hookline/tap/hookline
```

</TabItem>
<TabItem value="npm" label="npm">

```bash
npm install -g @hookline/cli
```

You need Node.js 20 or later for this option.

</TabItem>
<TabItem value="windows" label="Windows">

```powershell
irm https://hookline.example/install.ps1 | iex
```

</TabItem>
</Tabs>

## Confirm the install

```bash
hookline --version
```

```text title="Output"
hookline/2.4.0
```

If the shell reports that the command is not found, open a new terminal so it picks up the updated `PATH`.

## Authenticate

Sign in through the browser.

```bash
hookline login
```

The browser opens. You approve the CLI, and the terminal reports the account it stored.

```text title="Output"
Signed in to acme-labs as owner
```

Confirm which key the CLI uses.

```bash
hookline whoami
```

```text title="Output"
Account  acme-labs
Key      hl_test_9f2c4d
Mode     test
```

Test keys start with `hl_test_` and deliver to the CLI listener only. [Authentication](/docs/api/about/authentication) explains the difference between test and live keys.

## Troubleshooting

### The command is not found

The binary installed but the shell has not picked up the new path.

- Open a new terminal, then run `hookline --version`
- Confirm the install directory is on `PATH`
- On npm installs, confirm the global prefix is on `PATH` with `npm bin -g`

### Sign-in fails or the browser never opens

`hookline login` needs a browser and a loopback port. On a remote host, neither is available.

- Run `hookline login --no-browser` and paste the code it prints
- Confirm the machine can reach `hookline.example` over HTTPS
- Create a key in the dashboard and export `HOOKLINE_API_KEY` if the browser flow stays blocked

### The CLI uses the wrong account or key

Each shell session can hold its own key, and an exported key wins over the one stored by `login`.

- Run `hookline whoami` to see the account, key, and mode in use
- Unset `HOOKLINE_API_KEY` to fall back to the stored login
- Run `hookline logout` then `hookline login` to switch accounts cleanly

### The CLI reports an unsupported version

A CLI older than the API version cannot sign or replay correctly.

- Run `hookline --version` and compare it with the [changelog](/docs/changelog)
- Upgrade with the same method you installed with
- Pin the API version with `HOOKLINE_API_VERSION` if your team is not ready to move yet

## Next

[Quick start](/docs/getting-started/quick-start) sends an event and receives it in the same terminal, in about two minutes.
