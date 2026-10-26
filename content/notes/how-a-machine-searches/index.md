---
title: "How a Machine Searches"
slug: "how-a-machine-searches"
type: "note"
status: "evergreen"
summary: "Take the oldest item off the waiting list and you get ripples. Take the newest and you get a hiker who never turns back. One small swap, opposite behaviour, and why the route with fewer turns is not always the cheaper one."
date: "2026-07-10"
created: "2026-07-10"
updated: "2026-07-10"
topics: ["Artificial Intelligence", "Search"]
tags: ["AI", "Search", "Problem Framing", "Python", "Optimisation"]
linked_notes:
  - "a-star-and-the-honest-guess"
  - "an-agent-and-its-world"
  - "evolution-as-an-algorithm"
graph:
  show: true
  weight: 2
  cluster: "search-and-planning"
seo:
  title: "How a Machine Searches"
  description: "How AI turns a route problem into states and actions, why breadth-first and depth-first differ by one swap, and why Dijkstra finds cheaper routes than counting turns."
---

Picture a courier standing at junction A with a parcel for junction C. Her phone is dead. All she has is a laminated card that lists the roads between six junctions and how many minutes each one takes. Nobody has told her the route, and there is no one to ask.

How does she find it?

You and I would look at a map and the answer would jump out. A machine does not get that. It gets the card, and a rule for deciding which road to try next. That rule is the whole subject of this note. Change the rule, and the same card gives you a different route, found at a different cost, or sometimes no route at all.

This is the easy end of the spectrum I described in [An Agent and Its World](/notes/an-agent-and-its-world/): a world that is fully visible, that stands still while you think, and where every move does exactly what it says. Almost everything that comes later in AI is what you do when those conditions stop holding. But it is worth getting the easy end properly right first, because the ideas carry all the way up.

## Say what the problem is first

Before any algorithm runs, someone has to decide what the problem is. A search problem has five parts:

- an **initial state**, where we start
- the **actions** available in each state
- a **transition model**, which says what state an action leads to
- a **goal test**, a yes or no question about a state
- a **path cost**, which adds up the cost of each step

The initial state and the transition model together define the **state space**: every state you could reach, joined by the actions that connect them. It is a graph. A solution is a list of actions from the start to a goal, and an optimal solution is the cheapest one.

The courier's card is already a formulation. States are junctions, actions are roads, the goal test is "am I at C", and the path cost is minutes. Here is a second one, the smallest I know. A vacuum cleaner works in a world of two squares, each clean or dirty, and it is standing in one of them. That is 2 × 2 × 2 = 8 states. With n squares it is n × 2ⁿ, which gives 2, 8, 24 and 64 for one to four squares (I checked with a line of Python). The actions are Left, Right and Suck, each costing 1, and the goal is "no dirt anywhere".

The part I find easiest to underrate is that formulating is a choice, and it can go wrong. Describe a trip as "move the left foot one centimetre" and the state space is enormous and the actions are meaningless. Describe it as "drive from one town to the next" and it is small and useful. That is **abstraction**: throw away detail until the actions mean something. An abstraction is valid if every solution to the simplified problem can be turned into a real one, and useful if the simplified actions are easier than the full problem.

It can also go wrong the other way. Score the wrong thing and the search will find you a perfect answer to a question you did not ask. I wrote about this in [He Asked for Water](/essays/he-asked-for-water/), and it comes back in the next two notes. Search algorithms get the attention. The formulation is where most of the mistakes live.

One distinction tripped me up at first. The state space is a graph, and a state can be reached in many ways. The **search tree** is something else: it is built while you explore, and the same state can turn up in it many times, once for each route that reaches it. Keep those two apart and a lot of confusion about "repeated states" disappears.

## Two ways to wait in line

Every search algorithm in this family keeps a **frontier**: the states it has found but not yet explored. At each step it picks one from the frontier, looks at its neighbours, and adds the new ones to the frontier. The algorithms differ in one thing only, which item they pick.

