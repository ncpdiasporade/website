# NCP Diaspora Alliance Germany Website

Static website for [ncpdagermany.de](https://ncpdagermany.de), published from the `main` branch through GitHub Pages.

## What visitors can find

- July Uprising overview with primary, official, news, and clearly labelled community archive links in the same section
- কর্মসূচি synchronized from NCP Diaspora Alliance Germany Facebook Events, including image, date, time, location, and source
- NCP Diaspora Alliance Germany history, work principles, blog, and membership form
- Source-filtered updates from NCP Diaspora Alliance Germany and the National Citizen Party
- Image cards and video preview cards that always link back to the original post

## Local preview and validation

```bash
npm start
npm run validate
```

Open `http://localhost:3000` after starting the preview server.

## Editable content

- `data/announcements.json`: current announcements and events
- `data/july-resources.json`: links shown beneath the July Uprising overview
- `data/recent-updates.json`: recent activity and social updates
- `data/blog-posts.json`: blog articles and source lists
- `index.html`: layout, fallback content, styles, and browser-side rendering

Use `status: "draft"` to keep an item out of the published interface. Keep every factual update linked to its original source.

## Automatic Facebook posts, pinned items, Reels, and Events

`.github/workflows/sync-facebook.yml` runs once every hour and can also be started manually from GitHub Actions. It fetches recent posts and Page videos through the Meta Graph API, converts long captions into a concise context-first excerpt, caches stable image/video thumbnails in `img/social/`, detects one pinned post per Page, ranks Reels by the view count returned by Meta, validates the result, and commits the update to `main`. The website shows at most 10 cards in `সব আপডেট`, one pinned Germany item followed by one pinned NCP item in `ফিচার্ড`, and up to six top-viewed Reels in `ভিডিও`.

`.github/workflows/sync-facebook-events.yml` runs once every 24 hours. It reads upcoming Events from the NCP Diaspora Alliance Germany Page (with recent Page-post Event attachments as an API fallback), caches the Event cover in `img/events/`, updates `data/announcements.json`, and publishes the nearest upcoming Event in `কর্মসূচি`.

For an Event whose approved wording must not change, set `preserveCopy: true` on the matching fallback item. The sync will still verify the Facebook Event and its source link while preserving the reviewed title, description, date, time, location, and poster. This safeguard is enabled for `রক্তে জুলাই`.

Configure these in **GitHub repository → Settings → Secrets and variables → Actions**:

Secrets:

- `NCPDA_GERMANY_PAGE_ACCESS_TOKEN`
- `NCP_PAGE_ACCESS_TOKEN`

Variables:

- `NCPDA_GERMANY_PAGE_ID` (optional; defaults to `ncpdagermany`)
- `NCP_PAGE_ID` (optional; defaults to `1NationalCitizenParty`)
- `NCPDA_GERMANY_FEATURED_POST_URLS` (optional fallback; put the current Germany pinned-post permalink first)
- `NCP_FEATURED_POST_URLS` (optional fallback; put the current NCP pinned-post permalink first)
- `NCPDA_GERMANY_EVENT_URLS` (optional fallback; add current Facebook Event permalinks when Meta does not expose the Page Events edge)
- `META_GRAPH_VERSION` (optional; defaults to the version in `social-feed.config.json`)

The token must be allowed to read the corresponding Page's published posts, Page videos, pinned state, and Events. Top-Reel ranking uses `/<VIDEO_ID>/video_insights` with `blue_reels_play_count` and `total_video_views`, which requires `pages_read_engagement` and a Page token obtained by a person with the Page's `ANALYZE` task. Reading a Page that the app/user does not manage may require Meta approval for public Page content. Scheduled workflows deliberately fail when a required token or required video metric is unavailable, so GitHub does not incorrectly report that stale or unranked Facebook content was synchronized.

The website's `ফিচার্ড` filter shows only Facebook-linked items marked as pinned. If Meta does not expose a Page's pinned state, the sync preserves the last verified pinned item; the optional pinned-post URL variable can explicitly identify it. If more than one URL is supplied for a Page, the first matching permalink wins. The older singular `NCPDA_GERMANY_FEATURED_POST_URL` and `NCP_FEATURED_POST_URL` variables remain supported for compatibility. Pinned items and top-viewed Reels are retained even when they are older than the newest chronological feed items. Video cards always link to Facebook; large video files are not stored in Git.

## Publishing

For normal website edits:

```bash
npm run validate
git push origin main
```

GitHub Pages should then update the custom domain. Keep `CNAME` unchanged.
