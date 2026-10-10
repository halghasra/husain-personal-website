---
title: "Garbage In: The Unglamorous Half of Machine Learning"
slug: "garbage-in"
type: "note"
status: "evergreen"
summary: "Fifty rows of random numbers, labels with nothing to do with them, and a model that scores 95 per cent. A tour of the ways data misleads a model before it is trained, and the one mistake behind that number."
date: "2026-10-10"
created: "2026-10-10"
updated: "2026-10-10"
topics: ["Machine Learning", "Data Preparation"]
tags: ["Machine Learning", "Data", "Statistics", "Python", "AI"]
linked_notes:
  - "data-is-not-information"
  - "the-shape-of-data"
  - "one-neuron-one-line"
  - "finding-the-needle"
graph:
  show: true
  weight: 2
  cluster: "data"
seo:
  title: "Garbage In: The Unglamorous Half of Machine Learning"
  description: "Anscombe's quartet, mean imputation, the IQR rule, class imbalance and data leakage, with runnable Python and the one mistake that scores 95% on pure noise."
---

> *Garbage in, garbage out.*

Programmers learn this saying early, and it sounds like comfort. Feed the machine nonsense and nonsense comes out, where you can see it and throw it away.

Here is a test of the saying. I generated 50 rows of 5,000 columns of random numbers. I gave them labels, zero and one in alternation, that have nothing to do with the numbers. Then I did what the textbooks say: chose the 20 most promising columns, trained a logistic regression, and measured it with five-fold cross-validation. I repeated this on 20 different random datasets. The average accuracy was 95.4 per cent. The lowest was 90 and the highest was 100.

That is pure garbage going in, and what came out looked like a triumph. So the saying is incomplete. Garbage in, garbage out is the comfortable case. The dangerous one is garbage in, something that looks like gold out.

In [Data Is Not Information](/notes/data-is-not-information/) I described fields that arrive intact and still mean the wrong thing. This note is about the next step, when a model learns from them. It is a tour of the work that happens before and around the model, one small way of being misled at each stop, and at the end I come back to the 95 per cent and show where it came from.

## Look before you model

In 1973 the statistician Francis Anscombe built four small datasets to make a point. Each has 11 points. Here are their summaries, recomputed:

```python
import numpy as np
x = np.array([10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5], float)
x4 = np.array([8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8], float)
Y = [np.array([8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68]),
     np.array([9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74]),
     np.array([7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73]),
     np.array([6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89])]
for i, y in enumerate(Y, 1):
    a = x4 if i == 4 else x
    b1, b0 = np.polyfit(a, y, 1)
    print(i, round(a.mean(), 2), round(y.mean(), 2), round(y.var(ddof=1), 2),
          round(np.corrcoef(a, y)[0, 1], 3), f"y = {b0:.2f} + {b1:.3f}x")
```

```text
1 9.0 7.5 4.13 0.816 y = 3.00 + 0.500x
2 9.0 7.5 4.13 0.816 y = 3.00 + 0.500x
3 9.0 7.5 4.12 0.816 y = 3.00 + 0.500x
4 9.0 7.5 4.12 0.817 y = 3.00 + 0.500x
```

The columns are the dataset, the mean of x, the mean of y, the variance of y, the correlation, and the fitted line. They agree to two or three decimal places. Plot them and they could hardly be more different. The first is a noisy straight line. The second is a clean curve. The third is a tight line dragged off course by one stray point. The fourth has ten points stacked at the same x, and a single distant point alone decides the slope.

A summary compresses, and compression throws away shape. I think of exploratory analysis, the habit of looking at the data before modelling it, as the discipline of not letting that happen. There is a counterweight. Look at one dataset enough ways and chance will hand you a pattern, so looking suggests hypotheses and does not confirm them. I look at shape more closely in [The Shape of Data](/notes/the-shape-of-data/).

## The harmless average

Real data has gaps, and the first fix every tutorial offers is to fill each blank with the column's mean. It feels harmless. Ten values, three hidden:

