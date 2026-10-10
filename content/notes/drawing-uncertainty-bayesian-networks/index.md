---
title: "Drawing Uncertainty: Bayesian Networks"
slug: "drawing-uncertainty-bayesian-networks"
type: "note"
status: "evergreen"
summary: "Five yes-or-no facts about a house need 31 numbers to describe completely. Draw the arrows between them honestly and ten will do. A runnable burglar alarm, and what a neighbour's phone call is really worth."
date: "2026-10-10"
created: "2026-10-10"
updated: "2026-10-10"
topics: ["Artificial Intelligence", "Probability"]
tags: ["AI", "Probability", "Python", "Knowledge Representation", "Mathematics"]
linked_notes:
  - "bayes-or-how-to-change-your-mind"
  - "the-naive-assumption-that-works"
  - "an-agent-and-its-world"
graph:
  show: true
  weight: 2
  cluster: "uncertainty"
seo:
  title: "Drawing Uncertainty: Bayesian Networks"
  description: "How a graph of arrows and ten small tables replaces a 32-cell probability table. A runnable burglar alarm network, explaining away, and Laplace smoothing."
---

You are at your desk on an ordinary afternoon when your phone lights up with a call from your neighbour John. He says your burglar alarm is going off.

Do you run home?

John is fairly reliable. If the alarm really is ringing, he phones you nine times in ten. But he is not perfect: on a quiet day, one time in twenty, he phones about an alarm that is not ringing at all. The alarm itself is not perfect either, because a small earthquake can set it off. And burglaries are rare. So what is the chance, now, that your house is being burgled?

The answer is about 1.6 per cent. If a second neighbour, Mary, also calls, it jumps to about 28 per cent. Neither number is obvious, and both come out of a model you can write down in ten numbers. This note is about how that model is drawn, and why the drawing is the clever part.

(The story is the standard textbook one from Russell and Norvig, and the probabilities I use are the ones they use. I recomputed everything below myself.)

## One rule, several questions

