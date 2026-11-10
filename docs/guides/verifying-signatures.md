---
title: Verify signatures
description: Verify the HMAC signature on every Hookline webhook so your receiver only accepts events that Hookline sent.
sidebar_position: 1
displayed_sidebar: guidesSidebar
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Verify signatures

This guide adds signature verification to a receiver that already accepts Hookline deliveries. You need the endpoint secret from the dashboard, which starts with `whsec_`.

The check hashes the timestamp, a period, and the raw request body with that secret, then compares the result with the `v1` value in the header. [Delivery and retries](../api/about/delivery-and-retries.md#signing) explains why the timestamp is covered and why the comparison must be constant time.

## Steps

1. Store the endpoint secret in the environment, not in source control.

   ```bash
   HOOKLINE_SECRET=whsec_...
   ```

2. Read the raw request body before any JSON parser touches it. The bytes you hash must be the bytes Hookline sent.

3. Add the check from the tab that matches your runtime.

<Tabs>
<TabItem value="node" label="Node.js">

```js
import crypto from 'node:crypto';

export function verifySignature(rawBody, header, secret) {
  const pairs = header.split(',').map((p) => p.split('='));
  const t = pairs.find(([key]) => key === 't')?.[1];
  const signatures = pairs.filter(([key]) => key === 'v1').map(([, value]) => value);
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${t}.${rawBody}`)
    .digest('hex');
  const fresh = Math.abs(Date.now() / 1000 - Number(t)) < 300;
  return (
    fresh &&
    signatures.some((signature) => {
      const a = Buffer.from(expected);
      const b = Buffer.from(signature);
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    })
  );
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import hashlib
import hmac
import time


def verify_signature(raw_body: bytes, header: str, secret: str) -> bool:
    pairs = [p.split("=", 1) for p in header.split(",")]
    timestamp = next(value for key, value in pairs if key == "t")
    signatures = [value for key, value in pairs if key == "v1"]
    signed = f"{timestamp}.".encode() + raw_body
    expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()
    fresh = abs(time.time() - int(timestamp)) < 300
    return fresh and any(hmac.compare_digest(expected, sig) for sig in signatures)
```

</TabItem>
</Tabs>

4. Return `401` when the check fails and stop before the handler runs.

5. Parse the JSON and handle the event only after the check passes.

:::warning
If your framework parses the body before you verify, the re-serialized copy can differ from what was signed, and every check fails. Register the verify middleware before the JSON parser.
:::

## Verify it worked

- Send a test event from the dashboard. The delivery log shows `2xx` and your handler records the event.
- Replay the same delivery with one character changed in the body. The receiver returns `401`.
- Replay a delivery whose `t` is more than five minutes old. The receiver returns `401`.

## Troubleshooting

Work from the symptom. A signature error means the request arrived and your receiver rejected it, so the delivery log usually shows a `2xx` even though nothing was handled.

### Every request fails

The hash and the header disagree on every attempt, which points at the inputs rather than at timing.

- The secret is the endpoint secret that starts with `whsec_`, not your API key
- A test endpoint secret used against a live endpoint fails the same way
- The body was parsed before verification, so the hash covers a re-serialized copy

### Some requests fail

A receiver whose clock drifts past the five minute window rejects valid requests. So does one that verifies a queued copy much later.

- Compare the `t` value against the current time on the receiver, not on your laptop
- Synchronize the host clock and confirm the timezone is not shifting the result

### Fails only after a rotation

During a rotation window Hookline signs with both secrets and sends two `v1` values. A receiver that reads only the first one fails as soon as the new secret is used.

- Check every `v1` value, not just the first
- Keep the old secret until the window closes, then remove it

### Passes locally, fails in production

Something between Hookline and your handler rewrites the body. A proxy that recompresses, reformats, or logs and re-emits the request changes the bytes.

- Read the raw body at the handler
- Confirm no middleware parses or clones the request first

### The comparison is wrong

Comparing decoded bytes to a hex string always fails, even when the HMAC is correct.

- Keep both values as hex and compare them with a constant time function
- Confirm the digest is `sha256`, not `sha1`

If none of these apply, [Debug a failed delivery](./debug-failures.md) covers connection and endpoint failures.

