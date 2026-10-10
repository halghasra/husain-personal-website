---
title: "How a Convolutional Network Sees"
slug: "how-a-convolutional-network-sees"
type: "note"
status: "evergreen"
summary: "A plain network and a convolutional one read the same handwritten digits, and one of them needs 127 times fewer adjustable numbers. Where the saving comes from, checked by hand, and what happens when you borrow, stretch or forge pictures to train with."
date: "2026-09-24"
created: "2026-09-24"
updated: "2026-09-24"
topics: ["Artificial Intelligence", "Computer Vision", "Neural Networks"]
tags: ["AI", "Computer Vision", "Neural Networks", "Machine Learning", "Python"]
linked_notes:
  - "backpropagation-learning-by-blame"
  - "memorising-is-not-learning"
  - "why-data-is-a-matrix"
  - "garbage-in"
graph:
  show: true
  weight: 2
  cluster: "vision"
seo:
  title: "How a Convolutional Network Sees"
  description: "Convolution worked by hand, why a CNN needs far fewer parameters than a dense network, and what transfer learning, augmentation and GANs add."
---

Take handwritten digits, each a grid of 28 by 28 pixels. Here are two networks that could learn to read them.

The first is plain. It flattens the picture into a list of 784 numbers and passes it through three dense layers of 512, 512 and 10 units. Counting every weight and bias, it has 669,706 adjustable numbers. The second is a small convolutional network, which I set out below. It has 5,258.

That is 127 times fewer. So where did the other 664,448 numbers go, and what did the second network have to give up to lose them?

The answer turns out to fit on a postcard. It is nine numbers, a picture, and a refusal to forget that pixels have neighbours.

## Nine numbers on a picture

A **convolution** slides a small grid of numbers over an image. At each position it multiplies the grid with the patch of image underneath, number by number, and adds up the results. That small grid is a **filter** (or kernel).

Here is the smallest picture that shows something happening: a 5 by 5 image, dark on the left (0) and bright on the right (9), with a vertical edge between the third and fourth columns. The filter has -1 down its left column, 0 down the middle and 1 down the right, so it computes right minus left.

<figure>
<svg viewBox="0 0 560 240" role="img" aria-label="A 3 by 3 filter placed over the top three rows of a 5 by 5 image gives the value 27">
  <text class="dg-muted" x="120" y="22" font-size="13" text-anchor="middle">image</text>
  <rect class="dg-subtle" x="20" y="32" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="40" y="58" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="60" y="32" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="80" y="58" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="100" y="32" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="120" y="58" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-box" x="140" y="32" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="160" y="58" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-box" x="180" y="32" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="200" y="58" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-subtle" x="20" y="72" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="40" y="98" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="60" y="72" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="80" y="98" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="100" y="72" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="120" y="98" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-box" x="140" y="72" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="160" y="98" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-box" x="180" y="72" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="200" y="98" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-subtle" x="20" y="112" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="40" y="138" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="60" y="112" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="80" y="138" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="100" y="112" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="120" y="138" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-box" x="140" y="112" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="160" y="138" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-box" x="180" y="112" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="200" y="138" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-subtle" x="20" y="152" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="40" y="178" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="60" y="152" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="80" y="178" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="100" y="152" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="120" y="178" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-box" x="140" y="152" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="160" y="178" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-box" x="180" y="152" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="200" y="178" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-subtle" x="20" y="192" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="40" y="218" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="60" y="192" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="80" y="218" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-subtle" x="100" y="192" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="120" y="218" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-box" x="140" y="192" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="160" y="218" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-box" x="180" y="192" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="200" y="218" font-size="16" text-anchor="middle">9</text>
  <rect class="dg-accent-stroke" fill="none" x="60" y="32" width="120" height="120" stroke-width="3"/>
  <text class="dg-muted" x="330" y="22" font-size="13" text-anchor="middle">filter</text>
  <rect class="dg-highlight" x="270" y="72" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="290" y="98" font-size="16" text-anchor="middle">-1</text>
  <rect class="dg-highlight" x="310" y="72" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="330" y="98" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-highlight" x="350" y="72" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="370" y="98" font-size="16" text-anchor="middle">1</text>
  <rect class="dg-highlight" x="270" y="112" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="290" y="138" font-size="16" text-anchor="middle">-1</text>
  <rect class="dg-highlight" x="310" y="112" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="330" y="138" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-highlight" x="350" y="112" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="370" y="138" font-size="16" text-anchor="middle">1</text>
  <rect class="dg-highlight" x="270" y="152" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="290" y="178" font-size="16" text-anchor="middle">-1</text>
  <rect class="dg-highlight" x="310" y="152" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="330" y="178" font-size="16" text-anchor="middle">0</text>
  <rect class="dg-highlight" x="350" y="152" width="40" height="40" stroke-width="1"/>
  <text class="dg-text" x="370" y="178" font-size="16" text-anchor="middle">1</text>
  <text class="dg-text" x="245" y="138" font-size="22" text-anchor="middle">×</text>
  <text class="dg-text" x="415" y="138" font-size="22" text-anchor="middle">=</text>
  <text class="dg-ink" x="435" y="146" font-size="30" font-weight="bold">27</text>
  <text class="dg-muted" x="435" y="172" font-size="13">3 rows × 9</text>
