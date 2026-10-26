---
title: "Writing Knowledge Down"
slug: "writing-knowledge-down"
type: "note"
status: "evergreen"
summary: "A rule about birds works until the bird is a penguin. From that small exception, I follow the larger problem of representing knowledge without making reasoning impossible."
date: "2026-10-03"
created: "2026-10-03"
updated: "2026-10-03"
topics: ["Artificial Intelligence", "Knowledge Representation"]
tags: ["AI", "Knowledge Representation", "History of AI", "Python"]
linked_notes:
  - "data-is-not-information"
  - "finding-the-needle"
  - "drawing-uncertainty-bayesian-networks"
graph:
  show: true
  weight: 2
  cluster: "knowledge"
seo:
  title: "Writing Knowledge Down"
  description: "Semantic networks, frames, ontologies and knowledge graphs, and the trade between what a language can say and what a machine can answer. With small Python demos."
---

"Birds fly" is the kind of sentence that sounds like knowledge until it meets a penguin. Give a machine the facts that Tweety is a bird and birds fly, and the conclusion follows neatly. Give it Opus, who is both a bird and a penguin, and the same neatness becomes a mistake.

We can repair the rule by adding an exception, but the repair opens a much larger problem. Where should the exception live? Which rule wins when two categories disagree? Does an absent fact mean false or merely unknown? And how expressive can the representation become before answering a question requires too much computation?

In [Data Is Not Information](/notes/data-is-not-information/) I argued that meaning depends on an agreement between sender and receiver. Knowledge representation tries to make part of that agreement explicit enough for a machine to reason with. I am still learning this area, so this note does not pretend to survey it. I follow a narrower path through semantic networks, frames, triples and logic, using small programs wherever I can check the reasoning for myself.

## Climbing the links

Begin with a graph. Link `tweety` to `canary`, `canary` to `bird`, and `bird` to `animal`. Store a property at the highest category for which it holds, then allow the nodes below to inherit it. A question about Tweety can be answered by climbing the links until a relevant property appears.

This is a **semantic network**, and the usual starting point is Ross Quillian's work in the 1960s. A **frame**, which Marvin Minsky proposed in the mid 1970s, does the same job with the slots written out: a `bird` frame says `flies: True` by default, and a `penguin` frame overrides it. Here is the whole idea in a few lines:

```python
isa = {"canary": "bird", "penguin": "bird", "bird": "animal",
       "tweety": "canary", "opus": "penguin"}
props = {"bird": {"flies": True}, "penguin": {"flies": False},
         "animal": {"alive": True}}

def lookup(node, prop):
    while node is not None:
        if prop in props.get(node, {}):
            return props[node][prop], node
        node = isa.get(node)
    return None, None

for n in ("tweety", "opus"):
    print(n, lookup(n, "flies"), lookup(n, "alive"))
```

```text
tweety (True, 'bird') (True, 'animal')
opus (False, 'penguin') (True, 'animal')
```

The result contains both the answer and the node that supplied it. Tweety receives `flies` from `bird`; Opus reaches the nearer `penguin` override first; both eventually inherit `alive` from `animal`.

The appeal is not only economy, although storing "animals are alive" once is useful. The path is also a primitive explanation. If the system says that Tweety flies, it can point to the chain `tweety → canary → bird` and the property found there. Representation and justification are briefly the same structure.

## A default is a promise

The override solves Opus only because somebody anticipated penguins and recorded the exception. The structure itself cannot tell us which inherited properties are reliable, which categories deserve priority, or where the next exception is hiding. What looked like a factual hierarchy is already carrying a policy for handling conflict.

It gets worse when a node has two parents. A well-known puzzle in this literature has a man who is both a Quaker (Quakers are typically pacifists) and a Republican (Republicans typically are not). Both defaults are equally close:

```python
parents = {"nixon": ["quaker", "republican"]}
props = {"quaker": {"pacifist": True}, "republican": {"pacifist": False}}
def defaults(node, prop):
    return sorted({props[p][prop] for p in parents.get(node, []) if prop in props.get(p, {})})
print(defaults("nixon", "pacifist"))
```

