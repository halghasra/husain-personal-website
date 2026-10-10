---
title: "Backpropagation: Learning by Assigning Blame"
slug: "backpropagation-learning-by-blame"
type: "note"
status: "evergreen"
summary: "The sentence I first met was that the error is fed back and the weights are adjusted. Here is what that actually means: one tiny network, every number worked out and checked, and why the blame has to be shared out layer by layer."
date: "2026-10-10"
created: "2026-10-10"
updated: "2026-10-10"
topics: ["Artificial Intelligence", "Neural Networks", "Optimisation"]
tags: ["AI", "Neural Networks", "Optimisation", "Mathematics", "Python"]
linked_notes:
  - "one-neuron-one-line"
  - "memorising-is-not-learning"
  - "why-data-is-a-matrix"
graph:
  show: true
  weight: 2
  cluster: "neural-networks"
seo:
  title: "Backpropagation: Learning by Assigning Blame"
  description: "Backpropagation worked through with a tiny network: every number checked in Python, a numerical gradient check, and why softmax with cross-entropy suits the output."
---

When I first studied neural networks, the sentence I met for how they learn was this: the error is fed back and the weights are adjusted. It sounds like an explanation. It is really a description of the result, and it leaves the two hard questions alone. Adjusted by how much? And which weights, when even a modest network has hundreds of thousands of them?

In [the previous note](/notes/one-neuron-one-line/) I solved XOR with a small network whose weights I picked by hand. Nobody can do that for a network that reads handwritten digits. A plain one, with two hidden layers of 512 units, looks like this:

```python
# How many weights and biases in a plain network that reads 28 x 28 pixel digits?
layers = [784, 512, 512, 10]
total = sum(a * b + b for a, b in zip(layers, layers[1:]))
print("weights and biases:", total)
```

```text
weights and biases: 669706
```

That is 669,706 numbers, and when the network gets a digit wrong, every one of them contributed a little to the mistake. Training means working out each one's share and changing it accordingly. That is the whole job of **backpropagation**, and I think the best word for it is blame.

## Blame as a slope

Here is the question to ask of any single weight: if I nudge this weight up by a tiny amount, does the error go up or down, and by how much? The answer is the **slope** of the error with respect to that weight. A large positive slope means the weight is pushing the error up, so lower it. A slope near zero means leave it alone. Collect the slopes for every weight into one list and you have the **gradient**.

Given the slope, the rule for the update is one line, and it is called **gradient descent**:

<div class="formula">new weight = old weight - step size × slope</div>

The step size deserves respect, because the slope says which way is downhill and nothing about how far to walk. Take an error of (w - 3)², which is lowest at w = 3, and start at w = 0:

```python
slope = lambda w: 2 * (w - 3)            # slope of the error (w - 3)**2, lowest at w = 3

for step_size in (0.1, 1.0, 1.1):
    w, path = 0.0, [0.0]
    for _ in range(6):
        w = w - step_size * slope(w)     # new weight = old weight - step size * slope
        path.append(round(w, 4))
    print("step size", step_size, path)
```

```text
step size 0.1 [0.0, 0.6, 1.08, 1.464, 1.7712, 2.017, 2.2136]
step size 1.0 [0.0, 6.0, 0.0, 6.0, 0.0, 6.0, 0.0]
step size 1.1 [0.0, 6.6, -1.32, 8.184, -3.2208, 10.465, -5.958]
```

At 0.1 the weight creeps towards 3. At 1.0 it leaps over the target and back, forever. At 1.1 every leap is bigger than the last, and the error grows instead of shrinking.

There is one more thing the previous note leaves behind. A hard step, fire or do not fire, is flat everywhere except at the jump, so its slope is zero and there is nothing for blame to travel along. Networks that learn this way use a smooth bend instead. The classic choice is the sigmoid, σ(z) = 1 / (1 + e⁻ᶻ), which rises smoothly from 0 to 1 and has a slope of σ(z) × (1 - σ(z)).

## One step, every number

The smallest network that still shows the whole mechanism has one input, one hidden unit and one output unit, each with a sigmoid. The input is x = 1 and the answer we wanted is 0. The error is half the squared miss. The starting weights are w₁ = 0.5, b₁ = 0, w₂ = 1.5 and b₂ = -0.5.

