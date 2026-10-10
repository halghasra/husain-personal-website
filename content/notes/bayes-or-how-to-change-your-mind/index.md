---
title: "Bayes' Rule, or How to Change Your Mind"
slug: "bayes-or-how-to-change-your-mind"
type: "note"
status: "evergreen"
summary: "A test that catches 80 per cent of cases comes back positive, and your chance of being ill is about 7.5 per cent. The gap is the whole of Bayes' rule: how to let evidence move a belief without letting it replace the belief."
date: "2026-10-10"
created: "2026-10-10"
updated: "2026-10-10"
topics: ["Artificial Intelligence", "Probability"]
tags: ["AI", "Probability", "Mathematics", "Python", "Statistics"]
linked_notes:
  - "an-agent-and-its-world"
  - "drawing-uncertainty-bayesian-networks"
  - "the-naive-assumption-that-works"
  - "what-a-p-value-is-not"
graph:
  show: true
  weight: 2
  cluster: "uncertainty"
seo:
  title: "Bayes' Rule, or How to Change Your Mind"
  description: "Why a positive test for a rare illness usually means you are fine, how Bayes' rule explains it, and why a machine in an uncertain world needs it."
---

A test for a rare illness catches 80 per cent of the people who have it. It also raises a false alarm for 10 per cent of the people who do not. The illness affects 1 person in 100. You take the test and it comes back positive.

How likely is it that you are ill?

The tempting answer is somewhere near 80 per cent. The right answer is about 7.5 per cent. The test is not broken and nobody has slipped in the arithmetic. The gap comes from a number the question mentions in passing and the mind skips over: the 1 in 100. Bayes' rule is the repair for that skip, and once you see it work you start noticing the skip everywhere.

## Count people, not percentages

Forget formulas for a moment and picture a hall with 1,000 people in it. One in 100 is ill, so 10 people are ill and 990 are well.

- Of the 10 ill people, the test catches 80 per cent: 8 test positive.
- Of the 990 well people, the test raises a false alarm for 10 per cent: 99 test positive.

<figure>
<svg viewBox="0 0 720 310" role="img" aria-label="A tree splitting 1,000 people into 10 ill and 990 well. Of the 10 ill, 8 test positive and 2 test negative. Of the 990 well, 99 test positive and 891 test negative. Of the 107 positives, 8 are ill.">
  <rect x="10" y="125" width="120" height="50" rx="6" class="dg-box" stroke-width="1"/>
  <text x="70" y="156" font-size="14" text-anchor="middle" class="dg-text">1,000 people</text>

  <line x1="130" y1="150" x2="200" y2="75" class="dg-line" stroke-width="1.5"/>
  <line x1="130" y1="150" x2="200" y2="235" class="dg-line" stroke-width="1.5"/>

  <rect x="200" y="50" width="120" height="50" rx="6" class="dg-box" stroke-width="1"/>
  <text x="260" y="81" font-size="14" text-anchor="middle" class="dg-text">10 are ill</text>
  <rect x="200" y="210" width="120" height="50" rx="6" class="dg-box" stroke-width="1"/>
  <text x="260" y="241" font-size="14" text-anchor="middle" class="dg-text">990 are well</text>

  <line x1="320" y1="75" x2="390" y2="35" class="dg-line" stroke-width="1.5"/>
  <line x1="320" y1="75" x2="390" y2="105" class="dg-line" stroke-width="1.5"/>
  <line x1="320" y1="235" x2="390" y2="195" class="dg-line" stroke-width="1.5"/>
  <line x1="320" y1="235" x2="390" y2="275" class="dg-line" stroke-width="1.5"/>

  <rect x="390" y="15" width="150" height="40" rx="6" class="dg-highlight" stroke-width="1"/>
  <text x="465" y="40" font-size="13" text-anchor="middle" class="dg-text">8 test positive</text>
  <rect x="390" y="85" width="150" height="40" rx="6" class="dg-subtle" stroke-width="1"/>
  <text x="465" y="110" font-size="13" text-anchor="middle" class="dg-text">2 test negative</text>
  <rect x="390" y="175" width="150" height="40" rx="6" class="dg-highlight" stroke-width="1"/>
  <text x="465" y="200" font-size="13" text-anchor="middle" class="dg-text">99 test positive</text>
  <rect x="390" y="255" width="150" height="40" rx="6" class="dg-subtle" stroke-width="1"/>
  <text x="465" y="280" font-size="13" text-anchor="middle" class="dg-text">891 test negative</text>

  <text x="560" y="105" font-size="13" class="dg-muted">107 positives in all.</text>
  <text x="560" y="125" font-size="13" class="dg-muted">Only 8 of them are ill.</text>
