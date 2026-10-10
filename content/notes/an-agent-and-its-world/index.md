---
title: "An Agent and Its World"
slug: "an-agent-and-its-world"
type: "note"
status: "evergreen"
summary: "A wasp with a flawless routine and no way to notice that the world has moved. What it takes for a machine to do better: what rational really means, how to describe the world it lives in, and a ladder of designs where each rung fixes the one below."
date: "2026-06-18"
created: "2026-06-18"
updated: "2026-10-04"
topics: ["Artificial Intelligence", "Agents"]
tags: ["AI", "Problem Framing", "Rational Agents", "PEAS", "Agent Design"]
linked_notes:
  - "what-are-we-actually-trying-to-build"
  - "how-a-machine-searches"
  - "bayes-or-how-to-change-your-mind"
graph:
  show: true
  weight: 2
  cluster: "agents"
seo:
  title: "An Agent and Its World"
  description: "What an AI agent is, what rational precisely means, how to describe a task with PEAS, and the ladder of agent designs from reflex to learning."
---

There is a wasp, the sphex, whose routine is so tidy it has become a famous story about minds. The female paralyses her prey and drags it to the mouth of her burrow. She leaves it at the entrance and goes inside to check that all is well. Then she comes out and drags the prey in.

Now suppose that while she is inside checking, someone moves the prey a few inches away. She comes out, finds it, drags it back to the entrance, leaves it there, and goes in to check again. Move it again and she does the same thing again. In the classic telling, she does this dozens of times in a row, and never once thinks to drag it straight in.

The story may be tidier than the real insect. But as a picture of a certain kind of agent it is perfect. The wasp is good at her job. Her routine is elaborate, purposeful and, in the world it evolved for, it works. It just has no way to notice when the world stops behaving the way the routine assumes.

When I first studied how AI describes agents, that wasp kept coming back to me, because nearly every idea in this area is an answer to one question: what would it take for a machine not to be the wasp?

## An agent and its world

The vocabulary is small and it repays getting exactly right.

An **agent** is anything that perceives its **environment** through **sensors** and acts on it through **actuators**. You are one: eyes and ears in, hands and voice out. A robot vacuum is one: bump sensors and a dirt detector in, wheels and suction out.

What the sensors take in at a given moment is a **percept**. The complete history of everything the agent has ever perceived is its **percept sequence**. An agent's choice at any moment can depend on its built-in knowledge and on that whole history, but never on anything it has not perceived.

One thing worth saying early: "agent" is a lens for looking at systems. You could describe a pocket calculator as an agent that perceives button presses and acts by showing digits, but nothing useful follows. The lens earns its keep when there is a real decision to make about what to do next.

## The function and the program

There are two quite different ways to describe what an agent does, and mixing them up causes a lot of confusion.

The **agent function** is the behaviour written out in full: for every possible percept sequence, the action the agent takes. Think of it as an enormous table. It is a description from the outside, a specification.

The **agent program** is the actual code running on actual hardware that produces that behaviour. Put the program on a physical machine, the **architecture**, and you have the agent.

The smallest example I know is a vacuum world with just two squares, A and B, each either clean or dirty. The vacuum senses which square it is on and whether that square is dirty. It can suck, move right or move left. Here is a complete agent program for it, along with code that writes out the agent function as a table for every percept sequence up to a given length:

```python
from itertools import product

PERCEPTS = [(square, status) for square in "AB" for status in ("Clean", "Dirty")]

def reflex_vacuum(percept):
    square, status = percept
    if status == "Dirty":
        return "Suck"
    return "Right" if square == "A" else "Left"

# The same behaviour written out as a table: one row per possible percept sequence.
def lookup_table(T):
    table = {}
    for t in range(1, T + 1):
        for history in product(PERCEPTS, repeat=t):
            table[history] = reflex_vacuum(history[-1])
    return table

print(reflex_vacuum(("A", "Dirty")), reflex_vacuum(("A", "Clean")))
for T in (1, 5, 10):
    print(T, len(lookup_table(T)))
```

```text
Suck Right
1 4
5 1364
10 1398100
```

Six lines of program. The table has 4 rows for one step, 1,364 rows for histories up to five steps, and 1,398,100 rows by ten steps. By twenty steps it would be about 1.5 trillion rows, and the program would still be six lines.

Now scale that up to something real. Russell and Norvig do this sum for an automated taxi with a single camera. A camera at 1080 × 720 pixels, with 3 bytes of colour per pixel and 30 frames a second, produces about 70 million bytes every second. Write out the table for just one hour of driving and the number of entries is roughly 10 raised to the power of 600 billion: a number with over 600 billion digits. The number of atoms in the observable universe is usually estimated at around 10⁸⁰.