<figure>
<svg viewBox="0 0 720 220" role="img" aria-label="A chain of a network. Along the top, values flow forward from the input x to the hidden unit, to the output unit, to the error. Along the bottom, blame flows backward from the error to the output unit and then to the hidden unit, each step multiplying by one local slope.">
  <defs>
    <marker id="bp-fwd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" class="dg-accent"/>
    </marker>
    <marker id="bp-back" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" class="dg-ink"/>
    </marker>
  </defs>
  <text x="10" y="26" font-size="12" text-anchor="start" class="dg-muted">Forward pass: values</text>
  <rect x="10" y="40" width="90" height="56" rx="6" class="dg-box" stroke-width="1"/>
  <text x="55" y="64" font-size="13" text-anchor="middle" class="dg-text">input</text>
  <text x="55" y="82" font-size="13" text-anchor="middle" class="dg-text">x = 1</text>
  <rect x="170" y="40" width="130" height="56" rx="6" class="dg-box" stroke-width="1"/>
  <text x="235" y="64" font-size="13" text-anchor="middle" class="dg-text">hidden unit</text>
  <text x="235" y="82" font-size="13" text-anchor="middle" class="dg-text">h = 0.6225</text>
  <rect x="400" y="40" width="130" height="56" rx="6" class="dg-box" stroke-width="1"/>
  <text x="465" y="64" font-size="13" text-anchor="middle" class="dg-text">output unit</text>
  <text x="465" y="82" font-size="13" text-anchor="middle" class="dg-text">y = 0.6068</text>
  <rect x="620" y="40" width="90" height="56" rx="6" class="dg-box" stroke-width="1"/>
  <text x="665" y="64" font-size="13" text-anchor="middle" class="dg-text">error</text>
  <text x="665" y="82" font-size="13" text-anchor="middle" class="dg-text">0.1841</text>
  <line x1="100" y1="68" x2="166" y2="68" class="dg-accent-stroke" stroke-width="2" marker-end="url(#bp-fwd)"/>
  <line x1="300" y1="68" x2="396" y2="68" class="dg-accent-stroke" stroke-width="2" marker-end="url(#bp-fwd)"/>
  <line x1="530" y1="68" x2="616" y2="68" class="dg-accent-stroke" stroke-width="2" marker-end="url(#bp-fwd)"/>
  <text x="10" y="132" font-size="12" text-anchor="start" class="dg-muted">Backward pass: blame</text>
  <rect x="170" y="146" width="130" height="56" rx="6" class="dg-highlight" stroke-width="1"/>
  <text x="235" y="170" font-size="13" text-anchor="middle" class="dg-text">blame at hidden</text>
  <text x="235" y="188" font-size="13" text-anchor="middle" class="dg-text">d1 = 0.0510</text>
  <rect x="400" y="146" width="130" height="56" rx="6" class="dg-highlight" stroke-width="1"/>
  <text x="465" y="170" font-size="13" text-anchor="middle" class="dg-text">blame at output</text>
  <text x="465" y="188" font-size="13" text-anchor="middle" class="dg-text">d2 = 0.1448</text>
  <rect x="620" y="146" width="90" height="56" rx="6" class="dg-subtle" stroke-width="1"/>
  <text x="665" y="170" font-size="13" text-anchor="middle" class="dg-text">miss</text>
  <text x="665" y="188" font-size="13" text-anchor="middle" class="dg-text">y - t = 0.6068</text>
  <line x1="620" y1="174" x2="534" y2="174" class="dg-line" stroke-width="2.5" marker-end="url(#bp-back)"/>
  <line x1="400" y1="174" x2="304" y2="174" class="dg-line" stroke-width="2.5" marker-end="url(#bp-back)"/>
  <text x="577" y="164" font-size="11" text-anchor="middle" class="dg-muted">× y(1-y)</text>
  <text x="352" y="164" font-size="11" text-anchor="middle" class="dg-muted">× w₂ × h(1-h)</text>
</svg>
<figcaption>Values travel forward and are stored. Blame travels backward, and each step multiplies it by one local slope. Every number in the figure is worked out below.</figcaption>
</figure>