</svg>
<figcaption>The filter sits on the top three rows, one column in from the left. Each row of the patch is 0, 0, 9, and each row of the filter turns that into (-1 × 0) + (0 × 0) + (1 × 9) = 9. Three rows give 27.</figcaption>
</figure>

Do the other positions by sight. In the far-left position the patch is all zeros, so the output is 0. In the middle position the patch rows are 0, 0, 9, which is the case in the figure, so 27. In the right-hand position they are 0, 9, 9, so each row gives 9 minus 0, and again 27. Now the same thing in code, together with two variations:

```python
import numpy as np

img = np.array([[0, 0, 0, 9, 9]] * 5)
k = np.array([[-1, 0, 1]] * 3)

def slide(img, k):
    h, w = k.shape
    rows = img.shape[0] - h + 1
    cols = img.shape[1] - w + 1
    return np.array([[(img[i:i+h, j:j+w] * k).sum() for j in range(cols)]
                     for i in range(rows)])

print(slide(img, k))
print(slide(img, np.flip(k)))
print(slide(img, np.ones((3, 3)) / 9).round(2))
```

```text
[[ 0 27 27]
 [ 0 27 27]
 [ 0 27 27]]
[[  0 -27 -27]
 [  0 -27 -27]
 [  0 -27 -27]]
[[0. 3. 6.]
 [0. 3. 6.]
 [0. 3. 6.]]
```

The output is 0 where the picture is flat and 27 exactly where the dark side meets the bright side. Flip the filter and every sign flips, so it now answers "bright to dark". Replace it with a 3 by 3 grid of 1/9 and you get a blur instead: the sharp step from 0 to 9 becomes the ramp 0, 3, 6. Same operation, different nine numbers, entirely different question asked of the picture.

## The same nine numbers everywhere

Here is the part that carries the whole idea. The filter is the same at every position. It does not know where it is. The patch at the top-left and the patch at the bottom-right are checked with identical numbers, so a pattern the filter has learned to find is found wherever it turns up. A network does not need to learn "edge" separately for each corner of the picture, and a pattern that moves across the picture is still found. Rotation and size are not handled for free, which is part of why augmentation exists.

That is where the saving comes from. One 3 by 3 filter has 9 weights plus 1 bias, so 10 numbers, reused at every position. A dense layer connecting a 28 by 28 image (784 inputs) to 784 units has 784 × 784 + 784 = 615,440 numbers. The comparison is unfair in one way, since a real layer uses many filters, but even a dozen filters would not close the gap.

Two other things are worth knowing. The size of the output depends on the filter size k, the image width n, any padding p added round the border, and the stride s, the number of pixels the filter moves each step:

<div class="formula">output width = ⌊(n + 2p − k) ÷ s⌋ + 1</div>

For a 28-pixel image, a 3 by 3 filter with no padding gives 26. With one pixel of padding it gives 28, and a 5 by 5 filter with a stride of 2 gives 12. I checked all three by running them.

The second is a naming quirk. The textbook operation flips the filter before sliding it. Deep learning libraries do not, so what they compute is technically cross-correlation, though they still call it convolution. It makes no practical difference, because the filter values are learned.

Nobody designs those values, by the way. Filters start random and are adjusted by [backpropagation](/notes/backpropagation-learning-by-blame/) like any other weight. A trained network typically ends up with edge-like detectors in its first layer without anyone telling it what an edge is.

## Stacking the layers

A **convolutional neural network** stacks these operations. A convolutional layer applies a set of filters and produces one feature map per filter. An activation (usually ReLU, which sets negative values to zero) follows. **Pooling** then shrinks each map, most often by keeping only the largest value in each small block. Near the end, dense layers turn the surviving features into class scores. Because each layer looks at the previous layer's features and not at raw pixels, what the layers pick up goes from simple to complex: small edges first, then textures and parts, then whole objects. The stacking is what grows a window of nine pixels into something that can see a face.

Pooling is easy to check. Cut a 4 by 4 map into four 2 by 2 blocks and keep the largest value in each. The top-left block holds 1, 3, 4 and 6, so it keeps 6. The same by code, where the reshape groups the map into those blocks:

```python
import numpy as np
fm = np.array([[1, 3, 2, 1], [4, 6, 5, 0], [7, 2, 9, 8], [1, 0, 3, 4]])
print(fm.reshape(2, 2, 2, 2).max(axis=(1, 3)).tolist())
```

```text
[[6, 5], [7, 9]]
```

Now the count that opened this note. The network is a convolution with 8 filters of 3 by 3, a pooling step, a convolution with 16 filters of 3 by 3, a second pooling step, and a dense layer to 10 outputs. It is a small design I made up for this comparison:

```python
n, ch, total = 28, 1, 0
print("input", (n, n, ch))
for kind, size, filters in [("conv", 3, 8), ("pool", 2, None), ("conv", 3, 16), ("pool", 2, None)]:
    if kind == "conv":
        n = n - size + 1
        params = size * size * ch * filters + filters
        ch = filters
    else:
        n = n // size
        params = 0
    total += params
    print(kind, (n, n, ch), params)
flat = n * n * ch
dense = flat * 10 + 10
total += dense
print("flatten", flat)
print("dense", (10,), dense)
print("total", total)
dense_net = (784 * 512 + 512) + (512 * 512 + 512) + (512 * 10 + 10)
print("dense network", dense_net)
```

```text
input (28, 28, 1)
conv (26, 26, 8) 80
pool (13, 13, 8) 0
conv (11, 11, 16) 1168
pool (5, 5, 16) 0
flatten 400
dense (10,) 4010
total 5258
dense network 669706
```

The two convolutional layers cost 80 and 1,168 numbers. Most of the 5,258 sit in the last dense layer, 4,010 of them. A 2016 review of deep learning for visual understanding (Guo and others) reports the same pattern at full scale: fully connected layers can hold about 90% of a large network's parameters, which is why later architectures moved away from them.

One honest edge. I counted this small network but did not train it, so I am making no claim about how accurately it reads digits. The claim is only about where the numbers go. They did not vanish. They were never needed, because a dense layer stores a separate rule for every position, and a shared filter replaces all of those rules with one. What the network gives up is the freedom to treat each position differently, and the ability to relate two distant pixels in a single step. Distant pixels only meet in later layers, once the windows have grown.

The same review reports ImageNet classification error falling from 15.3% in 2012, with AlexNet, to 4.82% in 2015. It also cites something much stranger: images that look like noise to a person, which a leading network classified with 99.99% confidence. A hierarchy of filters is a powerful way to be right. It is not the same as understanding.

