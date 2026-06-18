---
title: "Intelligent Agents: Making Rational Concrete"
date: "2026-06-18"
tags: ["Artificial Intelligence", "AI", "Agents", "Computer Science", "Russell & Norvig"]
category: "Artificial Intelligence"
topic: "AI: A Modern Approach"
unit: "Intelligent Agents"
order: 2
coverImage: "./images/intelligent-agents-cover.webp"
---

The [previous lesson](/learning-hub/aritificial-intelligenece/introduction/thinking-machine-ch1/) established why *acting rationally* is the right target for AI. This lesson delivers the machinery that makes it concrete: what an agent is, what "rational" formally means, how to characterise the problems agents face, and the family of designs we will build the rest of the course around.

By the end you should be able to describe any AI task as a PEAS specification, classify its environment on seven dimensions, match it to an appropriate agent design, and explain why each rung on the design ladder fixes the limitation of the one below it.

---

# Agents and environments

<div class="callout callout-definition">
<p><strong>Definition · The core vocabulary</strong></p>
<p>An <strong>agent</strong> is anything that perceives its <strong>environment</strong> through <strong>sensors</strong> and acts on it through <strong>actuators</strong>.</p>
<ul>
<li><strong>Percept</strong> — what the sensors are taking in right now.</li>
<li><strong>Percept sequence</strong> — the complete history of everything the agent has ever perceived.</li>
</ul>
<p>An agent's action at any instant can depend on its built-in knowledge and on its entire percept sequence to date, but not on anything it has not perceived.</p>
</div>

<figure>
<svg viewBox="0 0 620 280" role="img" aria-label="The agent-environment interaction loop" xmlns="http://www.w3.org/2000/svg">
  <title>The agent-environment interaction loop</title>
  <defs>
    <marker id="ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="#a9701a"/></marker>
    <marker id="ar2" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="#0e7c86"/></marker>
  </defs>
  <rect x="40" y="40" width="250" height="200" rx="14" fill="#16202b"/>
  <text x="165" y="70" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="700" fill="#fff">AGENT</text>
  <rect x="70" y="90" width="190" height="46" rx="8" fill="#243240" stroke="#0e7c86"/>
  <text x="165" y="118" text-anchor="middle" font-family="monospace" font-size="11.5" fill="#9fd0d4">sensors → ? → actuators</text>
  <text x="165" y="160" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#8ea2b0">agent program maps the</text>
  <text x="165" y="176" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#8ea2b0">percept sequence to an action</text>
  <rect x="360" y="40" width="220" height="200" rx="14" fill="#e6f1f1" stroke="#0e7c86" stroke-width="1.5"/>
  <text x="470" y="148" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="700" fill="#0a5b63">ENVIRONMENT</text>
  <path d="M360 95 H300" fill="none" stroke="#a9701a" stroke-width="2.2" marker-end="url(#ar)"/>
  <text x="330" y="86" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#a9701a">percepts</text>
  <path d="M290 185 H360" fill="none" stroke="#0e7c86" stroke-width="2.2" marker-end="url(#ar2)"/>
  <text x="325" y="205" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#0a5b63">actions</text>
</svg>
<figcaption>The fundamental loop. The agent <em>perceives</em> (percepts in) and <em>acts</em> (actions out); the environment responds. Every agent in the book is a variation on what goes in the "?".</figcaption>
</figure>

## The distinction we must not blur: function vs. programme

<div class="callout callout-definition">
<p><strong>Definition · Agent function vs. agent programme</strong></p>
<p>The <strong>agent function</strong> is the abstract mathematical object that maps every possible percept sequence to an action — like an infinite lookup table, a complete external description of behaviour.</p>
<p>The <strong>agent programme</strong> is the concrete implementation of that function running on physical hardware. It is the actual code.</p>
</div>