</svg>
<figcaption>The same test, drawn as people. The shaded boxes are everyone who sees a positive result.</figcaption>
</figure>

That makes 107 positive results in the hall, and 8 of them belong to people who are ill. If you are one of the 107, the chance you are one of the 8 is 8 in 107, which is 7.5 per cent.

The 80 per cent was never wrong. It describes the 10 ill people. The 10 per cent also describes a group, and that group has 990 people in it, so a modest false-alarm rate applied to a huge group produces a pile of false positives that swamps the true ones.

Researchers call counts like these **natural frequencies**. A 2019 study by Reani and colleagues had people work through a fire-alarm version of the problem and found they did better with frequencies such as "10 out of 1,000" than with percentages, and better when the scenario matched something in their own experience. It is one study with one scenario, and its participants were crowdworkers, not doctors, so I would not stretch it far. But it fits what the hall shows: the arithmetic does not change with the format, and the mistake lives in the mind, not in the numbers.

## Where the rule comes from

Now the formula, which is the hall written down in symbols. It starts from one idea: learning that something happened throws away every possible world in which it did not. What is left is a smaller set of worlds, and the **conditional probability** P(A | B), read "the probability of A given B", is the share of that smaller set in which A also holds.

Write the chance of both A and B happening in two ways. You can take B first and then A given B, or A first and then B given A:

<div class="formula">P(A and B) = P(A | B) × P(B) = P(B | A) × P(A)</div>

Divide both sides by P(B) and you have Bayes' rule:

<div class="formula">P(A | B) = P(B | A) × P(A) / P(B)</div>

Each piece has a name, and the names are worth learning because every later use of the rule is a variation on them.

<div class="callout callout-definition"><p><strong>The four parts</strong></p><p>The <strong>prior</strong>, P(A), is how likely you thought A was before the evidence. The <strong>likelihood</strong>, P(B | A), is how likely the evidence is if A is true. The <strong>evidence</strong>, P(B), is how likely the evidence is overall, summed across every way it could arise. The <strong>posterior</strong>, P(A | B), is how likely A is now that you have seen it.</p></div>

For the test, A is "ill" and B is "positive". The prior is 0.01, the likelihood is 0.8, and the evidence is the two ways a positive can happen added together:

<div class="formula">P(positive) = 0.8 × 0.01 + 0.10 × 0.99 = 0.008 + 0.099 = 0.107</div>
<div class="formula">P(ill | positive) = 0.008 / 0.107 = 0.0748</div>

The two numbers in the sum, 0.008 and 0.099, are the hall's 8 and 99 as fractions of the whole. The rule and the headcount are the same calculation.

This also shows why the two directions are not twins. P(positive | ill) is how the test performs, and a laboratory can measure it by testing people whose status is already known. P(ill | positive) is what the person holding the result wants to know. One is a property of the test. The other is a property of the test and the population it is used on. Swapping them by accident is the **base rate fallacy**: judging how likely something is from how well the evidence fits it, while neglecting how common it was to begin with.

There is a tidier way to hold the update in your head, using odds. Before the test the odds of being ill are 1 to 99. A positive result is 8 times as likely from someone ill (80 per cent) as from someone well (10 per cent), so it multiplies the odds by 8, and the odds become 8 to 99. That is the hall again: 8 ill people among the positives for every 99 well ones. The factor of 8 measures how strongly the test speaks. The 1 to 99 measures what it was speaking to. A test with a factor of 8 sounds impressive, and against odds of 1 to 99 it is only a push.

## Same test, different starting point

If the base rate is doing the damage, then moving it should change the answer without touching the test. Here is a short function that computes the posterior, and a loop that moves only the prior.

```python
def posterior(prior, sensitivity, false_alarm):
    true_pos = sensitivity * prior
    false_pos = false_alarm * (1 - prior)
    return true_pos / (true_pos + false_pos)

for prior in (0.001, 0.01, 0.10, 0.50):
    print(f"base rate {prior:>5.1%}  ->  chance ill after a positive: {posterior(prior, 0.80, 0.10):.1%}")
```

Running it gives:

```text
base rate  0.1%  ->  chance ill after a positive: 0.8%
base rate  1.0%  ->  chance ill after a positive: 7.5%
base rate 10.0%  ->  chance ill after a positive: 47.1%
base rate 50.0%  ->  chance ill after a positive: 88.9%
```