So nobody builds the table. It serves as a definition, and the real work of AI is writing small programs that behave as well as the impossible table would. People did the same thing with square roots: there were once printed books of square root tables, and now a short routine inside a calculator replaces all of them.

## What rational means, precisely

In [What Are We Actually Trying to Build?](/notes/what-are-we-actually-trying-to-build/) I ended up at the idea that AI builds agents that do the right thing. That sentence is only useful once you say what "right" means.

AI's answer is to judge an agent by its consequences. As the agent acts, the environment moves through a sequence of states. A **performance measure** scores that sequence. The performance measure belongs to whoever designs or uses the agent. It is our idea of success, not the agent's.

There is a trap here. Design the measure around what you want the world to look like, not around how you imagine the agent should behave. Reward the vacuum for the amount of dirt it sucks up and a rational vacuum will learn to dump dirt back on the floor and suck it up again, forever. Reward it for a clean floor over time and the trick stops paying.

With that in place, the definition becomes precise. What is rational at a given moment depends on four things:

1. the performance measure that defines success;
2. what the agent already knows about its environment;
3. the actions it can take;
4. its percept sequence so far.

<div class="callout callout-definition"><p><strong>A rational agent</strong></p><p>For each possible percept sequence, a rational agent chooses the action that is expected to maximise its performance measure, given the evidence from its percepts and whatever knowledge it was built with.</p></div>

The word doing the most work is **expected**. Rational does not mean omniscient. Russell and Norvig's example is someone who sees an old friend across the street, checks there is no traffic, starts to cross, and is flattened by a cargo door that has fallen off a passing airliner. The decision to cross was rational. The outcome was terrible. Demanding that an agent always take the action that turns out best in hindsight is demanding a crystal ball.

This one landed for me because of insurance, which I work close to. A good underwriting decision can still be followed by a claim. If you judge each decision by its outcome alone, you end up punishing good decisions that were unlucky and rewarding bad ones that got away with it. You judge the decision by what was knowable when it was made.

Three consequences follow from this definition, and each one surprised me a little.

**Gathering information is rational.** Looking both ways before crossing is an action taken purely to improve your future percepts, and because it raises expected performance, a rational agent does it. Crossing a busy road without looking is irrational even if you happen to survive.

**Learning is required.** An agent that has been given prior knowledge should still update it from what it perceives, because the world will not always match what its designers assumed.

**Autonomy is the goal.** An agent that relies only on its designers' built-in knowledge, rather than on its own percepts, lacks autonomy. And that is exactly the wasp. Her built-in knowledge is excellent, right up to the moment the world violates it, and then she has nothing else to fall back on. Russell and Norvig pair her with the dung beetle, which will carry a ball of dung to plug the entrance of its nest, and if the ball is taken from its grip on the way, it carries on to the nest and mimes plugging the hole with a ball it no longer has.

## Writing the task down

Before designing an agent, you describe the problem it faces as completely as you can. The checklist is **PEAS**: **P**erformance measure, **E**nvironment, **A**ctuators, **S**ensors. Here it is for an automated taxi:

| | Automated taxi |
|---|---|
| **Performance** | Safe, fast, legal, comfortable trips; profit; little disruption to other road users |
| **Environment** | Roads, other traffic, pedestrians, customers, police, weather |
| **Actuators** | Steering, accelerator, brake, indicators, horn, display, speech |
| **Sensors** | Cameras, radar or lidar, speedometer, GPS, engine sensors, microphones, touchscreen |

Look at the first row. Safe, fast, comfortable and profitable already pull against each other. The table hides a question it does not answer: how much safety is worth how much speed? That question will come back.

I tried PEAS on something closer to my own work: an assistant that helps decide whether to offer someone an insurance policy, and at what price. The actuators (quote, decline, ask for more information, refer to a human underwriter) and sensors (the application, third-party data, past claims) are easy. The environment is interesting, because the claims that tell you whether you were right arrive months or years later. And the performance measure is, once again, the hard part. Measure the assistant on the claims it pays out and the "rational" strategy is to decline everybody: the underwriting version of a car told to be safe that never leaves the garage. A good measure has to balance claims against premiums, fair treatment of customers, the rules a regulator sets, and speed. Notice too that "ask for more information" is information gathering: sometimes the rational move is to find out more before deciding.

PEAS looks like a form to fill in. In practice it is where you find out whether you understand the problem at all.

## Seven ways a world can be hard

Once the task is written down, you can classify its environment. There are seven properties, and each one has an easy end and a hard end.

