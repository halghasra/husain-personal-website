---
title: "AI Traceability: The Gap Between Answer and Trust"
slug: "ai-traceability-the-gap-between-answer-and-trust"
type: "research-seed"
status: "active-question"
summary: "AI systems can produce confident answers with no trail of reasoning behind them. This is not just a UX problem. It is a fundamental problem in epistemics and system design."
date: "2026-01-15"
created: "2026-01-15"
updated: "2026-01-25"
planted: "2026-01-15"
last_tended: "2026-06-10"
topics: ["Trustworthy AI", "Traceability", "Explainability"]
tags: ["AI", "Machine Learning", "Traceability", "Trustworthy AI", "Research"]
linked_notes: []
sources: []
curio:
  stage: "candidate"
  url: ""
graph:
  show: true
  weight: 2
  cluster: "trustworthy-ai"
seo:
  title: "AI Traceability: The Gap Between Answer and Trust"
  description: "Why the gap between a model producing an answer and a human being able to trust it is one of the most important problems in applied AI."
---

## The question

How do we build AI systems that can explain where their answers came from?

Not just with a citation pasted underneath. Not just with a confidence score. With a real trail: what evidence was used, how it was weighted, what was uncertain, and what assumptions were made.

This is harder than it sounds.

## Why this matters

Modern language models and retrieval systems produce answers that sound authoritative but carry no provenance. The model has no way to say "I drew this conclusion from these three sources, which conflict on this point, and I chose to weight this one more heavily because of this pattern."

It just produces the output.

This matters enormously in any domain where the answer affects a real decision. Medicine. Law. Insurance. Policy. Research. These are domains where "trust the output" is not good enough. You need to be able to check, challenge, and trace the reasoning.

## The current state

There are several approaches being explored:

**Retrieval-augmented generation (RAG)** adds source documents to the generation process, and some implementations surface which chunks were retrieved. But "this chunk was retrieved" is not the same as "this is why I said what I said."

**Chain-of-thought prompting** encourages models to show intermediate reasoning steps. These can be useful, but they are generated text — not a true trace of the computational process.

**Explainability methods** (SHAP, attention maps, etc.) work at the feature level for specific model types. They are useful for narrow applications but do not generalise to language model reasoning.

**Knowledge graphs** offer a structured substrate where facts, sources, and relationships have explicit identity. If a system reasons over a knowledge graph, you can in principle trace the path. But integrating deep learning with knowledge graph reasoning at scale remains an open problem.

## What I am still unsure about

Whether the goal of "full traceability" is achievable or even well-defined for neural systems. The computations inside a transformer do not map cleanly onto human concepts of "reasoning." Tracing them at the computational level may not produce anything interpretable.

This might mean the answer lies not in tracing the model, but in building systems around the model that preserve provenance externally. A hybrid approach: neural generation with symbolic traceability scaffolding.

## Why this is my research question

I am drawn to this problem because it sits at the intersection of several things I care about:

- How do we design AI systems that can be trusted in high-stakes decisions?
- How do we structure knowledge so that it retains its provenance through transformation?
- What does it mean to "understand" an answer rather than just receive it?

These are not purely technical questions. They are also questions about epistemics, institutional design, and what we want from AI systems in the real world.

## Next steps for this seed

- Survey literature on provenance-aware AI systems
- Map the space between RAG, knowledge graphs, and causal reasoning
- Identify whether there are domain-specific approaches worth studying (legal AI, medical AI)
- Connect to Curio Synapse once the idea is clearer