<div class="callout callout-hint">
<p><strong>Intuition · The recipe vs. the cook</strong></p>
<p>The agent function is the <em>specification</em> ("for this input, produce that output") — the abstract recipe, possibly infinitely long. The agent programme is the working cook that realises it within real time and memory. Very different programmes can implement the same function; a tiny programme can stand in for an astronomically large table.</p>
</div>

<div class="callout callout-example">
<p><strong>Worked example · The vacuum-cleaner world</strong></p>
<p>Two squares, <em>A</em> and <em>B</em>, each clean or dirty. The agent senses its location and whether dirt is present; it can move left, move right, or suck. A simple agent <strong>function</strong>: if the current square is dirty, suck; otherwise move to the other square. Tabulated, it maps [A, Dirty] → Suck, [A, Clean] → Right, and so on — an unbounded table. The agent <strong>programme</strong> is the handful of lines of code that produce the same outputs without storing the table. This tiny world recurs throughout the course as the running test case.</p>
</div>

<div class="callout callout-warning">
<p><strong>Exam trap · Is the agent function the same as the agent programme?</strong></p>
<p><strong>No.</strong> Function = abstract map (possibly infinite); programme = its finite implementation on the architecture. Also remember: <strong>agent = architecture + programme</strong>.</p>
</div>

---

# Good behaviour — rationality, precisely

"A rational agent does the right thing" — but what is "right"? AI adopts **consequentialism**: judge behaviour by its *consequences*. The agent's actions push the environment through a sequence of states; if that sequence is desirable, the agent did well.

<div class="callout callout-definition">
<p><strong>Definition · Performance measure</strong></p>
<p>A <strong>performance measure</strong> evaluates any given sequence of environment states. It is the objective yardstick of success, and crucially it lives in the mind of the <em>designer or user</em> — not the agent.</p>
</div>

<div class="callout callout-example">
<p><strong>Key insight · Measure outcomes, not behaviours</strong></p>
<p>Design the performance measure around <strong>what you want to be true of the environment</strong>, not how you imagine the agent should act. Reward the vacuum for a <em>clean floor over time</em>, not for <em>amount of dirt collected</em> — or a rational agent will dump dirt out and re-collect it forever to game the measure.</p>
</div>

<div class="callout callout-definition">
<p><strong>Definition · A rational agent — the precise statement</strong></p>
<p>What is rational at a given moment depends on <strong>four things</strong>:</p>
<ol>
<li>the <strong>performance measure</strong> defining success,</li>
<li>the agent's <strong>prior knowledge</strong> of the environment,</li>
<li>the <strong>actions</strong> available to the agent,</li>
<li>the agent's <strong>percept sequence</strong> to date.</li>
</ol>
<p>For each possible percept sequence, a rational agent selects the action expected to maximise its performance measure, given the evidence of the percept sequence and its built-in knowledge.</p>
</div>

<div class="callout callout-warning">
<p><strong>Pitfall · Rational ≠ omniscient, perfect, or all-knowing</strong></p>
<p>Rationality maximises <em>expected</em> performance; <strong>omniscience</strong> would require knowing the actual outcome in advance, which is impossible. A rational agent can do everything right and still get unlucky. Demanding the perfect (after-the-fact best) action is incoherent unless you have a crystal ball. Do not confuse a rational decision with a fortunate outcome.</p>
</div>

## Information gathering, learning, and autonomy

The precise definition of rationality has three powerful consequences:

- **Information gathering is rational.** Looking both ways before crossing is not optional politeness — an action taken to *improve future percepts* raises expected performance, so a rational agent does it. (Crossing on an uninformative percept sequence is irrational precisely because the risk is too high.)

- **Learning is required.** A rational agent must learn as much as it can from what it perceives, updating and augmenting its prior knowledge rather than acting on fixed assumptions.

- **Autonomy is the goal.** An agent that leans only on its designers' built-in knowledge, rather than its own percepts and learning, lacks autonomy. After enough experience, a truly autonomous agent's behaviour becomes effectively independent of its initial programming.

