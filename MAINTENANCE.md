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

## JSON Content

- `data/recent-updates.json` powers the recent updates section.
- `data/blog-posts.json` powers the blog cards.
- Keep JSON valid and review all links before publishing.
- Use `status: "draft"` for items that should stay hidden.