```python
import numpy as np, pandas as pd
full = pd.Series([3, 5, 6, 8, 9, 11, 12, 14, 15, 17], dtype=float)
obs = full.copy(); obs[[2, 5, 8]] = np.nan          # hide 6, 11 and 15
imp = obs.fillna(obs.mean())
print(round(full.var(), 4), round(obs.var(), 4), round(imp.var(), 4))
print(round(obs.mean(), 4), round(imp.mean(), 4))
print(round(imp.var() / obs.var(), 4), round((7 - 1) / (10 - 1), 4))

rng = np.random.default_rng(0)
x = rng.normal(size=1000); y = 0.8 * x + rng.normal(scale=0.6, size=1000)
gone = rng.random(1000) < 0.30
y_filled = np.where(gone, y[~gone].mean(), y)
print(round(np.corrcoef(x, y)[0, 1], 3), round(np.corrcoef(x[~gone], y[~gone])[0, 1], 3),
      round(np.corrcoef(x, y_filled)[0, 1], 3), int(gone.sum()))
```

```text
21.1111 24.5714 16.381
9.7143 9.7143
0.6667 0.6667
0.8 0.811 0.697 289
```

The mean is untouched at 9.7143, and the variance falls from 24.57 to 16.38. The ratio is exactly 6/9. The three filled values sit exactly on the mean, so they add nothing to the sum of squared deviations while still counting in the divisor, and a column that was 30 per cent guesses is a third less spread out than the truth. The last line is a simulation: 1,000 rows, 289 of the y values deleted at random. The true correlation between x and y is 0.8. Using only the complete rows gives 0.811. Filling with the mean pulls it down to 0.697. The fill did not just add values. It weakened the relationship the model was meant to learn.

The reason a value is missing matters as much as the method. If people with high incomes decline to answer, every fill built from those who did answer is biased. On an insurance form a blank can mean the question was not asked, does not apply, or is not known, and a mean fill erases the difference. Keeping an extra column that records "this was missing" is cheap and preserves it. A filled gap looks like data. It is a guess wearing data's clothes.

## The strange value

An outlier is a value far enough from the rest to deserve a second look. The most common rule is Tukey's: flag anything below Q1 − 1.5 × IQR or above Q3 + 1.5 × IQR, where IQR is the distance between the first and third quartiles. The 1.5 is a convention, not a law of nature.

```python
import numpy as np
x = np.array([12, 13, 13, 14, 15, 15, 16, 17, 18, 95], dtype=float)
q1, q3 = np.percentile(x, [25, 75])
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr
print(q1, q3, iqr, lo, hi, x[(x < lo) | (x > hi)].tolist())
print(x.mean(), np.median(x), np.clip(x, lo, hi).mean(), round(x[(x >= lo) & (x <= hi)].mean(), 4))
z = (x - x.mean()) / x.std()
print(round(z.max(), 4), round(np.sqrt(len(x) - 1), 4))
```

```text
13.25 16.75 3.5 8.0 22.0 [95.0]
22.8 15.0 15.5 14.7778
2.9919 3.0
```

The fences are 8.0 and 22.0, and only 95 falls outside. One value drags the mean to 22.8 while the median stays at 15. Capping it at the fence gives a mean of 15.5, and dropping it gives 14.78. The last line shows why the other popular rule, "more than three standard deviations from the mean", fails here. The z-score of 95 is 2.9919, below 3. The outlier inflated the very standard deviation that was supposed to catch it. With 10 values the largest z-score any point can reach is √9 = 3, so a strict "above 3" rule could never fire at all.

Flagged does not mean wrong. In a vibration signal from a rotating machine, a heavy tail can mean impacts, and impacts can mean a fault: there the outlier is the signal. In insurance, large losses are rare and may be exactly what a model exists to handle, so deleting them as noise could remove the point. Before you delete the strange value, ask what it is trying to say.

## A common ruler

