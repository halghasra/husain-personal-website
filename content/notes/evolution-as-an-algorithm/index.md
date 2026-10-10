---
title: "Evolution as an Algorithm"
slug: "evolution-as-an-algorithm"
type: "note"
status: "evergreen"
summary: "A genetic algorithm found the best route through six cities in a blink, and it was the right answer to the wrong question. How a search that copies evolution works, what its three dials really do, and why it can throw away its best answer and still win."
date: "2026-10-10"
created: "2026-10-10"
updated: "2026-10-10"
topics: ["Artificial Intelligence", "Optimisation", "Evolutionary Computation"]
tags: ["AI", "Optimisation", "Search", "Python", "Problem Framing"]
linked_notes:
  - "how-a-machine-searches"
  - "a-star-and-the-honest-guess"
  - "an-agent-and-its-world"
graph:
  show: true
  weight: 2
  cluster: "evolutionary"
seo:
  title: "Evolution as an Algorithm"
  description: "How genetic algorithms search by selection, crossover and mutation, the exploration trade-off, local optima, and the travelling salesman problem solved in Python."
---

The first genetic algorithm I studied closely solved the wrong problem, and it solved it perfectly.

It was a small program for six cities and a table of the distances between them. It bred routes, generation after generation, and handed back this one: visit the cities in the order 0, 2, 1, 3, 5, 4, for a length of 123.76. I checked it the only way you can check a thing like this, by trying every possible ordering of six cities. There are 720. Nothing beat it. As far as the question it was answering went, it had found the best answer that exists.

Then I looked at how the length was worked out. The code added up the distance from each city to the next, and stopped. It never added the road home. I had asked about a salesman who must come back to where he started, and the program had been solving for a salesman who never goes home. Drive that same route and return to city 0, and the trip is 187.83. The best route that does return is 163.22.

Nothing in the algorithm was broken. It optimised exactly what it was given. I will come back to those six cities at the end, because they are the best argument I know for reading a score function twice. First, how a search that copies evolution works at all.

## Evolution with the biology taken out

A **genetic algorithm** keeps a whole population of candidate answers instead of one. It scores each, lets the better ones become parents, mixes the parents' parts to make children, adds a little random change, and repeats. Over many generations the population drifts towards better answers. John Holland is the name usually attached to the idea, and his book *Adaptation in Natural and Artificial Systems* appeared in 1975.

The pieces have biological names, and it helps to see them as plain engineering:

- **Encoding.** A candidate answer is written as a list of values, called a chromosome, whose entries are genes. It might be a string of bits, a list of numbers, or an ordering of cities.
- **Fitness.** A function that scores a candidate. This is the only thing the algorithm needs from your problem. No derivative, no tidy equation, only a way to say how good an answer is.
- **Selection.** Pick parents, favouring the fitter. In a *tournament*, you draw a few candidates at random and the best of them wins. In a *roulette wheel*, each candidate gets a slice of the wheel in proportion to its fitness, so the weak keep a small chance.
- **Crossover.** Combine two parents into children, for example by cutting both at one point and swapping the tails.
- **Mutation.** Change a gene at random with low probability, to bring in something no parent carried.

The vocabulary comes from biology, but the operators are engineering choices and not a model of real genetics. Nothing here knows where the answer is.

## Breeding a route without breaking it

The operators are the same three ideas for every problem, but the encoding decides what they have to look like. Try the textbook bit-string crossover on routes and you meet the problem quickly. A route is an ordering in which every city appears exactly once.

```python
p1, p2 = [3, 1, 5, 2, 6, 4], [6, 5, 4, 3, 2, 1]      # two routes through six cities

naive = p1[:3] + p2[3:]                               # cut both after three cities and swap tails
print("naive crossover:", naive, "repeats", sorted({c for c in naive if naive.count(c) > 1}),
      "and misses", sorted(set(p1) - set(naive)))

block = p1[2:5]                                       # keep a block of p1 where it is...
rest = [c for c in p2 if c not in block]              # ...and fill the gaps in p2's order
child = rest[:2] + block + rest[2:]
print("order crossover:", child)
```

