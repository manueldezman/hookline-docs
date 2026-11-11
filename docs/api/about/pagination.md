---
title: Pagination
description: Page through list endpoints with cursors, choose a page size, and know when you have reached the last page.
sidebar_position: 7
displayed_sidebar: apiSidebar
---

# Pagination

List endpoints return one page at a time. Cursors move forward through the collection.

## Parameters

| Parameter | Default | Maximum | Meaning |
| --- | --- | --- | --- |
| `limit` | 20 | 100 | Records per page |
| `starting_after` | none | none | Cursor from the previous page |

## Response shape

```json
{
  "data": [{ "id": "evt_8f2a91" }],
  "has_more": true,
  "next_cursor": "cur_19af"
}
```

Pass `next_cursor` as `starting_after` to get the next page. Stop when `has_more` is `false`.

## Example

```js
let cursor;
do {
  const page = await hookline.deliveries.list({ limit: 100, starting_after: cursor });
  for (const delivery of page.data) handle(delivery);
  cursor = page.next_cursor;
} while (cursor);
```

## Ordering

Records are newest first. A cursor stays stable while the record exists, so paging cannot skip an item that you inserted after you started. Newer records appear only on a fresh request.

## Large exports

For more than ten thousand records, use the export endpoint instead of paging. It streams a file and does not count against read limits. Contact support to enable it.
