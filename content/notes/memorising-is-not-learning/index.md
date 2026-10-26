---
title: "Memorising Is Not Learning"
slug: "memorising-is-not-learning"
type: "note"
status: "evergreen"
summary: "One curve fits every training point and fails almost everywhere between them. From that failure, I work through overfitting, unstable models, exhausted test sets and the metrics that reward doing nothing."
date: "2026-09-07"
created: "2026-09-07"
updated: "2026-09-07"
topics: ["Machine Learning", "Statistics", "Evaluation"]
tags: ["Machine Learning", "Statistics", "Data", "Python", "Problem Framing"]
linked_notes:
  - "garbage-in"
  - "what-a-p-value-is-not"
  - "backpropagation-learning-by-blame"
graph:
  show: true
  weight: 2
  cluster: "machine-learning"
seo:
  title: "Memorising Is Not Learning"
  description: "Overfitting, bias and variance, the test set, data leakage and precision and recall, each shown with a short Python experiment and its real output."
---

I gave four polynomial models the same twelve observations. One of them passed through every point, reducing its training error to 0.0000. If fitting the available data were the task, it had won completely.

On 201 fresh observations from the same process, its error rose to 5.8938. A far simpler cubic, which had left visible error on the training set, scored 0.1322. The perfect fit was about 45 times worse where the model was actually needed: away from the examples it had already seen.

The code had behaved correctly. The mistake was allowing performance on studied examples to stand in for performance on new ones. From that small experiment, this note moves through the related ways evaluation can flatter a model: excessive flexibility, repeated use of a test set, leakage before cross-validation, and a metric that rewards the majority class while ignoring the cases that matter.

## Twelve points, four curves

Here is the experiment. The real pattern is a single smooth wave, a sine curve. Every observation has noise added to it, with a standard deviation of 0.3, so the noise variance is 0.3² = 0.09. That is a floor. No model can be wrong by less than 0.09 on average, because the noise is not in the pattern for anyone to learn.

I fit polynomials of four different degrees to twelve noisy points. The degree is how flexible the curve is: degree 1 is a straight line, degree 3 allows a couple of bends, and degree 11 has twelve free coefficients, exactly enough to hit twelve points.

```python
import numpy as np, warnings
warnings.simplefilter("ignore")                      # high-degree fits complain about conditioning

def truth(x): return np.sin(2 * np.pi * x)           # the real pattern: one smooth wave
rng = np.random.default_rng(3)
x_train = np.linspace(0, 1, 12)                      # 12 points the model may study
y_train = truth(x_train) + rng.normal(0, 0.3, 12)    # each one jostled by noise (sd 0.3)
x_new = np.linspace(0, 1, 201)                       # 201 fresh points from the same source
y_new = truth(x_new) + rng.normal(0, 0.3, 201)

print("degree  error on study points  error on fresh points")
for degree in (1, 3, 9, 11):
    coeffs = np.polyfit(x_train, y_train, degree)
    seen = np.mean((np.polyval(coeffs, x_train) - y_train) ** 2)
    fresh = np.mean((np.polyval(coeffs, x_new) - y_new) ** 2)
    print(f"{degree:6d}  {seen:21.4f}  {fresh:21.4f}")
```

```text
degree  error on study points  error on fresh points
     1                 0.3342                 0.2961
     3                 0.2042                 0.1322
     9                 0.0317                 0.2982
    11                 0.0000                 5.8938
```

The columns have to be read together. The straight line is too rigid, leaving large errors on both seen and fresh data. The cubic has the lowest fresh-data error. Degree 9 fits the training points much more closely than the cubic but more than doubles the error on new observations. Degree 11 interpolates every training point and swings violently between them.

Increasing flexibility gives a model more ways to reduce training error, so that column alone cannot tell us when to stop. The useful question is whether the added flexibility captures a repeatable pattern or the accidents of this particular sample. Memorisation is not defined by a large model or a zero training error; it is the failure of what was learned to survive new data.

One honest caveat: this is a single draw of noise. The ordering holds up, but the exact numbers belong to this draw, as the next section shows.

## Two ways to be wrong

For squared error, the familiar bias-variance decomposition gives a more precise account of that failure. Expected error on a new observation can be separated into three parts:

<div class="formula">expected error = bias² + variance + noise</div>

**Bias** is how far the model's average answer is from the truth, because the model is too simple to bend the right way. **Variance** is how much the model's answer changes when the training data changes. **Noise** is the floor from above.

You can only measure the first two by repeating the experiment, which is easy in a simulation and impossible in a real project, where you have one dataset. So I drew 2,000 different sets of twelve noisy points and fitted each degree to every set:

```python
import numpy as np, warnings
warnings.simplefilter("ignore")

def truth(x): return np.sin(2 * np.pi * x)
rng = np.random.default_rng(3)
x_train = np.linspace(0, 1, 12)
x_new = np.linspace(0, 1, 201)
noise = 0.3

print("degree  bias squared  variance  plus 0.09 noise  measured error")
for degree in (1, 3, 5, 9):
    fits = []
    for _ in range(2000):                            # 2,000 different sets of 12 noisy points
        y = truth(x_train) + rng.normal(0, noise, 12)
        fits.append(np.polyval(np.polyfit(x_train, y, degree), x_new))
    fits = np.array(fits)
    bias2 = np.mean((fits.mean(axis=0) - truth(x_new)) ** 2)   # how far the average fit is from the truth
    variance = np.mean(fits.var(axis=0))                       # how much the fit moves between datasets
    y_fresh = truth(x_new) + rng.normal(0, noise, (2000, 201))
    measured = np.mean((fits - y_fresh) ** 2)
    print(f"{degree:6d}  {bias2:12.4f}  {variance:8.4f}  {bias2 + variance + noise**2:15.4f}  {measured:14.4f}")
```

```text
degree  bias squared  variance  plus 0.09 noise  measured error
     1        0.2157    0.0139           0.3196          0.3201
     3        0.0062    0.0248           0.1210          0.1212
     5        0.0000    0.0389           0.1289          0.1286
     9        0.0000    0.1205           0.2105          0.2103
```

The straight line has high bias (0.2157) and low variance (0.0139): different samples lead to similar lines, but those lines systematically miss the wave. The cubic reduces bias to 0.0062 while adding relatively little variance, giving the lowest total error in this experiment. By degrees 5 and 9, average bias is nearly gone, yet variance has risen to 0.0389 and 0.1205. Those fits can average to the right curve while any single fitted model remains unreliable.

Two things check the arithmetic. The last two columns agree to within 0.0005 (for the cubic, 0.1210 against 0.1212), so the three parts do add up. And degree 9 averages 0.2103 on fresh data over 2,000 datasets, against 0.2982 in my single draw above. The shape is solid. A single run is only a sample.

This is a simulation with evenly spaced inputs and a smooth truth. It shows the mechanism and proves nothing general. Very large neural networks often generalise better than this textbook curve would predict, which is an open question I am not going to settle here.

## The test set is only honest once

If error on the data you trained on is a poor guide, you need data the model has not studied. The standard answer is to split what you have in three.

<div class="callout callout-definition"><p><strong>Three sets, three jobs</strong></p><p>The <strong>training set</strong> teaches the model. The <strong>validation set</strong> is where you choose between models and settings. The <strong>test set</strong> is looked at once, at the end, to estimate how the model will do on genuinely new data.</p></div>

Model choices belong to training and validation: architecture, features, hyperparameters and stopping time. The test set estimates the result only after those choices are fixed. Once its performance has influenced a decision, it has joined the development process and no longer represents untouched evidence.

I wanted to see how much it matters, so I simulated it. Sixty noisy points: 36 to train, 12 to validate, 12 to test. Choose the polynomial degree from 1 to 9 two ways, once on the validation points and once by peeking at the test points. Repeat 500 times, and measure each choice against 20,000 fresh points that stand in for the real future.