```text
naive crossover: [3, 1, 5, 3, 2, 1] repeats [1, 3] and misses [4, 6]
order crossover: [4, 3, 5, 2, 6, 1]
```

Cutting two routes and swapping the tails gave a salesman who visits cities 1 and 3 twice and never sees 4 or 6. **Order crossover** fixes this. Keep a block of cities from the first parent exactly where it is, then fill the remaining slots with the other cities in the order the second parent visits them. The child is always a valid route, and it inherits something from both parents. A **swap mutation**, which exchanges two cities, is also always valid. The operators are borrowed from biology, and the encoding decides whether they work.

## The dial that can kill a population

Selection and mutation pull in opposite directions. Strong selection copies what works, so it is a force for **exploitation**. Mutation brings in genes nobody has, so it is a force for **exploration**. Too much of either ruins the search.

You can see this on the simplest problem there is. In OneMax, a candidate is a string of 60 bits and its fitness is the number of ones, so the best possible score is 60. Here is a small genetic algorithm with a population of 30 run for 60 generations, 50 times for each of six settings of two dials: how large a tournament is, and how often a bit mutates.

```python
import numpy as np

L = 60                                       # OneMax: fitness is the number of 1s, best is 60

def run(seed, k, p_mut, pop_size=30, gens=60):
    rng = np.random.default_rng(seed)
    pop = rng.integers(0, 2, (pop_size, L))
    previous, falls = 0, 0
    for _ in range(gens):
        f = pop.sum(axis=1)
        falls += f.max() < previous          # is this generation's best worse than the last one's?
        previous = f.max()
        idx = rng.integers(0, pop_size, (2 * pop_size, k))             # tournaments of size k
        w = idx[np.arange(2 * pop_size), f[idx].argmax(axis=1)]
        a, b = pop[w[:pop_size]], pop[w[pop_size:]]
        cut = rng.integers(1, L, pop_size)[:, None]
        child = np.where(np.arange(L) < cut, a, b)                      # one-point crossover
        pop = np.where(rng.random(child.shape) < p_mut, 1 - child, child)
    return pop.sum(axis=1).max(), len({tuple(r) for r in pop}), falls

for k in (2, 8):
    for p in (0.0, 1 / L, 0.5):
        res = [run(s, k, p) for s in range(50)]
        best = [r[0] for r in res]
        print(f"tournament {k}, mutation {p:.4f}: best {np.mean(best):5.2f}, "
              f"hit 60 in {sum(b == 60 for b in best):2d}/50, "
              f"distinct {np.mean([r[1] for r in res]):4.1f}, "
              f"fell in {np.mean([r[2] for r in res]):4.1f} of 60")
```

```text
tournament 2, mutation 0.0000: best 49.44, hit 60 in  0/50, distinct  1.0, fell in  1.3 of 60
tournament 2, mutation 0.0167: best 57.50, hit 60 in  1/50, distinct 29.5, fell in 10.5 of 60
tournament 2, mutation 0.5000: best 37.68, hit 60 in  0/50, distinct 30.0, fell in 25.2 of 60
tournament 8, mutation 0.0000: best 45.92, hit 60 in  0/50, distinct  1.0, fell in  0.0 of 60
tournament 8, mutation 0.0167: best 60.00, hit 60 in 50/50, distinct 19.5, fell in  0.3 of 60
tournament 8, mutation 0.5000: best 37.48, hit 60 in  0/50, distinct 30.0, fell in 25.2 of 60
```

Read the columns as a story. "Distinct" is how many different individuals are left in the final population of 30.

**Mutation of zero** left exactly one distinct individual in every run: thirty copies of the same string. Once the population collapses, crossover has nothing to mix and nothing can add a one that was lost. The search is frozen well short of 60.

**Mutation of 0.5** means every bit is a coin toss, so nothing selection finds is kept. A best score of about 37.5 is no better than luck. I checked what luck gives: the best of 30 random strings averages about 37.9. That is not search at all.

**Mutation of 1/60**, about one flipped bit per child, is the one that works, and it depends on the other dial. With a tournament of 8, all 50 runs reached 60. With a tournament of 2 the selection was too gentle to finish in 60 generations, and the average sat at 57.5.

