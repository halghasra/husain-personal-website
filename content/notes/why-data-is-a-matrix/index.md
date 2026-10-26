---
title: "Why Data Is a Matrix"
slug: "why-data-is-a-matrix"
type: "note"
status: "evergreen"
summary: "A photograph, a customer list and three film reviews look nothing alike, yet inside a model they are the same object. How a grid of numbers turns similarity into angles, a layer into one product, and a table into something that can act."
date: "2026-07-30"
created: "2026-07-30"
updated: "2026-07-30"
topics: ["Mathematics", "Machine Learning"]
tags: ["Mathematics", "Machine Learning", "Data", "Neural Networks", "Python"]
linked_notes:
  - "data-is-not-information"
  - "why-python-won-ai"
  - "the-shape-of-data"
  - "how-machines-learn-to-read"
graph:
  show: true
  weight: 2
  cluster: "mathematics"
seo:
  title: "Why Data Is a Matrix"
  description: "Why machine learning turns everything into a grid of numbers, and what vectors, dot products, matrix products, eigenvectors and PCA do once it has."
---

Put three things side by side on a desk. A photograph. A spreadsheet of customers. Three one-line film reviews: "movie is fantastic", "dumb movie", "movie is great".

They have nothing in common. One is light, one is commerce, one is language. Yet by the time any of them reaches a machine learning model, they are the same kind of object: numbers arranged in rows and columns. That is a strange thing to be true, and a great deal rests on it.

I want to follow the idea from the grid up to the point where a few lines of arithmetic can find what matters in a table of fifty columns. Every step is the previous step with one more thing noticed.

## Rows are things, columns are measurements

The convention is simple. A dataset is a **matrix** with one row for each observation and one column for each feature. One observation is a **vector**: one person's age, height and weight is a row of three numbers. Stack many rows and you have the matrix, which people usually call X.

A photograph fits the same scheme with one more axis. It is a grid of pixels, each pixel carries three numbers (how much red, green and blue), so an image is height by width by three. A collection of images adds yet another axis, and the general word for these stacked grids is **tensor**.

Text needs a decision first. The simplest one is to pick a vocabulary and count, which people call a bag of words. Take the four words (movie, fantastic, dumb, great) and each review becomes a row of counts:

```python
import numpy as np

# Rows are reviews, columns are words: (movie, fantastic, dumb, great)
X = np.array([[1, 1, 0, 0],    # "movie is fantastic"
              [1, 0, 1, 0],    # "dumb movie"
              [1, 0, 0, 1]])   # "movie is great"
print("shape (observations, features):", X.shape)
print("how often each word appears:", X.sum(axis=0))
print("words in each review:", X.sum(axis=1))

# One weight per word scores every review in a single product
w = np.array([0.0, 1.0, -1.0, 1.0])
print("scores:", X @ w)
```

```text
shape (observations, features): (3, 4)
how often each word appears: [3 1 1 1]
words in each review: [2 2 2]
scores: [ 1. -1.  1.]
```

Notice what the grid gave us for free. Summing down the columns counts how often each word appears. Summing across the rows counts the words in each review. And one weight per word, which I invented here, scores all three reviews in a single product: positive, negative, positive. I have not said how a machine would find good weights. The point for now is only that, once the data is a grid, a question about every row at once is a single line.

The grid has rules, and they matter. Every row must have the same number of columns, so text of different lengths needs a vocabulary like the one above before it fits. A table with names, dates and categories is not yet a matrix at all. It becomes one only after each column is encoded as numbers, and that encoding is a modelling choice, not a fact about the data. In my own work, a book of insurance claims has exactly this shape, one row per claim and one column per attribute, and the encoding of a postcode or a cause code is where much of the real thinking goes. I come back to it in [Data Is Not Information](/notes/data-is-not-information/).

## A row is an arrow

Here is the move that changes how the rest reads. A row of three numbers, such as (25, 170, 85), is also an arrow in three-dimensional space, running from the origin to that point. Every row of a dataset is an arrow. Similar rows are arrows that point nearly the same way.

That turns "how alike are these two records?" into a question about angles, and the tool for angles is the **dot product**. Multiply two vectors entry by entry and add the results into a single number:

<div class="formula">a · b = a₁b₁ + a₂b₂ + … + aₙbₙ = |a| |b| cos θ</div>