| Property | Easy end | Hard end | One sharp example |
|---|---|---|---|
| Observable | fully | partially | Chess shows you everything; poker hides the cards that matter. |
| Agents | single | multi | A crossword is solved alone; in chess someone is working against you. |
| Deterministic | deterministic | nondeterministic | In the vacuum world, Suck always cleans; on a real road, a tyre can burst. |
| Episodic | episodic | sequential | Inspecting parts on a line: each verdict stands alone. In chess, this move shapes every later one. |
| Static | static | dynamic | A crossword waits while you think; traffic does not. |
| Discrete | discrete | continuous | Chess has a finite set of moves; steering angles and speeds vary smoothly. |
| Known | known | unknown | You know the rules of solitaire; in a new video game you may not know what the buttons do. |

A few of these are easy to mix up, and the mix-ups are where the understanding is.

**Known is not the same as observable.** Solitaire is known (you know every rule) but partially observable (some cards are face down). A new video game can be fully observable (the whole screen is in front of you) yet unknown (you do not know what pressing a button will do). Known and unknown describe the agent's grasp of how the world works, not how much of it the agent can see.

**Stochastic is a particular kind of nondeterministic.** If the possible outcomes come with probabilities ("25 per cent chance of rain"), the environment is stochastic. If they are only listed ("it might rain"), it is nondeterministic.

**Partial observability can look like chance.** A perfectly deterministic world that you can only partly see will seem unpredictable from where you stand.

**Some worlds sit in between.** Chess played with a clock is **semidynamic**: the board does not change while you think, but your remaining time does, so dithering has a cost.

Chess with a clock is fully observable, multi-agent, deterministic, sequential, semidynamic, discrete and known. Taxi driving is partially observable, multi-agent, nondeterministic, sequential, dynamic, continuous and, at least in places, unknown. The real world sits at the hard end of nearly every property at once. So does my insurance example: the applicant knows things you do not, competitors price against you, and although each application looks like its own episode, a book of policies is sequential. That is why so much of AI starts with the easy end, solves it properly, and then relaxes one property at a time. [How a Machine Searches](/notes/how-a-machine-searches/) begins at exactly that easy end.

## A ladder of designs

The remaining question is how the program inside actually decides. There are five classic designs, and the best way I have found to remember them is as a ladder where each rung exists because the one below it fails at something.

<figure>
<svg viewBox="0 0 640 400" role="img" aria-label="A ladder of five agent designs. From bottom to top: simple reflex, model-based reflex, goal-based, utility-based, learning. Each rung fixes a failure of the one below." xmlns="http://www.w3.org/2000/svg">
  <title>The ladder of agent designs</title>
  <defs>
    <marker id="ladder-up" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="dg-accent"/></marker>
  </defs>
  <path d="M34 380 V30" class="dg-accent-stroke" stroke-width="2" marker-end="url(#ladder-up)"/>
  <text x="22" y="210" text-anchor="middle" font-size="13" class="dg-muted" transform="rotate(-90 22 210)">each rung fixes the one below</text>
  <rect x="60" y="316" width="560" height="62" rx="8" class="dg-subtle" stroke-width="1.5"/>
  <text x="78" y="342" font-size="16" font-weight="700" class="dg-ink">1. Simple reflex</text>
  <text x="78" y="364" font-size="13" class="dg-text">acts on the current percept only</text>
  <rect x="85" y="244" width="535" height="62" rx="8" class="dg-box" stroke-width="1.5"/>
  <text x="103" y="270" font-size="16" font-weight="700" class="dg-ink">2. Model-based reflex</text>
  <text x="103" y="292" font-size="13" class="dg-text">adds memory of the world: copes with what it cannot see</text>
  <rect x="110" y="172" width="510" height="62" rx="8" class="dg-box" stroke-width="1.5"/>
  <text x="128" y="198" font-size="16" font-weight="700" class="dg-ink">3. Goal-based</text>
  <text x="128" y="220" font-size="13" class="dg-text">adds a goal: knows where it is trying to get to</text>
  <rect x="135" y="100" width="485" height="62" rx="8" class="dg-box" stroke-width="1.5"/>
  <text x="153" y="126" font-size="16" font-weight="700" class="dg-ink">4. Utility-based</text>
  <text x="153" y="148" font-size="13" class="dg-text">adds degrees of better: weighs trade-offs and risk</text>
  <rect x="160" y="28" width="460" height="62" rx="8" class="dg-highlight" stroke-width="2"/>
  <text x="178" y="54" font-size="16" font-weight="700" class="dg-ink">5. Learning</text>
  <text x="178" y="76" font-size="13" class="dg-text">adds a critic: improves beyond what its designer knew</text>
</svg>
<figcaption>Five agent designs, each one a repair. Learning sits at the top, though in practice any of the lower four can be wrapped inside a learning agent.</figcaption>
</figure>

### Rung one: the simple reflex agent

The simplest agent looks only at the current percept and fires a matching **condition-action rule**: if the car in front is braking, brake. The vacuum program above is one of these. Reflex agents are fast, and often good enough.

