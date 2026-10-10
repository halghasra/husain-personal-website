---
title: "Why Python Won AI"
slug: "why-python-won-ai"
type: "note"
status: "evergreen"
summary: "The language the whole field runs on is one of the slow ones. I timed it, and then followed the puzzle down to what Python is really doing: calling other people's fast code, behind an interface that makes trying the next idea cheap."
date: "2026-06-24"
created: "2026-06-24"
updated: "2026-06-24"
topics: ["Programming", "Artificial Intelligence"]
tags: ["Python", "AI", "Machine Learning", "Data"]
linked_notes:
  - "why-data-is-a-matrix"
  - "the-shape-of-data"
  - "garbage-in"
graph:
  show: true
  weight: 2
  cluster: "programming"
seo:
  title: "Why Python Won AI"
  description: "Python is slow, yet nearly all of AI is written in it. Vectorisation, one shared model interface and labelled tables explain why, and where the limits are."
---

Here is a small experiment. Take a list of a million whole numbers and add 1 to each. First do it with a Python list comprehension, which is plain Python doing the work one item at a time. Then do it with a NumPy array, where the same job is one expression.

```python
import timeit
import numpy as np

values = list(range(1_000_000))
arr = np.arange(1_000_000)

loop_time = min(timeit.repeat(lambda: [v + 1 for v in values], number=1, repeat=5))
numpy_time = min(timeit.repeat(lambda: arr + 1, number=1, repeat=5))

print("same answer:", [v + 1 for v in values][:3] == (arr + 1)[:3].tolist())
print(f"list comprehension: {loop_time * 1000:.1f} ms")
print(f"numpy:              {numpy_time * 1000:.1f} ms")
print(f"ratio: about {loop_time / numpy_time:.0f} to 1")
```

On my machine it printed this:

```text
same answer: True
list comprehension: 29.3 ms
numpy:              0.6 ms
ratio: about 50 to 1
```

Timings change from machine to machine and run to run, so read it as a shape and not a benchmark. The shape is the interesting part. Same answer, and one version is around fifty times quicker than the other.

Now the puzzle. The slow one is Python itself. And Python is what almost the whole of AI is written in, a field that cares a great deal about speed. Why would it choose that?

## The engine and the steering wheel

The answer is already hiding in that experiment. The fast version is still written in Python. You type `arr + 1` in Python, but you are not asking Python to add a million numbers. You are asking NumPy, a library whose core is compiled code, to do it. The loop that Python would have run item by item runs instead inside that compiled code, where the numbers are packed together in memory as a single block of one type. Writing an operation once and letting the library apply it across a whole array is called **vectorisation**.

To see why the loop version is slow, think about what plain Python is doing. For every item it has to work out, at that moment, what kind of thing `v` is and what `+` means for that kind of thing, and then build a new object to hold the answer. Done a million times, that bookkeeping is most of the cost. A NumPy array has already settled the question once: every entry is the same type, so the compiled loop can run straight through.

So Python is the steering wheel, and compiled code is the engine. You do not feel the engine, because you never write it.

The trick that makes this pleasant to use is **broadcasting**, the rule for what happens when the arrays do not have the same shape. NumPy compares the shapes from the right. Two dimensions fit if they are equal, or if one of them is 1, and the 1 gets stretched to match. Here is the use I find most convincing, because it replaces a nested loop with one line. Take four people, with age, height and weight (invented numbers), and standardise every column, so each has mean 0 and standard deviation 1:

```python
import numpy as np

# Age, height (cm), weight (kg) for four people (invented numbers)
X = np.array([[25, 170, 85],
              [31, 182, 90],
              [47, 165, 70],
              [38, 175, 80]])

means = X.mean(axis=0)
print("column means:", means, " shape", means.shape)

z = (X - means) / X.std(axis=0)          # standardise every column in one line
print("column means of z are zero:", np.allclose(z.mean(axis=0), 0))
print("column SDs of z:", z.std(axis=0))

# Broadcasting can also hide a mistake
a = np.arange(4)                          # shape (4,)
b = np.arange(4).reshape(4, 1)            # shape (4, 1)
print("(4,) + (4,1) gives shape", (a + b).shape)

try:
    np.ones(3) + np.ones(4)
except ValueError as err:
    print("error:", err)
```

