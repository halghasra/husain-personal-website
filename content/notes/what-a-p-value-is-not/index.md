---
title: "What a p-value Is Not"
slug: "what-a-p-value-is-not"
type: "note"
status: "evergreen"
summary: "A machine that never finds a real effect still announces a discovery about once in twenty runs. Running it 10,000 times is the quickest way I know to see what p < 0.05 does and does not say."
date: "2026-10-10"
created: "2026-10-10"
updated: "2026-10-10"
topics: ["Statistics", "Probability"]
tags: ["Statistics", "Probability", "Python", "Data", "Mathematics"]
linked_notes:
  - "bayes-or-how-to-change-your-mind"
  - "the-shape-of-data"
  - "memorising-is-not-learning"
graph:
  show: true
  weight: 2
  cluster: "statistics"
seo:
  title: "What a p-value Is Not"
  description: "Run an experiment in which nothing is happening 10,000 times and see what p < 0.05 really means: not the chance the effect is real, not its size, not a cause."
---

Here is a machine that finds effects. Each time it runs, it makes up two groups of 30 numbers, compares their averages with a standard t-test, and reports whether the groups differ. The thing to know about the machine is that both groups come from the very same source. Nothing is going on. There is no effect to find, and the machine cannot find one.

I ran it 10,000 times and counted how often it announced a discovery at the usual threshold, p < 0.05.

```python
import numpy as np
from scipy import stats

rng = np.random.default_rng(1)

def one_experiment(shift=0.0, n=30):
    """Compare two groups of n numbers. The second group's true average is `shift` higher."""
    a = rng.normal(0, 1, n)
    b = rng.normal(shift, 1, n)
    return stats.ttest_ind(a, b).pvalue

# The factory: both groups come from the very same source, so nothing is going on.
null_p = np.array([one_experiment() for _ in range(10_000)])
print(f"experiments announcing a 'discovery' (p < 0.05): {np.mean(null_p < 0.05):.1%}")
print(f"experiments with p < 0.50:                       {np.mean(null_p < 0.50):.1%}")

counts, _ = np.histogram(null_p, bins=10, range=(0, 1))
print("how many p-values fell in each tenth, 0 to 1:", counts.tolist())

# Now give the factory a real effect: half a standard deviation.
real_p = np.array([one_experiment(shift=0.5) for _ in range(10_000)])
print(f"real effect of 0.5 SD, 30 per group, p < 0.05: {np.mean(real_p < 0.05):.1%}")
```

```text
experiments announcing a 'discovery' (p < 0.05): 4.9%
experiments with p < 0.50:                       50.1%
how many p-values fell in each tenth, 0 to 1: [980, 1008, 1028, 1006, 991, 985, 1036, 964, 1024, 978]
real effect of 0.5 SD, 30 per group, p < 0.05: 47.1%
```

About one run in twenty cries discovery over nothing. Half of all runs have p below 0.5. And the p-values are spread evenly: roughly a thousand in each tenth of the range from 0 to 1. When nothing is happening, a p-value near 0.03 turns up about as often as one near 0.93.

The machine is not faulty. That one in twenty is the number 0.05 promises. To understand what the promise covers, and everything it leaves out, it helps to say precisely what a p-value is.

## The promise

<div class="callout callout-definition"><p><strong>p-value</strong></p><p>The probability of seeing a result at least as extreme as the one observed, <em>assuming the null hypothesis is true</em>. The null hypothesis is the "nothing is going on" assumption: no difference, no effect, a fair coin.</p></div>

Take a coin tossed 100 times that lands heads 60 times. The null hypothesis is that the coin is fair. How surprising is 60 heads from a fair coin? "At least as extreme" means 60 or more heads, or 40 or fewer, and its probability works out at 0.0569. That sits just above 0.05, so by the usual convention the result is not called significant. Count only the high side, 60 or more, and the figure is 0.0284, which would be. The same tosses give two verdicts depending on a choice made about the test, and that is why the choice must be made before looking at the data, not after.

Look back at the output above. When the null is true, p-values come out flat between 0 and 1. That is a property of how p-values are constructed, and it is the thing that makes the 5 per cent threshold mean what it does: a rule that says "announce a discovery when p is below 0.05" will cry discovery over nothing 5 per cent of the time, because 5 per cent of a flat distribution lies below 0.05.

It is also a statement about the long run. Run the machine 20 times and you might see no false discoveries, or three. The 4.9 per cent settles near 5 only as the runs pile up, which is the law of large numbers doing its quiet work: averages of many independent trials close in on their true value, though any short run can wander.

Everything below is a way of answering the question "what does the promise not cover?".

