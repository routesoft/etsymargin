# EtsyMargin

A free Etsy profit & fee calculator, built as a static [Jekyll](https://jekyllrb.com) site so
GitHub Pages builds and deploys it automatically — no build step, no server, nothing to
maintain beyond writing content.

Live structure:
- `/` — the calculator (US/UK/Canada/Australia/Eurozone fee logic, all client-side JS)
- `/blog/` — 15 published guides, more can be added by dropping in one markdown file
- `/about/`, `/contact/`, `/privacy-policy/`, `/terms/`
- Auto-generated on every build: `sitemap.xml`, `feed.xml`, and per-page SEO meta tags (via
  `jekyll-seo-tag` and `jekyll-sitemap` — both whitelisted GitHub Pages plugins, so this all
  works with zero configuration on GitHub's side)

---

## 1. Deploy it (5 minutes, no local setup required)

1. Create a new **public** GitHub repository.
2. Upload every file in this project to it (drag-and-drop on github.com works fine, or push via
   git — see below).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch **main**, folder
   **/ (root)**. Save.
5. Wait 1–2 minutes. GitHub will build the Jekyll site automatically and give you a URL like
   `https://yourusername.github.io/your-repo-name/`.

That's it — no `npm install`, no build command, no CI config. GitHub Pages runs Jekyll for you.

### Pushing via git instead of drag-and-drop

```bash
cd path/to/this/folder
git init
git add .
git commit -m "Launch EtsyMargin"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

---

## 2. Point it at your real domain (one command)

Every file in this project currently uses the **placeholder domain `etsymargin.com`** — in
`_config.yml`, `robots.txt`, and the footer trademark note. Once you've bought a real domain (or
decided to stick with the free `username.github.io` address), update it everywhere in one shot:

```bash
# macOS/Linux — run from the project root, replace with your real domain
grep -rl 'etsymargin.com' . --include=\*.yml --include=\*.txt --include=\*.md --include=\*.html \
  | xargs sed -i '' 's/etsymargin\.com/your-real-domain.com/g'
```

(Drop the `''` after `-i` on Linux; it's only needed for macOS's version of `sed`.)

If you're **not** using a custom domain and are happy with the free
`yourusername.github.io/repo-name` address:
1. Set `url:` in `_config.yml` to `https://yourusername.github.io` and `baseurl:` to
   `/repo-name`.
2. Update the `Sitemap:` line in `robots.txt` to match.
3. Remove the trademark-notice domain reference in `_includes/footer.html` if you'd rather not
   name a domain there.

### If you do buy a custom domain

Add a file named `CNAME` (no extension) to the project root containing just your domain, e.g.:
```
etsymargin.com
```
Then point your domain's DNS at GitHub Pages per
[GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

---

## 3. Add a new blog post (this is the whole workflow)

Create one file in `_posts/` named `YYYY-MM-DD-your-slug.md`:

```markdown
---
title: "Your Post Title Here"
description: "A 150-character-ish summary for search results."
category: "Pricing"
tags: [tag one, tag two]
faq:
  - q: "A question buyers actually search for?"
    a: "A direct, complete answer."
---

Your post content in plain Markdown. Use `## Headings`, **bold**, tables, and
[internal links](/blog/other-post-slug/) to other posts and to the calculator (`/`).
```

Push it, and GitHub Pages rebuilds automatically. The post appears on `/blog/`, in the RSS feed,
and in `sitemap.xml` with zero other changes needed — that's the entire point of this setup.

**The `faq` front matter is optional but recommended** — it renders a visible, accessible FAQ
accordion on the post *and* generates matching `FAQPage` structured data for Google, which is
one of the more reliable ways a small site earns rich search snippets.

---

## 4. Preview changes locally (optional)

If you have Ruby installed:

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://localhost:4000`. If you don't have Ruby installed and don't want to, you don't
need it — GitHub builds the site for you on every push. This is purely for previewing before you
push.

---

## 5. Before you tell anyone about it

- [ ] Domain updated everywhere (`etsymargin.com` → yours), or confirmed you're keeping the
      `github.io` address
- [ ] `hello@etsymargin.com` in `contact.md` updated to a real inbox you check
- [ ] `assets/images/og-default.png` swapped if you want a different social preview image
      (1200×630px works best; keep the filename or update `image:` in `_config.yml`)
- [ ] Submit the sitemap (`/sitemap.xml`) in Google Search Console and Bing Webmaster Tools —
      this is the single highest-leverage thing you can do to get indexed fast

## Why this setup, specifically

- **jekyll-seo-tag** auto-generates title tags, meta descriptions, canonical URLs, Open Graph
  and Twitter Card tags, and JSON-LD on every page from the front matter you already write —
  you never hand-write a `<meta>` tag.
- **jekyll-sitemap** regenerates `sitemap.xml` on every build, so a new blog post is
  automatically discoverable without editing an XML file by hand.
- **No JavaScript framework, no build pipeline** — GitHub Pages builds plain Jekyll natively,
  so there's no dependency to go stale or npm audit to run six months from now.
- Every blog post is one Markdown file. Adding your 16th, 30th, or 100th post never touches the
  design, the calculator, or any shared template.
