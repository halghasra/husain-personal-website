---
title: "The Shape of Data"
slug: "the-shape-of-data"
type: "note"
status: "evergreen"
summary: "Four datasets share a mean, a spread, a correlation and a fitted line, and look nothing alike. A walk through the numbers we use to summarise data, what each one hides, and the question I should have asked before any of them."
date: "2026-07-31"
created: "2026-07-31"
updated: "2026-07-31"
topics: ["Statistics", "Data Analysis"]
tags: ["Statistics", "Data", "Probability", "Python"]
linked_notes:
  - "data-is-not-information"
  - "garbage-in"
  - "what-a-p-value-is-not"
  - "why-data-is-a-matrix"
graph:
  show: true
  weight: 2
  cluster: "statistics"
seo:
  title: "The Shape of Data"
  description: "Mean, median, standard deviation, skewness, kurtosis and the normal curve: what each summary hides, why Anscombe's quartet matters, and why variable types come first."
---

The mean is the first number most of us reach for, me included, and the standard deviation is usually the second. Together they feel like a description of a dataset: where it sits, and how far it wanders.

They are a compression of the dataset, and compression loses things. This note is about what gets lost, how to notice, and why a table of four small datasets from 1973 is the best argument I know for looking before calculating.

## Four datasets, one summary

In 1973 the statistician Francis Anscombe published four datasets, each with eleven pairs of numbers, built so that the usual summaries cannot tell them apart. Here they are, with the summaries computed:

```python
import numpy as np

x = np.array([10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5], float)
x4 = np.array([8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8], float)
ys = [np.array([8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68]),
      np.array([9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74]),
      np.array([7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73]),
      np.array([6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89])]

print("set  mean x  mean y  SD y  correlation  fitted line")
for i, y in enumerate(ys, 1):
    a = x4 if i == 4 else x
    slope, intercept = np.polyfit(a, y, 1)
    r = np.corrcoef(a, y)[0, 1]
    print(f"{i:>3}  {a.mean():6.2f}  {y.mean():6.2f}  {y.std(ddof=1):4.2f}  {r:11.3f}  y = {intercept:.2f} + {slope:.3f}x")
```

```text
set  mean x  mean y  SD y  correlation  fitted line
  1    9.00    7.50  2.03        0.816  y = 3.00 + 0.500x
  2    9.00    7.50  2.03        0.816  y = 3.00 + 0.500x
  3    9.00    7.50  2.03        0.816  y = 3.00 + 0.500x
  4    9.00    7.50  2.03        0.817  y = 3.00 + 0.500x
```

Four rows, almost one row. Same means, same spread, same correlation (to three decimal places, give or take a thousandth), same best straight line. Now draw them.

