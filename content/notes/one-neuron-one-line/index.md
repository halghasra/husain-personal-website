---
title: "One Neuron, One Line, and the Problem That Froze a Field"
slug: "one-neuron-one-line"
type: "note"
status: "evergreen"
summary: "Four points on a square and a rule a child can state, which a single artificial neuron can never learn. Why it cannot, what one extra layer changes, and what the popular story about a frozen field gets right and wrong."
date: "2026-08-08"
created: "2026-08-08"
updated: "2026-08-08"
topics: ["Artificial Intelligence", "Neural Networks"]
tags: ["AI", "Neural Networks", "History of AI", "Python", "Mathematics"]
linked_notes:
  - "backpropagation-learning-by-blame"
  - "memorising-is-not-learning"
  - "what-are-we-actually-trying-to-build"
graph:
  show: true
  weight: 2
  cluster: "neural-networks"
seo:
  title: "One Neuron, One Line, and the Problem That Froze a Field"
  description: "The perceptron learns AND but never XOR. A runnable proof, a two-layer fix, and a careful look at how much of the AI winter story the XOR problem explains."
---

Take four points at the corners of a square and label them with a rule a child could follow: a corner gets a 1 if exactly one of its two coordinates is 1, and a 0 otherwise. Bottom left is 0. Top right is 0. The other two corners are 1.

Now ask a single artificial neuron to learn those four labels. It will happily learn "both" and it will happily learn "either". It will never learn "one or the other, but not both", whatever weights it is given and however long it is allowed to practise.

That small failure is called the XOR problem, and it has a reputation. It is often told as the reason a whole field stalled for years. I wanted to know two things: why a neuron fails at something so easy to say, and how much of that reputation is earned.

## The smallest neuron

An artificial neuron does three things. It multiplies each input by a **weight**, adds the results together with a constant called the **bias**, and then fires if the total is above zero and stays silent if it is not.

<div class="formula">output = 1 if (w₁ × x₁ + w₂ × x₂ + b) > 0, otherwise 0</div>

The geometry is the part worth holding on to. The set of points where the total is exactly zero is a straight line. Points on one side make the neuron fire and points on the other side keep it quiet. So one neuron is one straight cut through the space of inputs, and nothing else. This version, with a hard fire-or-stay-silent step, is the one Frank Rosenblatt described as the perceptron in the late 1950s.

It learns from its mistakes. Show it an example. If the answer is right, change nothing. If it is wrong, push each weight a little towards the right answer:

<div class="formula">w ← w + (target - output) × x        b ← b + (target - output)</div>

Try it on AND, where all weights start at zero. The first mistake is on the input (1, 1), which should give 1 and gives 0. The rule sets w to (0, 0) + (1 - 0) × (1, 1) = (1, 1) and b to 1. The code below runs the whole process on AND, then OR, then XOR.

```python
import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])

def train(targets, passes=1000, show=0):
    w, b = np.zeros(2), 0.0
    mistakes_per_pass = []
    for p in range(1, passes + 1):
        mistakes = 0
        for x, t in zip(X, targets):
            y = int(w @ x + b > 0)              # the step: fire or stay silent
            if y != t:                          # wrong, so nudge towards the target
                w, b = w + (t - y) * x, b + (t - y)
                mistakes += 1
                if p <= show:
                    print(f"  pass {p}: input {x.tolist()} wanted {t}, got {y}, so w = {w.tolist()}, b = {b}")
        mistakes_per_pass.append(mistakes)
        if mistakes == 0:
            break
    return w, b, mistakes_per_pass

w, b, m = train([0, 0, 0, 1], show=1)
print("AND settled after", len(m), "passes, w =", w.tolist(), "b =", b)
w, b, m = train([0, 1, 1, 1])
print("OR settled after", len(m), "passes")
w, b, m = train([0, 1, 1, 0])
print("XOR mistakes per pass, first 8 passes:", m[:8])
print("XOR passes tried:", len(m), "| passes with no mistakes:", m.count(0))
```