A model given an income of 50,000 and an age of 40 sees two numbers, not two units. Distance-based methods such as nearest neighbours and k-means take the numbers at face value, so whichever column has the biggest scale wins by default.

**Feature scaling** rewrites each column onto a common scale. A z-score subtracts the mean and divides by the standard deviation. Min-max scaling maps the observed range onto 0 to 1.

```python
import numpy as np
a, b = np.array([40, 50000.]), np.array([25, 51000.])   # age, income
d2 = (a - b) ** 2
print(round(float(np.sqrt(d2.sum())), 2), round(float(d2[0] / d2.sum() * 100), 4))

y = np.array([10, 12, 14, 16, 200], dtype=float)   # one extreme value
print(np.round((y - y.min()) / (y.max() - y.min()), 4).tolist())
print(np.round((y - y.mean()) / y.std(), 4).tolist())

x = np.array([2, 4, 4, 4, 5, 5, 7, 9], dtype=float)
train, test = x[:6], x[6:]                          # fit on train only
print(((test - train.mean()) / train.std()).tolist())
print(np.round((test - train.min()) / (train.max() - train.min()), 4).tolist())
```

```text
1000.11 0.0225
[0.0, 0.0105, 0.0211, 0.0316, 1.0]
[-0.5399, -0.5132, -0.4865, -0.4597, 1.9993]
[3.0, 5.0]
[1.6667, 2.3333]
```

In the first line, a 15-year age gap contributes 0.0225 per cent of the squared distance between two people. Income decided everything. The second and third lines show min-max's weakness: one extreme value squeezes the four ordinary points into the bottom 3 per cent of the range, 0 to 0.0316. The last two lines scale held-out values using only the first six rows. They land at 3.0 and 5.0 as z-scores, and at 1.6667 and 2.3333 under min-max, outside the 0 to 1 range. That is normal, and a hint at something I come back to: the scaler is allowed to be surprised by data it has not seen.

## The model that catches nothing

Suppose 10 cases in 1,000 are the ones you care about: a fraud, a failure, a large loss. A model that says "nothing to see" every time is right 990 times.

```python
import numpy as np
from sklearn.metrics import accuracy_score, recall_score
from sklearn.utils.class_weight import compute_class_weight

y = np.array([0] * 990 + [1] * 10)
pred = np.zeros_like(y)                     # always say "majority"
print(accuracy_score(y, pred), recall_score(y, pred))
w = compute_class_weight("balanced", classes=np.array([0, 1]), y=y)
print(w.tolist(), 1000 / (2 * 990), 1000 / (2 * 10))
```

```text
0.99 0.0
[0.5050505050505051, 50.0] 0.5050505050505051 50.0
```

99 per cent accuracy, and recall of 0.0: not one of the ten cases found. Accuracy counts what you got right and never asks what you missed. The remedies are to weight the rare class (here 50 for each rare case against 0.505 for each common one, so both classes carry the same total weight of 500), to duplicate or delete rows until the classes balance, or to synthesise new rare examples. All three share a limit: none adds real information about the rare class. Each also moves the base rate the model sees, so its raw probabilities stop meaning what they say. The cheapest defence comes before any of them: choose a metric that cannot be fooled this way, and look at each class on its own.

## Making and choosing columns

Sometimes the model was not too simple. The question was. Take XOR, the textbook case of a pattern that no straight line separates, which I cover in [One Neuron, One Line](/notes/one-neuron-one-line/). A logistic regression on the two raw inputs gets half the points right. Hand it one extra column, the product of the two inputs, and it gets them all.

```python
import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[-1, -1], [-1, 1], [1, -1], [1, 1]], float)
y = np.array([0, 1, 1, 0])                       # XOR
print(LogisticRegression(C=1e6, max_iter=10000).fit(X, y).score(X, y))
X2 = np.column_stack([X, X[:, 0] * X[:, 1]])     # one extra column: the product
print(LogisticRegression(C=1e6, max_iter=10000).fit(X2, y).score(X2, y))

img = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
sym = np.array([[1, 0, 1], [0, 1, 0], [1, 0, 1]])
def orientations(a):
    return {tuple(np.rot90(b, k).ravel()) for b in (a, np.fliplr(a)) for k in range(4)}
print(len(orientations(img)), len(orientations(sym)))
```