<figure>
<svg viewBox="0 0 640 450" role="img" aria-label="Four scatter plots with the same mean, spread, correlation and fitted line. Plot I is a noisy rising cloud, plot II is a smooth curve, plot III is a tight line with one point far above it, and plot IV has ten points stacked at one x value and a single point far to the right.">
  <title>Anscombe's quartet</title>
  <rect x="30" y="20" width="270" height="170" rx="6" class="dg-subtle" stroke-width="1"/>
  <line x1="45.0" y1="154.6" x2="285.0" y2="41.2" class="dg-accent-stroke" stroke-width="2"/>
  <circle cx="150.0" cy="104.4" r="4.5" class="dg-ink"/>
  <circle cx="120.0" cy="119.9" r="4.5" class="dg-ink"/>
  <circle cx="195.0" cy="111.0" r="4.5" class="dg-ink"/>
  <circle cx="135.0" cy="93.5" r="4.5" class="dg-ink"/>
  <circle cx="165.0" cy="100.3" r="4.5" class="dg-ink"/>
  <circle cx="210.0" cy="77.2" r="4.5" class="dg-ink"/>
  <circle cx="90.0" cy="115.8" r="4.5" class="dg-ink"/>
  <circle cx="60.0" cy="158.0" r="4.5" class="dg-ink"/>
  <circle cx="180.0" cy="64.8" r="4.5" class="dg-ink"/>
  <circle cx="105.0" cy="150.1" r="4.5" class="dg-ink"/>
  <circle cx="75.0" cy="137.9" r="4.5" class="dg-ink"/>
  <text x="42" y="42" font-size="15" font-weight="700" class="dg-text">I</text>
  <text x="165.0" y="210" font-size="12" text-anchor="middle" class="dg-muted">mean y 7.50, line y = 3 + 0.5x</text>
  <rect x="340" y="20" width="270" height="170" rx="6" class="dg-subtle" stroke-width="1"/>
  <line x1="355.0" y1="154.6" x2="595.0" y2="41.2" class="dg-accent-stroke" stroke-width="2"/>
  <circle cx="460.0" cy="88.8" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="103.0" r="4.5" class="dg-ink"/>
  <circle cx="505.0" cy="94.5" r="4.5" class="dg-ink"/>
  <circle cx="445.0" cy="94.1" r="4.5" class="dg-ink"/>
  <circle cx="475.0" cy="87.2" r="4.5" class="dg-ink"/>
  <circle cx="520.0" cy="103.6" r="4.5" class="dg-ink"/>
  <circle cx="400.0" cy="131.5" r="4.5" class="dg-ink"/>
  <circle cx="370.0" cy="174.4" r="4.5" class="dg-ink"/>
  <circle cx="490.0" cy="89.0" r="4.5" class="dg-ink"/>
  <circle cx="415.0" cy="115.5" r="4.5" class="dg-ink"/>
  <circle cx="385.0" cy="151.2" r="4.5" class="dg-ink"/>
  <text x="352" y="42" font-size="15" font-weight="700" class="dg-text">II</text>
  <text x="475.0" y="210" font-size="12" text-anchor="middle" class="dg-muted">mean y 7.50, line y = 3 + 0.5x</text>
  <rect x="30" y="250" width="270" height="170" rx="6" class="dg-subtle" stroke-width="1"/>
  <line x1="45.0" y1="384.6" x2="285.0" y2="271.2" class="dg-accent-stroke" stroke-width="2"/>
  <circle cx="150.0" cy="342.6" r="4.5" class="dg-ink"/>
  <circle cx="120.0" cy="352.4" r="4.5" class="dg-ink"/>
  <circle cx="195.0" cy="267.9" r="4.5" class="dg-ink"/>
  <circle cx="135.0" cy="347.6" r="4.5" class="dg-ink"/>
  <circle cx="165.0" cy="337.7" r="4.5" class="dg-ink"/>
  <circle cx="210.0" cy="323.1" r="4.5" class="dg-ink"/>
  <circle cx="90.0" cy="362.2" r="4.5" class="dg-ink"/>
  <circle cx="60.0" cy="372.0" r="4.5" class="dg-ink"/>
  <circle cx="180.0" cy="332.9" r="4.5" class="dg-ink"/>
  <circle cx="105.0" cy="357.4" r="4.5" class="dg-ink"/>
  <circle cx="75.0" cy="367.2" r="4.5" class="dg-ink"/>
  <text x="42" y="272" font-size="15" font-weight="700" class="dg-text">III</text>
  <text x="165.0" y="440" font-size="12" text-anchor="middle" class="dg-muted">mean y 7.50, line y = 3 + 0.5x</text>
  <rect x="340" y="250" width="270" height="170" rx="6" class="dg-subtle" stroke-width="1"/>
  <line x1="355.0" y1="384.6" x2="595.0" y2="271.2" class="dg-accent-stroke" stroke-width="2"/>
  <circle cx="430.0" cy="355.1" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="366.7" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="339.1" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="323.1" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="328.3" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="348.6" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="374.0" r="4.5" class="dg-ink"/>
  <circle cx="595.0" cy="271.2" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="369.6" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="336.3" r="4.5" class="dg-ink"/>
  <circle cx="430.0" cy="350.7" r="4.5" class="dg-ink"/>
  <text x="352" y="272" font-size="15" font-weight="700" class="dg-text">IV</text>
  <text x="475.0" y="440" font-size="12" text-anchor="middle" class="dg-muted">mean y 7.50, line y = 3 + 0.5x</text>