Their weakness is that they have no memory. They work only when the right action can be read off the current percept. Give the vacuum a sensor for dirt but not for location and it cannot tell which way to move; a deterministic reflex agent in that position can loop forever, and the usual patch is to let it act at random now and then, which breaks the loop at the cost of some wasted moves. The wasp is close to this rung: a fixed sequence of responses with no record of what has already happened.

### Rung two: the model-based reflex agent

The fix for not seeing everything is to remember. A **model-based** agent keeps an internal state: its best guess about the parts of the world it cannot currently perceive. If a car disappears behind a lorry, the agent still believes the car is there.

Keeping that guess up to date needs two kinds of knowledge. A **transition model** says how the world changes, both by itself and in response to the agent's actions. A **sensor model** says how the real state of the world shows up in the agent's percepts. Together they let the agent track a world it can only partly see.

But knowing what the world is like does not tell you what to do. At a junction, a perfect picture of the road is useless if you do not know where you are going.

### Rung three: the goal-based agent

A **goal-based** agent has a description of the states it wants to reach. To choose an action, it combines its model with its goal and asks: if I do this, what happens, and does that get me closer? Answering that means looking ahead, sometimes many steps, which is the work of search and planning.

This design is often slower than a reflex, but it is far more flexible, because its knowledge is explicit. A reflex agent brakes at brake lights because a rule says so. A goal-based agent brakes because it predicts that braking avoids a collision. Change the destination and the goal-based agent simply plans a new route; the reflex agent would need every rule rewritten.

Its weakness is that a goal is only yes or no. Many routes reach the airport. Some are quicker, some are safer, some are cheaper. A goal cannot tell them apart.

### Rung four: the utility-based agent

A **utility-based** agent replaces the yes-or-no goal with a **utility function**, a score for how desirable each outcome is. It is the agent's internal version of the performance measure. When the world is uncertain, the agent picks the action with the highest **expected utility**: the utility of each possible outcome, weighted by how likely that outcome is.

<div class="formula">EU(action) = ∑ P(outcome | action) × U(outcome)</div>

Here is an example I worked through to convince myself. You have 60 minutes to catch a flight. The motorway takes 25 minutes, except that one time in ten there is a jam and it takes 70. The back roads always take 40. A goal-based agent sees two routes that both reach the airport. An agent that minimises average journey time picks the motorway, because 0.9 × 25 + 0.1 × 70 = 29.5 minutes, which beats 40. But what you actually care about is catching the flight. Give that a utility of 1 and missing it a utility of 0, and the motorway's expected utility is 0.9 while the back roads score 1.0. The utility-based agent takes the back roads, and it is right.

Utility earns its place in two situations goals cannot handle: when goals conflict, like speed and safety, and when no goal can be reached for certain, so likelihood has to be weighed against importance. There is a deeper result behind this, from decision theory: an agent whose choices meet a few reasonable consistency conditions behaves as if it were maximising expected utility, whether or not it was built with a utility function inside. Utility is less a design choice than something rationality forces on you. How an agent should update those probabilities as evidence arrives is the subject of [Bayes' Rule, or How to Change Your Mind](/notes/bayes-or-how-to-change-your-mind/).

The weakness of all four designs so far is the same: everything they know, someone had to put there. In an unknown environment, the designer's knowledge runs out.

### Rung five: the learning agent

Turing saw this coming. In his 1950 paper he asked: "Instead of trying to produce a programme to simulate the adult mind, why not rather try to produce one which simulates the child's?" Build something that can learn, then teach it.

A **learning agent** has four parts. The **performance element** chooses actions; it is the whole of whichever agent you had on the lower rungs. The **critic** watches what happens and tells the agent how well it is doing against a fixed standard. The **learning element** uses the critic's feedback to improve the performance element. The **problem generator** suggests actions that might be worse in the short term but teach the agent something, so that it explores instead of repeating what it already knows.

The critic's standard has to sit outside the agent and stay fixed. If the agent could adjust the standard, the easiest way to "improve" would be to lower the bar to match whatever it already does. And the problem generator is what stops the agent becoming a cleverer wasp: an agent that only ever exploits what it knows will never find out that it was wrong.

## Back to the wasp

The wasp has a superb routine and no critic. Nothing in her tells her that checking the burrow for the twentieth time is not working, so nothing in her can change.

Each rung of the ladder is a repair for one specific way of being stuck: not seeing, not knowing where you are going, not knowing which way is better, not being able to learn. Read from the bottom, the ladder is a list of the wasp's limits. Read from the top, it is a description of what we are asking machines to become.

A reflex knows what to do. A learning agent can find out it was wrong.

---

**Sources**

- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., Pearson, 2021.
- A. M. Turing, "Computing Machinery and Intelligence", *Mind*, 59(236), 1950, 433 to 460.