```text
  pass 1: input [1, 1] wanted 1, got 0, so w = [1.0, 1.0], b = 1.0
AND settled after 6 passes, w = [2.0, 1.0] b = -2.0
OR settled after 4 passes
XOR mistakes per pass, first 8 passes: [2, 3, 4, 4, 4, 4, 4, 4]
XOR passes tried: 1000 | passes with no mistakes: 0
```

AND settles after six passes through the four examples, at weights (2, 1) and bias -2. You can check that by hand: input (1, 1) gives 2 + 1 - 2 = 1, which fires, while (1, 0) gives 0 and (0, 1) gives -1, which do not. OR settles faster.

XOR does not settle at all. From the third pass onwards the neuron makes four mistakes per pass, one for every example, and it goes on doing so until I stopped it at 1,000. Each nudge repairs one case by breaking another.

Where the classes can be separated by a line, the perceptron rule is proven to find a line in a finite number of steps. Where they cannot, it has nothing to converge to.

## Why no weights will do

Trying harder is not the answer, and a short argument shows why. A neuron with weights a and b and bias c fires when a × x₁ + b × x₂ + c > 0. For XOR it would need all four of these to hold:

- c ≤ 0, so that (0, 0) stays silent
- a + c > 0, so that (1, 0) fires
- b + c > 0, so that (0, 1) fires
- a + b + c ≤ 0, so that (1, 1) stays silent

Add the middle two: a + b + 2c > 0. That means a + b + c > -c, and since c ≤ 0, -c is at least zero. So a + b + c is positive, which contradicts the last line. No weights satisfy all four.

An argument on paper is the real proof, but I like to see the wall as well. This tries every neuron whose weights and bias sit on a grid from -5 to 5 in steps of a quarter:

```python
import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], float)
xor = [0, 1, 1, 0]

# Try every single neuron with a, b and c on a grid from -5 to 5 in steps of 0.25
grid = np.arange(-5, 5.01, 0.25)
best = 0
for a in grid:
    for b in grid:
        for c in grid:
            right = sum(int(a * x[0] + b * x[1] + c > 0) == t for x, t in zip(X, xor))
            best = max(best, right)
print("settings tried:", len(grid) ** 3, "| best score on XOR:", best, "of 4")
```

```text
settings tried: 68921 | best score on XOR: 3 of 4
```

Three out of four is the ceiling. That is exactly what the geometry predicts: one straight line can always get three corners right and cannot get the fourth.

## The fix is a second layer

Here is the part that I found almost anticlimactic. Put one more layer of neurons between the inputs and the output, and XOR becomes easy. This network has two hidden units. I chose the weights by hand:

<div class="formula">h₁ = ReLU(x₁ + x₂)        h₂ = ReLU(x₁ + x₂ - 1)        output = h₁ - 2 × h₂</div>

ReLU is the simplest bend there is: it returns zero for anything below zero and the number itself for anything above.

```python
import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], float)
relu = lambda z: np.maximum(0, z)                # zero below zero, a ramp above it

W1 = np.array([[1, 1], [1, 1]], float)           # both hidden units add the two inputs
b1 = np.array([0, -1], float)                    # the second has a higher bar to clear
W2 = np.array([1, -2], float)                    # output = h1 - 2 * h2

H = relu(X @ W1 + b1)
out = H @ W2
for x, h, o in zip(X, H, out):
    print(x.astype(int).tolist(), "-> hidden", h.tolist(), "-> output", o)
```

```text
[0, 0] -> hidden [0.0, 0.0] -> output 0.0
[0, 1] -> hidden [1.0, 0.0] -> output 1.0
[1, 0] -> hidden [1.0, 0.0] -> output 1.0
[1, 1] -> hidden [2.0, 1.0] -> output 0.0
```