The first form is arithmetic. The second is geometry: the lengths of the two arrows times the cosine of the angle between them. Set them equal and you can solve for the angle.

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

dot = a @ b
len_a = np.linalg.norm(a)
len_b = np.linalg.norm(b)
cos = dot / (len_a * len_b)

print("dot product:", dot)
print("lengths:", round(len_a, 3), round(len_b, 3))
print("cosine:", round(cos, 4))
print("angle in degrees:", round(np.degrees(np.arccos(cos)), 1))
print("(1, 2) . (2, -1) =", np.array([1, 2]) @ np.array([2, -1]))

# Why attention divides by sqrt(d_k): the dot product of unit-variance random vectors has variance d_k
rng = np.random.default_rng(0)
d_k = 64
q = rng.normal(size=(100_000, d_k))
k = rng.normal(size=(100_000, d_k))
scores = (q * k).sum(axis=1)
print("variance of q . k:", round(scores.var(), 1), " after dividing by sqrt(d_k):", round((scores / np.sqrt(d_k)).var(), 2))
```

```text
dot product: 32
lengths: 3.742 8.775
cosine: 0.9746
angle in degrees: 12.9
(1, 2) . (2, -1) = 0
variance of q . k: 64.0  after dividing by sqrt(d_k): 1.0
```

The dot product of (1, 2, 3) and (4, 5, 6) is 1×4 + 2×5 + 3×6 = 32. The lengths are √14 = 3.742 and √77 = 8.775, so the cosine is 32 ÷ (3.742 × 8.775) = 0.9746, an angle of 12.9 degrees. Almost parallel. A dot product of zero means the arrows are perpendicular, as with (1, 2) and (2, -1).

The last block is a detail I enjoyed. In the Transformer paper (Vaswani and colleagues, 2017), the attention scores are dot products, and the authors divide them by √d_k, where d_k is the length of the vectors. Their footnote gives the reason: if the entries are independent, with mean 0 and variance 1, the dot product has variance d_k. I simulated it with d_k = 64 and got a variance of 64.0, and dividing by √64 brought it back to 1.0. The same arithmetic that compares two customers is being used to let a language model decide which words to look at.

It breaks in familiar ways. A raw dot product grows with the length of the arrows, so to compare direction alone you divide by both lengths, which gives the cosine. If one column is in centimetres and another in years, the larger numbers swamp the smaller ones, so the columns need putting on a comparable scale first. And pointing the same way is not the same as meaning the same thing: two count vectors can line up and still describe different situations.

## Multiplying the whole table at once

Now put many dot products in a grid. To multiply matrix A by matrix B, take the dot product of every row of A with every column of B. The answer's entry in row i, column j is row i of A dotted with column j of B. That is all matrix multiplication is, and it only works when the inner sizes match: an m by n matrix times an n by p matrix gives an m by p matrix.

```python
import numpy as np

A = np.array([[1, 0], [2, 3]])
B = np.array([[2, 1], [3, 1]])

print("AB =\n", A @ B)
print("BA =\n", B @ A)
print("row 2 of A . column 1 of B =", A[1] @ B[:, 0])
print("A * B (entry by entry) =\n", A * B)

P = np.ones((3, 2))
Q = np.ones((2, 3))
print("PQ shape:", (P @ Q).shape, " QP shape:", (Q @ P).shape)
try:
    np.ones((3, 2)) @ np.ones((3, 2))
except ValueError:
    print("a (3x2) times a (3x2) is not defined")
```

```text
AB =
 [[ 2  1]
 [13  5]]
BA =
 [[4 3]
 [5 3]]
row 2 of A . column 1 of B = 13
A * B (entry by entry) =
 [[2 0]
 [6 3]]