```text
[False, True]
```

The search finds both answers at the same distance. A careless implementation would return whichever parent it visited first, allowing the order in which facts were entered to decide whether Nixon is a pacifist. Formal systems for defeasible or non-monotonic reasoning were developed for precisely this family of "normally, unless" problems. I understand why they are needed, but not yet well enough to explain their machinery responsibly here.

There was a second, quieter problem in the early networks. They often used one kind of link, "is a", for two different statements: "Tweety is a canary" (this individual belongs to a class) and "a canary is a bird" (this class sits inside that class). Those behave differently, and mixing them is a known criticism of the early designs. Later logics for describing categories were built partly to keep them apart.

I find a small version of the same pattern in my own field. A policy type with standard terms and a handful of overrides for particular cases looks a lot like a frame with exceptions. Whether it is a useful way to model insurance products is something I want to test rather than assert.

## Facts as triples

A contemporary knowledge graph is often described as a collection of **subject, relation, object** triples. The triples hold particular claims; an **ontology** supplies the vocabulary and constraints that make those claims interpretable. The graph might say that Apple Inc. was founded by Steve Jobs. The ontology says what counts as a company, a person and a founding relationship.

The standard motivating case is one word with two meanings. A user types "Apple". Before a system can help, it has to decide between the company and the fruit, and the only way to decide is to know something about the world. The small graph below holds a handful of triples, and two short functions do the work:

```python
T = [("Apple_Inc", "type", "Company"), ("Apple_Inc", "founded_by", "Steve_Jobs"),
     ("apple_fruit", "type", "Fruit"), ("apple_fruit", "grows_on", "apple_tree"),
     ("Company", "subclass_of", "Organisation")]

def types(e):
    out = {o for s, p, o in T if s == e and p == "type"}
    changed = True
    while changed:
        changed = False
        for s, p, o in T:
            if p == "subclass_of" and s in out and o not in out:
                out.add(o); changed = True
    return out

def score(e, ctx):
    return sum(1 for s, p, o in T if s == e and o.lower() in ctx)

print(sorted(types("Apple_Inc")))
print({e: score(e, {"steve_jobs"}) for e in ("Apple_Inc", "apple_fruit")})
print({e: score(e, {"apple_tree"}) for e in ("Apple_Inc", "apple_fruit")})
```

```text
['Company', 'Organisation']
{'Apple_Inc': 1, 'apple_fruit': 0}
{'Apple_Inc': 0, 'apple_fruit': 1}
```

The output demonstrates two jobs that are easy to blur together. The first is inference: nobody stored "Apple Inc. is an organisation", but the `subclass_of` relation allows the system to derive it. The second is disambiguation: a mention of Steve Jobs favours the company, while a mention of an apple tree favours the fruit. The toy scoring function is far too small for real semantic search, yet it exposes the useful division of labour between textual context and structured facts.

## What silence means

There is one design choice hiding inside this tiny example, and it is easy to miss. What should the system conclude about a fact that is not in the graph?

```python
T = {("Apple_Inc", "founded_by", "Steve_Jobs")}
def closed_world(s, p, o):
    return (s, p, o) in T
def open_world(s, p, o):
    return True if (s, p, o) in T else "unknown"
print(closed_world("Apple_Inc", "founded_by", "Steve_Wozniak"),
      open_world("Apple_Inc", "founded_by", "Steve_Wozniak"))
```

```text
False unknown
```

Steve Wozniak co-founded Apple, so `False` is not justified by this graph. The triple is missing; a negation is not present. A closed-world database can often treat absence as false because it claims to contain a complete set within a defined boundary, such as all current customers. A graph describing the wider world rarely earns that assumption. There, absence more honestly means that the graph does not know. Choosing between those interpretations is part of the model, not an implementation detail.

Other limits come with the territory. Someone has to build the graph and keep it current, and people disagree about categories. A graph can disambiguate and trace an answer back to its parts, which is valuable where you need to show your working. But it only knows what was put in, and embedding-based search reaches some of the same goals without a hand-built graph. I compare that approach with keyword ranking in [Finding the Needle](/notes/finding-the-needle/), and which of the two wins depends heavily on the job.

