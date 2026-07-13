# Maintenance Guide

## Usual Update Flow

1. Edit `index.html` or the relevant file in `img/`.
2. Preview locally with `npm start`.
3. Check `git status --short`.
4. Commit only the intended files.
5. Push `main` to publish the update.

## Notes

- The site is static and currently keeps CSS and JavaScript inside `index.html`.
- Do not add a standalone stylesheet unless `index.html` is updated to link it.
- Preserve the `CNAME` file so `ncpdagermany.de` keeps working.
- Keep image paths relative, for example `img/logo/logo-transparent.png`.

## Review-Based Content Automation

- `data/recent-updates.json` powers the recent updates section.
- `data/blog-posts.json` powers the blog cards.
- `data/blog-topics.json` is the queue for generated blog drafts; set a topic to `ready` before automation should draft it.
- `automation.config.json` controls search queries, lookback windows, and editorial voice.
- `.github/workflows/content-review.yml` runs weekly and can also be started manually from GitHub Actions.
- The workflow opens a pull request for review; merging the pull request publishes the approved content.
- Add `OPENAI_API_KEY` as a GitHub repository secret before blog generation can run.
- Optional: add `OPENAI_MODEL` as a repository variable to choose the writing model.