All four are right. Look at what the hidden layer did to the inputs. It re-described the four corners as three distinct points: (0, 0), (1, 0) and (2, 1). The two corners that should both give 1 landed on the same spot, and in that new space a single line does separate the classes.

<figure>
<svg viewBox="0 0 680 280" role="img" aria-label="Two panels. Left: the four XOR inputs at the corners of a square, with the two 1s on one diagonal and the two 0s on the other, so no straight line separates them. Right: the same four cases after the hidden layer, as three points, where one straight line separates the single 1 from the two 0s.">
  <text x="150" y="24" font-size="14" text-anchor="middle" class="dg-text">Input space: no line works</text>
  <rect x="70" y="60" width="160" height="160" rx="2" fill="none" class="dg-line" stroke-width="1.5"/>
  <circle cx="70" cy="220" r="11" class="dg-ink"/>
  <circle cx="230" cy="60" r="11" class="dg-ink"/>
  <circle cx="230" cy="220" r="11" class="dg-accent"/>
  <circle cx="70" cy="60" r="11" class="dg-accent"/>
  <text x="50" y="240" font-size="12" text-anchor="middle" class="dg-muted">(0, 0) gives 0</text>
  <text x="250" y="240" font-size="12" text-anchor="middle" class="dg-muted">(1, 0) gives 1</text>
  <text x="50" y="42" font-size="12" text-anchor="middle" class="dg-muted">(0, 1) gives 1</text>
  <text x="250" y="42" font-size="12" text-anchor="middle" class="dg-muted">(1, 1) gives 0</text>
  <text x="150" y="268" font-size="12" text-anchor="middle" class="dg-muted">x₁ across, x₂ up</text>
  <text x="500" y="24" font-size="14" text-anchor="middle" class="dg-text">Hidden space: one line does</text>
  <line x1="400" y1="220" x2="600" y2="220" class="dg-line" stroke-width="1"/>
  <line x1="400" y1="220" x2="400" y2="70" class="dg-line" stroke-width="1"/>
  <line x1="445" y1="220" x2="625" y2="80" class="dg-accent-stroke" stroke-width="2.5"/>
  <circle cx="400" cy="220" r="11" class="dg-ink"/>
  <circle cx="490" cy="220" r="11" class="dg-accent"/>
  <circle cx="580" cy="80" r="11" class="dg-ink"/>
  <text x="400" y="246" font-size="12" text-anchor="middle" class="dg-muted">(0, 0)</text>
  <text x="490" y="246" font-size="12" text-anchor="middle" class="dg-muted">(1, 0) and (0, 1)</text>
  <text x="560" y="64" font-size="12" text-anchor="middle" class="dg-muted">(1, 1)</text>
  <text x="500" y="268" font-size="12" text-anchor="middle" class="dg-muted">h₁ across, h₂ up</text>
</svg>
<figcaption>Dark dots are the cases that must give 0, amber dots the cases that must give 1. On the left, no straight line separates them. After the hidden layer (right), the two 1s have landed on the same point and the amber line puts them on one side.</figcaption>
</figure>

One condition matters here, and it is easy to miss. A hidden layer alone is not enough. If the units in between are plain weighted sums, the two layers collapse into one. Multiplying one linear step by another gives a linear step, and you are back to a single line. This snippet checks that on random weights:

```python
import numpy as np

relu = lambda z: np.maximum(0, z)
rng = np.random.default_rng(0)
A1, c1 = rng.normal(size=(3, 2)), rng.normal(size=3)     # first layer: 2 inputs to 3 units
A2, c2 = rng.normal(size=(1, 3)), rng.normal(size=1)     # second layer: 3 units to 1 output
x = rng.normal(size=(5, 2))

two_layers = (x @ A1.T + c1) @ A2.T + c2
one_layer = x @ (A2 @ A1).T + (A2 @ c1 + c2)
print("two linear layers vs the one layer they collapse into:", np.abs(two_layers - one_layer).max())

with_bend = relu(x @ A1.T + c1) @ A2.T + c2
print("same two layers with a ReLU between them:", round(float(np.abs(with_bend - one_layer).max()), 3))
```