## The price of saying more

The part that changed how I understood the subject is the tension between expression and computation. A representation language gains power by allowing more kinds of statement, but that power can make its questions much harder, or even impossible, to answer mechanically in every case.

The paper that names it is "Expressiveness and tractability in knowledge representation and reasoning", by Hector Levesque and Ronald Brachman, from 1987. As I understand its point, the expressive power of a representation language is tied to the difficulty of reasoning in it, so every system sits somewhere on a trade. The landmarks along the trade are standard results:

- **Propositional logic** says little. Deciding whether a sentence can be made true at all is still NP-complete. The brute-force check tries every assignment of true and false, and there are 2ⁿ of them for n variables.
- **Horn clauses** (rules of the form "if these facts, then that fact") restrict the language, and entailment can then be checked in time linear in the size of the knowledge base by chaining forward from the facts.
- **First-order logic** can say far more. Entailment in it is only semi-decidable: a proof will be found if the sentence follows from the knowledge, but no procedure is guaranteed to halt when it does not.
- **Description logics** are a family designed as decidable fragments of first-order logic. They sit behind OWL, a standard language for ontologies, and OWL 2 defines profiles for which the main reasoning tasks are tractable.

Two small calculations make the first two concrete:

```python
print(2**20, 2**30, 2**50)
rules = [({"a", "b"}, "c"), ({"c"}, "d"), ({"d", "a"}, "e")]
facts = {"a", "b"}
changed = True
while changed:
    changed = False
    for body, head in rules:
        if body <= facts and head not in facts:
            facts.add(head)
            changed = True
print(sorted(facts))
```

```text
1048576 1073741824 1125899906842624
['a', 'b', 'c', 'd', 'e']
```

The first line is the number of truth assignments a brute-force check faces with 20, 30 and 50 variables: about a million, a billion, and over a quadrillion. The second is forward chaining over three Horn rules. It only ever adds facts and it stops, which is why that style of rule stays fast.

The same pressure shows up in probability. A full table of joint probabilities over n yes/no variables has 2ⁿ entries, which is the pressure that [Drawing Uncertainty: Bayesian Networks](/notes/drawing-uncertainty-bayesian-networks/) exists to relieve.

A caution on "tractable". It is a guarantee about the worst case. A rich language can still be fast on the cases you actually have, and a restricted one can be slow on a very large knowledge base. The word "expressive" also gets used differently in neural networks, where it describes what functions a network can represent. That is a separate idea from what a logic can state.

## The part I understand least

The examples I can run have given me a foothold, not command of the field. I still cannot explain defeasible reasoning in enough depth, trace the formal route from loosely defined semantic networks to description logics, or say when a modern graph should inherit properties rather than store explicit relations.

I am equally cautious about the usual comparison with learned embeddings. My current suspicion is that explicit graphs become especially valuable when the path to an answer must remain inspectable, while embeddings are useful when the relationships are too numerous or ambiguous to encode by hand. That may prove to be a false division, and testing it is more interesting than defending it.

What the note has made clearer is that no representation merely records knowledge. It also decides what counts as an exception, what silence means, which inferences are allowed, and how much computation an answer may cost. Before trusting what a knowledge system returns, I need to understand those decisions as well as the facts it contains.

---

## References

- S. Russell and P. Norvig, [*Artificial Intelligence: A Modern Approach*](https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003500), 4th ed., Pearson, 2021 (knowledge representation, logic and the tractability of inference).
- M. R. Quillian, "Semantic memory", in M. Minsky (ed.), *Semantic Information Processing*, 1968.
- M. Minsky, ["A Framework for Representing Knowledge"](https://web.media.mit.edu/~minsky/papers/Frames/frames.html), MIT-AI Laboratory Memo 306, 1974; reprinted 1975.
- H. J. Levesque and R. J. Brachman, ["Expressiveness and tractability in knowledge representation and reasoning"](https://doi.org/10.1111/j.1467-8640.1987.tb00176.x), *Computational Intelligence*, 3(1), 1987, 78–93.
