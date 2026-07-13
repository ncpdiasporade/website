# NCP Diaspora Alliance Germany Website

This repository contains the static frontend for the NCP Diaspora Alliance Germany website at `ncpdagermany.de`.

## Structure

- `index.html` contains the live page markup, styles, and scripts.
- `img/` contains the public website images.
- `CNAME` connects the custom domain.

## Local Preview

Run a local static server:

```bash
npm start
```

Then open `http://localhost:3000`.

## Publish

Commit changes on `main`, then push:

```bash
git push origin main
```

The live site is expected to update from the GitHub repository after the push.

## Content Automation

The site supports review-based automation for recent updates and blog drafts.

```bash
npm run automation:validate
npm run automation:render
```

GitHub Actions runs `.github/workflows/content-review.yml` on a schedule and opens a pull request instead of publishing directly.