```python
import numpy as np, warnings
warnings.simplefilter("ignore")
rng = np.random.default_rng(11)

def truth(x): return np.sin(2 * np.pi * x)
def make(n):
    x = rng.uniform(0, 1, n)
    return x, truth(x) + rng.normal(0, 0.3, n)
def error(coeffs, x, y): return np.mean((np.polyval(coeffs, x) - y) ** 2)

x_future, y_future = make(20000)                     # stands in for the real future
honest, peeked, real = [], [], []
for _ in range(500):
    x, y = make(60)
    order = rng.permutation(60)
    train, valid, test = order[:36], order[36:48], order[48:]
    fits = {d: np.polyfit(x[train], y[train], d) for d in range(1, 10)}
    best = min(fits, key=lambda d: error(fits[d], x[valid], y[valid]))   # choose the degree on validation
    honest.append(error(fits[best], x[test], y[test]))                   # then look at the test set once
    peeked.append(min(error(fits[d], x[test], y[test]) for d in fits))   # or choose on the test set itself
    real.append(error(fits[best], x_future, y_future))
print("average over 500 repeats")
print("  test error when the degree was chosen on validation:", round(np.mean(honest), 3))
print("  test error when the degree was chosen on the test  :", round(np.mean(peeked), 3))
print("  error on 20,000 genuinely new points               :", round(np.mean(real), 3))
```

```text
average over 500 repeats
  test error when the degree was chosen on validation: 0.114
  test error when the degree was chosen on the test  : 0.097
  error on 20,000 genuinely new points               : 0.124
```

Choosing the degree on validation data and evaluating it once gives a mean test error of 0.114, close to the 0.124 observed on 20,000 future samples. Choosing the degree that happened to look best on the test set reports 0.097. No individual result was falsified; the optimism came from selecting among nine noisy estimates and reporting the smallest.

With a larger search over models and settings, there are more chances for an accidental low test error to win. The logic is closely related to running many statistical comparisons and publishing the fortunate one, which I examine in [What a p-value Is Not](/notes/what-a-p-value-is-not/).

Splits can go wrong in other ways. With 12 test points the estimate is noisy, which is one reason people rotate the roles of the folds (cross-validation). A random split from one source says nothing about a different population, such as another hospital or another year. And for data ordered in time, a random shuffle lets the model train on the future. In insurance, where I work, a pricing or claims model should be tested on a later period than it was trained on, because that is how it will be used.

## The leak that predicts noise

The nastiest version of reusing information has no peeking in the code at all.

Take 50 rows and 5,000 columns of pure random noise, with labels, 0 or 1, that have nothing to do with the columns. Nobody can predict these labels, so an honest accuracy is about 50 per cent. Now do what looks like sensible practice: find the 20 columns that best match the labels, then estimate accuracy by cross-validation on those 20. The alternative puts the column selection inside each training fold, so that it never sees the rows being tested.

```python
import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.pipeline import make_pipeline

y = np.array([0, 1] * 25)                            # 50 labels with nothing behind them
folds = StratifiedKFold(5, shuffle=True, random_state=0)
model = LogisticRegression(max_iter=1000)
pipeline = make_pipeline(SelectKBest(f_classif, k=20), LogisticRegression(max_iter=1000))

wrong_order, right_order, best_match = [], [], []
for seed in range(20):
    X = np.random.default_rng(seed).normal(size=(50, 5000))      # 5,000 columns of pure noise
    corr = np.abs(((X - X.mean(0)) / X.std(0)).T @ ((y - y.mean()) / y.std())) / 50
    best_match.append(corr.max())                                # the best-looking noise column
    X_picked = SelectKBest(f_classif, k=20).fit_transform(X, y)  # choose columns using all 50 rows
    wrong_order.append(cross_val_score(model, X_picked, y, cv=folds).mean())
    right_order.append(cross_val_score(pipeline, X, y, cv=folds).mean())  # choose inside each fold

print("accuracy        mean  lowest  highest")
print("pick, then CV  ", round(np.mean(wrong_order), 3), round(min(wrong_order), 2), round(max(wrong_order), 2))
print("CV with pick   ", round(np.mean(right_order), 3), round(min(right_order), 2), round(max(right_order), 2))
print("best single noise column, correlation with the labels (average):", round(np.mean(best_match), 2))
```

```text
accuracy        mean  lowest  highest
pick, then CV   0.954 0.9 1.0
CV with pick    0.508 0.38 0.68
best single noise column, correlation with the labels (average): 0.51
```

Picking first and validating second reports 95.4 per cent accuracy on average, with even the worst of the 20 datasets reaching 90 per cent, on labels that carry no information at all. Selecting inside each fold reports 50.8 per cent, close to the coin toss that chance predicts (individual datasets ranged from 38 to 68 per cent).