The code does the forward pass, then the backward pass, then checks the answer in a completely different way by nudging each weight and watching the error. It then takes one step.

```python
from math import exp

sig = lambda z: 1 / (1 + exp(-z))
x, t = 1.0, 0.0                              # one input, and the answer we wanted is 0

def forward(w):
    w1, b1, w2, b2 = w
    h = sig(w1 * x + b1)
    y = sig(w2 * h + b2)
    return h, y, 0.5 * (y - t) ** 2          # the error: half the squared miss

def backward(w):
    w1, b1, w2, b2 = w
    h, y, _ = forward(w)
    d2 = (y - t) * y * (1 - y)               # blame at the output unit
    d1 = d2 * w2 * h * (1 - h)               # that blame, passed back through w2
    return d2, d1, [d1 * x, d1, d2 * h, d2]  # last item: gradient for w1, b1, w2, b2

w = [0.5, 0.0, 1.5, -0.5]                    # w1, b1, w2, b2
h, y, loss = forward(w)
print(f"forward : h = {h:.4f}  y = {y:.4f}  loss = {loss:.4f}")

d2, d1, grad = backward(w)
print(f"backward: y(1-y) = {y * (1 - y):.4f}  d2 = {d2:.4f}  h(1-h) = {h * (1 - h):.4f}  d1 = {d1:.4f}")
print("gradient:", [round(g, 4) for g in grad])

def by_nudging(i, eps=1e-6):                 # check: nudge one weight each way, watch the error
    up, down = list(w), list(w)
    up[i] += eps
    down[i] -= eps
    return (forward(up)[2] - forward(down)[2]) / (2 * eps)
print("by nudging:", [round(by_nudging(i), 4) for i in range(4)])

step_size = 1.0                              # one step downhill
w_new = [wi - step_size * g for wi, g in zip(w, grad)]
print("new weights:", [round(v, 4) for v in w_new], " new loss", round(forward(w_new)[2], 4))

for _ in range(200):                         # keep going
    w = [wi - step_size * g for wi, g in zip(w, backward(w)[2])]
print("after 200 steps: y =", round(forward(w)[1], 4), " loss =", round(forward(w)[2], 4))
```

```text
forward : h = 0.6225  y = 0.6068  loss = 0.1841
backward: y(1-y) = 0.2386  d2 = 0.1448  h(1-h) = 0.2350  d1 = 0.0510
gradient: [0.051, 0.051, 0.0901, 0.1448]
by nudging: [0.051, 0.051, 0.0901, 0.1448]
new weights: [0.449, -0.051, 1.4099, -0.6448]  new loss 0.151
after 200 steps: y = 0.0507  loss = 0.0013
```

Here is the same thing in words, with the numbers.

1. **Forward.** The hidden unit sees 0.5 × 1 + 0 = 0.5 and returns σ(0.5) = 0.6225. The output unit sees 1.5 × 0.6225 - 0.5 = 0.4337 and returns σ(0.4337) = 0.6068. The error is ½ × 0.6068² = 0.1841.
2. **Blame at the output.** The miss is y - t = 0.6068. The output unit's slope is y × (1 - y) = 0.2386. Multiply them: d2 = 0.1448.
3. **Blame for the output weights.** The weight w₂ multiplied the hidden value h, so its share is d2 × h = 0.0901. The bias b₂ was added without being multiplied by anything, so its share is just d2 = 0.1448.
4. **Pass the blame back.** The hidden unit influenced the error only through w₂, so it inherits d2 × w₂, scaled by its own slope h × (1 - h) = 0.2350. That gives d1 = 0.1448 × 1.5 × 0.2350 = 0.0510.
5. **Blame for the first-layer weights.** w₁ multiplied x = 1, so its share is d1 × x = 0.0510, and b₁'s share is d1 = 0.0510.

Written as one product, the blame on w₁ is a chain of local slopes, one for each link between that weight and the error. That is the chain rule from calculus, and it is all backpropagation really is:

<div class="formula">∂error/∂w₁ = (y - t) × y(1 - y) × w₂ × h(1 - h) × x = 0.0510</div>

