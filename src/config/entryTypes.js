// Entry types across the notebook: how they are labelled and which ink marks them.
// Colours are CSS variables so the graph and legends follow the dark and paper themes.
export const TYPE_LABELS = {
  note: "Note",
  essay: "Essay",
  "research-seed": "Research seed",
  "paper-note": "Paper note",
  "learning-log": "Learning log",
  build: "Build",
  article: "Article",
}

export const TYPE_COLORS = {
  note: "var(--t-note)",
  essay: "var(--t-essay)",
  "research-seed": "var(--t-seed)",
  "paper-note": "var(--t-paper)",
  "learning-log": "var(--t-log)",
  build: "var(--t-build)",
  article: "var(--t-article)",
}

export const typeLabel = type => TYPE_LABELS[type || "note"] || type
export const typeColor = type => TYPE_COLORS[type || "note"] || "var(--t-note)"
