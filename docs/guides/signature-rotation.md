---
title: Rotate a signing secret
description: Replace an endpoint secret without dropping deliveries, using the two-secret window Hookline provides.
sidebar_position: 3
displayed_sidebar: guidesSidebar
---

# Rotate a signing secret

This guide replaces an endpoint secret while deliveries keep flowing. You need dashboard access and a receiver that already verifies signatures.

During the window Hookline signs every delivery with both secrets. [Delivery and retries](../api/about/delivery-and-retries.md#signing) explains that header shape, and [Verify signatures](./verifying-signatures.md) covers the check itself.

## Steps

1. Start the rotation in the dashboard and copy the new secret into your environment as `HOOKLINE_SECRET_NEXT`. The old secret stays active.

2. Deploy the receiver with a list of secrets rather than a single one.

   ```js
   import {verifySignature} from './hookline-signature';

   const secrets = [
     process.env.HOOKLINE_SECRET,
     process.env.HOOKLINE_SECRET_NEXT,
   ].filter(Boolean);

   export function verify(rawBody, header) {
     return secrets.some((secret) =>
       verifySignature(rawBody, header, secret),
     );
   }
   ```

   The import path is wherever the check from [Verify signatures](./verifying-signatures.md) lives in your code.

3. Send a test event and confirm the receiver accepts it while both secrets are present.

4. Watch the delivery log for one full retry cycle, 24 hours, and confirm no signature failures appear.

5. Complete the rotation in the dashboard. Hookline stops signing with the old secret.

6. Remove `HOOKLINE_SECRET_NEXT` and the old secret from the environment, leaving only the new one.

## Verify it worked

- A new delivery carries a single `v1` value in `Hookline-Signature`.
- The receiver accepts it with only the new secret configured.
- The delivery log shows no signature failures after the old secret is removed.

## If a secret leaked

Rotate immediately and skip the overlap. Accepting only the new secret for a few minutes beats accepting a leaked one for a day. Deliveries that fail during the switch appear in the log and can be replayed.

## Rollback

Before step 5 the old secret keeps working, so a failed rotation costs nothing. If step 4 shows failures, stop the rotation and keep both secrets in place until the receiver is correct.