<div class="callout callout-example">
<p><strong>Worked example · The dung beetle and the sphex wasp</strong></p>
<p>Both insects run fixed, non-learning routines. The dung beetle will pantomime plugging its nest even after its dung ball is snatched away. The sphex wasp, if its caterpillar is nudged a few inches during its "check the burrow" step, restarts the drag-and-check loop dozens of times in a row. These are agents with rich behaviour but <strong>zero autonomy</strong>: when reality violates the evolved assumption, they fail without noticing. They are the cautionary tale for why rational agents must learn.</p>
</div>

<div class="callout callout-checkpoint">
<p><strong>An agent looks both ways, then crosses — and is hit by a freak meteorite. Was it irrational?</strong></p>
<p>No. Rationality is about maximising expected performance given the percept sequence, not guaranteeing a good outcome. The agent gathered the relevant information and made the choice with the highest expected value. A bad outcome from an unforeseeable event does not make the decision irrational; that would require omniscience.</p>
</div>

---

# Task environments — the problems agents solve

An environment is the "problem"; a rational agent is the "solution". Before designing any agent, you specify the task environment as fully as possible. The checklist is **PEAS**.

<div class="callout callout-definition">
<p><strong>Definition · PEAS</strong></p>
<p><strong>P</strong>erformance measure · <strong>E</strong>nvironment · <strong>A</strong>ctuators · <strong>S</strong>ensors. Specifying all four is always the first step in agent design.</p>
</div>

### Worked example: PEAS for an automated taxi

| P | E | A | S |
|---|---|---|---|
| Safe, fast, legal, comfortable trip; max profit; minimum impact on others | Roads, traffic, pedestrians, policy, customers, weather | Steering, accelerator, brake, signal, horn, display, speech | Cameras, radar/lidar, speedometer, engine sensors, mics, touchscreen |

Note the performance measures already conflict — speed vs. safety vs. comfort vs. profit — foreshadowing why we will need *utility* functions later in this course.

---

# The seven dimensions of an environment

Every task environment can be classified along seven axes. This is one of the most heavily examined parts of the chapter. You should be able to classify a novel environment on the spot and explain why each property makes the agent's job harder or easier.

| Dimension | The poles | Why it matters for design |
|---|---|---|
| **Observability** | Fully / Partially / Unobservable | If fully observable, the agent needs no internal memory of the world. Partial observability (noisy or incomplete sensors) forces the agent to maintain internal state. |
| **Agents** | Single / Multi (competitive or cooperative) | Other goal-driven entities change everything: in competitive settings, randomised behaviour can be rational (unpredictability); cooperation invites communication. |
| **Determinism** | Deterministic / Nondeterministic | If the next state is fixed by current state + action, the agent need not worry about surprises. Most real, complex environments must be treated as nondeterministic. |
| **Episodes** | Episodic / Sequential | Episodic: each decision is self-contained (e.g. spotting defective parts). Sequential: now affects later (chess, driving) — the agent must think ahead. |
| **Dynamism** | Static / Dynamic / Semidynamic | A *dynamic* world changes while you deliberate, so dithering is itself a choice. *Semidynamic*: the world is fixed but your score is not (chess with a clock). |
| **Continuity** | Discrete / Continuous | Applies to states, time, percepts, and actions. Chess is discrete; driving sweeps through continuous positions, speeds, and steering angles. |
| **Knowledge** | Known / Unknown | About the agent's grasp of the "laws of physics" of the world, not the world's observability. Unknown → the agent must learn how the world works. |

<div class="callout callout-warning">
<p><strong>Pitfall · Three classic mix-ups</strong></p>
<p><strong>Known ≠ fully observable.</strong> Solitaire is known (you know the rules) but partially observable (face-down cards). A new video game can be <em>unknown</em> (you do not know what the buttons do) yet fully observable (the whole screen is visible).</p>
<p><strong>Stochastic ≠ nondeterministic.</strong> Stochastic = possibilities come with explicit probabilities ("25% chance of rain"). Nondeterministic = possibilities are merely listed, unquantified ("might rain").</p>
<p><strong>Partial observability can masquerade as nondeterminism.</strong> A deterministic world you cannot fully see looks unpredictable from the agent's perspective.</p>
</div>