## Borrowing someone else's eyes

Training a network from nothing needs a great deal of labelled data. **Transfer learning** avoids that by starting from a network already trained on a large, broad task. The reason it can work is those early layers. The edge and texture detectors learned for one job are useful for many others. You can freeze them and train only a small new head on top, or continue training everything gently.

ImageNet is too big to try here, so I made a small version of the experiment. scikit-learn ships a set of 1,797 handwritten digits, each 8 by 8 pixels. One caveat first: the network I use is a plain one-hidden-layer network, not a CNN. The idea being tested is the borrowing of a hidden layer, not the convolution.

There are two tests, each averaged over 30 runs with different random seeds. In the first, 900 digits pre-train a network on the ten digit classes. The task is then a different question on the other 897 images: is the digit odd or even? Only 10 or 50 of those images get labels. In the second, the network is pre-trained on digits 0 to 4 only, and the new task is to separate digits 5 to 9 from five labelled examples each. In both, I compare a simple classifier on the raw pixels with the same classifier on the frozen hidden layer of the pre-trained network.

```python
import numpy as np, warnings
warnings.filterwarnings("ignore")
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import LogisticRegression

X, y = load_digits(return_X_y=True)
X = X / 16.0

def trial(seed, split, target_labels, pick, hidden):
    rng = np.random.RandomState(seed)
    src, tgt = split(rng)
    net = MLPClassifier(hidden_layer_sizes=(hidden,), max_iter=500, random_state=seed)
    net.fit(X[src], y[src])
    W, b = net.coefs_[0], net.intercepts_[0]
    borrow = lambda Z: np.maximum(0, Z @ W + b)      # the frozen hidden layer
    Xt, yt = X[tgt], target_labels(y[tgt])
    lab = pick(rng, yt)
    test = np.setdiff1d(np.arange(len(tgt)), lab)
    score = lambda f: LogisticRegression(max_iter=3000).fit(f(Xt[lab]), yt[lab]).score(f(Xt[test]), yt[test])
    return score(lambda Z: Z), score(borrow)

def mean_scores(**kw):
    runs = np.array([trial(seed, **kw) for seed in range(30)])
    return runs.mean(axis=0).round(3)

def random_split(rng):
    perm = rng.permutation(len(X))
    return perm[:900], perm[900:]

def few_labels(n):
    def pick(rng, yt):
        while True:
            lab = rng.choice(len(yt), n, replace=False)
            if len(set(yt[lab])) == 2:
                return lab
    return pick

def five_each(rng, yt):
    return np.concatenate([rng.choice(np.where(yt == c)[0], 5, replace=False) for c in range(5, 10)])

odd_even = lambda labels: labels % 2
for n in (10, 50):
    print("odd or even,", n, "labels:", mean_scores(split=random_split, target_labels=odd_even,
                                                    pick=few_labels(n), hidden=64))
low_high = lambda rng: (np.where(y < 5)[0], np.where(y >= 5)[0])
print("5 to 9 from a 0 to 4 network:", mean_scores(split=low_high, target_labels=lambda l: l,
                                                  pick=five_each, hidden=32))
```

```text
odd or even, 10 labels: [0.672 0.758]
odd or even, 50 labels: [0.846 0.889]
5 to 9 from a 0 to 4 network: [0.898 0.776]
```

In each pair the first number is the raw pixels and the second is the borrowed layer. With 10 labelled examples, borrowing lifts accuracy from 67.2% to 75.8%. With 50 the gap narrows to 84.6% against 88.9%. That fits the story: the less data you have for the new task, the more the borrowed features are worth.

The last line of the output is the failure, and it is the more instructive one. A network that spent its life separating 0 to 4 kept only what that job needed. Handed digits it had never seen, its hidden layer did worse (77.6%) than the raw pixels (89.8%). This is **negative transfer**. What you borrow has to be broad enough for the new question. ImageNet works as a starting point largely because it is broad. The effect here is modest and the setting is tiny, so treat it as an illustration and not a benchmark.

