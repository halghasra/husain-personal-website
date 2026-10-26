---
title: "AI Traceability: The Gap Between Answer and Trust"
slug: "ai-traceability-the-gap-between-answer-and-trust"
type: "research-seed"
status: "active-question"
summary: "A cited answer may tell us where information was found without showing how that information shaped the conclusion. This research seed asks what genuine traceability would require."
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

Not merely with a citation placed beneath the answer or a confidence score presented beside it, but with a trail that shows what evidence was used, how it was weighted, what remained uncertain, and which assumptions shaped the result.

The more I read about this problem, the less convinced I am that citation and traceability are the same thing. A citation can identify a source. Traceability must connect that source to the claim, and then connect the claim to the decision that followed. Those are different demands.

## Why this matters

Retrieval-augmented generation gives a model access to external documents and can expose the passages retrieved during generation [1]. That is useful, but retrieval alone does not establish that a passage supports a particular claim, nor does it show how conflicting evidence was handled. NIST's AI Risk Management Framework treats transparency and accountability as properties of the wider system, which is closer to the problem I am interested in [2].

The distinction matters most when an answer informs a consequential decision. In medicine, law, insurance, policy, and research, a plausible response is only the beginning. Someone must be able to inspect the evidence, challenge the assumptions, and understand the limits of what the system has established.

## What existing approaches can and cannot show

**Retrieval-augmented generation** can show which documents or chunks were made available to a model. It does not, by itself, prove that each generated claim follows from those sources [1].

**Generated reasoning traces** can help a reader follow an answer, but fluent intermediate text should not automatically be treated as a faithful record of the computation that produced it. Research on natural-language explanations repeatedly distinguishes how convincing an explanation sounds from whether it faithfully reflects the model's behaviour [3].

**Feature-attribution methods** answer narrower questions. SHAP, for example, assigns feature contributions to a prediction under a defined model and background distribution [4]. Attention weights are sometimes read as explanations, although evidence shows that this interpretation is not generally reliable [5].

**Knowledge graphs and provenance models** offer a different substrate. Entities, relations, claims, and sources can have explicit identities; W3C PROV provides a standard vocabulary for representing how entities and activities relate [6]. Combining symbolic provenance with neural generation remains an active research area [7].

## Where my question is changing

I began by asking for a complete trace of a model's reasoning. I am no longer sure that this is either attainable or useful. The internal computation of a neural model does not arrive pre-divided into the concepts a human auditor would want to inspect.

A more defensible target may be **system-level claim traceability**: for every material claim, preserve the supporting and contradicting evidence, the transformations performed on it, the uncertainty attached to it, and the human or machine decisions made along the way. This would not reveal everything happening inside the model. It could still make the resulting system substantially more inspectable.

## What I still need to resolve

- What should count as a traceable unit: a token, sentence, claim, inference, or decision?
- How should a system represent disagreement between sources rather than smoothing it away?
- Which parts of a trace should be machine-verifiable, and which inevitably depend on human judgement?
- Can provenance survive summarisation and multi-step generation without becoming too expensive to maintain?
- Should traceability be evaluated by faithfulness, usefulness to an auditor, reproducibility, or some combination of the three?

## Next steps

- Review work on provenance-aware generation and citation faithfulness.
- Map the boundary between retrieval, knowledge graphs, causal models, and model interpretability.
- Study domain-specific approaches in legal, medical, and scientific AI.
- Define a small claim-evidence schema and test it on a constrained corpus.
- Connect the result to Curio Synapse when the research question is sufficiently precise.

## References

1. Lewis, P. et al. (2020). [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401).
2. National Institute of Standards and Technology. (2023). [AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework).
3. Lyu, Q. et al. (2024). [Faithful Chain-of-Thought Reasoning](https://aclanthology.org/2024.cl-2.6/). *Computational Linguistics*, 50(1).
4. Lundberg, S. M., & Lee, S.-I. (2017). [A Unified Approach to Interpreting Model Predictions](https://arxiv.org/abs/1705.07874).
5. Jain, S., & Wallace, B. C. (2019). [Attention is not Explanation](https://aclanthology.org/N19-1357/). *NAACL-HLT 2019*.
6. W3C. (2013). [PROV-O: The PROV Ontology](https://www.w3.org/TR/prov-o/).
7. Tiddi, I., & Schlobach, S. (2022). [Knowledge graphs as tools for explainable machine learning: A survey](https://doi.org/10.1016/j.artint.2021.103627). *Artificial Intelligence*, 302.