PQ shape: (3, 3)  QP shape: (2, 2)
a (3x2) times a (3x2) is not defined
```

The bottom left entry of AB is 13, which is the second row of A, (2, 3), dotted with the first column of B, (2, 3): 2×2 + 3×3. And AB and BA are different matrices. Order matters. With a 3 by 2 and a 2 by 3, both orders exist but give a 3 by 3 and a 2 by 2, which are not even the same shape. Two 3 by 2 matrices cannot be multiplied at all.

One warning for anyone typing this into Python. The `*` operator multiplies entry by entry, which is the other output above. Matrix multiplication is `@`. Mixing them up gives an answer of the right shape and the wrong meaning, which is the worst kind of mistake.

This is the same operation as the scoring step earlier: a data matrix times a weight vector, with every row scored at once. Make the weights a matrix instead and you score every row against many weight vectors at once. The first step of a layer in a neural network is exactly that product, a data matrix times a weight matrix, followed by a further non-linear step. A great deal of modern AI is this one operation, repeated, on hardware built to do it quickly.

## A matrix is a verb

A matrix is usually taught as a noun, a table to be added and multiplied. The idea that changes everything is that a matrix is also a verb. It does something to space.

Multiply a matrix by the two basis arrows, (1, 0) and (0, 1), and you get back its first and second columns. So the columns say where each basis arrow lands. Every other point follows, because a matrix keeps straight lines straight and evenly spaced: any vector is a certain mix of the two basis arrows, and its image is the same mix of where they went.

Take A = [[2, 1], [0, 1]], and watch what it does to the unit square.

<figure>
<svg viewBox="0 0 640 270" role="img" aria-label="On the left, the unit square with corners at (0, 0), (1, 0), (1, 1) and (0, 1). On the right, the same square after multiplying by the matrix with rows (2, 1) and (0, 1): a leaning parallelogram with corners at (0, 0), (2, 0), (3, 1) and (1, 1). The first basis arrow lands on (2, 0) and the second on (1, 1).">
  <defs>
    <marker id="wdim-arrow" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="dg-accent"/></marker>
  </defs>
  <line x1="36" y1="200" x2="170" y2="200" class="dg-line" stroke-width="1"/>
  <line x1="60" y1="224" x2="60" y2="90" class="dg-line" stroke-width="1"/>
  <polygon points="60,200 120,200 120,140 60,140" class="dg-subtle" stroke-width="1.5"/>
  <line x1="60" y1="200" x2="116" y2="200" class="dg-accent-stroke" stroke-width="2.5" marker-end="url(#wdim-arrow)"/>
  <line x1="60" y1="200" x2="60" y2="144" class="dg-accent-stroke" stroke-width="2.5" marker-end="url(#wdim-arrow)"/>
  <text x="122" y="218" font-size="13" text-anchor="start" class="dg-text">(1, 0)</text>
  <text x="50" y="146" font-size="13" text-anchor="end" class="dg-text">(0, 1)</text>
  <text x="90" y="252" font-size="13" text-anchor="middle" class="dg-muted">the unit square, area 1</text>
  <line x1="205" y1="170" x2="295" y2="170" class="dg-line" stroke-width="2" marker-end="url(#wdim-arrow)"/>
  <text x="250" y="158" font-size="14" text-anchor="middle" class="dg-text">multiply by A</text>
  <line x1="336" y1="200" x2="580" y2="200" class="dg-line" stroke-width="1"/>
  <line x1="360" y1="224" x2="360" y2="90" class="dg-line" stroke-width="1"/>
  <polygon points="360,200 480,200 540,140 420,140" class="dg-highlight" stroke-width="1.5"/>
  <line x1="360" y1="200" x2="474" y2="200" class="dg-accent-stroke" stroke-width="2.5" marker-end="url(#wdim-arrow)"/>
  <line x1="360" y1="200" x2="416" y2="144" class="dg-accent-stroke" stroke-width="2.5" marker-end="url(#wdim-arrow)"/>
  <text x="480" y="218" font-size="13" text-anchor="start" class="dg-text">(2, 0)</text>
  <text x="410" y="132" font-size="13" text-anchor="end" class="dg-text">(1, 1)</text>
  <text x="546" y="144" font-size="13" text-anchor="start" class="dg-text">(3, 1)</text>
  <text x="450" y="252" font-size="13" text-anchor="middle" class="dg-muted">the same square after A, area 2</text>
</svg>
<figcaption>The columns of A are where the two basis arrows land. The whole square follows them, and its area doubles.</figcaption>
</figure>

```python
import numpy as np

A = np.array([[2, 1],
              [0, 1]])

print("A @ (1, 0) =", A @ np.array([1, 0]))
print("A @ (0, 1) =", A @ np.array([0, 1]))

square = np.array([[0, 1, 1, 0],      # x of each corner
                   [0, 0, 1, 1]])     # y of each corner