The last column is the odd one, and it is the puzzle I most wanted to understand. "Fell" counts how often the best individual in a generation was worse than the best of the generation before. With the gentle tournament and the working mutation rate, that happened in about 10 generations out of 60. The algorithm lost its best answer to crossover and mutation, over and over, and still climbed to 57.5. How can a search throw away the best thing it has and keep winning?

Because the population is the memory, and the best individual is only the visible tip of it. Breeding from a good, varied crowd keeps producing good candidates even when a particular champion is lost. If you want a guarantee that the best never disappears, the standard fix is **elitism**: copy the best individual unchanged into the next generation. I use it in the final example.

## Standing on the wrong hill

The other danger is quieter. Picture the score of every possible answer as a height, so that the set of answers becomes a landscape. Searching is walking about in the dark with a torch that lights only the ground beside your feet. A **local optimum** is a peak that beats everything next to it but is not the highest peak, and a search that only ever climbs will stop on it happily. The picture is usually credited to the biologist Sewall Wright.

Here is the smallest landscape I could make that shows it: two hills over positions 0 to 100, a low one at 20 with height 6 and a high one at 75 with height 10.

<figure>
<svg viewBox="0 0 640 270" role="img" aria-label="A landscape with two hills. The low hill peaks at position 20 with height 6 and is marked local optimum. The high hill peaks at position 75 with height 10 and is marked global optimum. Below the axis, starts from 0 to 47 are shown climbing to the low hill and starts from 48 to 100 climbing to the high hill.">
  <title>Two hills and the climbers that start on them</title>
  <polyline points="40.0,189.8 45.6,189.7 51.2,189.4 56.8,189.0 62.4,188.4 68.0,187.3 73.6,185.8 79.2,183.6 84.8,180.5 90.4,176.4 96.0,171.1 101.6,164.6 107.2,156.9 112.8,148.1 118.4,138.7 124.0,129.1 129.6,119.9 135.2,111.8 140.8,105.5 146.4,101.4 152.0,100.0 157.6,101.4 163.2,105.5 168.8,111.8 174.4,119.9 180.0,129.1 185.6,138.7 191.2,148.1 196.8,156.9 202.4,164.6 208.0,171.1 213.6,176.4 219.2,180.5 224.8,183.6 230.4,185.8 236.0,187.3 241.6,188.4 247.2,189.0 252.8,189.4 258.4,189.7 264.0,189.8 269.6,189.9 275.2,190.0 280.8,190.0 286.4,190.0 292.0,190.0 297.6,190.0 303.2,190.0 308.8,190.0 314.4,190.0 320.0,190.0 325.6,190.0 331.2,190.0 336.8,189.9 342.4,189.8 348.0,189.7 353.6,189.5 359.2,189.1 364.8,188.4 370.4,187.3 376.0,185.5 381.6,183.0 387.2,179.3 392.8,174.2 398.4,167.4 404.0,158.6 409.6,147.7 415.2,134.8 420.8,120.2 426.4,104.5 432.0,88.5 437.6,73.2 443.2,59.7 448.8,49.1 454.4,42.3 460.0,40.0 465.6,42.3 471.2,49.1 476.8,59.7 482.4,73.2 488.0,88.5 493.6,104.5 499.2,120.2 504.8,134.8 510.4,147.7 516.0,158.6 521.6,167.4 527.2,174.2 532.8,179.3 538.4,183.0 544.0,185.5 549.6,187.3 555.2,188.4 560.8,189.1 566.4,189.5 572.0,189.7 577.6,189.8 583.2,189.9 588.8,190.0 594.4,190.0 600.0,190.0" fill="none" class="dg-accent-stroke" stroke-width="3"/>
  <line x1="40" y1="190" x2="600" y2="190" class="dg-line" stroke-width="1.5"/>
  <circle cx="152" cy="100" r="6" class="dg-ink"/>
  <circle cx="460" cy="40" r="6" class="dg-ink"/>
  <text x="152" y="84" font-size="13" text-anchor="middle" class="dg-text">local optimum, height 6</text>
  <text x="400" y="24" font-size="13" text-anchor="end" class="dg-text">global optimum, height 10</text>
  <rect x="40" y="206" width="263" height="26" rx="4" class="dg-subtle" stroke-width="1"/>
  <text x="171" y="223" font-size="13" text-anchor="middle" class="dg-text">48 starts end on the low hill</text>
  <rect x="309" y="206" width="291" height="26" rx="4" class="dg-highlight" stroke-width="1"/>
  <text x="454" y="223" font-size="13" text-anchor="middle" class="dg-text">53 starts end on the high hill</text>
  <text x="40" y="256" font-size="12" text-anchor="start" class="dg-muted">position 0</text>
  <text x="600" y="256" font-size="12" text-anchor="end" class="dg-muted">position 100</text>