</svg>
<figcaption>Anscombe's four datasets, each with the same mean, spread, correlation and fitted line (the amber line, the same in every panel). Only the pictures differ.</figcaption>
</figure>

Set I is what the summary seems to promise: a noisy cloud around a rising line. Set II is a smooth curve, so a straight line is simply the wrong model, however good its correlation looks. Set III is a tight line with one point far above it, and that single point tilts the fitted line away from the other ten. Set IV is the oddest: ten points stacked at the same x, and one point alone out at 19, so the whole slope hangs on a single observation.

Anscombe's argument was in the title of his paper, "Graphs in Statistical Analysis". A picture is not a decoration added to the numbers afterwards. It is the check that the numbers are about the thing you think they are about.

That does not make summaries useless. It means each one answers one narrow question, and I want to go through them one at a time to see which question, and what it leaves out.

## The middle

The **mean** adds up the values and divides by how many there are. The **median** is the middle value once they are sorted. The mean uses every value, which sounds like a virtue, and is also exactly its weakness: every value pulls on it, so an extreme one pulls hard. The median uses only the order, so it does not care how extreme the extreme is.

```python
import numpy as np

clean = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
dirty = np.append(clean, 177015)          # one extreme value

print("clean: mean", clean.mean(), " median", np.median(clean))
print("dirty: mean", round(dirty.mean(), 2), " median", np.median(dirty))

# How much of the data can you corrupt before the statistic runs away?
rng = np.random.default_rng(0)
data = rng.normal(100, 10, size=21)
for k in (0, 5, 10, 11):
    bad = data.copy()
    bad[:k] = 1_000_000                   # corrupt k of the 21 values
    print(f"{k:>2} corrupted: mean {bad.mean():>10.1f}   median {np.median(bad):>10.1f}")
```

```text
clean: mean 5.5  median 5.5
dirty: mean 16097.27  median 6.0
 0 corrupted: mean       98.2   median       98.7
 5 corrupted: mean   238169.5   median      100.4
10 corrupted: mean   476240.6   median      110.4
11 corrupted: mean   523855.2   median  1000000.0
```

One absurd number, 177,015, drags the mean of the first ten integers from 5.5 to 16,097.27 (that is 177,070 divided by 11) and moves the median by half a point, to 6. The second experiment makes it systematic. I drew 21 values around 100 and replaced some of them with a million. The mean is ruined by the first corrupted value. The median hardly notices five bad values, or even ten, and only gives way when 11 of the 21 are bad, a majority. The share of the data you can corrupt before a statistic can be made arbitrarily wrong is its **breakdown point**: effectively zero for the mean, one half for the median.

So use the median? Not automatically. The median ignores size, and sometimes size is the whole question. In insurance, the total paid out across a portfolio is the mean claim times the number of claims, so a median claim cost tells you about the typical claim and nothing about the bill. A mean claim cost and a median claim cost answer different questions, and reporting only one hides the other. The gap between them is itself a quick hint of skew, which I come back to below.

## The spread

The **variance** is the average squared distance from the mean, and the **standard deviation** is its square root, which puts the spread back into the units of the data. Squaring removes the sign and punishes big deviations.

The detail I find most satisfying is the "minus one". Run the same eight numbers through NumPy and through pandas and you get two different standard deviations:

```python
import numpy as np
import pandas as pd

data = np.array([2, 4, 4, 4, 5, 5, 7, 9])
print("mean:", data.mean())
print("sum of squared deviations:", ((data - data.mean())**2).sum())
print("divide by n    :", round(np.var(data), 3), " SD:", round(np.std(data), 3))
print("divide by n - 1:", round(np.var(data, ddof=1), 3), " SD:", round(np.std(data, ddof=1), 3))
print("pandas .std()  :", round(pd.Series(data).std(), 3))

# Average each estimate over many samples of 5 from a population whose variance is exactly 1
rng = np.random.default_rng(0)
samples = rng.normal(0, 1, size=(100_000, 5))
print("divide-by-n estimates, averaged    :", round(samples.var(axis=1, ddof=0).mean(), 3))
print("divide-by-(n-1) estimates, averaged:", round(samples.var(axis=1, ddof=1).mean(), 3))
```

```text
mean: 5.0
sum of squared deviations: 32.0
divide by n    : 4.0  SD: 2.0
divide by n - 1: 4.571  SD: 2.138
pandas .std()  : 2.138
divide-by-n estimates, averaged    : 0.802
divide-by-(n-1) estimates, averaged: 1.003
```

The squared deviations add up to 32. Divide by 8 and the variance is 4, so the SD is 2. Divide by 7 and the variance is 4.571, so the SD is 2.138. NumPy divides by n unless you tell it otherwise, and pandas divides by n minus 1. Neither is a bug. They answer different questions.

The reason is that when you are measuring from the sample's own mean, you are measuring from the one point that sits closest to your data. Deviations from it come out a little too small. The simulation shows how much: I drew 100,000 samples of five from a population whose variance is exactly 1. Dividing by n gave an average of 0.802, close to the (n - 1) ÷ n = 0.8 that theory predicts. Dividing by n - 1 gave 1.003. The correction is named after Friedrich Bessel. It makes the variance estimate unbiased, but the SD, being a square root of it, is still slightly off on average.

An SD has two more limits. Because deviations are squared, one outlier can dominate it just as it dominates the mean. And it describes how wide the data is, not what shape it has. Anscombe's four sets share an SD and nothing else.

## The shape itself

Spread says how far. Shape says how it is arranged. Two numbers capture a little of it. **Skewness** is the average cubed standardised deviation, and measures lopsidedness: positive means a long right tail. **Kurtosis** is the average fourth power, and measures how heavy the tails are. A normal curve has a kurtosis of 3, and libraries usually report **excess kurtosis**, which is that minus 3, so the normal scores 0.

```python
import numpy as np
import pandas as pd
from scipy.stats import skew, kurtosis

rng = np.random.default_rng(0)
samples = {
    "normal":      rng.normal(0, 1, 100_000),
    "exponential": rng.exponential(1, 100_000),     # long right tail
    "laplace":     rng.laplace(0, 1, 100_000),      # symmetric, heavy tails
    "uniform":     rng.uniform(0, 1, 100_000),      # symmetric, no tails
}
for name, d in samples.items():
    print(f"{name:<12} skew {skew(d):>5.2f}   excess kurtosis {kurtosis(d):>5.2f}   mean {d.mean():.2f}   median {np.median(d):.2f}")

# On a small sample, two libraries give two answers
small = [1, 2, 2, 3, 3, 3, 4, 4, 5, 20]
print("skew     scipy:", round(skew(small), 3), " pandas:", round(pd.Series(small).skew(), 3))
print("kurtosis scipy:", round(kurtosis(small), 3), " pandas:", round(pd.Series(small).kurt(), 3))
```

```text
normal       skew -0.00   excess kurtosis  0.02   mean -0.00   median -0.00
exponential  skew  2.01   excess kurtosis  5.99   mean 1.00   median 0.69
laplace      skew -0.00   excess kurtosis  3.12   mean -0.00   median -0.00
uniform      skew -0.01   excess kurtosis -1.21   mean 0.50   median 0.50
skew     scipy: 2.449  pandas: 2.904
kurtosis scipy: 4.444  pandas: 8.821
```

