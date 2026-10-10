---
title: "A*, and the Art of the Honest Guess"
slug: "a-star-and-the-honest-guess"
type: "note"
status: "evergreen"
summary: "Four tiles are out of place, so the puzzle takes four moves. It does not, and the gap between that quick count and the truth is the whole art of A*. One honest guess saves the search from wandering, and a boastful one quietly breaks it."
date: "2026-07-11"
created: "2026-07-11"
updated: "2026-07-11"
topics: ["Artificial Intelligence", "Search"]
tags: ["AI", "Search", "Python", "Optimisation", "Problem Framing"]
linked_notes:
  - "how-a-machine-searches"
  - "evolution-as-an-algorithm"
  - "an-agent-and-its-world"
graph:
  show: true
  weight: 2
  cluster: "search-and-planning"
seo:
  title: "A*, and the Art of the Honest Guess"
  description: "How A* search uses one estimate to stop wandering, why the estimate must never overstate, and a runnable Python 8-puzzle solver that proves the point with numbers."
---

Here is a sliding puzzle. Eight tiles and one gap on a three by three board, and you may only slide a tile into the gap. The aim is to turn the board on the left into the board on the right.

```text
start:  2 8 3        goal:  1 2 3
        1 6 4               8 _ 4
        7 _ 5               7 6 5
```

Count the tiles that are in the wrong place. The 2, the 8, the 1 and the 6: four. So is the answer four moves?

It is not. Each slide moves one tile one square, and when you count how far each of those four has to travel, the total is 5. The cheapest solution is exactly 5 moves. That quick count of four was a guess, and it was a good one, because it told me something true: I cannot possibly do it in fewer than four. What it could not do was claim the answer.

That small gap, between a fast estimate and the truth, is what lets a search algorithm skip most of the work. It is also where the algorithm can be quietly ruined.

## One guess added to the bill

In [How a Machine Searches](/notes/how-a-machine-searches/) we ended with Dijkstra's algorithm: always expand the state that has cost least so far. It is exact, and it is blind. It has no idea where the goal is, so it spreads outwards in every direction, and most of what it explores is on the wrong side of the map.

**A\*** (said "A star") adds one number. For every state n it keeps two quantities:

- `g(n)`: the exact cost already paid to get from the start to n
- `h(n)`: a **heuristic**, an estimate of the cheapest cost still to go from n to the goal

and it always expands the state with the lowest total.

<div class="formula">f(n) = g(n) + h(n)</div>

So `f(n)` is the estimated cost of the best route that goes through n. Dijkstra's algorithm ranks states by what they have cost. A\* ranks them by what the whole journey would cost if the guess is right. Set `h` to zero for every state and A\* becomes Dijkstra's algorithm exactly. The algorithm is credited to Peter Hart, Nils Nilsson and Bertram Raphael, who published it in 1968.

The guess has to come from somewhere, and the usual source is a trick I like: **relax the rules**, solve the easier problem exactly, and use its cost as the estimate. For the puzzle there are two easy relaxations.

- Let a tile jump straight to its home square. Then the cost is the number of tiles out of place. Call this `h1`, **misplaced tiles**. At the start it is 4.
- Let a tile slide onto any neighbouring square, even an occupied one. Then the cost is the sum of every tile's distance from home, counted in rows plus columns. Call this `h2`, the **Manhattan distance**, after the grid of a city. At the start it is 5.

Because each relaxed puzzle breaks a rule in the player's favour, it can only be easier than the real one. So its cost can never be higher than the real cost. Hold on to that sentence. The rest of the note leans on it.

## The five moves

Here is the winning line, with `h1` as the guess. The blank moves up, up, left, down, right.