## It is not the chance that nothing is happening

The most common misreading is that p = 0.03 means a 3 per cent chance the null hypothesis is true, or a 97 per cent chance the effect is real. It does not. The p-value is the probability of the data given the null. What people want is the probability of the null given the data. Those two are not the same number, and turning one into the other needs a prior, which is the territory of [Bayes' rule](/notes/bayes-or-how-to-change-your-mind/).

You can see how far apart they can be with the same hall-of-people trick. Suppose one idea in ten that you test is a real effect of half a standard deviation, and the rest are nothing. The machine above tells us how often each kind crosses the threshold: 47.1 per cent of real effects and 5 per cent of nothings.

<div class="callout callout-hint"><p><strong>Worked example</strong></p><p>Out of 1,000 ideas, 100 are real and 900 are nothing. About 47 of the real ones reach p &lt; 0.05. About 45 of the nothings do as well (5 per cent of 900). So 92 results are called significant, and 47 of them are real. That is 51 per cent. About half of the discoveries are false, even though every one of them passed the 0.05 test.</p></div>

I also simulated this directly, drawing each idea as real or not and testing it, and got 50.5 per cent real among the significant results, within noise of the 51.1 per cent from the arithmetic. The answer would be better with more power or a higher base rate of real effects, and worse with fewer. The point is that "p < 0.05" cannot tell you the answer by itself. It is the base rate fallacy again, in a lab coat.

## It is not the size of the effect

A small p-value says the data would be surprising if there were no effect. It says nothing about whether the effect is large enough to care about, and with enough data a trivial effect becomes very surprising indeed.

Here is a real but tiny difference, a twentieth of a standard deviation, measured on 20,000 observations per group. After the p-value, the code asks the other question, how big is the difference and how sure are we, using a **bootstrap**: resample each group with replacement to make many pretend datasets, recompute the difference each time, and see how much it moves.

```python
import numpy as np
from scipy import stats

rng = np.random.default_rng(3)

# A tiny real effect, measured on a huge sample
n = 20_000
a = rng.normal(0.00, 1, n)
b = rng.normal(0.05, 1, n)
print(f"p-value: {stats.ttest_ind(b, a).pvalue:.1e}")
print(f"observed difference: {b.mean() - a.mean():.3f} standard deviations")

# Bootstrap: resample each group with replacement, recompute the difference, repeat
boot = np.array([rng.choice(b, n).mean() - rng.choice(a, n).mean() for _ in range(2_000)])
low, high = np.percentile(boot, [2.5, 97.5])
print(f"95% bootstrap interval for the difference: {low:.3f} to {high:.3f}")
```

```text
p-value: 9.0e-08
observed difference: 0.053 standard deviations
95% bootstrap interval for the difference: 0.033 to 0.072
```

A p-value of 9.0e-08 looks like a thunderclap, and the effect behind it is about 5 per cent of a standard deviation. Whether that matters depends on what is being measured, but for most purposes it will not. The interval is the more informative sentence: the difference is probably somewhere between 0.03 and 0.07 standard deviations.

The reason is the law of large numbers. As the sample grows, the sample average settles on the true average, and the true averages of two real groups are almost never exactly equal. Collect enough data and any difference at all will be detected. A small p-value can mean a big effect or a big sample, and it will not say which.

The bootstrap is worth a word on its own. It sounds like a conjuring trick, because it reuses the one sample you have as if it were the whole population, and it works surprisingly often. It was introduced by Bradley Efron in 1979, and it handles statistics such as the median, where no simple formula exists. It has limits: it measures sampling variation, not bias in how the data was collected, and it behaves badly with extremes and with dependent data such as time series.

The reverse also holds. A large p-value does not show there is no effect. Look at the last line of the first output: with a real effect of half a standard deviation and 30 per group, the test finds it only 47.1 per cent of the time. A "non-significant" result with a small sample often means only that the sample was too small to say.

## It is not a cause

Correlation tests produce p-values too, and they can be astonishingly small for relationships that mean nothing causal. Here is a small invented world in which temperature drives both ice cream sales and the number of swimmers, and neither affects the other.

```python
import numpy as np
from scipy.stats import pearsonr

rng = np.random.default_rng(0)
n = 1_000
temperature = rng.normal(20, 6, n)                        # the hidden driver
ice_cream = 5 * temperature + rng.normal(0, 20, n)        # sales rise with heat
swimmers = 2 * temperature + rng.normal(0, 10, n)         # so do swimmers

r, p = pearsonr(ice_cream, swimmers)
print(f"ice cream vs swimmers: r = {r:.3f}, p = {p:.0e}")

def leftover(y, x):
    slope, intercept = np.polyfit(x, y, 1)
    return y - (slope * x + intercept)

r2, p2 = pearsonr(leftover(ice_cream, temperature), leftover(swimmers, temperature))
print(f"after removing temperature from both: r = {r2:.3f}, p = {p2:.2f}")
```

```text
ice cream vs swimmers: r = 0.628, p = 6e-111
after removing temperature from both: r = 0.008, p = 0.81
```

A p-value of 6e-111 is about as significant as anything gets, and the entire link is the weather. Take temperature out of both variables and the correlation falls to 0.008. A p-value tests whether a pattern is likely to be chance. It never tests why the pattern is there. Only a designed experiment with random assignment, or careful causal reasoning, gets you from a pattern to a cause.

## Why the machinery works, and when it stops

The t-test assumes, roughly, that the sample average is normally distributed. The data themselves need not be. The reason is the **central limit theorem**: the average of many independent values, with finite variance, is approximately normal whatever shape the individual values have, and its spread shrinks like the standard deviation divided by the square root of the number of values.

Approximately is doing real work in that sentence, and the condition "many" depends on the shape. The next block tests a hypothesis that is true, on very lopsided (exponential) data, and counts false alarms. At a 5 per cent threshold, an honest test should give 5 per cent.

```python
import numpy as np
from scipy import stats

rng = np.random.default_rng(4)

# A very lopsided population (exponential) whose true mean is exactly 1.
# We test "the mean is 1", which is TRUE, so every rejection is a false alarm.
for n in (5, 30, 200):
    false_alarms = sum(stats.ttest_1samp(rng.exponential(1, n), 1.0).pvalue < 0.05
                       for _ in range(20_000))
    print(f"n = {n:>3}: false alarm rate {false_alarms / 20_000:.1%}")
```

```text
n =   5: false alarm rate 11.9%
n =  30: false alarm rate 7.1%
n = 200: false alarm rate 5.3%
```

With 5 values the "5 per cent" test is wrong about 12 per cent of the time. With 30 it is still 7 per cent. By 200 it has nearly kept its word. So the p-value depends on assumptions as well as on the data, and the assumptions need to hold well enough: independence of the observations, enough of them for the average to be well behaved, a population without wild extremes. Observations that are clustered, such as repeated measures on one person, break the usual arithmetic entirely, and the printed p-value can be far too small.

## Twenty looks

There is one more way the promise gets broken, and it needs no bad maths at all. Suppose you test 20 things in a dataset and nothing is going on in any of them. Each test has a 5 per cent chance of a false alarm. The chance that at least one of the twenty fires is:

<div class="formula">1 minus (0.95 to the power 20) = 0.64</div>

A simulation of 100,000 rounds agrees: 64.3 per cent. Test twenty unrelated things at p < 0.05 and, more likely than not, one of them will look like a finding. If only the one that fired gets written up, a reader sees a single p-value of 0.03 and has no way to know it was the winner of twenty draws. The remedy is to count the tests you ran, not just the ones you report, and to correct for them. Ways to do that exist, and I will not pretend to have mastered them here.

## A threshold with a history

The t-test used throughout was published in 1908 by William Gosset under the pen name Student. He worked at the Guinness brewery in Dublin. The 0.05 line is usually traced to the writing of Ronald Fisher in the 1920s. I would not read more into its origin than this: it is a convention, not a law of nature, and nothing special happens to evidence between 0.049 and 0.051.

In 2016 the American Statistical Association published a statement on p-values. Among its principles, in my paraphrase: a p-value does not measure the probability that the hypothesis is true, and it does not measure the size or importance of an effect. That is the same list this note has been working through with a simulation.

## What I would report instead

None of this means p-values are useless. They answer a narrow question well: how surprising would these data be if nothing were going on, under these assumptions? What goes wrong is asking them to answer a bigger one.

Next to any p-value I would want to see the size of the effect with an interval around it, the number of things that were tried, and some sense of how plausible the effect was before anyone measured it. In product work, where an A/B test result can be waved through a meeting as a single number, that last part matters most.

A p-value measures surprise under one assumption. What to believe afterwards is still your job.

---

**Sources**

- Student (W. S. Gosset), "The probable error of a mean", *Biometrika*, 6(1), 1908.
- R. A. Fisher, *Statistical Methods for Research Workers*, Oliver and Boyd, 1925.
- B. Efron, "Bootstrap methods: another look at the jackknife", *The Annals of Statistics*, 7(1), 1979.
- R. L. Wasserstein and N. A. Lazar, "The ASA statement on p-values: context, process, and purpose", *The American Statistician*, 70(2), 2016.