```text
column means: [ 35.25 173.    81.25]  shape (3,)
column means of z are zero: True
column SDs of z: [1. 1. 1.]
(4,) + (4,1) gives shape (4, 4)
error: operands could not be broadcast together with shapes (3,) (4,) 
```

The three column means form a shape `(3,)` row. Subtracting it from a `(4, 3)` table stretches that row down all four rows, and the whole standardisation is one expression. If you have ever written the equivalent with two nested loops, you will see why people stayed.

The last two checks are the other side of the coin. A `(3,)` against a `(4,)` cannot line up, and NumPy says so. But a `(4,)` against a `(4, 1)` lines up in a way you probably did not intend, and gives a four by four grid without a murmur. A rule that is forgiving enough to be convenient is forgiving enough to hide a bug. The habit worth having is to print the shape whenever an answer comes out larger than you expected.

It also explains an oddity. In linear algebra, adding a plain number to a matrix is not defined. NumPy happily does it: `A + 3` adds 3 to every entry. That is not algebra. It is the same stretching rule, applied to a number with no dimensions at all, because convenience won over strictness.

## The code that looks like the maths

There is a second thing about vectorised code that I think matters more than the speed. It looks like the mathematics.

Much of machine learning is written on the page as a few short formulas. Scoring every row of a table of features, for instance, is one product of a data matrix and a weight vector. Here is that product done as nested loops, and then as the formula:

```python
import timeit
import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(2000, 100))      # 2000 rows, 100 features
w = rng.normal(size=100)              # one weight per feature

def scores_loop():
    out = []
    for row in X:
        total = 0.0
        for xi, wi in zip(row, w):
            total += xi * wi
        out.append(total)
    return out

print("same scores:", np.allclose(scores_loop(), X @ w))
t_loop = min(timeit.repeat(scores_loop, number=1, repeat=3))
t_mat = min(timeit.repeat(lambda: X @ w, number=1, repeat=3))
print(f"nested loops: {t_loop * 1000:.1f} ms   X @ w: {t_mat * 1000:.2f} ms")
```

```text
same scores: True
nested loops: 33.8 ms   X @ w: 0.03 ms
```

The two agree. The loops take around thirty milliseconds and the one-liner a few hundredths of one (a time that short is hard to measure precisely, so call it roughly a thousand times faster and no more exact than that). But set the speed aside and look at the shape of the two. `X @ w` is the formula, character for character. When a paper says the scores are X times w, the code says the same, and the distance between reading an idea and trying it shrinks to almost nothing.

I cannot prove this was decisive. What I can say is that a language where the code resembles the notation lowers the cost of every experiment, and [matrices are how machine learning sees its data](/notes/why-data-is-a-matrix/), so the notation is everywhere.

## One interface for every model

Speed is half the story, and I suspect the smaller half. The other half is what it costs to try a different idea.

scikit-learn, the standard library for classical machine learning in Python, gives every model the same small set of calls. You build the model, call `fit` on training data, and then call `predict` or `score`. Hao and Ho, in their review of the package, describe this shared convention. Here are two quite different classifiers, a nearest-neighbour method and a decision tree, trained and scored on the classic iris flower data:

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)

for model in (KNeighborsClassifier(), DecisionTreeClassifier(random_state=0)):
    model.fit(X_train, y_train)
    print(type(model).__name__, round(model.score(X_test, y_test), 3))
```

```text
KNeighborsClassifier 0.978
DecisionTreeClassifier 0.978
```

The two models work in completely different ways, and the code that runs them is the same two lines. Swapping one for the other cost me the name of a class.

I would not read much into the tie. There are 45 test flowers here, so each score is 44 right out of 45, and iris is a famously easy dataset. A single split on a small test set cannot say which method is better. What the snippet shows is how little friction there is between an idea ("what if I try a tree?") and an answer. When trying the next thing costs one line, people try a lot of things, and the library that makes that cheap collects the users.

## A table that remembers who is who

The third piece is pandas, which gives Python a table: a **DataFrame**, with labelled columns and a set of row labels called the **index**. The index looks like a column of row numbers. It is not, and the difference is worth two minutes.

```python
import pandas as pd

