# Husain Alghasra Personal Website

This is the source code for my personal website and public notebook at [husainalghasra.com](https://husainalghasra.com).

The site is built around a Markdown-first publishing workflow. Notes, essays, research seeds, paper notes, builds, and book notes live in `/content` and are transformed into pages, archives, and a neural map during the Gatsby build process.

The goal of the site is not to be a static portfolio. It is a living knowledge system.

---

## Tech stack

- **Framework:** Gatsby 5
- **Language:** JavaScript / React 18
- **Styling:** CSS Modules with CSS Variables (dark/light mode)
- **Content:** Markdown with YAML frontmatter
- **Hosting:** Netlify
- **Images:** Gatsby Image (Sharp)
- **Fonts:** Montserrat, Merriweather, Machiato (custom)
- **Comments:** Disqus (optional, via env var)

---

## Folder structure

```text
/content
  /blog              Existing blog posts (legacy, served at /blog/*)
  /notes             Short notes and evergreen thoughts
  /essays            Longer-form writing
  /research-seeds    Early-stage research questions
  /paper-notes       Academic paper reading notes
  /builds            Build logs and project notes
/src
  /components        Layout, Footer, SEO, AuthorBio, etc.
  /config            siteConfig.js (central metadata and social links)
  /pages             index.js, about.js, notebook.js, research.js, reading.js, builds.js, graph.js
  /styles            CSS Modules per component and page
  /templates         blog-post.js, blog-list.js, lesson.js, lesson-list.js
```

---

## Running locally

```bash
# Install dependencies
npm install

# Start development server
npm run develop

# Build for production
npm run build

# Serve production build locally
npm run serve

# Clean Gatsby cache
npm run clean
```

The dev server runs at `http://localhost:8000`.
GraphiQL is available at `http://localhost:8000/___graphql`.

---

## Content model

All content uses YAML frontmatter. The full target model is:

```yaml
---
title: ""
slug: ""
type: "note"       # note | essay | research-seed | paper-note | build | article
status: "draft"    # draft | published | evergreen | active-question | reading | reviewed
summary: ""
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
topics: []
tags: []
linked_notes: []
sources: []
coverImage: "./images/filename.png"
graph:
  show: true
  weight: 1
  cluster: ""
seo:
  title: ""
  description: ""
---
```

Not every field is required on old posts. Add what you know.

---

## How to add a new note

1. Create a folder in `/content/notes/your-note-slug/`
2. Add `index.md` with frontmatter and body
3. Add any images to `/content/notes/your-note-slug/images/`
4. Run `npm run develop` to see it

The note will appear automatically in `/notebook` and `/graph`.

---

## How to add a new essay

Same as a note but use `/content/essays/` and set `type: "essay"`.
Essays also appear in the notebook archive.

---

## How to add a paper note

Create in `/content/paper-notes/` with:

```yaml
type: "paper-note"
status: "reading"   # or reviewed / evergreen
```

The reading page at `/reading` will pick it up automatically.

---

## How to add a build note

Create in `/content/builds/` with `type: "build"`.
It will appear on the `/builds` page.

---

## Navigation

| Nav label     | Route       | Source                              |
|---------------|-------------|-------------------------------------|
| Home          | /           | src/pages/index.js                  |
| Notebook      | /notebook   | src/pages/notebook.js               |
| Research      | /research   | src/pages/research.js               |
| Reading       | /reading    | src/pages/reading.js                |
| Builds        | /builds     | src/pages/builds.js                 |
| About         | /about      | src/pages/about.js                  |
| Curio Synapse | external    | <https://curiosynapse.com>          |

Legacy blog posts are also served at `/blog/*` for link compatibility.

---

## Central config

All personal metadata and social links live in `src/config/siteConfig.js`.
Do not hardcode URLs or names in components — import from there.

---

## Neural Map

The `/graph` page currently renders a filterable list view of all content with type indicators and tags.

A future version will render a real force-directed graph (D3 or Cytoscape) driven by:

- `linked_notes` frontmatter arrays
- `[[wikilinks]]` in Markdown body
- Shared tags and topics

---

## Deployment

The site deploys automatically to Netlify on push to `main`.

Build command: `gatsby build`
Publish directory: `public`
Node version: 18

Environment variables needed:

- `GATSBY_DISQUS_NAME` — your Disqus shortname (optional, comments disabled if missing)

---

## Dark / light mode

Themes are managed via `ThemeContext.js`. The user's preference is persisted in `localStorage`.
The `dark` class is toggled on `<html>` and drives all CSS variables.
