---
title: "Writing Knowledge Down"
slug: "writing-knowledge-down"
type: "note"
status: "evergreen"
summary: "Tweety is a bird, so Tweety flies. Opus is a bird too. What happens when you try to give a machine a rule and an exception, why a graph of facts can resolve which Apple you meant, and the price of a language that can say anything."
date: "2026-10-10"
created: "2026-10-10"
updated: "2026-10-10"
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

Tweety is a bird, and birds fly, so Tweety flies. Fine. Opus is also a bird, a penguin, and he does not fly. Write down one rule and one fact, ask a machine whether Opus can fly, and it will cheerfully say yes.

The obvious repair is to hand it a list of exceptions. That repair turns out to be the first step into most of what makes it hard to write knowledge down for a machine: where facts should live, what happens when they disagree, what the machine should conclude from silence, and how much it costs to let a language say more.

In [Data Is Not Information](/notes/data-is-not-information/) I argued that meaning is not in the bytes. It sits in the agreement between sender and receiver, and the agreement has to already be in place. This note is about one of the oldest attempts in AI to write that agreement down in a form a machine can use. The material I have on it is thinner than for most things I write about, so I have kept to what I can run or am sure of, and I say where my understanding stops.

## Climbing the links

The oldest idea is also the simplest. Put the things in a graph. Link `tweety` to `canary`, `canary` to `bird`, `bird` to `animal`. Attach each fact to the most general node it is true of, and let everything below inherit it. To answer a question, start at a node and climb the links until some node has an answer.

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

Each answer comes with the node that supplied it. Tweety inherits `flies` from `bird`. Opus meets the `penguin` override first and the climb stops there. Both inherit `alive` from `animal`, a fact stored once and shared by everything below it.

That is attractive economy. You state "animals are alive" one time instead of for every animal, and when the fact changes you change one place. It is also a small explanation facility for free, since the path the climb took is the justification.

## A default is a promise

The trouble starts with the override. `penguin` says `flies: False`, and someone had to know to write that. Nothing in the structure says which defaults are safe to rely on or which categories will need exceptions. A default is a promise with an escape clause, and the graph cannot tell you where the escape clauses are.

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

The climb finds both answers at the same distance and has no principled way to choose. A simple program would return whichever parent it happened to look at first, and the result would depend on the order the facts were typed in. Formal tools for reasoning about "normally, unless" exist, and they are a field of their own. I know that they exist and roughly what they are for. I do not understand them well enough to explain them here.

There was a second, quieter problem in the early networks. They often used one kind of link, "is a", for two different statements: "Tweety is a canary" (this individual belongs to a class) and "a canary is a bird" (this class sits inside that class). Those behave differently, and mixing them is a known criticism of the early designs. Later logics for describing categories were built partly to keep them apart.

I find a small version of the same pattern in my own field. A policy type with standard terms and a handful of overrides for particular cases looks a lot like a frame with exceptions. Whether it is a useful way to model insurance products is something I want to test rather than assert.

## Facts as triples

A more modern way to write knowledge down drops the climbing and stores plain statements: **subject, relation, object**. A **knowledge graph** is a large collection of these triples. An **ontology** is the agreed vocabulary underneath: the kinds of thing in a domain, and how they may relate. The graph holds the specific facts. The ontology says what "Company" and "founded by" mean.

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

Two things happened. First, nobody stored "Apple_Inc is an Organisation". The `subclass_of` link produced it, which is the climbing idea again, now applied to statements instead of properties. Second, the same word resolved to different entities depending on which neighbours the context matched: mention Steve Jobs and the company wins, mention an apple tree and the fruit does. This is disambiguation, and it is why people describe semantic search as text analysis plus a knowledge graph.

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

Steve Wozniak co-founded Apple, so the closed-world answer, `False`, is simply wrong. The graph did not say he was not a founder. Nobody had typed the triple in. A database usually reads silence as no, and that suits a list of customers, where a missing row means a missing customer. A knowledge graph that tries to describe the world often has to read silence as "I do not know". Neither reading is correct everywhere. Which one a system uses is a decision about the world it describes, and it deserves to be written down as carefully as the facts.

Other limits come with the territory. Someone has to build the graph and keep it current, and people disagree about categories. A graph can disambiguate and trace an answer back to its parts, which is valuable where you need to show your working. But it only knows what was put in, and embedding-based search reaches some of the same goals without a hand-built graph. I compare that approach with keyword ranking in [Finding the Needle](/notes/finding-the-needle/), and which of the two wins depends heavily on the job.

## The price of saying more

The last idea is the one I find most striking, because it says something about all of this at once. The more a language can say, the harder it is to reason with.

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

I have been more confident in this note than I am in the subject. The climbing, the triples and the Horn rules I can run and check. Three things I cannot yet explain properly: how the formal systems for "normally, unless" reasoning work and what they cost, how the early networks with vague links were turned into description logics with a precise meaning, and where modern knowledge graphs keep inheritance and where they quietly drop it.

I also do not know when a hand-built graph beats learned embeddings, or the reverse. My suspicion is that the graph wins where you must show where an answer came from, and embeddings win where nobody could ever write the rules. That is a suspicion, and I would like to test it.

What I am sure of is the shape of the trade. Every way of writing knowledge down chooses between what it can say and what it can promise to answer, and a good choice is made on purpose.

A default is a promise with an escape clause. A language that can say anything cannot promise to answer everything.

---

**Sources**

- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., 2021 (knowledge representation, logic and the tractability of inference).
- M. R. Quillian, "Semantic memory", in M. Minsky (ed.), *Semantic Information Processing*, 1968.
- M. Minsky, "A Framework for Representing Knowledge", 1975.
- H. J. Levesque and R. J. Brachman, "Expressiveness and tractability in knowledge representation and reasoning", *Computational Intelligence*, 3(1), 1987.
