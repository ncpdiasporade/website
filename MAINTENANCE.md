# Website Maintenance Guide

## Before every publication

1. Keep titles factual and specific.
2. Summarize the central point of long social captions; do not copy a long caption into the card.
3. Link to the original Facebook post, official document, or source page.
4. Use a local optimized image whenever possible. Add an accurate `imageAlt`.
5. Run `npm run validate` and preview with `npm start`.
6. Check desktop and mobile layouts before pushing `main`.

## কর্মসূচি / Facebook Events workflow

Automatic Event updates are handled every 24 hours by `.github/workflows/sync-facebook-events.yml`. The nearest upcoming NCP Diaspora Alliance Germany Facebook Event is displayed in `কর্মসূচি`. `data/announcements.json` remains the reviewed fallback. Each Event includes:

- a short title and contextual excerpt
- ISO date plus human-readable date, time, and location
- optimized poster image and accurate alternative text
- original Facebook source URL

The daily sync removes expired automated Events and ignores expired dated fallback items. Add a completed Event recap to recent updates when it remains useful.

Use `preserveCopy: true` when an Event's approved programme text must remain verbatim. The Facebook Event will still be checked daily, but the reviewed title, description, time, location, and poster will not be overwritten.

## July information workflow

Edit `data/july-resources.json` to maintain the links shown under the July Uprising overview. Label every link as one of these kinds: official/government, United Nations, news archive, or community archive. Do not describe a community archive as a government or official source.

For casualty figures, preserve the OHCHR wording: the report estimates that as many as 1,400 people may have been killed between 1 July and 15 August 2024. It is not a UN-confirmed list of 1,400 martyrs.

## Recent updates workflow

Automatic updates are handled by `.github/workflows/sync-facebook.yml`. See `README.md` for token setup.

Manual fallback:

1. Add the item at the top of `data/recent-updates.json`.
2. Set `sourceKey` to `germany` or `ncp`.
3. Set `mediaType` to `text`, `image`, or `video`.
4. Set `featured: true` only when that exact item is the Page's pinned post. Only one pinned item per Page is allowed. When Meta does not expose that state, put the verified pinned permalink first in `NCPDA_GERMANY_FEATURED_POST_URLS` or `NCP_FEATURED_POST_URLS`.
5. For a Reel or video, use a preview image, retain the Meta view count when available, and link `sourceUrl` to the original Facebook video.
6. Keep the excerpt under roughly 340 characters and preserve the post's actual meaning.

## Privacy and membership submissions

The membership form sends data through FormSubmit to the organization's email and links to FormSubmit's privacy notice. Do not promise storage or deletion practices that the organization cannot actually guarantee. Handle correction or deletion requests sent to `ncpdiasporade@gmail.com` promptly and document the internal retention policy before expanding data collection.

## Publish

Commit only reviewed files and push `main`. Preserve `CNAME` so the custom domain remains connected.