In [the note on Bayes' rule](/notes/bayes-or-how-to-change-your-mind/) one hypothesis met one piece of evidence. Real situations have many unknowns at once: whether there was a burglary, whether there was an earthquake, whether the alarm is ringing, whether John called, whether Mary called. Five yes-or-no facts, then.

The most complete description of such a world is the **full joint distribution**: one probability for every combination of answers. Five yes-or-no variables give 2⁵ = 32 combinations, which I will call worlds, and the 32 probabilities sum to 1.

Once you have that table, every question about those variables is a matter of adding up cells. Take a smaller example, the one every textbook uses: a patient may have a cavity, a toothache, or a dentist's probe that catches in the tooth. Three variables, eight worlds.

| | toothache, catch | toothache, no catch | no toothache, catch | no toothache, no catch |
|---|---:|---:|---:|---:|
| **cavity** | 0.108 | 0.012 | 0.072 | 0.008 |
| **no cavity** | 0.016 | 0.064 | 0.144 | 0.576 |

To get the probability of a cavity, add every cell in the first row: 0.108 + 0.012 + 0.072 + 0.008 = 0.2. Adding up cells to remove a variable you do not care about is called **marginalisation**, or summing out. To get the probability of a cavity given a toothache, take the cavity cells that also have a toothache (0.108 + 0.012 = 0.12), divide by all the toothache cells (0.2), and you get 0.6.

That is a complete answer sheet for the dentist's world. The problem is its size. It has 2ⁿ cells for n yes-or-no variables, and one of them is forced by the rest, so you must supply 2ⁿ minus 1 numbers:

| Variables | Cells | Numbers to supply |
|---:|---:|---:|
| 3 | 8 | 7 |
| 5 | 32 | 31 |
| 10 | 1,024 | 1,023 |
| 20 | 1,048,576 | 1,048,575 |

And a table is only as good as the data behind it. To fill 1,024 cells from observations, you would want to have seen every combination of ten facts, many of them rare, and that is not going to happen. So the full answer sheet exists in principle and almost never in practice.

## The link that runs through a third thing

Look at toothache and the probe catching. In the table they are clearly related: the chance of both together is 0.108 + 0.016 = 0.124, while multiplying their separate chances gives 0.2 × 0.34 = 0.068. If you hear that the probe caught, a toothache looks more likely.

But why? Because both are signs of a cavity. Now fix the cavity, and look again. Among the people who have a cavity, the probe catches 90 per cent of the time whether or not they have a toothache. Among the people who do not have one, it catches 20 per cent of the time whether or not they have a toothache. Once you know about the cavity, the toothache tells you nothing more about the probe.

<div class="callout callout-definition"><p><strong>Conditional independence</strong></p><p>Two variables are conditionally independent given a third if, once you know the third, learning one tells you nothing more about the other. Here: P(catch | cavity, toothache) = P(catch | cavity).</p></div>

The link was never direct. It ran through the cavity, and holding the cavity still makes it vanish. This one observation is what rescues us from the huge table, because it lets the joint be built from small pieces:

<div class="formula">P(cavity, toothache, catch) = P(cavity) × P(toothache | cavity) × P(catch | cavity)</div>

For the world with all three true, that is 0.2 × 0.6 × 0.9 = 0.108, which matches the cell in the table. The pieces need five numbers (one for the cavity, and two each for toothache and catch, one per state of the cavity) in place of the table's seven. Three variables is too small to be impressive. The saving is small at three and enormous at thirty.

A word of caution that I will repeat later. This independence is a claim about the world, not a fact about probability. The dentist table happens to satisfy it. Another table might not.

## A picture of who influences whom

A **Bayesian network** is that idea turned into a drawing. Each variable is a node. An arrow from X to Y means X directly influences Y. There are no loops. Each node carries a small table, its **conditional probability table**, giving its probability for each combination of its parents' values. A node with no parents just holds a plain prior.

Here is the alarm.

<figure>
<svg viewBox="0 0 480 300" role="img" aria-label="The alarm network. Burglary and Earthquake each have an arrow to Alarm. Alarm has an arrow to JohnCalls and an arrow to MaryCalls.">
  <defs>
    <marker id="bn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" class="dg-accent"/>
    </marker>
  </defs>
  <rect x="40" y="10" width="120" height="54" rx="6" class="dg-box" stroke-width="1"/>
  <text x="100" y="33" font-size="14" text-anchor="middle" class="dg-text">Burglary</text>
  <text x="100" y="52" font-size="12" text-anchor="middle" class="dg-muted">1 number</text>
  <rect x="320" y="10" width="120" height="54" rx="6" class="dg-box" stroke-width="1"/>
  <text x="380" y="33" font-size="14" text-anchor="middle" class="dg-text">Earthquake</text>
  <text x="380" y="52" font-size="12" text-anchor="middle" class="dg-muted">1 number</text>
  <rect x="180" y="120" width="120" height="54" rx="6" class="dg-highlight" stroke-width="1"/>
  <text x="240" y="143" font-size="14" text-anchor="middle" class="dg-text">Alarm</text>
  <text x="240" y="162" font-size="12" text-anchor="middle" class="dg-muted">4 numbers</text>
  <rect x="40" y="226" width="120" height="54" rx="6" class="dg-box" stroke-width="1"/>
  <text x="100" y="249" font-size="14" text-anchor="middle" class="dg-text">JohnCalls</text>
  <text x="100" y="268" font-size="12" text-anchor="middle" class="dg-muted">2 numbers</text>
  <rect x="320" y="226" width="120" height="54" rx="6" class="dg-box" stroke-width="1"/>
  <text x="380" y="249" font-size="14" text-anchor="middle" class="dg-text">MaryCalls</text>
  <text x="380" y="268" font-size="12" text-anchor="middle" class="dg-muted">2 numbers</text>
  <line x1="110" y1="64" x2="205" y2="116" class="dg-accent-stroke" stroke-width="2" marker-end="url(#bn-arrow)"/>
  <line x1="370" y1="64" x2="275" y2="116" class="dg-accent-stroke" stroke-width="2" marker-end="url(#bn-arrow)"/>
  <line x1="215" y1="174" x2="115" y2="222" class="dg-accent-stroke" stroke-width="2" marker-end="url(#bn-arrow)"/>
  <line x1="265" y1="174" x2="365" y2="222" class="dg-accent-stroke" stroke-width="2" marker-end="url(#bn-arrow)"/>
</svg>
<figcaption>Burglary and earthquake can each set off the alarm. The alarm, and nothing else, makes the neighbours call. Each box says how many numbers its table needs.</figcaption>
</figure>

The arrows say something specific. John and Mary respond to the alarm and to nothing else: if you already know whether the alarm is ringing, their calls tell you nothing more about burglary or earthquake. The tables are:

- P(Burglary) = 0.001 and P(Earthquake) = 0.002.
- P(Alarm | Burglary, Earthquake) is 0.95, 0.94, 0.29 and 0.001 for burglary and earthquake both, burglary only, earthquake only, and neither.
- P(JohnCalls | Alarm) is 0.90 if the alarm is ringing and 0.05 if it is not.
- P(MaryCalls | Alarm) is 0.70 if the alarm is ringing and 0.01 if it is not.

Count the entries: 1 + 1 + 4 + 2 + 2 = 10 numbers, against the 31 the full table needs. The joint is recovered by multiplying each variable's table entry, given its parents:

<div class="formula">P(B, E, A, J, M) = P(B) × P(E) × P(A | B, E) × P(J | A) × P(M | A)</div>

For the quiet, unlikely world in which nothing happens except that the alarm rings and both neighbours call, that is 0.999 × 0.998 × 0.001 × 0.90 × 0.70 = 0.000628.

## Asking the network

Now for the questions. The simplest way to answer them, and the one I will use, is to enumerate all 32 worlds, build each one's probability from the tables, and add up the ones that match. It is brute force, and it is exactly the answer-sheet method from earlier, with the sheet generated from ten numbers instead of stored.

```python
from itertools import product

# Conditional probability tables for the alarm network
P_B = 0.001
P_E = 0.002
P_A = {(True, True): 0.95, (True, False): 0.94,
       (False, True): 0.29, (False, False): 0.001}   # P(Alarm | Burglary, Earthquake)
P_J = {True: 0.90, False: 0.05}                      # P(JohnCalls | Alarm)
P_M = {True: 0.70, False: 0.01}                      # P(MaryCalls | Alarm)

def bern(p, value):
    return p if value else 1 - p

def joint(b, e, a, j, m):
    """One entry of the full joint, built from the five small tables."""
    return (bern(P_B, b) * bern(P_E, e) * bern(P_A[(b, e)], a)
            * bern(P_J[a], j) * bern(P_M[a], m))

worlds = list(product([True, False], repeat=5))      # all 32 worlds (b, e, a, j, m)
print("worlds:", len(worlds), " total probability:", round(sum(joint(*w) for w in worlds), 10))
print("P(j, m, a, not b, not e) =", round(joint(False, False, True, True, True), 6))

def query(target, evidence):
    """P(target | evidence), by summing the worlds that agree with each."""
    names = ["b", "e", "a", "j", "m"]
    def total(condition):
        return sum(joint(*w) for w in worlds
                   if all(w[names.index(k)] == v for k, v in condition.items()))
    return total({**evidence, **target}) / total(evidence)

print("P(B)                       =", round(query({"b": True}, {}), 4))
print("P(B | John calls)          =", round(query({"b": True}, {"j": True}), 4))
print("P(B | John and Mary call)  =", round(query({"b": True}, {"j": True, "m": True}), 4))
print("P(B | alarm)               =", round(query({"b": True}, {"a": True}), 4))
print("P(B | alarm, earthquake)   =", round(query({"b": True}, {"a": True, "e": True}), 4))
```

Output:

```text
worlds: 32  total probability: 1.0
P(j, m, a, not b, not e) = 0.000628
P(B)                       = 0.001
P(B | John calls)          = 0.0163
P(B | John and Mary call)  = 0.2842
P(B | alarm)               = 0.3736
P(B | alarm, earthquake)   = 0.0033
```

The first line is a sanity check: thirty-two probabilities built from ten numbers, and they sum to 1. The next confirms the hand calculation of 0.000628.

Then the answers to the opening question. A burglary starts at 0.1 per cent. After John's call alone it is 1.6 per cent, which is why you should probably not abandon your meeting: John's 5 per cent false-alarm rate is fifty times bigger than the burglary rate, so most of his calls come from nothing at all. After John and Mary both call it is 28.4 per cent. The two calls are separate pieces of evidence that only share a cause, the alarm, and together they lift the chance of a burglary to about 284 times its starting value. It is still more likely than not that there is no burglar in the house, because the starting point was so low. That is the base rate from the [Bayes note](/notes/bayes-or-how-to-change-your-mind/) asserting itself again.

The direction deserves a name. The network was built causally, from causes to effects, because causes are what people can describe. The queries run backwards, from effects to causes. Reading evidence back to its likely source is the **diagnostic** direction, and it is the one most real uses want.

One honest limit on the code. Enumeration over all worlds doubles in cost with every variable you add, so it is hopeless for a network of a hundred variables. Smarter exact algorithms exploit the shape of the graph, and approximate methods trade accuracy for speed. Exact inference in a general network is known to be computationally hard, and I have not studied the clever machinery in depth, so I will leave it there.

## Explaining away

One result in the output is worth slowing down for. Learn that the alarm is ringing, and the chance of a burglary rises to 37.4 per cent. Now learn that there was also an earthquake. The chance of a burglary falls to 0.3 per cent.

Nothing about burglary and earthquakes changed. Burglary and earthquake are independent in this network: knowing one tells you nothing about the other, until you know the alarm rang. The alarm needs an explanation. A burglar is one candidate. An earthquake is another. Confirm the earthquake and the alarm is mostly accounted for, so the burglar is no longer needed to explain it. The textbooks call this **explaining away**.

It is the mirror image of the dentist. There, a shared cause linked two effects, and fixing the cause made the link disappear. Here, a shared effect links two causes that were unrelated, and fixing the effect creates a link between them. A network drawn as arrows makes both patterns visible at a glance, which is much of the point of drawing it.

## When a count is zero

A network's tables have to come from somewhere, and often they come from counting rows in data. That brings a trap.

Take a classic toy dataset of 14 days, recording the weather and whether someone played tennis. There were 5 days with no tennis and 9 with tennis. Of the 5 no-tennis days, none were overcast: 3 were sunny and 2 were rainy. Counted honestly, P(Overcast | no tennis) = 0 out of 5.

A single zero does enormous damage. Every overcast query will now give no tennis a probability of zero, and so a probability of 1.0 for tennis, no matter what else is observed. From fourteen rows, the model has decided that something is impossible.

**Laplace smoothing** is the standard patch. Add one to every count before dividing, and add the number of possible values to the denominator, so the probabilities still sum to 1:

<div class="formula">P(value | class) = (count + 1) / (class count + number of values)</div>

```python
from fractions import Fraction

no_days  = {"Sunny": 3, "Overcast": 0, "Rain": 2}   # 5 days without tennis
yes_days = {"Sunny": 2, "Overcast": 4, "Rain": 3}   # 9 days with tennis

def raw(counts, value):
    return Fraction(counts[value], sum(counts.values()))

def smoothed(counts, value):
    return Fraction(counts[value] + 1, sum(counts.values()) + len(counts))

prior_no, prior_yes = Fraction(5, 14), Fraction(9, 14)

for label, p in (("raw", raw), ("smoothed", smoothed)):
    score_no = prior_no * p(no_days, "Overcast")
    score_yes = prior_yes * p(yes_days, "Overcast")
    chance_yes = score_yes / (score_no + score_yes)
    print(f"{label:>8}: P(tennis | overcast) = {chance_yes} = {float(chance_yes):.4f}")
```

```text
     raw: P(tennis | overcast) = 1 = 1.0000
smoothed: P(tennis | overcast) = 6/7 = 0.8571
```

The answer is still "tennis", but no longer a certainty. A rare event that has not turned up yet is not an impossible one. The correction is crude, though. The pseudo-count of one is arbitrary, and with only five rows it is large next to the real counts: it moved P(Sunny | no tennis) from 0.6 to 0.5. It also treats every unseen value alike. And sometimes a zero is real. The fix is a modelling decision, not a law.

## Where it breaks

- **The structure is a choice.** Someone decided there is an arrow from alarm to John and none from John to Mary. Leave out a real dependency and the network silently ignores it. Arrows also need not be causal; a network with the class at the root and every observed feature hanging directly off it is the shape behind [naive Bayes](/notes/the-naive-assumption-that-works/), chosen on purpose and known to be false, and it can still work.
- **Tables grow with parents.** A node with k yes-or-no parents needs 2ᵏ rows. A dense node brings the huge table back through the side door.
- **Inference can be expensive**, as above.
- **The numbers still have to come from somewhere.** Counting, experts, or experiment. A network can make bad estimates look rigorous.

The idea goes back to Judea Pearl, whose 1988 book *Probabilistic Reasoning in Intelligent Systems* is usually credited with making these networks a rigorous and practical tool.

In insurance the diagnostic direction is the natural one: a claim, a failure or an odd pattern is the effect, and the question is always what most likely caused it. A network gives that question a shape.

Ten numbers can do the work of thirty-one, provided the arrows tell the truth. Draw too few of them and the answers come back tidy and wrong.

---

**Sources**

- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., Pearson, 2021 (the burglar alarm and the dentist examples, explaining away).
- J. Pearl, *Probabilistic Reasoning in Intelligent Systems: Networks of Plausible Inference*, Morgan Kaufmann, 1988.