<div class="callout callout-insight">
<p><strong>Key insight · The hardest environment is the real one</strong></p>
<p>The "easy" end of every axis is: fully observable, single-agent, deterministic, episodic, static, discrete, known. The real world sits at the <em>hard</em> end of all seven at once — partially observable, multi-agent, nondeterministic, sequential, dynamic, continuous, unknown. That is exactly why the next chapter deliberately restricts itself to the easy end first, then later chapters relax the constraints one by one.</p>
</div>

<div class="callout callout-checkpoint">
<p><strong>Classify chess (with a clock) on all seven dimensions.</strong></p>
<p>Fully observable · multi-agent (competitive) · deterministic · sequential · <strong>semidynamic</strong> (board is static, but the clock changes your score) · discrete · known. Contrast with taxi driving: partially observable, multi-agent, nondeterministic, sequential, dynamic, continuous, and arguably unknown.</p>
</div>

---

# The structure of agents — five designs

All agents share the shape **agent = architecture + programme**, where the programme maps percepts to actions. The interesting question is *how* the programme decides. The five designs form a ladder of increasing sophistication — each fixes a limitation of the one below it.

<figure>
<svg viewBox="0 0 620 330" role="img" aria-label="The ladder of five agent types" xmlns="http://www.w3.org/2000/svg">
  <title>The ladder of five agent designs from simple reflex to learning</title>
  <rect x="40" y="270" width="540" height="46" rx="8" fill="#e6f1f1" stroke="#0e7c86"/>
  <text x="58" y="298" font-family="sans-serif" font-size="13.5" font-weight="700" fill="#16202b">1 · Simple reflex</text>
  <text x="282" y="298" font-family="sans-serif" font-size="11.5" fill="#444">acts on the <tspan font-style="italic">current percept</tspan> only — condition–action rules</text>
  <rect x="70" y="216" width="510" height="46" rx="8" fill="#eaf1ea" stroke="#3f7a4d"/>
  <text x="88" y="244" font-family="sans-serif" font-size="13.5" font-weight="700" fill="#16202b">2 · Model-based reflex</text>
  <text x="346" y="244" font-family="sans-serif" font-size="11.5" fill="#444">+ internal <tspan font-style="italic">state</tspan> to handle partial observability</text>
  <rect x="100" y="162" width="480" height="46" rx="8" fill="#f8efe0" stroke="#a9701a"/>
  <text x="118" y="190" font-family="sans-serif" font-size="13.5" font-weight="700" fill="#16202b">3 · Goal-based</text>
  <text x="290" y="190" font-family="sans-serif" font-size="11.5" fill="#444">+ <tspan font-style="italic">goals</tspan>; considers the future (search and planning)</text>
  <rect x="130" y="108" width="450" height="46" rx="8" fill="#ece9f5" stroke="#5d4f9e"/>
  <text x="148" y="136" font-family="sans-serif" font-size="13.5" font-weight="700" fill="#16202b">4 · Utility-based</text>
  <text x="390" y="136" font-family="sans-serif" font-size="11.5" fill="#444">+ <tspan font-style="italic">utility</tspan>; maximise expected utility</text>
  <rect x="160" y="54" width="420" height="46" rx="8" fill="#16202b"/>
  <text x="178" y="82" font-family="sans-serif" font-size="13.5" font-weight="700" fill="#ffffff">5 · Learning</text>
  <text x="350" y="82" font-family="monospace" font-size="11.5" fill="#9fd0d4">improves any of the above</text>
  <text x="30" y="40" font-family="monospace" font-size="11.5" fill="#5a6b78">more capable ↑</text>
</svg>
<figcaption>Each rung adds one capability the rung below lacks. Any of the five can <em>also</em> be made into a learning agent — learning is orthogonal, sitting on top.</figcaption>
</figure>