| Step | Board | g | h | f |
|---|---|---:|---:|---:|
| 0 | 2 8 3 / 1 6 4 / 7 _ 5 | 0 | 4 | 4 |
| 1 | 2 8 3 / 1 _ 4 / 7 6 5 | 1 | 3 | 4 |
| 2 | 2 _ 3 / 1 8 4 / 7 6 5 | 2 | 3 | 5 |
| 3 | _ 2 3 / 1 8 4 / 7 6 5 | 3 | 2 | 5 |
| 4 | 1 2 3 / _ 8 4 / 7 6 5 | 4 | 1 | 5 |
| 5 | 1 2 3 / 8 _ 4 / 7 6 5 | 5 | 0 | 5 |

Watch the `f` column. It starts at 4, an underestimate, and creeps up to 5 as the guess is corrected by reality, and at the goal, where `h` is 0, it equals the true cost of 5. It never overshoots. With the Manhattan guess the very first `f` is already 5, so the opening estimate is exactly right and the search has almost nothing to argue about.

## The algorithm in a screenful of Python

Here is the whole thing for this puzzle. States are tuples of nine numbers with 0 standing for the gap, and `neighbours` slides the gap in every legal direction. The search keeps a priority queue ordered by `f`. If it later finds a cheaper way to a state it has already seen, it records the cheaper route and the stale queue entry is skipped when it comes round.

```python
import heapq

GOAL = (1, 2, 3,
        8, 0, 4,
        7, 6, 5)
START = (2, 8, 3,
         1, 6, 4,
         7, 0, 5)

MOVES = {"Up": -3, "Down": 3, "Left": -1, "Right": 1}   # direction the blank moves

def neighbours(state):
    blank = state.index(0)
    row, col = divmod(blank, 3)
    for name, step in MOVES.items():
        if (name == "Up" and row == 0) or (name == "Down" and row == 2):
            continue
        if (name == "Left" and col == 0) or (name == "Right" and col == 2):
            continue
        s = list(state)
        s[blank], s[blank + step] = s[blank + step], s[blank]
        yield name, tuple(s)

def misplaced(state):
    return sum(1 for i, t in enumerate(state) if t != 0 and t != GOAL[i])

def manhattan(state):
    total = 0
    for i, t in enumerate(state):
        if t:
            j = GOAL.index(t)
            total += abs(i // 3 - j // 3) + abs(i % 3 - j % 3)
    return total

def no_idea(state):
    return 0

def a_star(start, h):
    frontier = [(h(start), 0, 0, start)]            # (f, tie-break, g, state)
    best_g = {start: 0}
    parent = {start: (None, None)}
    counter, expanded = 1, 0
    while frontier:
        f, _, g, state = heapq.heappop(frontier)
        if g > best_g[state]:
            continue                                 # a cheaper route to this state was found since
        expanded += 1
        if state == GOAL:
            moves = []
            while parent[state][0] is not None:
                state, move = parent[state][0], parent[state][1]
                moves.append(move)
            return g, moves[::-1], expanded
        for move, nxt in neighbours(state):
            if g + 1 < best_g.get(nxt, float("inf")):
                best_g[nxt] = g + 1
                parent[nxt] = (state, move)
                heapq.heappush(frontier, (g + 1 + h(nxt), counter, g + 1, nxt))
                counter += 1



cost, moves, expanded = a_star(START, manhattan)
print("cost:", cost, " moves:", moves, " nodes expanded:", expanded)
```

```text
cost: 5  moves: ['Up', 'Up', 'Left', 'Down', 'Right']  nodes expanded: 6
```

Five moves, found after expanding six states, the last of which is the goal itself. With the misplaced-tiles guess the same run expands 7. The exact counts depend on how ties between equal `f` values are broken, so treat them as an illustration, not a law.

## What the guess buys

One puzzle proves nothing about speed. So here is a fairer test: forty starting boards, each made by shuffling the goal with 100 random slides (so every one is solvable), run under three different guesses. Add this to the end of the same file.