## Stretching the pictures you have

A second answer to scarce data is to make more of it. **Data augmentation** creates extra training examples by changing the ones you already have in ways that should not change the label: rotating, flipping, cropping, shifting the colours, adding a little noise. A small check of how much a flip and a rotation buy:

```python
import numpy as np

img = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
sym = np.array([[1, 0, 1], [0, 1, 0], [1, 0, 1]])

def orientations(a):
    return {tuple(np.rot90(b, k).ravel()) for b in (a, np.fliplr(a)) for k in range(4)}

print(len(orientations(img)), len(orientations(sym)))
```

```text
8 1
```

Four rotations times a mirror flip give eight distinct versions of the lopsided image, so one picture becomes eight. The symmetric one gives one: it gains nothing.

Two cautions, both of which I think are worth more than the technique. First, the transformation must preserve the label. Turn a handwritten 6 upside down and you have a 9. The trick that makes the training set bigger can quietly relabel it, and which changes are safe depends on the domain. Second, a copy is not a new fact. The extra examples are strongly correlated with the originals, so they add variety and not information, and they must go into the training set only, because transformed copies of test images that leak into training make the test meaningless.

## A forger and a detective

There is a third way to make pictures, and it is the strangest. In a **generative adversarial network** (introduced in 2014) two networks play a game. A generator turns random noise into fake images. A discriminator looks at a mix of real and fake and tries to tell them apart. Nobody tells the generator what a face looks like. It only learns what the detective cannot catch, and the detective keeps getting better.

The maths of the game can be checked in one dimension. Let the real data be a bell curve centred on 0, and the generator's output a bell curve centred on 1: still wrong. The best possible discriminator says "real" with probability real ÷ (real + fake) at each point.

```python
import numpy as np

def normal(x, mu):
    return np.exp(-0.5 * (x - mu) ** 2) / np.sqrt(2 * np.pi)

x = np.linspace(-10, 11, 200001)
dx = x[1] - x[0]
real, fake = normal(x, 0), normal(x, 1)     # the generator is still off by 1
best = real / (real + fake)                 # the best possible discriminator
for point in (-1.0, 0.5, 2.0):
    i = np.argmin(abs(x - point))
    print(point, round(best[i], 4))
value = (real * np.log(best) + fake * np.log(1 - best)).sum() * dx
print(round(value, 4), round(-np.log(4), 4))
```

```text
-1.0 0.8176
0.5 0.5
2.0 0.1824
-1.1635 -1.3863
```

At -1 the real data is much more likely than the fake, so the detective is 81.8% sure it is real. At 0.5 the two curves cross and it can only shrug: 0.5. Past that it says "fake". The last line is the value of the game at the best detective, -1.1635. If the forger gets perfect, the detective is at 0.5 everywhere and the value falls to -log 4 = -1.3863. That is the generator's target and the signal to stop: the judge is now guessing.

GANs have known troubles: a generator can collapse to a few convincing outputs, and two moving targets can oscillate instead of settling. What interests me here is that made-up images are one more way to stretch scarce data, with the same catch as any augmentation. Whether the forgeries carry the biases of the pictures they learned from is a separate question, and it needs asking.

## What the network does not see

Put the pieces together and a picture of seeing emerges, and it is not the human one. The network does not see a face. It asks small questions about edges, at every position, with the same shared numbers, and stacks the answers until they add up to one.

The filter does not know where it is. The network does not know what it is looking at. Ask the same small question in enough places, and it can still tell you what is there.

---

**Sources**

- Y. Guo and others, *Deep learning for visual understanding: A review*, Neurocomputing, 2016.
- I. Goodfellow and others, *Generative Adversarial Nets*, 2014.
- K. Maharana and others, *A review: Data pre-processing and data augmentation techniques*, 2022.
- scikit-learn documentation for the `load_digits` dataset (8 by 8 handwritten digits).