All four gradients are positive, so all four weights go down. With a step size of 1.0 they become 0.449, -0.051, 1.4099 and -0.6448, and the error falls from 0.1841 to 0.1510. The nudging line printed the same four gradients, so the chain of products and the brute-force measurement agree. Repeat the step 200 times and the output falls from 0.6068 to 0.0507.

Checking a hand-built gradient this way is a standard habit, and a good one. A backward pass is easy to get subtly wrong and it never raises an error. The wrong gradient just trains a worse network.

## Why this is affordable

The nudging check used the slow method: change one weight, rerun the network, compare. Doing that for every weight would cost an extra forward pass for each of the 669,706 weights in the digit network, for a single step of training. Backpropagation gets all the gradients from one forward pass and one backward pass. The backward pass costs roughly as much as the forward one, a small multiple at most, because of the thing you saw in step 4: the blame at the hidden unit reuses d2 instead of starting again. Each layer's blame is built from the blame of the layer after it.

In real networks each layer holds many units, so these products become matrix multiplications, the kind of arithmetic that [a matrix view of data](/notes/why-data-is-a-matrix/) makes natural. Nothing about the idea changes. It only gets wider.

The method was popularised for multi-layer networks by a 1986 paper from Rumelhart, Hinton and Williams. I know the idea had earlier roots, which I have not traced, so I would not call that paper the beginning.

## Where the blame fades

Each step backwards multiplies the blame by one slope. A sigmoid's slope is never larger than 0.25, which it reaches at z = 0. Stack ten sigmoid layers and the slope factors alone can shrink the blame by 0.25¹⁰, about 9.5 × 10⁻⁷, before the weights are even counted. The early layers of a deep sigmoid network can therefore get almost no blame and barely learn. This is the vanishing gradient. A ReLU, the bend from the previous note, has a slope of exactly 1 for positive inputs, which is one standard reason it became the usual choice for hidden layers.

Two more limits are worth stating. Backpropagation hands over a direction, not a destination. Whether training reaches a good solution depends on the shape of the error surface and the step size, as the 1.1 example above showed. And the method needs every part of the network to have a slope, which is why the hard step had to go.

## Starting the blame at the output

In my tiny network, the blame started from the squared error of a single output. For classification, networks usually end in a **softmax**, which turns a list of raw scores into probabilities that are positive and add up to 1, and they are graded with **cross-entropy**, which is -ln of the probability given to the right answer.

```python
import numpy as np

z = np.array([2.0, 1.0, 0.1])                 # raw scores for three classes
p = np.exp(z) / np.exp(z).sum()               # softmax: positive, and adds up to 1
print("softmax:", p.round(4).tolist(), "| total:", round(float(p.sum()), 4))
print("loss if class 0 is right:", round(float(-np.log(p[0])), 4), "| if class 1 is right:", round(float(-np.log(p[1])), 4))

t = np.array([1, 0, 0])                       # class 0 is the right one
print("blame on each score, p - t:", (p - t).round(4).tolist())
loss = lambda s: -np.log(np.exp(s[0]) / np.exp(s).sum())
nudge = [(loss(z + d) - loss(z - d)) / 2e-6 for d in np.eye(3) * 1e-6]
print("by nudging each score     :", np.round(nudge, 4).tolist())

# A sigmoid output that is confidently wrong: it says 0.99 and the answer is 0
sig = lambda s: 1 / (1 + np.exp(-s))
s = np.log(0.99 / 0.01)
y = sig(s)
print("output", round(float(y), 2), "| blame under squared error:", round(float((y - 0) * y * (1 - y)), 4),
      "| blame under cross-entropy:", round(float(y - 0), 4))
```

```text
softmax: [0.659, 0.2424, 0.0986] | total: 1.0
loss if class 0 is right: 0.417 | if class 1 is right: 1.417
blame on each score, p - t: [-0.341, 0.2424, 0.0986]
by nudging each score     : [-0.341, 0.2424, 0.0986]
output 0.99 | blame under squared error: 0.0098 | blame under cross-entropy: 0.99
```