```python
import random

def scramble(steps, rng):
    state = GOAL
    for _ in range(steps):
        state = rng.choice([s for _, s in neighbours(state)])
    return state

rng = random.Random(7)
starts = [scramble(100, rng) for _ in range(40)]

results = {}
for name, h in (("no guess (h = 0)", no_idea), ("misplaced tiles", misplaced),
                ("Manhattan distance", manhattan)):
    costs, nodes = [], 0
    for s in starts:
        cost, _, expanded = a_star(s, h)
        costs.append(cost)
        nodes += expanded
    results[name] = costs
    print(f"{name:20s} mean nodes expanded {nodes / len(starts):9.1f}")

print("all three agree on every cost:",
      results["no guess (h = 0)"] == results["misplaced tiles"] == results["Manhattan distance"])
print("mean optimal length:", sum(results["misplaced tiles"]) / len(starts))
```

```text
no guess (h = 0)     mean nodes expanded   34693.4
misplaced tiles      mean nodes expanded    3366.2
Manhattan distance   mean nodes expanded     315.1
all three agree on every cost: True
mean optimal length: 16.75
```

All three find answers of identical length, every time. The only thing that changes is the work. With no guess, which is Dijkstra's algorithm (and, because every slide costs 1, breadth-first search in all but name), the search expands about 35 thousand states per puzzle. The crude guess cuts that by a factor of roughly ten. The better guess cuts it by another factor of ten. A better estimate is not a cleverer algorithm. It is the same algorithm, told more truth.

The better guess wins for a reason that can be stated exactly. `h2` is never smaller than `h1`, for any board, so we say it **dominates** it. An A\* search with a dominating guess never expands more states than one with the weaker guess, as long as both guesses are honest.

## The promise

Now the word in the title. Why can you trust that answer of 5?

Here is the argument, in words. Suppose A\* is about to return a route that costs C, and suppose a cheaper route exists. Walk along the cheaper route and find the first state on it that has not yet been expanded. It must be sitting on the queue, reached along that route, so its `f` is the cost paid so far along the route plus the guess. The guess is no more than the true remaining cost, so that `f` is no more than the whole cheaper route, which costs less than C. A state with an `f` below C was waiting, and it would have been taken first. So A\* cannot return the dearer route.

Look at where the argument used the guess: `h` is **no more than the true remaining cost**. That property is called **admissible**. Straight-line distance is admissible for road routes, since no road is shorter than the straight line. The guess may be gloomy, even useless (`h = 0` is admissible and tells you nothing). What it may never do is claim that the goal is further away than it really is.

There is a second, stronger property, **consistency**. A consistent guess never drops by more than the cost of a step: `h(n) ≤ cost(n to n′) + h(n′)`, a triangle inequality. Every consistent guess is admissible, and with a consistent guess the first time A\* reaches any state, it has arrived by a cheapest route. The reverse does not hold. Take three states in a row, S to A costing 1 and A to G costing 1, with guesses of 2, 0 and 0. Each is at most the true remaining cost (2, 1 and 0), so the guess is admissible. But from S the guess is 2, while the step to A costs 1 and leaves a guess of 0, and 2 is more than 1 + 0. Admissible, not consistent. My code above tolerates that, because it re-queues a state when it finds a cheaper route to it. Versions that never revisit a state do not.

For the puzzle I did not want to take the claim on trust. The next block works out the true cost from every board by searching outwards from the goal, and then checks both guesses against it. It ends by running the experiment again with a deliberately dishonest guess: twice the Manhattan distance.