```text
two linear layers vs the one layer they collapse into: 8.881784197001252e-16
same two layers with a ReLU between them: 0.069
```

Without the bend the two layers and the single combined layer agree to within rounding error, about 10⁻¹⁵. With a ReLU between them they no longer do, which is the whole point. Stack lines and you still have a line. Put a bend between them and you have a network.

## What the failure did, and what it did not

The popular version runs like this. In 1969 Marvin Minsky and Seymour Papert published *Perceptrons*, showed that a neuron cannot do XOR, and neural network research froze. I should say plainly that I have not read the book itself. What follows is a map drawn from other people's histories, and I have kept to the parts I can support.

What I am confident of is this. Rosenblatt described the perceptron in the late 1950s. Minsky and Papert's 1969 book is a mathematical study of what perceptrons with a single layer can and cannot compute, and XOR is the standard small example of the limit. The limit is real, and you have just watched it.

What the histories I have read say about the first AI winter is wider than one book. They tie the first downturn to the early 1970s, to promises that ran ahead of results and to funding cuts, with the 1973 Lighthill report in Britain as the landmark. Russell and Norvig list the limits of single-layer networks as one setback among several in that period, next to failed machine translation and programs that did not scale. One of the histories, by Haenlein and Kaplan, credits Minsky and Papert with showing that computers lacked the processing power for neural networks, which is a different claim from the XOR limit. The sources do not tell one tidy story, and I would not put much weight on any single strand of it.

So here is what I am comfortable saying. The XOR limit was a real and well-known result about one kind of neuron. It sat alongside other disappointments and other pressures. I cannot honestly say it alone froze a field, and the histories I have read do not say so either.

There is a more useful point hiding in the technicalities. The fix, a hidden layer, creates a new difficulty. The rule above adjusts each weight using the error at that neuron's own output. A hidden unit has no target of its own, because nobody has told it what it ought to have said. And the hard step gives no slope to follow, because it is flat everywhere except at the jump. Making hidden layers trainable needed something else. That something was backpropagation, which Rumelhart, Hinton and Williams published in 1986 (the idea had earlier roots that I have not traced). It is the subject of [the next note](/notes/backpropagation-learning-by-blame/).

## The same trap in a scorecard

My own work is in insurance, where a scorecard adds up points for various risk factors and compares the total with a cut-off. That is a perceptron in plain clothes: a weighted sum against a threshold. And it has the perceptron's blind spot. If the risk is high when one of two factors is present but low when both are present, no choice of points will express it. Someone has to build a combined factor by hand, which is exactly what a hidden layer does automatically.

I take a general habit from that. Before asking how well a model fits, ask what its shape cannot express. A model can be excellent on average and still be unable to represent one pattern that matters.

The cure for one line was a second layer, with a bend between the two.

---

**Sources**

- F. Rosenblatt, "The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain", *Psychological Review*, 65(6), 1958.
- M. Minsky and S. Papert, *Perceptrons: An Introduction to Computational Geometry*, MIT Press, 1969. (Not read for this note; cited for the date and subject.)
- D. E. Rumelhart, G. E. Hinton and R. J. Williams, "Learning representations by back-propagating errors", *Nature*, 323, 1986.
- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., Pearson, 2021.
- M. Haenlein and A. Kaplan, "A Brief History of Artificial Intelligence: On the Past, Present, and Future of Artificial Intelligence", *California Management Review*, 61(4), 2019.
- A. Toosi, A. Bottino, B. Saboury, E. Siegel and A. Rahmim, "A Brief History of AI: How to Prevent Another Winter (A Critical Review)", *PET Clinics*, 16(4), 2021.
