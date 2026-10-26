---
title: "How a Convolutional Network Sees"
slug: "how-a-convolutional-network-sees"
type: "note"
status: "evergreen"
summary: "Two networks can inspect the same pixels while making very different assumptions about them. I follow the nine shared numbers that give convolution its advantage, then test what happens when visual features are borrowed, stretched and generated."
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

A handwritten digit can be stored as 784 pixel values. Once those values are flattened into a list, a dense neural network has no built-in reason to treat neighbouring pixels as neighbours. The first and last positions are simply two inputs among 784.

I compared two networks that could be used for this task. The dense one has layers of 512, 512 and 10 units, giving it 669,706 weights and biases. The small convolutional design developed later in this note has 5,258. It reaches that number by making a strong assumption about images: a useful pattern can be recognised with the same small detector wherever it appears.

That assumption removes 664,448 adjustable numbers, a reduction by a factor of about 127. It also tells us what convolution gives up in exchange. The network no longer learns an unrelated rule for every pixel position. It preserves the spatial arrangement of the image and reuses nine numbers at a time.

## Nine numbers on a picture

A **convolution** moves a small grid of numbers across an image. At every position, it multiplies that grid by the pixels underneath and sums the products. The grid is called a **filter** or **kernel**, and its output records how strongly the local patch matches the pattern encoded by those numbers.

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

The result is zero across flat regions and 27 where the dark pixels meet the bright ones. Reversing the filter reverses the signs, distinguishing the opposite edge direction. Replacing it with nine values of 1/9 changes the operation again: instead of detecting an edge, it averages each patch and turns the abrupt step from 0 to 9 into the sequence 0, 3, 6.

Nothing about the sliding operation itself means "edge" or "blur". The meaning comes from the nine values. Convolution supplies a way to ask the same local question across an image; the filter decides what that question is.

## The same nine numbers everywhere

The same filter is used at every position. A patch in the top-left and one in the bottom-right are tested with identical weights, so the detector can respond to the same pattern wherever it appears. This **weight sharing** is the central economy of a convolutional layer. The network does not have to relearn a vertical edge separately for each region of the image.

Translation is only partly handled by this design. Moving a feature moves the activation map, and later pooling may make small shifts matter less, but rotation and scale are not automatically solved. A filter trained on one orientation does not become a detector for every orientation for free.

That is where the saving comes from. One 3 by 3 filter has 9 weights plus 1 bias, so 10 numbers, reused at every position. A dense layer connecting a 28 by 28 image (784 inputs) to 784 units has 784 × 784 + 784 = 615,440 numbers. The comparison is unfair in one way, since a real layer uses many filters, but even a dozen filters would not close the gap.

Two other things are worth knowing. The size of the output depends on the filter size k, the image width n, any padding p added round the border, and the stride s, the number of pixels the filter moves each step:

<div class="formula">output width = ⌊(n + 2p − k) ÷ s⌋ + 1</div>

For a 28-pixel image, a 3 by 3 filter with no padding gives 26. With one pixel of padding it gives 28, and a 5 by 5 filter with a stride of 2 gives 12. I checked all three by running them.

The second is a naming quirk. The textbook operation flips the filter before sliding it. Deep learning libraries do not, so what they compute is technically cross-correlation, though they still call it convolution. It makes no practical difference, because the filter values are learned.

In a trained CNN, those filter values are usually not written by hand. They begin as parameters and are adjusted through [backpropagation](/notes/backpropagation-learning-by-blame/). Edge-like filters often emerge in early layers because local changes in brightness are useful ingredients for the classification objective, not because the network was given a definition of an edge.

## Stacking the layers

A **convolutional neural network** applies many filters and stacks their feature maps. An activation such as ReLU introduces non-linearity by replacing negative values with zero. **Pooling** can then reduce the spatial resolution, commonly by keeping the maximum within each small block. Near the output, the accumulated features are converted into class scores.

With each additional convolution, a unit depends on a larger region of the original image. This growing **receptive field** is what allows local detectors to contribute to wider patterns. It is tempting to describe the progression as edges becoming textures, parts and finally objects. That is a useful intuition, but it should not be mistaken for a guarantee that each internal feature has a clean human name.

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