print("square after A:\n", A @ square)
print("determinant:", round(np.linalg.det(A), 3))

R = np.array([[0, -1],
              [1,  0]])              # a quarter turn anticlockwise
print("R @ (1, 0) =", R @ np.array([1, 0]), " determinant of R:", round(np.linalg.det(R), 3))
print("R @ A =\n", R @ A)
v = np.array([1, 1])
print("A then R equals R @ A:", np.array_equal(R @ (A @ v), (R @ A) @ v))
```

```text
A @ (1, 0) = [2 0]
A @ (0, 1) = [1 1]
square after A:
 [[0 2 3 1]
 [0 0 1 1]]
determinant: 2.0
R @ (1, 0) = [0 1]  determinant of R: 1.0
R @ A =
 [[ 0 -1]
 [ 2  1]]
A then R equals R @ A: True
```

The corners (0, 0), (1, 0), (1, 1), (0, 1) become (0, 0), (2, 0), (3, 1), (1, 1): a leaning parallelogram of area 2. That factor of 2 is the **determinant**, the amount by which the matrix scales area. The quarter turn R has determinant 1, because turning does not change area. A determinant of zero would flatten the whole plane onto a line, and no matrix can undo that, which is why such a matrix has no inverse.

The last two lines explain why order matters. Doing A and then R is the single matrix R @ A, with the later step written on the left. That is also why AB and BA differ: they are different sequences of moves.

Limits are worth knowing. Only straight, origin-fixed moves are matrices, so a plain shift is not one. Stack as many matrices as you like and you still have one matrix, which is why a neural network adds a bias and a non-linear step between them. And the picture is easy in two dimensions and impossible to draw in three hundred, although the algebra does not change. Finally, a data matrix is usually a rectangular table of observations, not a square transformation. It is the same grid, read in a different way, and the question decides which reading is right.

## The directions a matrix cannot bend

A matrix can twist space in every direction at once. Yet most matrices have a few special directions where they do nothing but stretch or squash. An **eigenvector** of a matrix is such a direction: the matrix sends it to a multiple of itself. The multiple is the **eigenvalue**.

<div class="formula">A v = λ v</div>

Finding them is a short piece of algebra, and a small example does it better than words.

<div class="callout callout-hint"><p><strong>Worked example</strong></p><p>Take A = [[4, 2], [1, 3]]. Av = λv means (A - λI)v = 0, which has a non-zero solution only when the determinant of A - λI is zero. That determinant is (4 - λ)(3 - λ) - 2 = λ² - 7λ + 10 = (λ - 5)(λ - 2), so the eigenvalues are 5 and 2.</p><p>For λ = 5 the equation gives -v₁ + 2v₂ = 0, so v is any multiple of (2, 1). For λ = 2 it gives 2v₁ + 2v₂ = 0, so v is any multiple of (1, -1).</p></div>

NumPy does the same, scaling each eigenvector to length 1:

```python
import numpy as np

A = np.array([[4, 2],
              [1, 3]])

values, vectors = np.linalg.eig(A)
values, vectors = values.real, vectors.real      # these are real; some versions return a complex type
order = np.argsort(values)[::-1]
values, vectors = values[order], vectors[:, order]
print("eigenvalues:", np.round(values, 6))
print("eigenvectors (columns):\n", np.round(vectors, 3))

for lam, v in zip(values, vectors.T):
    print("A @ v =", np.round(A @ v, 3), " lambda * v =", np.round(lam * v, 3))

print("trace:", np.trace(A), " sum of eigenvalues:", round(values.sum(), 6))
print("determinant:", round(np.linalg.det(A), 6), " product of eigenvalues:", round(values.prod(), 6))

# A quarter turn leaves no direction alone
R = np.array([[0, -1], [1, 0]])
print("eigenvalues of a quarter turn:", np.linalg.eigvals(R))
```

```text
eigenvalues: [5. 2.]
eigenvectors (columns):
 [[ 0.894 -0.707]
 [ 0.447  0.707]]
