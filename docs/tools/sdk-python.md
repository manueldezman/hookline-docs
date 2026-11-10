---
title: Python SDK
description: Install the Hookline Python SDK, create events and endpoints, and verify signatures with the bundled helper.
sidebar_position: 2
displayed_sidebar: toolsSidebar
---

# Python SDK

The SDK wraps the HTTP API, retries on `429` and `5xx`, and includes a signature helper. Python 3.10 or later is required.

## Install

```bash
pip install hookline
```

## Set up

```python
import os
from hookline import Hookline

hookline = Hookline(os.environ["HOOKLINE_API_KEY"], version="2026-03-01", timeout=10.0)
```

## Events

```python
event = hookline.events.create(
    type="invoice.paid",
    payload={"invoiceId": "inv_1042", "amount": 4900},
)

same = hookline.events.retrieve(event.id)
```

Pass `idempotency_key` to make a retry safe.

```python
hookline.events.create(body, idempotency_key="inv_1042-paid")
```

## Endpoints

```python
endpoint = hookline.endpoints.create(
    url="https://example.com/webhooks",
    event_types=["invoice.paid"],
)
```

The response includes `secret`. Store it immediately, because the SDK never returns it again.

## Deliveries

```python
page = hookline.deliveries.list(status="failed", limit=50)
hookline.deliveries.replay(page.data[0].id)
```

## Verify signatures

```python
from hookline import verify_signature

ok = verify_signature(raw_body, request.headers["Hookline-Signature"], secret)
```

Pass `bytes` rather than a decoded string. The helper compares in constant time and rejects a timestamp older than five minutes.

## Errors

```python
from hookline import HooklineError

try:
    hookline.events.create(body)
except HooklineError as err:
    if err.code == "rate_limited":
        time.sleep(err.retry_after)
    else:
        raise
```

See [Errors and status codes](../api/about/api-errors.md).

## Related

- [Quick start](../getting-started/quick-start.md)
- [Create an event](../api/events/create.md)