## 1 · Simple reflex agents

Decide using only the *current percept*, via **condition-action rules** ("if front car is braking, then brake"). Fast and simple — but blind to history. In a partially observable world they fail badly: a vacuum that senses only its current square cannot reason about the other one. Randomising actions can rescue a stuck simple reflex agent in some cases (e.g. to escape an infinite loop).

## 2 · Model-based reflex agents

The fix for partial observability: keep an **internal state** that tracks the unobserved parts of the world. Maintaining it requires two pieces of knowledge:

<div class="callout callout-definition">
<p><strong>Transition model</strong></p>
<p>How the world evolves — both the effects of the agent's own actions and how the world changes on its own.</p>
</div>

<div class="callout callout-definition">
<p><strong>Sensor model</strong></p>
<p>How the actual world state shows up in the agent's percepts.</p>
</div>

Together they let the agent maintain a *best guess* of "what the world is like now", even when sensors cannot see everything (e.g. tracking cars hidden behind a truck).

## 3 · Goal-based agents

Knowing the current state is not enough to act — at a junction the right turn depends on where you are going. A **goal** describes desirable states; the agent combines its model with the goal to choose actions that achieve it. This requires considering the future ("what happens if I do A, and will that satisfy my goal?"), which is the job of **search** and **planning**.

<div class="callout callout-insight">
<p><strong>Connection · Why goal-based beats reflex despite being slower</strong></p>
<p>A reflex agent brakes at brake-lights because the rule says so — it has no idea why. A goal-based agent brakes because it predicts that doing so prevents a collision. The knowledge is now <strong>explicit and modifiable</strong>: change the destination and behaviour adapts automatically, whereas a reflex agent's rules would all have to be rewritten. This explicitness is the bridge into the next chapter.</p>
</div>

## 4 · Utility-based agents

Goals give only a binary happy/unhappy verdict. But many action sequences reach the goal — some faster, safer, cheaper. A **utility function** assigns a real-valued "how desirable" score to states, an internalisation of the performance measure. A rational utility-based agent chooses the action maximising **expected utility** (the utility averaged over possible outcomes, weighted by their probabilities).

Utility earns its place in exactly two situations goals cannot handle:

- **Conflicting goals** (speed vs. safety) — the utility function encodes the right trade-off.
- **Uncertain achievement** — utility weighs the *likelihood* of success against the importance of each goal.

<div class="callout callout-example">
<p><strong>Key insight · The deep theorem behind utility</strong></p>
<p><strong>Decision theory</strong> shows that any rational agent must behave <strong>as if</strong> it possesses a utility function it is maximising in expectation. Utility is not just one design choice among many — it is a constraint that falls out of rationality itself. A useful side-benefit: an explicit utility function lets one general algorithm make rational decisions regardless of the specific utilities involved.</p>
</div>

## 5 · Learning agents — the four components

Turing argued it would be easier to build a learning machine and teach it than to program intelligence by hand. Any of the four designs above can be wrapped as a learning agent. A learning agent has four conceptual parts:

<figure>
<svg viewBox="0 0 620 250" role="img" aria-label="The four components of a learning agent" xmlns="http://www.w3.org/2000/svg">
  <title>The four components of a learning agent</title>
  <defs>
    <marker id="la" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#0e7c86"/></marker>
    <marker id="la2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#a9701a"/></marker>
  </defs>
  <rect x="40" y="40" width="540" height="170" rx="14" fill="#fbfaf6" stroke="#d2cdbf"/>
  <rect x="330" y="70" width="220" height="50" rx="8" fill="#e6f1f1" stroke="#0e7c86"/>
  <text x="440" y="92" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#16202b">Performance element</text>
  <text x="440" y="109" text-anchor="middle" font-family="sans-serif" font-size="10.5" fill="#5a6b78">picks actions (= the whole agent before)</text>
  <rect x="70" y="70" width="220" height="50" rx="8" fill="#16202b"/>
  <text x="180" y="92" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#fff">Learning element</text>
  <text x="180" y="109" text-anchor="middle" font-family="sans-serif" font-size="11.5" fill="#9fd0d4">makes improvements</text>
  <rect x="70" y="140" width="220" height="46" rx="8" fill="#f8efe0" stroke="#a9701a"/>
  <text x="180" y="161" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#16202b">Critic</text>
  <text x="180" y="177" text-anchor="middle" font-family="sans-serif" font-size="11.5" fill="#5a6b78">scores against a fixed standard</text>
  <rect x="330" y="140" width="220" height="46" rx="8" fill="#ece9f5" stroke="#5d4f9e"/>
  <text x="440" y="161" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#16202b">Problem generator</text>
  <text x="440" y="177" text-anchor="middle" font-family="sans-serif" font-size="11.5" fill="#5a6b78">suggests exploratory actions</text>
  <path d="M290 95 H330" stroke="#0e7c86" stroke-width="2" fill="none" marker-end="url(#la)"/>
  <path d="M180 140 V124" stroke="#a9701a" stroke-width="2" fill="none" marker-end="url(#la2)"/>
  <text x="200" y="135" font-family="sans-serif" font-size="10" fill="#a9701a">feedback</text>
</svg>
<figcaption>The learning agent. The <em>performance element</em> is everything we previously called "the agent." The <em>learning element</em> improves it, guided by the <em>critic</em>; the <em>problem generator</em> pushes it to explore.</figcaption>
</figure>

| Component | Role |
|---|---|
| **Performance element** | Selects external actions. This is the entire agent from the earlier designs. |
| **Learning element** | Responsible for improvements; modifies the performance element using feedback from the critic. |
| **Critic** | Tells the learning element how well the agent is doing against a *fixed* performance standard. |
| **Problem generator** | Suggests exploratory, possibly suboptimal actions that lead to informative experiences. |

<div class="callout callout-warning">
<p><strong>Pitfall · Why the critic's standard must be fixed and external</strong></p>
<p>The performance standard must sit outside the agent and stay fixed — otherwise the agent could "learn" how to lower the bar to match its own behaviour and declare victory. A percept alone cannot tell the agent it is succeeding (a chess programme sees "checkmate delivered" but needs the external standard to know that is good). The problem generator is what stops a purely greedy agent from never exploring — it is the scientist running an experiment that may not pay off immediately (Galileo dropping rocks to improve his theory, not to break rocks).</p>
</div>

## How components represent the world: atomic, factored, and structured

Cutting across all designs is how a state is represented. Richer representations express more but cost more to compute with.

| Representation | A state is… | Example and where used |
|---|---|---|
| **Atomic** | a single indivisible black box with no internal structure | "currently in Arad". Used by the search and game-playing algorithms of the next few chapters. |
| **Factored** | a set of attribute-value pairs (variables) | GPS = …, fuel = …, speed = … Used in CSPs, Bayesian networks, planning, ML. |
| **Structured** | objects and the relationships between them | "the cow is in the truck, which is to the left of the barn". Used in databases, first-order logic, NLP. |

---

## What we have established

- **Agent** = sensors + actuators; behaviour = **agent function** (abstract map) realised by an **agent programme** (code on an architecture).
- **Rational** = for every percept sequence, pick the action maximising *expected* performance, given prior knowledge. Rational ≠ omniscient. Rationality *requires* information-gathering, learning, and autonomy.
- Specify any task with **PEAS**; classify it on the **seven dimensions**. The real world is the hard pole of all seven.
- Five agent designs: **simple reflex → model-based → goal-based → utility-based → learning**, each fixing the last one's limitation.
- Learning agent = **performance element + learning element + critic + problem generator** (with a fixed external standard).
- States are **atomic** (Ch. 3), **factored**, or **structured** — expressiveness versus cost.

---

*Next in this series: Chapter 3 — Solving Problems by Searching. We give the agent a goal and a model of the world, then ask: how does it find a sequence of actions to reach that goal?*
