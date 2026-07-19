# Website Maintenance Guide

## Before every publication

1. Keep titles factual and specific.
2. Summarize the central point of long social captions; do not copy a long caption into the card.
3. Link to the original Facebook post, official document, or source page.
4. Use a local optimized image whenever possible. Add an accurate `imageAlt`.
5. Run `npm run validate` and preview with `npm start`.
6. Check desktop and mobile layouts before pushing `main`.

## Announcement workflow

Edit `data/announcements.json`. The first published item with `featured: true` is displayed in the Announcement Corner. Include:

- a short title and contextual excerpt
- ISO date plus human-readable date, time, and location
- optimized poster image and accurate alternative text
- original Facebook source URL

After an event, either mark it `draft`, replace it with the next announcement, or move its photos and recap into the gallery/recent updates.

## July Corner workflow

Edit `data/july-resources.json`. Label every link as one of these kinds: official/government, United Nations, news archive, or community archive. Do not describe a community archive as a government or official source.

For casualty figures, preserve the OHCHR wording: the report estimates that as many as 1,400 people may have been killed between 1 July and 15 August 2024. It is not a UN-confirmed list of 1,400 martyrs.

## Recent updates workflow

Automatic updates are handled by `.github/workflows/sync-facebook.yml`. See `README.md` for token setup.

Manual fallback:

1. Add the item at the top of `data/recent-updates.json`.
2. Set `sourceKey` to `germany` or `ncp`.
3. Set `mediaType` to `text`, `image`, or `video`.
4. For a video, use a preview image and link `sourceUrl` to the original Facebook video.
5. Keep the excerpt under roughly 340 characters and preserve the post's actual meaning.

## Privacy and membership submissions

The membership form sends data through FormSubmit to the organization's email and links to FormSubmit's privacy notice. Do not promise storage or deletion practices that the organization cannot actually guarantee. Handle correction or deletion requests sent to `ncpdiasporade@gmail.com` promptly and document the internal retention policy before expanding data collection.

## Publish

Commit only reviewed files and push `main`. Preserve `CNAME` so the custom domain remains connected.