Take the oldest one and you get **breadth-first search** (BFS). It explores everything one step away, then everything two steps away, and so on, like ripples spreading from a stone dropped in a pond. Take the newest one and you get **depth-first search** (DFS). It plunges down one branch as far as it will go, and backs up only when it hits a dead end, like a hiker who never turns back until the path stops.

In code the difference is a single call. Here is a small tree, A with children B and C, B with D and E, C with F, and one function that does both:

```python
from collections import deque

tree = {"A": ["B", "C"], "B": ["D", "E"], "C": ["F"],
        "D": [], "E": [], "F": []}

def search(start, oldest_first):
    frontier, order = deque([start]), []
    while frontier:
        node = frontier.popleft() if oldest_first else frontier.pop()
        order.append(node)
        kids = tree[node]
        frontier.extend(kids if oldest_first else reversed(kids))
    return order

print("oldest first:", search("A", True))
print("newest first:", search("A", False))
```

```text
oldest first: ['A', 'B', 'C', 'D', 'E', 'F']
newest first: ['A', 'B', 'D', 'E', 'C', 'F']
```

The `popleft()` against `pop()` is the whole algorithm. (The `reversed` is only there so the depth-first run visits children left to right.)

<figure>
<svg viewBox="0 0 640 250" role="img" aria-label="Two copies of the same tree with nodes A to F. On the left, breadth-first order numbers the nodes A 1, B 2, C 3, D 4, E 5, F 6, level by level. On the right, depth-first order numbers them A 1, B 2, D 3, E 4, C 5, F 6, down each branch before the next.">
  <title>Visiting order, breadth-first and depth-first</title>
  <text x="160" y="20" font-size="14" font-weight="700" text-anchor="middle" class="dg-ink">Oldest first (breadth-first)</text>
  <text x="480" y="20" font-size="14" font-weight="700" text-anchor="middle" class="dg-ink">Newest first (depth-first)</text>
  <g class="dg-line" stroke-width="1.5">
    <line x1="160" y1="60" x2="100" y2="130" class="dg-line"/>
    <line x1="160" y1="60" x2="220" y2="130" class="dg-line"/>
    <line x1="100" y1="130" x2="70" y2="200" class="dg-line"/>
    <line x1="100" y1="130" x2="130" y2="200" class="dg-line"/>
    <line x1="220" y1="130" x2="220" y2="200" class="dg-line"/>
    <line x1="480" y1="60" x2="420" y2="130" class="dg-line"/>
    <line x1="480" y1="60" x2="540" y2="130" class="dg-line"/>
    <line x1="420" y1="130" x2="390" y2="200" class="dg-line"/>
    <line x1="420" y1="130" x2="450" y2="200" class="dg-line"/>
    <line x1="540" y1="130" x2="540" y2="200" class="dg-line"/>
  </g>
  <g stroke-width="1.5">
    <circle cx="160" cy="60" r="18" class="dg-box"/>
    <circle cx="100" cy="130" r="18" class="dg-box"/>
    <circle cx="220" cy="130" r="18" class="dg-box"/>
    <circle cx="70" cy="200" r="18" class="dg-box"/>
    <circle cx="130" cy="200" r="18" class="dg-box"/>
    <circle cx="220" cy="200" r="18" class="dg-box"/>
    <circle cx="480" cy="60" r="18" class="dg-box"/>
    <circle cx="420" cy="130" r="18" class="dg-box"/>
    <circle cx="540" cy="130" r="18" class="dg-box"/>
    <circle cx="390" cy="200" r="18" class="dg-box"/>
    <circle cx="450" cy="200" r="18" class="dg-box"/>
    <circle cx="540" cy="200" r="18" class="dg-box"/>
  </g>
  <g font-size="14" text-anchor="middle" class="dg-text">
    <text x="160" y="65">A</text><text x="100" y="135">B</text><text x="220" y="135">C</text>
    <text x="70" y="205">D</text><text x="130" y="205">E</text><text x="220" y="205">F</text>
    <text x="480" y="65">A</text><text x="420" y="135">B</text><text x="540" y="135">C</text>
    <text x="390" y="205">D</text><text x="450" y="205">E</text><text x="540" y="205">F</text>
  </g>
  <g font-size="13" font-weight="700" text-anchor="start" class="dg-ink">
    <text x="182" y="58">1</text><text x="122" y="128">2</text><text x="242" y="128">3</text>
    <text x="92" y="198">4</text><text x="152" y="198">5</text><text x="242" y="198">6</text>
    <text x="502" y="58">1</text><text x="442" y="128">2</text><text x="562" y="128">5</text>
    <text x="412" y="198">3</text><text x="472" y="198">4</text><text x="562" y="198">6</text>
  </g>
