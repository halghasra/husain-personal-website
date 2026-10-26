---
title: "Garbage In: The Unglamorous Half of Machine Learning"
slug: "garbage-in"
type: "note"
status: "evergreen"
summary: "I gave a model random numbers and meaningless labels, then watched it score 95 per cent. The result led me backwards through the quieter decisions that shape a model before training begins."
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

I used to hear this as a promise: bad data might ruin a model, but at least the failure would announce itself. The output would be obviously useless, somebody would inspect the input, and the mistake would be found.

Then I built a deliberately meaningless dataset. It had 50 rows, 5,000 columns of random numbers, and alternating labels that had no relationship to any of them. I selected the 20 columns that appeared most promising, trained a logistic regression, and evaluated it with five-fold cross-validation. Across 20 fresh random datasets, the average accuracy was 95.4 per cent. Even the worst run scored 90 per cent; the best scored 100.

Nothing in the data was learnable. The impressive result came entirely from the way I had prepared and evaluated it. That is the version of bad data work that worries me: not the model that collapses, but the one that produces a number polished enough to survive a meeting.

In [Data Is Not Information](/notes/data-is-not-information/) I looked at fields that arrive intact while carrying the wrong meaning. Here I want to follow what happens after those fields enter a machine-learning workflow. The examples move through exploration, missing values, outliers, scaling, imbalance and feature construction. They eventually return to that 95.4 per cent, where a single ordering mistake explains the entire illusion.

## Look before you model

In 1973, the statistician Francis Anscombe published four small datasets that have become a warning against trusting a summary without looking at what it summarises. Each contains only 11 points. I recomputed their familiar statistics below:

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

The output gives, in order, the dataset number, both means, the variance of *y*, the correlation and the fitted line. To two or three decimal places, the four datasets appear to be the same. On a plot, they tell four different stories: a noisy line, a curve, a line distorted by one point, and a nearly vertical stack whose slope is decided by a lone observation.

The problem is not that the summaries are wrong. They are accurate answers to questions that discarded the geometry of the data. Exploratory analysis is therefore less about hunting for attractive patterns than about learning what the summary has compressed away. Looking can mislead too, particularly when enough plots make chance look meaningful, so it suggests questions rather than settling them. I explore that tension more fully in [The Shape of Data](/notes/the-shape-of-data/).

## The harmless average

Real data arrives with gaps, and mean imputation is often introduced as the harmless repair: replace each blank with the average of what remains. The average is preserved, which makes the method look conservative. Its other effects are easier to miss. Here are ten values with three hidden:

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

The mean remains 9.7143, but the variance falls from 24.57 to 16.38. The ratio is exactly 6/9 because the three replacements sit on the mean: they add observations to the denominator without adding any squared distance from the centre. The column is now 30 per cent imputed and exactly one-third less variable than the observed version.

The simulation shows a second cost. Its original correlation is 0.8. Keeping only complete rows estimates 0.811, while filling the missing *y* values with the mean reduces it to 0.697. The imputation has not merely completed a column; it has weakened the relationship the model was supposed to learn.

Even that calculation assumes the values disappeared at random. If people with high incomes are more likely to decline a question, the visible values are already a biased guide to the missing ones. In an insurance system, a blank might mean "not asked", "not applicable" or "unknown", three states that should not necessarily collapse into the same average. A missingness indicator at least preserves the fact that a value was supplied by the preprocessing rather than the person or event being modelled.

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

An outlier rule identifies an unusual value; it does not diagnose it. In a vibration signal from a rotating machine, a heavy tail may record the impacts that reveal a fault. In insurance, the largest losses may be rare precisely because they belong to the risk the model is meant to understand. The statistical flag begins an investigation. It cannot decide whether the observation is an error, an exceptional but valid case, or the most important case in the dataset.

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

The accuracy is 99 per cent and the recall is zero: the model has missed every case for which it might have been useful. Accuracy counts correct decisions without asking whether the errors are concentrated in the class that matters.

Class weights, resampling and synthetic examples can all change what the learner pays attention to. In this example, balanced weighting gives each rare case a weight of 50 and each common case about 0.505, so both classes contribute a total weight of 500. None of these interventions creates new knowledge about the rare class, however, and changing the class balance also changes how raw predicted probabilities should be interpreted. The first defence is therefore conceptual rather than computational: choose a metric that reflects the error you actually care about, then inspect performance class by class.

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

That extra product is **feature engineering**: constructing an input that makes a relationship available to the model. Ratios, durations, counts and interactions all do the same kind of work. Each engineered feature contains a judgement about what might matter, so documenting the feature is also documenting part of the model's reasoning.

The last line demonstrates **data augmentation**, where an existing example is transformed in ways that are assumed to preserve its label. Four rotations, with and without a mirror flip, create eight distinct orientations of the asymmetric image. The symmetric image still produces only one. Augmentation can teach a model which changes should not matter, but its examples are not independent observations. The label-preserving assumption also has to be true: rotate a handwritten 6 far enough and it may become a 9. The transformation encodes knowledge; it does not manufacture evidence.

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

The three numbers are the mean, minimum and maximum accuracy across the 20 random datasets. Selecting first gives 95.4 per cent on average. Selecting separately inside each training fold gives 50.8 per cent, close to the chance performance expected from balanced binary labels. *The Elements of Statistical Learning* uses this kind of feature-selection trap to explain why model assessment must include the whole training procedure, not only the final estimator. Nothing in the leaky version crashes or raises a warning. Its failure appears as success.

This is **data leakage**: information that should remain outside training reaches some part of the learning process. The obvious case is a test label entering the model, but leakage usually travels through quieter routes. A selector fitted on every row has allowed the test set to help choose the columns. A global imputation mean lets it help fill the gaps. A scaler fitted before the split lets it help set the ruler. Oversampling before the split can place near-duplicates on both sides.

The principle I now use is broader than "fit the model on the training set". Every operation that learns from data belongs inside the training boundary. That includes the vocabulary, imputer, scaler, feature selector and sampler, not merely the classifier at the end.

Leakage has other forms I only name here: a feature recorded after the outcome it is supposed to predict, duplicates on both sides of the split, and using the future to predict the past in data ordered by time. Tuning against the same test set again and again leaks slowly, which is why the test set should be used once.

The original saying is still useful, but it describes the failure that is easiest to notice. The more dangerous pipeline accepts weak or contaminated data and returns a convincing metric. When a result looks unusually good, the question is not only whether the model learned the pattern. It is also whether some earlier step allowed it to see the answer.

---

## References

- F. J. Anscombe, ["Graphs in Statistical Analysis"](https://doi.org/10.1080/00031305.1973.10478966), *The American Statistician*, 27(1), 1973, 17–21.
- J. W. Tukey, *Exploratory Data Analysis*, Addison-Wesley, 1977 (the IQR fences).
- T. Hastie, R. Tibshirani and J. Friedman, [*The Elements of Statistical Learning*](https://hastie.su.domains/ElemStatLearn/), 2nd ed., Springer, 2009 (feature selection and cross-validation, §7.10.2).
- S. Russell and P. Norvig, [*Artificial Intelligence: A Modern Approach*](https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003500), 4th ed., Pearson, 2021.