</svg>
<figcaption>Hill climbing from each of the 101 starting positions. Where you start decides which hill you finish on, and from the top of the low hill nothing nearby says there is a better one.</figcaption>
</figure>

```python
import numpy as np
from collections import Counter

def height(x):                                  # two hills: a low one at 20, the highest at 75
    return 6 * np.exp(-((x - 20) / 8) ** 2) + 10 * np.exp(-((x - 75) / 8) ** 2)

def climb(x):                                   # step to the best neighbour until none is better
    while True:
        best = max((max(x - 1, 0), x, min(x + 1, 100)), key=height)
        if best == x:
            return x
        x = best

ends = {start: climb(start) for start in range(101)}
print("where the 101 climbers end up:", dict(Counter(ends.values())))
print("starts that end on the low hill:", min(s for s in ends if ends[s] == 20),
      "to", max(s for s in ends if ends[s] == 20))
for r in (1, 3, 5):                             # r independent random starts
    print(f"{r} random starts: chance at least one finds the high hill = {1 - (48 / 101) ** r:.3f}")
```

```text
where the 101 climbers end up: {20: 48, 75: 53}
starts that end on the low hill: 0 to 47
1 random starts: chance at least one finds the high hill = 0.525
3 random starts: chance at least one finds the high hill = 0.893
5 random starts: chance at least one finds the high hill = 0.976
```

Forty-eight of the 101 starts climb to the low hill and finish there, certain they are at the top. A climber started at random does well just over half the time. Restarting helps in a predictable way: with five random starts the chance of at least one landing on the high hill is about 98 per cent. A local optimum feels exactly like the global one from the inside.

This is the case for a population. A genetic algorithm holds many points at once, and crossover and mutation make jumps, so it can have members on both hills in the same generation. But it is not immune. Once the whole population has gathered on one hill, as the zero-mutation runs above collapsed onto a single string, it behaves like a single climber. The dial from the last section and the landscape here are the same problem seen twice.

There is a name for this family. A **metaheuristic** is a general search strategy that needs only a way to score candidates and a way to move to nearby ones, and trades any guarantee of the best answer for a good answer in reasonable time. Genetic algorithms are one. Simulated annealing, which sometimes accepts a worse move on purpose, with a chance that shrinks as a "temperature" falls, is another. The word "heuristic" sits oddly here, because in [A\*, and the Art of the Honest Guess](/notes/a-star-and-the-honest-guess/) it meant an estimate that must never overstate, with a proof attached. Here it means a rule of thumb that makes no promise at all. The first kind buys speed and keeps the guarantee. The second kind buys reach and gives the guarantee up.

## The salesman who never went home

Back to the six cities. The **travelling salesman problem** asks for the shortest route that visits every city once and returns to the start. A route is an ordering, so a candidate is a permutation, and the fitness is its total length, to be minimised. Order crossover and swap mutation keep every candidate valid.

For n cities there are (n - 1) factorial, divided by 2, distinct closed tours: fix the starting city, and treat a route and its reverse as the same tour. That is 60 tours for six cities, 181,440 for ten, 43,589,145,600 for fifteen, and about 6.1 × 10¹⁶ for twenty. Six cities can be checked outright. Twenty cannot, and unlike the shortest-path problems in [How a Machine Searches](/notes/how-a-machine-searches/), there is no clever exact method that makes the difficulty go away. This is where a search like this earns its place.