The first lines show softmax turning the scores (2.0, 1.0, 0.1) into probabilities, and a loss of 0.417 if class 0 was the right answer. Then comes the tidy part. The blame on each raw score is simply p - t, the probability the network gave minus what was true, and the nudging check agrees. The signal that starts the backward pass is just "what you said minus what was true".

The last line explains why this pairing is used. Suppose a sigmoid output says 0.99 and the answer is 0. Under squared error the starting blame is 0.0098, because the factor y(1 - y) is tiny when the output is saturated. A network that is confidently wrong would learn slowly from its own worst mistakes. Cross-entropy cancels that factor, and the blame is 0.99. This is for a sigmoid output with a single yes-or-no answer; the softmax case above has the same neat form.

## What the hidden layers become

Now the payoff for the last note. This network has three tanh hidden units, and nobody chooses its weights. It starts from random ones and learns XOR by exactly the process above.

```python
import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], float)
t = np.array([[0], [1], [1], [0]], float)
sig = lambda z: 1 / (1 + np.exp(-z))
rng = np.random.default_rng(1)
W1, b1 = rng.normal(0, 1, (2, 3)), np.zeros(3)     # 2 inputs -> 3 tanh units -> 1 output
W2, b2 = rng.normal(0, 1, (3, 1)), np.zeros(1)

for step in range(5001):
    h = np.tanh(X @ W1 + b1)                       # forward pass
    y = sig(h @ W2 + b2)
    if step in (0, 1000, 5000):
        print(f"step {step:4d}  loss {np.mean((y - t) ** 2):.4f}  outputs {y.ravel().round(3).tolist()}")
    dy = 2 * (y - t) / len(X) * y * (1 - y)        # blame at the output
    dh = dy @ W2.T * (1 - h ** 2)                  # blame passed back to the hidden units
    W2 -= h.T @ dy;  b2 -= dy.sum(0)
    W1 -= X.T @ dh;  b1 -= dh.sum(0)

h = np.tanh(X @ W1 + b1)
print("what the hidden layer made of the inputs 00, 01, 10, 11:")
print(h.round(2))

# Can one perceptron (the neuron from the previous note) now finish the job?
w, b = np.zeros(3), 0.0
for p in range(1, 1001):
    mistakes = 0
    for hx, target in zip(h, t.ravel()):
        out = int(w @ hx + b > 0)
        if out != target:
            w, b, mistakes = w + (target - out) * hx, b + (target - out), mistakes + 1
    if mistakes == 0:
        break
print("a single perceptron on the hidden values settles after", p, "passes")
```

```text
step    0  loss 0.2698  outputs [0.5, 0.738, 0.582, 0.765]
step 1000  loss 0.0011  outputs [0.023, 0.963, 0.969, 0.04]
step 5000  loss 0.0002  outputs [0.009, 0.985, 0.988, 0.016]
what the hidden layer made of the inputs 00, 01, 10, 11:
[[-0.82 -0.83 -0.83]
 [-1.    0.98 -0.89]
 [ 0.88  0.97  0.96]
 [-0.97  1.    0.93]]
a single perceptron on the hidden values settles after 3 passes
```

The error falls from 0.2698 to 0.0002 and the outputs head to 0, 1, 1, 0. Look at the four rows of hidden values. They are a different description of the same four cases, built by training and not by me. And the single perceptron from last time, the neuron that could not do XOR on the raw inputs, settles in three passes once it is given these values.

Nobody told the network what to build. The blame, passed backwards, shaped the middle layer into something a single line could finish. This is what people mean by **representation learning**, and it is the reason depth earns its place.

It is one run, and I will be straight about that. I repeated it from 20 different random starting points: 19 solved XOR, and the lone perceptron then settled within three or four passes each time. One start got stuck with an error of 0.1252 and never recovered. Backpropagation points downhill, and nothing promises the hill leads to the bottom.

Learning is not being told the answer. It is working out who was responsible for the mistake.

---

**Sources**

- D. E. Rumelhart, G. E. Hinton and R. J. Williams, "Learning representations by back-propagating errors", *Nature*, 323, 1986.
- M. P. Deisenroth, A. A. Faisal and C. S. Ong, *Mathematics for Machine Learning*, Cambridge Univ. Press, 2020 (gradients and backpropagation in chapter 5, gradient descent in chapter 7).