The two convolutional layers require 80 and 1,168 parameters. The final dense layer alone requires 4,010, more than three-quarters of this model's total. That concentration is one reason later vision architectures found ways to reduce or replace large fully connected stages: location-specific connections rapidly dominate the parameter count.

I counted this network but did not train it, so the comparison establishes parameter use rather than predictive accuracy. The missing parameters have not been compressed into a cleverer form; the architecture has ruled them out. A shared filter replaces many position-specific connections with one reusable detector. In return, early layers cannot give every location an entirely independent rule, and distant pixels interact only after successive layers have enlarged the receptive field.

The history of image classification shows how effective this architecture can be, but confidence can hide a very different failure. Nguyen, Yosinski and Clune generated images that were unrecognisable to people while state-of-the-art networks assigned familiar object classes with 99.99 per cent confidence. The system had found evidence that strongly activated its learned decision boundary. Whether that evidence deserved the human label was another question.

## Borrowing someone else's eyes

Training a large visual model from random parameters can require more labelled examples than a new task provides. **Transfer learning** begins with a model trained elsewhere, then either freezes part of it and learns a new output layer or fine-tunes some of the borrowed weights. The hope is that the earlier representation contains visual features that remain useful for the new question.

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

In each pair, the first result uses raw pixels and the second uses the frozen hidden layer. With ten labelled examples, the borrowed representation raises mean accuracy from 67.2 to 75.8 per cent. With fifty labels, the difference narrows to 84.6 against 88.9 per cent. In this particular experiment, the representation is most helpful when labels for the new task are scarce.

The final line is the counterexample. A network trained only to separate digits 0 to 4 produces a representation that performs worse on the unseen digits 5 to 9: 77.6 per cent against 89.8 from raw pixels. This is **negative transfer**. Pretraining does not provide universally useful vision; it preserves features selected by the source task. The experiment is intentionally small and should be read as a worked illustration, not a benchmark for transfer learning in general.

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

The transformation is useful only if it preserves the label. A horizontal flip may leave an animal photograph meaningful while reversing text; rotating a handwritten 6 may produce a 9. Safe augmentation is therefore domain knowledge written as an image operation.

The generated examples are also dependent on their originals. They can teach invariance to a transformation, but they do not provide the same evidence as independently collected images. All variants of an observation must remain on the same side of a train-test split. Otherwise, a transformed copy in training allows the model to recognise what the evaluation presents as unseen.

## A forger and a detective

A **generative adversarial network**, introduced by Goodfellow and colleagues in 2014, replaces fixed image transformations with a learned game. A generator maps random inputs to synthetic samples. A discriminator sees both real and generated samples and learns to distinguish them. The generator improves through the discriminator's response, learning which changes make its outputs harder to reject.

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

What I had called "seeing" at the start now looks more precise. A convolutional network applies learned local tests, reuses them across positions, and composes their responses over increasingly large receptive fields. Transfer learning reuses some of those responses for another task; augmentation declares which visual changes should not matter; a GAN learns to imitate a distribution well enough to challenge a discriminator.

None of this requires the system to experience a face, digit or edge as a person does. It requires a representation that supports the task and a loss that rewards the right distinctions. The remarkable fact is that local weight sharing can produce such strong recognition. The equally important fact is that recognition, confidence and understanding remain different claims.

---

## References

- Y. Guo et al., ["Deep learning for visual understanding: A review"](https://doi.org/10.1016/j.neucom.2015.09.116), *Neurocomputing*, 187, 2016, 27–48.
- A. Nguyen, J. Yosinski and J. Clune, ["Deep Neural Networks are Easily Fooled: High Confidence Predictions for Unrecognizable Images"](https://arxiv.org/abs/1412.1897), *Proceedings of CVPR*, 2015, 427–436.
- I. Goodfellow et al., ["Generative Adversarial Nets"](https://arxiv.org/abs/1406.2661), *Advances in Neural Information Processing Systems 27*, 2014.
- K. Maharana, S. Mondal and B. Nemade, ["A review: Data pre-processing and data augmentation techniques"](https://doi.org/10.1016/j.gltp.2022.04.020), *Global Transitions Proceedings*, 3(1), 2022, 91–99.
- scikit-learn, [`load_digits` documentation](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_digits.html) (the 8 × 8 handwritten-digits dataset used in the examples).