The program below does both. It checks all 720 orderings of the six-city table, which also shows what the two versions of the length disagree about, and then runs a small genetic algorithm with elitism: order crossover, a swap mutation with probability 0.4, tournaments of three, and a population of 20.

```python
import itertools, random
import numpy as np

D = np.array([[0.00, 38.02, 27.12, 33.46, 64.07, 42.10],
              [38.02, 0.00, 31.00, 29.55, 35.55, 38.40],
              [27.12, 31.00, 0.00, 28.03, 47.38, 57.90],
              [33.46, 29.55, 28.03, 0.00, 55.11, 20.07],
              [64.07, 35.55, 47.38, 55.11, 0.00, 16.02],
              [42.10, 38.40, 57.90, 20.07, 16.02, 0.00]])

def open_length(route):                       # legs between consecutive cities only
    return sum(D[route[i], route[i + 1]] for i in range(len(route) - 1))

def tour_length(route):                       # the same, plus the leg back home
    return open_length(route) + D[route[-1], route[0]]

# Check every ordering of the six cities: 720 of them.
every = list(itertools.permutations(range(6)))
print("best open path  :", min(every, key=open_length), round(min(map(open_length, every)), 2))
print("best closed tour:", min(every, key=tour_length), round(min(map(tour_length, every)), 2))
print("best open path, driven as a tour:", round(tour_length((0, 2, 1, 3, 5, 4)), 2))

def order_crossover(a, b):
    i, j = sorted(random.sample(range(len(a) + 1), 2))
    block = a[i:j]
    rest = [c for c in b if c not in block]
    return rest[:i] + block + rest[i:]

def swap_mutation(route):
    route = route[:]
    i, j = random.sample(range(len(route)), 2)
    route[i], route[j] = route[j], route[i]
    return route

def tournament(pop, k=3):
    return min(random.sample(pop, k), key=tour_length)

random.seed(1)
pop = [random.sample(range(6), 6) for _ in range(20)]
for generation in range(60):
    children = [min(pop, key=tour_length)]             # elitism: keep the best route
    while len(children) < 20:
        child = order_crossover(tournament(pop), tournament(pop))
        if random.random() < 0.4:
            child = swap_mutation(child)
        children.append(child)
    pop = children
best = min(pop, key=tour_length)
print("genetic algorithm:", best, round(tour_length(best), 2))
```

```text
best open path  : (0, 2, 1, 3, 5, 4) 123.76
best closed tour: (0, 2, 1, 4, 5, 3) 163.22
best open path, driven as a tour: 187.83
genetic algorithm: [4, 1, 2, 0, 3, 5] 163.22
```

The first line is the answer I found so quickly at the start: the shortest **open path**, a route that visits every city and stops. The second is the shortest **closed tour**, which returns to the start, and it is a different route entirely. The third line is the cost of confusing the two. The open path's best route, driven as a tour, takes 187.83, which is 24.61 longer than the 163.22 it could have been.

The genetic algorithm, once the return leg is in the fitness function, finds 163.22. Its route, 4, 1, 2, 0, 3, 5, is the same tour as 0, 2, 1, 4, 5, 3 read from a different starting city and in the opposite direction. A tour has no beginning and no direction, which is why 12 of the 720 orderings tie for first place.

The fix was one line. The distance back to the start, added to the fitness. But I would not have found it by staring at a good-looking answer. I found it because six cities are small enough to check by brute force. At twenty cities there is no such check, and a genetic algorithm gives you no proof that its answer is the best, only a good tour and a hope. It is worth knowing that before anyone acts on one.

One small mercy: a genetic algorithm ends with a whole population of good routes, so a person can pick the second best when the best breaks a rule the score never knew about.

Evolution has no idea where it is going, and a good search does not need to. You do.

---

**Sources**

- J. H. Holland, *Adaptation in Natural and Artificial Systems*, 1975.
- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., Pearson, 2021. Local search and optimisation.
- S. Wright, "The roles of mutation, inbreeding, crossbreeding and selection in evolution", *Proceedings of the Sixth International Congress of Genetics*, 1, 1932, 356 to 366.
