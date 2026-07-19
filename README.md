# NCP Diaspora Alliance Germany Website

Static website for [ncpdagermany.de](https://ncpdagermany.de), published from the `main` branch through GitHub Pages.

## What visitors can find

- July Uprising overview with primary, official, news, and clearly labelled community archive links in the same section
- Announcements and upcoming events, including image, date, time, location, and source
- NCP Diaspora Alliance Germany history, work principles, gallery, blog, and membership form
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

## Automatic Facebook updates

`.github/workflows/sync-facebook.yml` runs once every hour and can also be started manually from GitHub Actions. It fetches recent posts through the Meta Graph API, converts long captions into a concise context-first excerpt, caches stable image/video thumbnails in `img/social/`, detects Facebook pinned/Featured posts when Meta exposes that state, validates the result, and commits the update to `main`.

Configure these in **GitHub repository → Settings → Secrets and variables → Actions**:

Secrets:

- `NCPDA_GERMANY_PAGE_ACCESS_TOKEN`
- `NCP_PAGE_ACCESS_TOKEN` (optional until the central NCP page grants the required access)

Variables:

- `NCPDA_GERMANY_PAGE_ID` (optional; defaults to `ncpdagermany`)
- `NCP_PAGE_ID` (optional; defaults to `1NationalCitizenParty`)
- `NCPDA_GERMANY_FEATURED_POST_URL` (optional fallback when Meta does not expose the Page's Featured state)
- `NCP_FEATURED_POST_URL` (optional fallback when Meta does not expose the Page's Featured state)
- `META_GRAPH_VERSION` (optional; defaults to the version in `social-feed.config.json`)

The token must be allowed to read the corresponding Page's published posts. Reading a Page that the app/user does not manage may require Meta approval for public Page content. If a token is missing or a source fails, the sync keeps the existing website content and does not delete it.

The website's `ফিচার্ড` filter shows only Facebook-linked items marked as featured. If Meta does not expose a Page's Featured state, the sync preserves the last verified selection; the optional Featured Post URL variable can be used as an explicit fallback. Video posts are shown as linked video preview cards. This avoids storing large video files in Git and avoids depending on short-lived Facebook video URLs.

## Publishing

For normal website edits:

```bash
npm run validate
git push origin main
```

GitHub Pages should then update the custom domain. Keep `CNAME` unchanged.