```python
from collections import deque

true_cost = {GOAL: 0}                     # true cheapest cost from every state, found
queue = deque([GOAL])                     # by searching outwards from the goal
while queue:
    s = queue.popleft()
    for _, n in neighbours(s):
        if n not in true_cost:
            true_cost[n] = true_cost[s] + 1
            queue.append(n)

print("states that can reach the goal:", len(true_cost))
for name, h in (("misplaced", misplaced), ("Manhattan", manhattan)):
    admissible = all(h(s) <= c for s, c in true_cost.items())
    consistent = all(h(s) <= 1 + h(n) for s in true_cost for _, n in neighbours(s))
    print(f"{name:10s} admissible: {admissible}   consistent: {consistent}")
print("Manhattan >= misplaced everywhere:",
      all(manhattan(s) >= misplaced(s) for s in true_cost))

def boastful(state):                      # twice the honest guess
    return 2 * manhattan(state)

late, nodes = 0, 0
for s in starts:
    cost, _, expanded = a_star(s, boastful)
    nodes += expanded
    late += cost > true_cost[s]
print(f"boastful guess: {late} of {len(starts)} answers not optimal, "
      f"mean nodes expanded {nodes / len(starts):.1f}")
```

```text
states that can reach the goal: 181440
misplaced  admissible: True   consistent: True
Manhattan  admissible: True   consistent: True
Manhattan >= misplaced everywhere: True
boastful guess: 12 of 40 answers not optimal, mean nodes expanded 200.8
```

Of the 362,880 ways to arrange the nine squares, exactly half, 181,440, can reach this goal. The other half cannot, however long you slide. For every one of those boards both guesses are admissible, both are consistent, and the Manhattan guess is never below the misplaced one.

Then the boastful guess. It is faster: about 200 states instead of 315. And in 12 of the 40 puzzles it returns a route that is not the shortest. The worst case was 26 moves for a puzzle that could be done in 20. The program did not crash or warn me. It reported an answer, the same way it reports a right one.

That, to me, is the real lesson of A\*. It is often described as "optimal", full stop. That sentence is false. It is optimal if the guess is honest, and the algorithm cannot check that for you. The guarantee is borrowed entirely from a property of your estimate.

There is a respectable use for the boastful version. Multiplying the guess by a factor W above 1 gives **weighted A\***, which trades some optimality for speed, and with an admissible `h` the answer costs at most W times the best. My experiment sits inside that bound (W is 2, and the worst ratio was 1.3). The difference is that you chose it on purpose, and you know what you gave up.

## What it will not do

A few honest limits, since a note about honest guesses should have some.

**Memory.** A\* keeps every state it has found, so its worst case is exponential, just like breadth-first search. It expands fewer states than Dijkstra's algorithm when the guess helps, which usually means it stores fewer, but a better guess shrinks the pile without removing the problem.

**Speed is not guaranteed.** A good guess makes A\* faster in practice. Nothing in the argument above promises how much faster. A weak guess gives you little, and a useless one gives you Dijkstra's algorithm.

**Good guesses are the hard part.** Everything here depended on having a cheap, honest estimate. For the puzzle, relaxing a rule produced two. For other problems you may have to work for one, and nothing guarantees one exists. When none exists, or the space is simply too large, a different family of searches takes over, and [Evolution as an Algorithm](/notes/evolution-as-an-algorithm/) is where I start on those.

**A bad heuristic fails silently.** I have read two route-planning papers where A\* comes out with a different answer from Dijkstra's algorithm, and a correct A\* with an honest guess cannot do that. The likely suspects are a guess that overstates, perhaps because it measures distance when the costs are minutes, or a bug. It is worth checking the guess before trusting the comparison.

That last point is the one I would carry into any real project, and not only into search. An estimate you did not check is a promise somebody else made on your behalf.

A heuristic is a promise not to be too pessimistic. Optimism is allowed. Exaggeration is not.

---

**Sources**

- P. E. Hart, N. J. Nilsson and B. Raphael, "A Formal Basis for the Heuristic Determination of Minimum Cost Paths", *IEEE Transactions on Systems Science and Cybernetics*, 4(2), 1968, 100 to 107.
- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., Pearson, 2021. Informed search and heuristic design by relaxation.
- E. W. Dijkstra, "A note on two problems in connexion with graphs", *Numerische Mathematik*, 1, 1959, 269 to 271.