The test is identical in every row. It catches 80 per cent and raises a false alarm 10 per cent of the time throughout. A positive result means almost nothing when the condition is very rare, and a lot when the condition is common. This is why a screening programme and a diagnostic test for someone with symptoms are different instruments even when the same chemistry sits inside them: the people being tested are different, so the prior is different.

It is also, I think, the most useful lesson for anyone who works with risk. Whenever someone quotes you how good a test, a model or a rule is, the next question is how common the thing is in the people it will be used on. In insurance, where a flag from a fraud rule or a risk score is only as meaningful as the rate of fraud or risk in the group it flags, that question comes up daily.

## Yesterday's posterior is today's prior

The word "prior" suggests a belief you start with and then abandon. It is better to treat it as a belief you carry. After the first positive result, your chance of being ill is 7.5 per cent. If you take a second, independent test and it is positive too, the posterior from the first test becomes the prior for the second.

```python
belief = 0.01
for test in range(1, 4):
    belief = posterior(belief, 0.80, 0.10)
    print(f"after positive test {test}: {belief:.1%}")
```

```text
after positive test 1: 7.5%
after positive test 2: 39.3%
after positive test 3: 83.8%
```

Three positives take a 1 per cent belief to 84 per cent, in steps. A negative result pushes the other way: one negative takes the same 1 per cent down to 0.2 per cent. The belief moves each time and never jumps to certainty, and no single result is allowed to overrule the rest.

The word **independent** is carrying real weight in that paragraph. The loop assumes the tests make their mistakes separately. If a quirk in one person's blood triggers a false alarm every time, the second positive is mostly the first one again, and 39.3 per cent is too high. The condition for multiplying evidence together is that the pieces are independent *once you know the truth*. That condition has a name, and a drawing, and it is the subject of the [next note](/notes/drawing-uncertainty-bayesian-networks/).

## Why a machine needs this

Logic can say that something is true or that it is false. It has no way to say "probably true". An agent acting in the real world is almost never in that comfortable position. Its sensors are noisy, its actions do not always have their intended effect, and the world changes while it is not looking. The wasp in [An Agent and Its World](/notes/an-agent-and-its-world/) fails because nothing in it can register that the world has moved. An agent that carries a probability for each thing it cares about, and revises it after every observation, has a way to register exactly that.

That is Bayes' rule used as a loop: hold a belief, observe, update, act, observe again. Probability alone does not choose the action. A decision-theoretic agent combines its probabilities with how much each outcome matters to it and picks the action with the best expected value. But the probabilities have to come first, and they have to be kept honest as the evidence comes in.

The rule is older than any of this. Thomas Bayes did not publish it himself. His essay on the problem appeared in 1763, after his death, communicated to the Royal Society by Richard Price. Pierre-Simon Laplace later took the same line of reasoning much further. I have not tried to untangle exactly who contributed what, and I would be wary of any tidy account that claims to.

## Where it breaks

The rule is a machine for turning priors and likelihoods into posteriors. It cannot tell you whether the inputs were any good.

- **A bad prior gives a bad posterior.** The 1 in 100 has to be the right 1 in 100 for the person in front of you. Someone sent for a test because of symptoms does not belong to the general population, and the base rate for them is higher.
- **A likelihood of exactly zero is a veto.** If the likelihood of the evidence under one hypothesis is 0, that hypothesis ends at 0 whatever else you observe. Fourteen rows of data can easily produce a zero by never having seen something happen, and the fix for that, adding a small pseudo-count, is covered in the note on [Bayesian networks](/notes/drawing-uncertainty-bayesian-networks/).
- **Independence is an assumption.** Multiplying evidence together is only correct when the pieces really are independent given the truth. When they are not, the posterior comes out too confident.
- **A precise number can mislead.** Seven decimal places on a posterior built from a guessed prior is decoration.

None of these breaks the rule. They are the places where the person using it has to do the thinking that the formula cannot.

Evidence should move a belief, not replace it. How far it moves depends on where it started.

---

**Sources**

- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., Pearson, 2021 (probabilistic reasoning and agents under uncertainty).
- T. Bayes, "An Essay towards solving a Problem in the Doctrine of Chances", communicated by R. Price, *Philosophical Transactions of the Royal Society*, 53, 1763.
- M. Reani and colleagues, "Experience and Problem Format in Probabilistic Reasoning", 2019.