</svg>
<figcaption>The same tree searched twice. The numbers show the order of visiting. Breadth-first sweeps across each level; depth-first finishes a whole branch before it touches the next.</figcaption>
</figure>

The two strategies have very different bills. Breadth-first search is **complete**, which means it finds a solution if one exists (provided each state has finitely many neighbours), and when every step costs the same it finds the one with the fewest steps. But it has to hold a whole layer of the tree in memory. With a branching factor b of 10 (ten options at each step) and a solution 10 steps away, that is on the order of 10¹⁰ nodes. At a thousand bytes a node, that is about 10 terabytes. In practice BFS tends to run out of memory long before it runs out of time.

Depth-first search needs memory only for the current branch, roughly b times the maximum depth, so it barely notices the problem size. The price is that it is neither complete nor optimal. In a space with loops or an endless path it can wander down one branch forever, and even when it finishes, it returns the first solution it stumbles on, which may be a very long one.

## The route with fewer turns is not always the cheaper one

Breadth-first search counts steps. The courier does not care about steps. She cares about minutes. Here is her card, as a list of roads with their times:

<div class="callout callout-hint"><p><strong>The courier's card</strong></p><p>A to B 2, A to D 8, B to D 5, B to E 6, C to E 9, C to F 3, D to E 3, D to F 2, E to F 1.</p></div>

Run breadth-first search from A to C and it finds A, B, E, C. Three roads, so it is happy. That route takes 2 + 6 + 9 = 17 minutes. (There is a second three-road route, A, D, F, C, which takes 13, and BFS cannot tell the two apart because it never looks at the times. Which one it returns depends on the order it happens to list the neighbours.)

The cheapest route has four roads. It is A, B, D, F, C, and it takes 2 + 5 + 2 + 3 = 12 minutes. More turns, five minutes saved.

The fix is small. Instead of expanding the oldest state, expand the one with the lowest cost so far. That is **uniform-cost search**, and run over a whole graph from a single source it is **Dijkstra's algorithm**, published in 1959. The frontier becomes a priority queue ordered by cost, and here it is in a few lines:

```python
import heapq

roads = {("A", "B"): 2, ("A", "D"): 8, ("B", "D"): 5, ("B", "E"): 6, ("C", "E"): 9,
         ("C", "F"): 3, ("D", "E"): 3, ("D", "F"): 2, ("E", "F"): 1}
graph = {}
for (u, v), minutes in roads.items():
    graph.setdefault(u, {})[v] = minutes
    graph.setdefault(v, {})[u] = minutes

def cheapest(start, goal):
    frontier = [(0, start, [start])]          # (cost so far, junction, route)
    settled = set()
    while frontier:
        cost, node, route = heapq.heappop(frontier)
        if node in settled:
            continue
        if node == goal:
            return cost, route
        settled.add(node)
        for nxt, minutes in graph[node].items():
            heapq.heappush(frontier, (cost + minutes, nxt, route + [nxt]))

print(cheapest("A", "C"))
```

```text
(12, ['A', 'B', 'D', 'F', 'C'])
```