Read the four rows as four characters. The normal is the reference: skew about 0, excess kurtosis about 0. The exponential has a long right tail, skew about 2, and look at its mean and median: 1.00 against 0.69. That gap between them is the quick skew check I promised. The Laplace is perfectly symmetric but has heavy tails, so it produces rare large swings in both directions. Its excess kurtosis is about 3, where theory says exactly 3. The uniform has no tails at all, and an excess kurtosis near -1.2.

Notice the middle two rows. Both have a skew of zero, and they are nothing alike. Zero skew only means the lopsidedness cancels out. And kurtosis is better read as tail weight than as how pointed the peak is.

The last two lines are a trap. On ten numbers with one 20 among them, SciPy and pandas disagree: skew 2.449 against 2.904, kurtosis 4.444 against 8.821. SciPy uses the plain formula by default and pandas applies small-sample corrections. With large samples they agree. Both statistics are driven by a few extreme points, so on small samples I treat them as hints and not as measurements.

## Why the bell keeps turning up

The **normal distribution** is the symmetric bell fixed completely by two numbers: its mean sets where it sits and its standard deviation sets how wide it is. A **z-score** counts how many standard deviations a value is from the mean. For marks with a mean of 75 and an SD of 10 (invented), a 90 has z = (90 - 75) ÷ 10 = 1.5.

```python
import numpy as np
from math import erf, exp, pi, sqrt
from scipy.stats import skew

def cdf(z):
    return 0.5 * (1 + erf(z / sqrt(2)))

mu, sigma, x = 75, 10, 90
z = (x - mu) / sigma
print("z-score:", z, "  share of a normal population below it:", round(cdf(z), 4))
for k in (1, 2, 3):
    print(f"within {k} SD, normal: {cdf(k) - cdf(-k):.4f}")

# The same rule on skewed data (exponential: mean 1, SD 1)
rng = np.random.default_rng(0)
e = rng.exponential(1, 100_000)
for k in (1, 2, 3):
    print(f"within {k} SD, exponential: {np.mean(np.abs(e - e.mean()) <= k * e.std()):.4f}")

# A density is not a probability: a narrow bell is taller than 1 at its peak
print("height of the bell at its peak, SD 1  :", round(1 / (1 * sqrt(2 * pi)), 4))
print("height of the bell at its peak, SD 0.1:", round(1 / (0.1 * sqrt(2 * pi)), 4))

# Averaging tidies things: skew of the average of n exponentials
for n in (1, 5, 30, 200):
    means = rng.exponential(1, size=(100_000, n)).mean(axis=1)
    print(f"average of {n:>3}: skew {skew(means):5.2f}  (theory {2 / np.sqrt(n):.2f})")
```

```text
z-score: 1.5   share of a normal population below it: 0.9332
within 1 SD, normal: 0.6827
within 2 SD, normal: 0.9545
within 3 SD, normal: 0.9973
within 1 SD, exponential: 0.8645
within 2 SD, exponential: 0.9498
within 3 SD, exponential: 0.9816
height of the bell at its peak, SD 1  : 0.3989
height of the bell at its peak, SD 0.1: 3.9894
average of   1: skew  2.01  (theory 2.00)
average of   5: skew  0.89  (theory 0.89)
average of  30: skew  0.37  (theory 0.37)
average of 200: skew  0.14  (theory 0.14)
```

About 93.3 per cent of a normal population sits below a z of 1.5. The famous rule is exact for a normal curve: 68.27, 95.45 and 99.73 per cent lie within one, two and three SDs. But look at the exponential, which is not normal. The same windows hold 86.5, 95.0 and 98.2 per cent. The rule belongs to the curve, not to every dataset, and applying it to lopsided data gives wrong answers in both directions.

There is a small trap in the heights. A narrow bell with an SD of 0.1 peaks at 3.99, far above 1. That is fine, because the height of the curve is a density, not a probability. Only the area under it between two values is a probability.

