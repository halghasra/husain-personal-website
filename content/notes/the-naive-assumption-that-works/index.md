---
title: "The Naive Assumption That Works Anyway"
slug: "the-naive-assumption-that-works"
type: "note"
status: "evergreen"
summary: "Naive Bayes treats related words as independent evidence, an assumption language violates constantly. I wanted to understand why its classifications can survive that mistake, and exactly where the double-counting finally changes the answer."
date: "2026-09-20"
created: "2026-09-20"
updated: "2026-09-20"
topics: ["Artificial Intelligence", "Probability", "Natural Language Processing"]
tags: ["AI", "Probability", "Machine Learning", "NLP", "Python"]
linked_notes:
  - "bayes-or-how-to-change-your-mind"
  - "drawing-uncertainty-bayesian-networks"
  - "how-machines-learn-to-read"
graph:
  show: true
  weight: 2
  cluster: "language"
seo:
  title: "The Naive Assumption That Works Anyway"
  description: "Why Naive Bayes works despite a false independence assumption: worked PlayTennis numbers, Laplace smoothing, a six-review text classifier, and where it breaks."
---

Suppose a review contains the phrase *not good*. A text classifier sees two clues. The word *not* appears more often in negative reviews, and so does *good* in positive ones. Their order and dependence are exactly what give the phrase its meaning, yet Naive Bayes deliberately ignores that relationship and multiplies the clues as though they arrived separately.

The assumption is plainly false for language. *Terrible* and *waste* co-occur; *New* and *York* are not independent observations; repeating the same complaint three ways does not create three witnesses. Still, Naive Bayes remains a useful baseline for text classification and often chooses the correct class even when its probabilities should not be believed.

I wanted to understand that apparent contradiction without settling for the familiar line that all models are wrong. The useful question is more precise: which part of the answer survives the false assumption, which part does not, and how much dependence is required before the predicted class changes too?

## The calculation behind the name