Why can you trust it? Because the lowest-cost state on the frontier cannot be improved by going round some other way: every other route to it starts by leaving the frontier through a state that already costs at least as much, and the extra roads can only add to the total. That argument needs one condition, and it is a real one. **No road may have a negative cost.** Allow a road that gives you time back and a state you had finished with could suddenly become cheaper, and the method breaks. Other algorithms (Bellman and Ford's, for instance) handle that case.

Notice also the tie. A, B, E, F, C also costs 12, and the code returns only one of the two. When two optimal routes exist, which you get depends on how ties are broken, so it is worth being a little suspicious of anyone who says the algorithm found "the" best route.

Dijkstra's algorithm is sometimes filed under informed search. It is not. It uses no estimate of how far the goal is, only the cost already paid, so it spreads outwards in every direction like the ripples of the breadth-first search, just weighted by cost. Keep that picture. It is the thing the next note sets out to fix.

## Which resource do you want to run out of?

By now there are several strategies, and a fair question is which one is best. The honest answer is that there is no best one, only a best trade for the problem in front of you. Four questions let you compare them:

1. **Complete:** does it find a solution when one exists?
2. **Optimal:** does it find the cheapest?
3. **Time:** how many nodes does it generate?
4. **Space:** how many does it keep in memory?

With b the branching factor and d the depth of the shallowest solution, the standard textbook comparison looks like this:

| Algorithm | Complete | Optimal | Time | Space |
|---|---|---|---|---|
| Breadth-first | yes | if steps cost the same | `O(b^d)` | `O(b^d)` |
| Uniform-cost | yes (steps above zero) | yes | grows with cost, not depth | same as time |
| Depth-first | no | no | `O(b^m)`, m the deepest path | `O(b·m)` |
| Iterative deepening | yes | if steps cost the same | `O(b^d)` | `O(b·d)` |

The last row is my favourite, because it looks like cheating. **Iterative deepening** runs depth-first search with a depth limit of 1, then 2, then 3, and so on until the goal turns up. It keeps depth-first's small memory and gets breadth-first's completeness. The obvious objection is that it redoes the shallow work over and over. The numbers say that hardly matters. With b = 10 and a solution at depth 5, breadth-first generates 1 + 10 + 100 + 1,000 + 10,000 + 100,000 = 111,111 nodes. Iterative deepening generates 6 + 50 + 400 + 3,000 + 20,000 + 100,000 = 123,456. That is about 11.1 per cent more work, because in a tree this bushy nearly everything sits in the last layer, so repeating the top costs almost nothing.

Two cautions about reading the table. Big-O hides constants and says nothing about your actual instance, and the "optimal" column always comes with its condition attached. Those conditions are the first thing that gets dropped when someone summarises an algorithm in a sentence.

## Where the card runs out

Search over a graph is one piece of a larger problem. When a robot or a vehicle gets from here to there, four separate questions are in play: where am I, what is around me, what is the best way to get there, and how do I physically move along it. People answer all four without noticing. A machine has to answer each on purpose. Building a map of an unknown place while estimating your own position in it has a name, SLAM (simultaneous localisation and mapping). Turning a chosen route into wheel speeds is motion control. The search algorithms in this note own only the third question.

That leaves their assumptions exposed. The courier's card is a **known, static map**, and the plan it produces is a plan made once, in advance. A real vehicle needs a loop that keeps checking what it perceives, because the road may be closed by the time it arrives, and the minutes on the card may change while the plan is still being worked out. The same holds for any decision problem where the costs shift as you plan.

There is also the matter of size. Dijkstra's algorithm is exact, but it explores in every direction because it has no idea where the goal is. On a six-junction card that does not matter. On a country's road network it matters a great deal. And once a problem is too large for any exact method, as when you must visit dozens of places in the best order, you stop asking for the best answer and start asking for a good one. [Evolution as an Algorithm](/notes/evolution-as-an-algorithm/) picks that thread up.

The nearer question is whether one honest guess about where the goal lies could stop the search wandering in the wrong direction. It can, and the catch is the word honest. That is [A\*, and the Art of the Honest Guess](/notes/a-star-and-the-honest-guess/).

The order you look in decides what you find, and what it costs to find it.

---

## References

- S. Russell and P. Norvig, [*Artificial Intelligence: A Modern Approach*](https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003500), 4th ed., Pearson, 2021 (problem formulation, uninformed search and the comparison of strategies).
- E. W. Dijkstra, ["A note on two problems in connexion with graphs"](https://doi.org/10.1007/BF01386390), *Numerische Mathematik*, 1, 1959, 269–271.