```text
0.5
1.0
8 1
```

That is **feature engineering**: building the inputs a model sees, such as ratios, durations and counts, from raw data. The hand-built column carries an assumption about what matters, and it is worth writing the assumption down.

The last line of the code is **data augmentation**, making extra training examples by changing the ones you have in ways that should not change the label. Four rotations, each with and without a mirror flip, turn one asymmetric 3 by 3 image into 8 distinct versions. A symmetric image gives 1: it gains nothing. Augmentation adds variety, not information, because the copies are strongly tied to the originals. It can also corrupt the label. Turn a handwritten 6 upside down and you have a 9. A copy is not a new fact.

## Back to the 95 per cent

Now the opening experiment. The recipe was: pick the 20 columns that best match the labels, then cross-validate. With 5,000 columns of random numbers, some will line up with any set of labels by chance. Choosing them using all 50 rows means the selector has seen every row, including the ones cross-validation later pretends to hold out. The model is then graded on questions whose answers it was handed.

The fix changes the order of two steps and nothing else. Put the selector inside each training fold, so that it only ever sees training rows:

```python
import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.pipeline import make_pipeline

y = np.array([0, 1] * 25)                     # labels with nothing to do with the data
cv = StratifiedKFold(5, shuffle=True, random_state=0)
clf = LogisticRegression(max_iter=1000)
right = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000))
leaky, honest = [], []
for seed in range(20):
    X = np.random.default_rng(seed).normal(size=(50, 5000))
    Xs = SelectKBest(f_classif, k=20).fit_transform(X, y)      # sees every row
    leaky.append(cross_val_score(clf, Xs, y, cv=cv).mean())
    honest.append(cross_val_score(right, X, y, cv=cv).mean())
print("leaky ", round(np.mean(leaky), 3), round(min(leaky), 3), round(max(leaky), 3))
print("honest", round(np.mean(honest), 3), round(min(honest), 3), round(max(honest), 3))
```

```text
leaky  0.954 0.9 1.0
honest 0.508 0.38 0.68
```

The columns are the mean, minimum and maximum accuracy over the 20 random datasets. Done in the wrong order, 95.4 per cent. Done in the right order, 50.8 per cent, which is what chance predicts for two balanced classes. This trap is described in *The Elements of Statistical Learning*, and it is easy to fall into because nothing crashes. The only symptom is a score that is too good.

This is **data leakage**: any route by which information from outside the training data, usually from the test set or from the future, reaches the model while it is being built. The pattern is always the same. A step that learns something from data is fitted on rows that include the evaluation rows. That step can be a selector, a scaler, an imputer, a text vocabulary, or an oversampler. Every earlier section of this note hides a version of it. Fill the gaps with a mean computed over all rows and the test set has contributed to the fill. Fit the scaler on everything and it has contributed to the ruler. Duplicate rare cases before splitting and copies of test rows sit in training. The rule is short: anything that learns from data learns from the training rows only.

Leakage has other forms I only name here: a feature recorded after the outcome it is supposed to predict, duplicates on both sides of the split, and using the future to predict the past in data ordered by time. Tuning against the same test set again and again leaks slowly, which is why the test set should be used once.

The saying should be longer. Garbage in, garbage out is the polite version. The dangerous one is garbage in, applause out, and the only defence I know is to ask what the model saw that it should not have.

---

**Sources**

- F. J. Anscombe, "Graphs in Statistical Analysis", *The American Statistician*, 27(1), 1973.
- J. W. Tukey, *Exploratory Data Analysis*, Addison-Wesley, 1977 (the IQR fences).
- T. Hastie, R. Tibshirani and J. Friedman, *The Elements of Statistical Learning*, 2nd ed., Springer, 2009 (selecting features before cross-validation).
- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., 2021.