The Bayes part is [Bayes' rule](/notes/bayes-or-how-to-change-your-mind/). For each possible class, the model combines how common that class is with how likely it would be to produce the observed words:

<div class="formula">P(class | words) = P(words | class) × P(class) ÷ P(words)</div>

The denominator is the same whichever class you test, so if you only want to know which class wins, you can ignore it. What is left is a comparison of P(words | class) × P(class) across the classes.

The trouble sits in the first factor. A review is a list of words, and the chance of that exact list under a class is a huge joint probability. You cannot estimate it from data, for a reason I will come to. The naive step is to replace it with a product of one-word probabilities:

<div class="formula">P(w₁, w₂, …, wₙ | class) ≈ P(w₁ | class) × P(w₂ | class) × … × P(wₙ | class)</div>

This turns training into counting: the frequency of each class, and the frequency of each token within it. The simplicity is genuine. The cost is hidden in the approximation that made the counting sufficient.

## The table we cannot fill

Why not estimate the true joint probability of the words? Because the table grows before the evidence does. If each of *n* words is merely present or absent, a full distribution requires 2ⁿ − 1 values per class. Twenty words already require 1,048,575. A vocabulary of 10,000 implies 2¹⁰⁰⁰⁰ possible patterns, while the naive factorisation needs one conditional probability per word.

The idea that licenses this saving is **conditional independence**: two things are conditionally independent given a third if, once you know the third, learning one tells you nothing more about the other. Russell and Norvig's dentist example shows it holding exactly. A toothache and the dentist's probe catching in a tooth are linked, because both are symptoms of a cavity. Their joint table gives the chance of the probe catching as:

| | Toothache | No toothache |
|---|---|---|
| Cavity | 0.9 | 0.9 |
| No cavity | 0.2 | 0.2 |

Once you know about the cavity, the toothache changes nothing. Without that knowledge the link is real: the chance of both is 0.124, while the product of their separate chances is 0.068. I recomputed all of these from the eight cells of the table. The link ran through the cavity, and holding the cavity still removes it.

Naive Bayes transfers that structure to words, using the class in place of the cavity. Once the review is assumed negative, every token is treated as an independent clue. In the dentist example, the conditional independence follows from the causal structure of the variables. In text, it is mostly a computational bargain.

## Weather before words

Before returning to text, the classic PlayTennis table makes the arithmetic visible. It contains fourteen days described by outlook, temperature, humidity and wind, with a final record of whether tennis was played. Nine days are labelled Yes and five No. The new observation is Sunny with a Strong wind.

Count within each class. Of the five No days, three were Sunny and three had Strong wind. Of the nine Yes days, two were Sunny and three had Strong wind. Then score each class:

<div class="callout callout-hint"><p><strong>Worked example</strong></p><p>No: 5/14 × 3/5 × 3/5 = 9/70 = 0.128571.</p><p>Yes: 9/14 × 2/9 × 3/9 = 1/21 = 0.047619.</p><p>Divide each by their sum (0.176190) and the model says 0.7297 for No and 0.2703 for Yes.</p></div>

The following code does the same sum with exact fractions, so there is no rounding to hide behind:

```python
from fractions import Fraction as F

rows = [("Sunny","Hot","High","Weak","No"), ("Sunny","Hot","High","Strong","No"),
        ("Overcast","Hot","High","Weak","Yes"), ("Rain","Mild","High","Weak","Yes"),
        ("Rain","Cool","Normal","Weak","Yes"), ("Rain","Cool","Normal","Strong","No"),
        ("Overcast","Cool","Normal","Strong","Yes"), ("Sunny","Mild","High","Weak","No"),
        ("Sunny","Cool","Normal","Weak","Yes"), ("Rain","Mild","Normal","Weak","Yes"),
        ("Sunny","Mild","Normal","Strong","Yes"), ("Overcast","Mild","High","Strong","Yes"),
        ("Overcast","Hot","Normal","Weak","Yes"), ("Rain","Mild","High","Strong","No")]
col = {"Outlook": 0, "Wind": 3}
size = {"Outlook": 3, "Wind": 2}

def score(evidence, cls, alpha=0):
    sub = [r for r in rows if r[4] == cls]
    s = F(len(sub), len(rows))
    for feature, value in evidence.items():
        hits = sum(r[col[feature]] == value for r in sub)
        s *= F(hits + alpha, len(sub) + alpha * size[feature])
    return s

ev = {"Outlook": "Sunny", "Wind": "Strong"}
no, yes = score(ev, "No"), score(ev, "Yes")
print(no, yes, round(float(no / (no + yes)), 4))
```

```text
9/70 1/21 0.7297
```

Same numbers as by hand. Notice that the `alpha` argument in the function is doing nothing yet. It is about to matter.

## Never is a long time

Now ask about an Overcast day with a Strong wind. Look at the table: every Overcast day in the data was a Yes. Not one No day was Overcast, so counted honestly, P(Overcast | No) = 0 out of 5.

```python
ev = {"Outlook": "Overcast", "Wind": "Strong"}
print(score(ev, "No"), score(ev, "Yes"))
```

```text
0 2/21
```

The No score is exactly zero, and it will be zero whatever the wind is doing, because a product with a zero in it is zero. Fourteen rows have proved that something is impossible. Five days without an Overcast sky in them became a law of nature.

The repair is called **Laplace smoothing** (after Pierre-Simon Laplace), or add-one smoothing. Before turning counts into probabilities, pretend you have seen every possible value one extra time. If a feature has k possible values:

<div class="formula">P(value | class) = (count + 1) ÷ (class count + k)</div>

The +1 gives every value a small chance, and the + k in the denominator keeps each set of probabilities adding up to 1. For Outlook there are three values and five No days, so the zero becomes 1/8:

```python
no, yes = score(ev, "No", 1), score(ev, "Yes", 1)
print(no, yes, round(float(no / (no + yes)), 4))
```

```text
5/196 15/154 0.2075
```

Now the model says 0.2075 for No, and so 0.7925 for Yes. The answer is still "play", but as a lean and not a certainty. The fix has a price. Smoothing also moved P(Sunny | No) from 3/5 = 0.6 down to 4/8 = 0.5, and with only five rows to learn from, that is a large nudge. The pseudo-count is arbitrary, it treats every unseen value alike, and it can hide a zero that is real. Even so, not having seen something is not evidence that it cannot happen, and a classifier that cannot tell those apart will eventually say something absurd.

## Six reviews

The same machinery runs on text, with words in place of weather. Here is a classifier trained on six reviews, written out in plain Python. The three positive ones are "fantastic movie", "great movie great cast" and "movie is great fun". The three negative ones are "dumb movie", "dull dumb plot" and "movie boring dull". I drop the stop word *is*, which leaves a vocabulary of 9 words, with 9 word tokens in the positive reviews and 8 in the negative.

```python
from collections import Counter

train = [("fantastic movie", "pos"), ("great movie great cast", "pos"),
         ("movie is great fun", "pos"), ("dumb movie", "neg"),
         ("dull dumb plot", "neg"), ("movie boring dull", "neg")]
stop = {"is"}

counts = {"pos": Counter(), "neg": Counter()}
docs = Counter()
for text, label in train:
    docs[label] += 1
    counts[label].update(w for w in text.split() if w not in stop)

vocab = sorted(set(counts["pos"]) | set(counts["neg"]))
print(len(vocab), sum(counts["pos"].values()), sum(counts["neg"].values()))

def score(text, label, alpha=1):
    total = sum(counts[label].values())
    s = docs[label] / sum(docs.values())
    for w in text.split():
        s *= (counts[label][w] + alpha) / (total + alpha * len(vocab))
    return s

review = "great dull movie"
pos, neg = score(review, "pos"), score(review, "neg")
print(round(pos, 6), round(neg, 6), round(pos / (pos + neg), 4))
print(round(score(review, "pos", alpha=0), 6), round(score(review, "neg", alpha=0), 6))
```

```text
9 9 8
0.001372 0.000916 0.5996
0.0 0.0
```

The test review, "great dull movie", is mixed on purpose. By hand, the positive score is 1/2 × (3+1)/(9+9) × (0+1)/(9+9) × (3+1)/(9+9) = 0.001372, and the negative score is 1/2 × (0+1)/(8+9) × (2+1)/(8+9) × (2+1)/(8+9) = 0.000916. That gives 0.5996 for positive: a slight lean, which is the honest answer, because *great* pulls one way and *dull* pulls the other. I cross-checked this against scikit-learn's `MultinomialNB(alpha=1)` on the same counts, and it returns 0.4004 for negative and 0.5996 for positive.

The last line of the output is the zero problem again. Without smoothing, *dull* has never been seen in a positive review and *great* has never been seen in a negative one, so both scores collapse to exactly 0 and the model cannot choose at all.

One practical detail for real text. A review of 200 words multiplies 200 small numbers, and the result underflows: `0.001 ** 200` is `0.0` in floating point. Implementations add logarithms instead, and 200 × ln(0.001) is a perfectly healthy -1381.55.

## When the cheat is caught

So far the false assumption has cost nothing, which should make us suspicious. Here is where it costs something, with numbers I can check exactly.

Take two equally likely classes, A and B, and a clue *x* that points to the right class 70% of the time. Now suppose the data contains the same clue three times over, a perfectly dependent copy of itself, as when a review repeats one complaint in three phrasings. Naive Bayes counts each copy as fresh, independent evidence. The code also sets up a second, independent clue *z*, right 80% of the time, which I use in a moment.

```python
from fractions import Fraction as F

px, pz = F(7, 10), F(4, 5)

def naive_posterior(copies):
    a = px ** copies
    b = (1 - px) ** copies
    return a / (a + b)

for k in (1, 2, 3, 5):
    print(k, round(float(naive_posterior(k)), 4))

def odds_for_A(copies, with_z):
    o = (px / (1 - px)) ** copies
    if with_z:
        o *= (1 - pz) / pz
    return o

print("naive, 3 copies of x:", round(float(odds_for_A(3, True)), 2))
print("truth, x counted once:", round(float(odds_for_A(1, True)), 2))
```

```text
1 0.7
2 0.8448
3 0.927
5 0.9857
naive, 3 copies of x: 3.18
truth, x counted once: 0.58
```

The first four lines isolate the calibration problem. One clue supports class A with probability 0.7. Five perfectly dependent copies raise the naive posterior to 0.9857 even though the evidence has not changed. The ranking survives because A was already ahead, but the reported confidence no longer describes the information available.

The last two lines make the dependence strong enough to alter the class. A second, independent clue *z* is correct 80 per cent of the time and points to B, while *x* points to A. Count *x* once and A's odds are roughly 0.58 to 1, so B wins. Count its three copies independently and A's odds become about 3.18 to 1. Repetition has allowed one source of evidence to outvote a stronger independent source.

This separates two claims that are often bundled together. A classifier can place the correct class first without assigning it a calibrated probability. Domingos and Pazzani showed formally that the naive classifier can be optimal under zero-one classification loss even when its probability estimates are poor and its independence assumptions fail. Classification only needs the decision boundary to fall in the right place. Dependence becomes fatal when the duplicated evidence moves an observation across that boundary.

The practical consequence depends on what the prediction will be used for. A rough label for routing free-text notes may tolerate uncalibrated confidence. A threshold that triggers an investigation, denies an application or prioritises a clinical case cannot treat an asserted 99 per cent as meaningful without calibration and validation. Where context and dependence carry the meaning, a model that represents them, such as the networks in [Drawing Uncertainty](/notes/drawing-uncertainty-bayesian-networks/) or the contextual methods in [How Machines Learn to Read](/notes/how-machines-learn-to-read/), is a better match to the problem.

Naive Bayes works because being wrong about the joint distribution does not automatically make it wrong about the ordering of the classes. That is a narrower achievement than accurate probability estimation, but it is still a useful one. The mistake is asking the model's confidence to promise more than its assumptions can support.

---

## References

- S. Russell and P. Norvig, [*Artificial Intelligence: A Modern Approach*](https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003500), 4th ed., Pearson, 2021 (Bayes' rule, conditional independence and the dentist example).
- P. Domingos and M. Pazzani, ["On the Optimality of the Simple Bayesian Classifier under Zero-One Loss"](https://doi.org/10.1023/A:1007413511361), *Machine Learning*, 29, 1997, 103–130.
