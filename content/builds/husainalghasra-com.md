---
title: "husainalghasra.com"
slug: "husainalghasra-com"
type: "build"
status: "active"
summary: "The website began as a place to publish. It has gradually become the system through which I keep notes, develop questions, and trace the connections between them."
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

I wanted a place where I could think in public without pretending that every thought had reached its final form. A conventional blog seemed too finished, while a portfolio would make the work look more orderly than learning ever is. What I needed was closer to a notebook: somewhere an idea could begin as a question, gather evidence, and perhaps grow into an essay or lesson.

The secondary question was about knowledge systems. How do you structure information so that ideas connect? How do you preserve the trail from a rough note to a finished essay?

## What I built

A Gatsby site that reads Markdown files from a `/content` folder and turns them into different kinds of pages. Notes, essays, research seeds, paper notes, builds, and lessons share a common publishing system, but they are not presented as though they serve the same purpose.

The visual design is deliberately closer to an editorial notebook than a product site. The dark palette and restrained amber accent help, but the more important choice is structural: writing is organised by what it is and where it sits in my thinking, not by how well it might fill a card grid.

The Neural Map is the part of the site that best expresses the original idea. It builds a content-driven graph from each entry's metadata. Explicit links in `linked_notes` form the strongest edges; shared topics and tags create weaker relationships; clusters and content types help the map retain some shape. The result is not meant to claim that every association is profound. It lets me see where a question is isolated, where several pieces are circling the same concern, and where one line of inquiry has begun to lead into another.

## What I learnt

Gatsby has suited the project because its data layer can query Markdown consistently while the templates preserve meaningful differences between content types. CSS Modules have also allowed the design to evolve without turning the stylesheet into a second, less legible version of the site.

The harder lesson has had little to do with the framework. A knowledge system can have an elegant schema and a beautiful graph, yet remain empty if the habit of writing does not survive. The code can make connections visible; it cannot create the thinking worth connecting.

## What I would change

The graph already uses a D3 force simulation, but its relationship model can become more deliberate. Shared tags are useful clues, although they are not equivalent to a connection I have explicitly argued for. I want future iterations to make that distinction clearer, improve the way dense clusters are explored, and expose why a particular edge exists rather than leaving the reader to infer it.

## Stack

- **Framework:** Gatsby 5
- **Language:** JavaScript / React 18
- **Styling:** CSS Modules with CSS Variables
- **Content:** Markdown with YAML frontmatter
- **Hosting:** Netlify
- **Fonts:** Montserrat, Merriweather, Machiato (custom)

## Links

- [Source on GitHub](https://github.com/halghasra/husain-personal-website)
- [Live site](https://husainalghasra.com)