Why does the wrong order work so well? With 5,000 columns and 50 rows, some columns line up with the labels by chance. The best single noise column correlates with the labels at about 0.51. The selection step found those lucky columns using every row, including the rows that cross-validation later held out. The test rows had already voted.

This is **data leakage**. A feature selector, scaler, vocabulary or imputation rule has learned from rows that the evaluation later presents as unseen. The estimator itself may receive only its training fold, but the representation it receives already contains information from outside that fold. Nothing needs to crash because the program has carried out the requested operations exactly; the error is in the boundary around what was allowed to learn.

Leakage has other forms. A feature recorded after the outcome hands the model the answer. In claims data, a field filled in after the decision, such as a final outcome code, would do that, and I would look for fields like it before trusting a strong result. The wider habit is the one in [Garbage In](/notes/garbage-in/): the unglamorous parts of preparing data decide whether the score means anything.

## A score that means nothing

Even with a clean split and no leak, one more thing can mislead: the number itself.

Picture a day with 1,000 claims, 10 of them fraudulent. A detector that flags nothing at all is right 990 times. That is 99 per cent accuracy, with no fraud found. Accuracy counts the answers you got right, and when one class is rare, doing nothing gets almost all of them right.

The fix is to ask two separate questions. **Precision** asks: of the cases the detector flagged, how many were truly positive? **Recall** asks: of the truly positive cases, how many did it find? **F1** is a single number built from both, the harmonic mean, which is low whenever either one is low.

```python
def scores(tp, fp, fn, tn):
    precision = tp / (tp + fp)
    recall = tp / (tp + fn)
    f1 = 2 * precision * recall / (precision + recall)
    accuracy = (tp + tn) / (tp + fp + fn + tn)
    return round(precision, 3), round(recall, 3), round(f1, 3), round(accuracy, 3)

# 1,000 cases, 10 of them genuinely positive (say, fraudulent claims)
print("flags nothing: accuracy", (990 + 0) / 1000, "| recall", 0 / 10)
print("flags 20, catches 8 of the 10 (precision, recall, F1, accuracy):", scores(8, 12, 2, 978))

# Why F1 uses the harmonic mean: precision 1.0 but recall only 0.1
p, r = 1.0, 0.1
print("simple average of the two:", (p + r) / 2, "| F1:", round(2 * p * r / (p + r), 4))
```

```text
flags nothing: accuracy 0.99 | recall 0.0
flags 20, catches 8 of the 10 (precision, recall, F1, accuracy): (0.4, 0.8, 0.533, 0.986)
simple average of the two: 0.55 | F1: 0.1818
```

A detector that flags 20 claims and catches 8 of the 10 frauds has recall of 0.8 but precision of only 0.4, because 12 of its flags were false alarms. Its accuracy is 98.6 per cent, which says nothing about those 12. Its F1 is 0.533.

The harmonic mean penalises imbalance between precision and recall. With precision 1.0 and recall 0.1, the arithmetic mean is 0.55 even though nine out of ten positive cases were missed. F1 falls to 0.18. That lower number is useful only if precision and recall deserve equal weight.

In practice, false alarms and missed cases rarely cost the same. Missing fraud, delaying an honest claim and sending work to an investigator have different consequences. A metric encodes a preference among those consequences, whether or not that preference was discussed. It should be chosen from the decision the model supports, not merely because a library makes it convenient.

Every score in this note is an argument about future behaviour. To judge the argument, I need to know what the model and its preprocessing were allowed to see, how often the evaluation data influenced a choice, and what a trivial model would have achieved. Without those answers, another decimal place only makes the uncertainty look tidy.

---

## References

- T. Hastie, R. Tibshirani and J. Friedman, [*The Elements of Statistical Learning*](https://hastie.su.domains/ElemStatLearn/), 2nd ed., Springer, 2009 (model assessment and selection, chapter 7).
- F. Pedregosa et al., ["Scikit-learn: Machine Learning in Python"](https://jmlr.org/papers/v12/pedregosa11a.html), *Journal of Machine Learning Research*, 12, 2011, 2825–2830.