So why does the bell appear so often? The last block is my favourite answer. Take the average of n draws from the lopsided exponential, over and over, and look at the skew of those averages. With n = 1 it is the exponential's own 2.01. With 5 it falls to 0.89, with 30 to 0.37 and with 200 to 0.14, tracking 2 ÷ √n, the theoretical value, almost exactly. Averaging makes things tidy. That is the idea behind the **central limit theorem**: under conditions (independent draws from a distribution with a finite variance), the average of many of them looks more and more like a bell, whatever the original shape. Gauss used the curve for errors in astronomical measurements in the early 1800s, which is why it is also called Gaussian, and measurement error is a sum of many small effects. Nature is not particularly tidy. Averages are.

The conditions matter, and real data often fails them. Income and claim sizes tend to be right-skewed with long tails, and assuming a bell under-prices the rare, large events, which are usually the ones that cost something.

## The question I should have asked first

I have left the most basic question until last, because it is the one I would most like to have asked before the rest. What kind of number is this?

A column of numbers is not always a quantity. A rank, a shirt number or a postcode stored as a figure can be added and averaged, and the answer means nothing. Kaliyadan and Kulkarni, in a short teaching paper for clinicians, give two tests I like because they take ten seconds. The **subtraction test**: if subtracting two values gives something meaningful, the variable is quantitative, and if not, it is qualitative. The **mid-way test**: if the value halfway between two values makes sense, the variable is continuous, and if not, it is discrete. Qualitative variables then split into **nominal** (labels with no order, like a playing position) and **ordinal** (labels with an order, like small, medium and large).

```python
import pandas as pd

players = pd.DataFrame({
    "Rk":  [1, 2, 3, 4],                       # an identifier: arithmetic means nothing
    "Pos": ["PG", "C", "SF", "C"],             # nominal: labels with no order
    "Age": [24, 31, 27, 22],                   # discrete: whole numbers
    "PTS": [27.3, 8.1, 16.9, 12.4],            # continuous: a value halfway between makes sense
})
players["Size"] = pd.Categorical(["M", "L", "S", "L"],
                                 categories=["S", "M", "L"], ordered=True)   # ordinal

print("mode of Pos:", players["Pos"].mode().tolist())
print("largest Size:", players["Size"].max())
print("mean of PTS:", round(players["PTS"].mean(), 2))
print("mean of Rk:", players["Rk"].mean())
```

```text
mode of Pos: ['C']
largest Size: L
mean of PTS: 16.18
mean of Rk: 2.5
```

The table is invented, though shaped like a sports statistics sheet. The only centre a nominal column has is its **mode**, the most common label, here C. The ordinal size has a maximum, because S < M < L, but nobody can say M sits halfway between S and L. Points per game is genuinely continuous, so a mean of 16.18 means something. And Python happily reports a mean rank of 2.5, which is a number about nothing.

The boundaries are modelling choices, not facts. Age is continuous in nature and discrete as recorded. A five-star rating is ordinal, yet it is routinely averaged as if the gaps between stars were equal. A column of 0s and 1s might be a count, a flag or a category, and the software type will not tell you which. Encoding categories as 1, 2, 3 for a model can quietly invent an order that was never there. Insurance data mixes every type in one table: postcodes, bands, counts, amounts. Treating the postcode as a number is a classic trap, and one of the many quiet ways a model ends up learning from the wrong thing, which is the subject of [Garbage In](/notes/garbage-in/).

Everything above depends on getting this right first. A mean needs a quantity. A median needs an order. An SD needs distances that mean something. A mode is all a label can offer.

Before you calculate anything, ask what the numbers are allowed to mean. Before you trust anything you calculated, draw it.

---

## References

- F. J. Anscombe, ["Graphs in Statistical Analysis"](https://doi.org/10.1080/00031305.1973.10478966), *The American Statistician*, 27(1), 1973, 17–21.
- F. Kaliyadan and V. Kulkarni, ["Types of Variables, Descriptive Statistics, and Sample Size"](https://doi.org/10.4103/idoj.IDOJ_468_18), *Indian Dermatology Online Journal*, 10(1), 2019, 82–86.
