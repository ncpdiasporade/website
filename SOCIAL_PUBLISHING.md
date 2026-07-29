# Social publishing workflow

The repository applies one explicit editorial rule:

- Content originating on the NCP Diaspora Alliance Germany Facebook Page is eligible for automatic publishing to X and TikTok.
- Content originating in the website Blog always requires a manual GitHub Actions approval run.
- Facebook-origin content is not sent back to Facebook or Instagram, preventing duplicate Meta posts.

The first baseline records all content that already exists when the system is installed. It never republishes that backlog. New Facebook items are detected from `data/recent-updates.json`; new or materially changed Blog articles are detected from `data/blog-posts.json`.

## Operational files

- `social-publishing.config.json` contains the immutable source policy and platform copy limits.
- `data/social-review-queue.json` contains drafts, approval state and per-platform delivery state.
- `data/social-publishing-state.json` contains source fingerprints and the delivery history.
- `img/social/outbound/` contains platform-ready media generated from the original source image. A text card is generated when a Facebook post has no image.

The automatic workflow first commits a `publishing` claim and only then contacts a platform. If a runner stops after claiming, the next run will not blindly repost the item. This favours manual reconciliation over accidental duplicates.

## Required GitHub Secrets

### X

Create a write-enabled X Developer App and authorize the NCPDA Germany X account. Add:

- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_TOKEN_SECRET`

The publisher uploads media with authenticated user context and creates the post through X API v2.

### TikTok

Create a TikTok Developer App, add the Content Posting API, obtain approval for `video.publish`, authorize `@ncpda_germany`, and verify `https://ncpdagermany.de` as a URL prefix/domain. Add:

- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`
- `TIKTOK_REFRESH_TOKEN`
- `SOCIAL_SECRETS_PAT`

TikTok access tokens expire after 24 hours and are refreshed automatically. TikTok can rotate the refresh token. `SOCIAL_SECRETS_PAT` must be a narrowly scoped GitHub credential allowed to update Actions secrets in this repository; the workflow uses it only to replace `TIKTOK_REFRESH_TOKEN`. As a short-lived test alternative, `TIKTOK_ACCESS_TOKEN` can be set directly, but it is not suitable for durable automation.

TikTok posts use `PUBLIC_TO_EVERYONE`. An unaudited TikTok client restricts Direct Post content to private visibility, so the workflow must not be considered fully live until TikTok's audit is complete.

## Approving a Blog post

1. Open the latest **Publish Facebook-origin social posts** workflow run and read its job summary. It lists the Blog slug and queue ID awaiting approval.
2. Open **Actions → Approve and publish a blog post → Run workflow**.
3. Enter the Blog slug or queue ID.
4. Choose `x`, `tiktok`, or `x,tiktok`.
5. Optionally replace either generated caption; otherwise leave both caption fields empty.
6. Run the workflow. That manual action is the recorded editorial approval.

## Local safety checks

```bash
npm ci
npm run social:status
npm run validate
```

Use `SOCIAL_MOCK_PUBLISHING=true` with alternate queue/state paths when testing. Never put platform tokens in repository files, workflow input fields, captions, or command-line arguments.

Official references:

- X Create Post: https://docs.x.com/x-api/posts/create-post
- X media upload: https://docs.x.com/x-api/media/upload-media
- TikTok Content Posting API: https://developers.tiktok.com/doc/content-posting-api-get-started
- TikTok token management: https://developers.tiktok.com/doc/oauth-user-access-token-management
- GitHub Actions secrets: https://docs.github.com/en/actions/concepts/security/secrets
