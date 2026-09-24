---
title: Verify signatures
description: Verify the HMAC signature on every Hookline webhook so your receiver only accepts events that Hookline sent.
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Verify signatures

Hookline signs every delivery. Verify the signature before you trust the request body.

## The signature header

Each request includes a `Hookline-Signature` header:

```text
Hookline-Signature: t=1700000000,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```

- `t` is the Unix timestamp when Hookline signed the request.
- `v1` is the hex-encoded HMAC-SHA256 signature.

## How the signature is computed

1. Build the signed string: the timestamp, a period, and the raw request body.
2. Compute an HMAC-SHA256 of that string with your endpoint secret. Secrets start with `whsec_`.
3. Compare the result to `v1` with a constant-time comparison.

:::warning
Use the raw request body. If your framework parses the JSON first, the re-serialized body can differ and the check fails.
:::

## Verification code

<Tabs>
<TabItem value="node" label="Node.js">

```js
import crypto from 'node:crypto';

export function verifySignature(rawBody, header, secret) {
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=')));
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${parts.t}.${rawBody}`)
    .digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v1 ?? '');
  const fresh = Math.abs(Date.now() / 1000 - Number(parts.t)) < 300;
  return fresh && a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import hashlib
import hmac
import time


def verify_signature(raw_body: bytes, header: str, secret: str) -> bool:
    parts = dict(p.split("=", 1) for p in header.split(","))
    signed = f"{parts['t']}.".encode() + raw_body
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    fresh = abs(time.time() - int(parts["t"])) < 300
    return fresh and hmac.compare_digest(expected, parts.get("v1", ""))
```

</TabItem>
</Tabs>

## Reject old requests

Both examples reject requests with a timestamp more than five minutes old. This stops replay attacks, where someone resends a captured request.
