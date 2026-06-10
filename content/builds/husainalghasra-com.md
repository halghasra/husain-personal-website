---
title: "husainalghasra.com"
slug: "husainalghasra-com"
type: "build"
status: "active"
summary: "My personal website and public notebook. Built with Gatsby, React, and Markdown. A living knowledge system."
date: "2026-05-13"
created: "2024-01-01"
updated: "2026-05-13"
topics: ["Web Development", "Knowledge Systems"]
tags: ["Gatsby", "React", "Markdown", "Personal"]
linked_notes: []
graph:
  show: true
  weight: 1
  cluster: "builds"
seo:
  title: "Build: husainalghasra.com"
  description: "How I built and maintain my personal website as a living public notebook."
---

## What question started it?

I wanted a place to think in public. Not a blog with perfectly edited posts. Not a portfolio. A notebook. Somewhere ideas could live at different stages of completeness.

The secondary question was about knowledge systems. How do you structure information so that ideas connect? How do you preserve the trail from a rough note to a finished essay?

## What I built

A Gatsby site that reads Markdown files from a `/content` folder and turns them into pages. The content model supports different types: notes, essays, research seeds, paper notes, builds.

The design is intended to feel like a digital notebook rather than a product site. Dark, editorial, minimal. Amber accent. Notes in a list, not a grid.

The Neural Map page will eventually become a real content-driven graph. For now it is a relationship view that shows all entries with their types and tags.

## What I learnt

Gatsby is a good choice for this kind of site. The GraphQL data layer makes it easy to query and filter content across different source types. CSS Modules keep the styles manageable.

The harder problem is content, not code. A notebook only works if you actually write in it.

## What I would change

I would like to add a proper graph visualisation using something like D3 or Cytoscape, driven by the frontmatter `linked_notes` and shared tags. That is the next milestone.

## Stack

- **Framework:** Gatsby 5
- **Language:** JavaScript / React 18
- **Styling:** CSS Modules with CSS Variables
- **Content:** Markdown with YAML frontmatter
- **Hosting:** Netlify
- **Fonts:** Montserrat, Merriweather, Machiato (custom)

## Links

- [Source on GitHub](https://github.com/halghasra)
- [Live site](https://husainalghasra.com)