A @ v = [4.472 2.236]  lambda * v = [4.472 2.236]
A @ v = [-1.414  1.414]  lambda * v = [-1.414  1.414]
trace: 7  sum of eigenvalues: 7.0
determinant: 10.0  product of eigenvalues: 10.0
eigenvalues of a quarter turn: [0.+1.j 0.-1.j]
```

For each eigenvector, A @ v and λ × v are identical. The eigenvalues also pass two neat checks: they add up to the trace (4 + 3 = 7) and multiply to the determinant (4×3 - 2×1 = 10). The sign of an eigenvector is arbitrary, so another library may print the negatives.

The last line is the catch. A quarter turn changes the direction of everything, so there is no real direction it leaves alone, and its eigenvalues come out complex. Not every matrix has real eigenvectors, and not every square matrix has enough of them to describe it completely. The well-behaved case is the symmetric matrix, which always has real eigenvalues and enough perpendicular eigenvectors. That matters in the next step, because the matrix we are about to build is symmetric.

## Thin data

Now the payoff. Suppose a table has many columns, and many of them move together: a handful of underlying factors, each showing up in several columns. The table may be fifty columns wide while living mostly along a few directions. **Principal component analysis**, or PCA, finds those directions.

It takes four steps. Subtract each column's mean, so the data is centred. Build the **covariance matrix**, which records how every pair of columns varies together. Take its eigenvectors and eigenvalues. Each eigenvector is a **principal component**, a direction in the data, and its eigenvalue is how much the data varies along it. Here are ten invented points with two measurements that rise together:

```python
import numpy as np

# Ten points, two measurements that rise together (invented, for illustration)
x = np.array([2.5, 0.5, 2.2, 1.9, 3.1, 2.3, 2.0, 1.0, 1.5, 1.1])
y = np.array([2.4, 0.7, 2.9, 2.2, 3.0, 2.7, 1.6, 1.1, 1.6, 0.9])
X = np.column_stack([x, y])

Xc = X - X.mean(axis=0)                   # 1. centre each column
C = np.cov(Xc, rowvar=False)              # 2. covariance matrix
values, vectors = np.linalg.eigh(C)       # 3. its eigenvectors and eigenvalues
order = np.argsort(values)[::-1]
values, vectors = values[order], vectors[:, order]

print("covariance matrix:\n", np.round(C, 4))
print("eigenvalues:", np.round(values, 4))
print("share of variance:", np.round(values / values.sum(), 4))
print("first component:", np.round(vectors[:, 0], 3))
print("one number per point:", np.round(Xc @ vectors[:, 0], 2))
```

```text
covariance matrix:
 [[0.6166 0.6154]
 [0.6154 0.7166]]
eigenvalues: [1.284  0.0491]
share of variance: [0.9632 0.0368]
first component: [0.678 0.735]
one number per point: [ 0.83 -1.78  0.99  0.27  1.68  0.91 -0.1  -1.14 -0.44 -1.22]
```

The two eigenvalues are 1.284 and 0.0491, so the first direction carries 96.3 per cent of the total variation and the second only 3.7 per cent. The first component points along (0.678, 0.735), roughly the diagonal. Projecting each point onto it replaces two numbers by one, and loses just 3.7 per cent of the variation. Ten points in two dimensions is a toy, but the same four steps work on a table of fifty columns.

Three cautions. PCA is sensitive to scale: a column measured in grams will dominate one in kilograms unless the columns are standardised first. It finds the directions where the data varies most, which is not the same as the directions that matter for a task, so a label can depend on a low-variance direction that PCA throws away. And it is linear, so data bent into a curve or a spiral needs other methods. Each component is also a mixture of the original columns, which makes it harder to explain to someone than "age" or "weight".

Look back at what happened. Centring is a subtraction on a grid. The covariance matrix is one matrix product. The components are eigenvectors. Nothing new was needed beyond the rows, the arrows, the product and the stretch.

## Back to the desk

Before a model can learn anything from a photograph, a customer list or three film reviews, the world has to be made to fit in a grid. That step takes judgement, and it is where meaning leaks in or out. After it, a surprising amount of learning is just what you do to the grid.

---

## References

- M. P. Deisenroth, A. A. Faisal and C. S. Ong, [*Mathematics for Machine Learning*](https://mml-book.github.io/), Cambridge University Press, 2020 (linear algebra, eigendecomposition and PCA).
- A. Vaswani et al., ["Attention Is All You Need"](https://arxiv.org/abs/1706.03762), *Advances in Neural Information Processing Systems 30*, 2017.