marks = pd.DataFrame({"mark": [72, 58, 91, 65]},
                     index=["Amal", "Bilal", "Chen", "Dana"])   # invented marks
bonus = pd.Series({"Chen": 5, "Amal": 3, "Zoe": 4})
print(marks["mark"] + bonus)

df = pd.DataFrame({"x": [10, 20, 30, 40, 50]})
kept = df[df["x"] != 30]
print(kept.index.tolist())
print("loc[3]:", kept.loc[3, "x"], " iloc[3]:", kept.iloc[3, 0])
```

```text
Amal     75.0
Bilal     NaN
Chen     96.0
Dana      NaN
Zoe       NaN
dtype: float64
[0, 1, 3, 4]
loc[3]: 40  iloc[3]: 50
```

The bonus list was written in a different order and has a name, Zoe, who is not in the table. pandas does not care about order. It matches by label: Amal gets 3 added, Chen gets 5, and anyone missing from either side becomes `NaN`, which is pandas' mark for "no value". Position played no part.

The second half is the trap. After removing the row labelled 2, the index reads `[0, 1, 3, 4]`. Asking for label 3 with `.loc` returns 40. Asking for the fourth row with `.iloc` returns 50. The labels travelled with their rows. If you expected the rows to be renumbered, the two lookups will quietly give you different numbers.

I find this one of the better design decisions in the whole ecosystem. A label says who a row is. A position only says where it happens to be standing today. Real tables get filtered, sorted and merged constantly, and a tool that keeps identity separate from order stops a whole family of mistakes. It also produces the surprise `NaN`s, which look like missing data and are really mismatched labels. Both come from the same choice.

## What I can and cannot claim

Python was created by Guido van Rossum, first released in 1991, and named after *Monty Python's Flying Circus*, not the snake. The language itself is easy to read. Printing a greeting is a single `print` call, where some other languages need several lines. It is free and open source. Those things surely helped.

There is also an irony I like. The thing that makes Python slow is also what makes it pleasant: Python is interpreted, which means your code is read and run as it goes, with no separate build step. That is exactly why you can type one line, see its answer straight away, change it and try again. For work where you do not yet know what you are looking for, that quick back and forth is, I think, worth a good deal more than raw speed, particularly once the heavy lifting has been handed to compiled libraries.

But I do not want to overclaim. Plenty of languages are readable. What Python has is the pile of libraries above, each of which hides compiled code behind a short, readable call, and a community that writes its tutorials, answers and examples in one language. Once most of the examples are in Python, the next library is written for Python too. I suspect that loop, where use feeds libraries and libraries feed use, explains more than the syntax does. I have not found a clean way to measure it, and I will not pretend to.

Some limits are worth stating plainly:

- The speed comes from the libraries and not from Python. Code that cannot be written as whole-array operations, like a step that needs the previous step's answer, pays the full price of a Python loop.
- Vectorised code builds whole intermediate arrays, so it can use a lot of memory.
- "Most used" is not "best for every job". R remains strong for statistical analysis, and much of the heavy lifting under these libraries is compiled code written in languages such as C and C++.
- The ecosystem moves quickly. The code above ran on Python 3.13, NumPy 2.5, pandas 3.0 and scikit-learn 1.9. If a call has been renamed by the time you read this, check the current documentation before blaming the idea.

The speed was never in Python. It was in everything Python is willing to call.

---

**Sources**

- J. Hao and T. K. Ho, "Machine Learning Made Easy: A Review of Scikit-learn Package in Python Programming Language", *Journal of Educational and Behavioral Statistics*, 44(3), 2019.
- C. R. Harris et al., "Array programming with NumPy", *Nature*, 585, 2020.
