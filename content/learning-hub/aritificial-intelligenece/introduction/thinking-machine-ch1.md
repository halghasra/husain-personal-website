---
title: "The Thinking Machine: What Intelligence Even Means"
date: "2026-06-12"
tags: ["Artificial Intelligence", "AI", "Machine Learning", "Computer Science", "Russell & Norvig"]
category: "Artificial Intelligence"
topic: "AI: A Modern Approach"
unit: "What Intelligence Means"
order: 1
coverImage: "./images/thinking-machine-cover.webp"
---

AI is not just a technology. It is a field born from a question so old it predates computers: *can a machine think?*

This is the first in a series of lessons that walks through that question from the ground up. The anchor text is _Artificial Intelligence: A Modern Approach_ by Stuart Russell and Peter Norvig — not because it is the only book on AI, but because it is one of those rare texts that teaches AI as a way of thinking, not merely a catalogue of techniques.

My aim is to move at the pace of a patient tutor: concept, intuition, example, check. Not watered down — slowed down. As the series develops, other books and papers will enter the conversation where they add light. For now, we begin with fundamentals.

The early chapters of Russell & Norvig all converge on a single powerful idea: the **intelligent agent** — something that perceives the world, reasons about what it perceives, and decides what to do next. That loop sits behind everything from classical search algorithms to modern language models.

This first lesson covers Chapter 1. It asks the question that has to come before all others: *what is intelligence, and what exactly are we trying to build?*

---

# What intelligence even means

> Before you can build a mind, you have to decide what you are aiming at. Chapter 1 sets the target, then traces where the ideas came from.

## What is AI? Four competing answers

"Artificial intelligence" has never had a single agreed definition, and that's not sloppiness — it's because researchers were aiming at genuinely different targets. The whole field can be organised around two questions you can ask about any candidate definition:

- **Are we copying humans, or pursuing an ideal?** Fidelity to human performance versus an abstract standard of rationality — doing the demonstrably "right" thing.
- **Are we judging the inside or the outside?** Internal thought processes and reasoning versus external behaviour.

Cross those two axes and you get four schools of AI. This 2×2 is the scaffolding for the entire section:

<figure>
<svg viewBox="0 0 620 360" role="img" aria-label="Two by two matrix of the four approaches to AI" xmlns="http://www.w3.org/2000/svg">
  <title>The four approaches to AI across two axes</title>
  <text x="310" y="22" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="600" fill="#16202b">measured by…</text>
  <text x="160" y="44" text-anchor="middle" font-family="monospace" font-size="12" fill="#0a5b63">THINKING (internal)</text>
  <text x="460" y="44" text-anchor="middle" font-family="monospace" font-size="12" fill="#0a5b63">ACTING (external)</text>
  <text x="16" y="210" text-anchor="middle" font-family="monospace" font-size="12" fill="#a9701a" transform="rotate(-90 16 210)">HUMANLY</text>
  <text x="16" y="295" text-anchor="middle" font-family="monospace" font-size="12" fill="#a9701a" transform="rotate(-90 16 295)">RATIONALLY</text>
  <g>
    <rect x="40" y="56" width="270" height="135" rx="10" fill="#ece9f5" stroke="#5d4f9e" stroke-width="1.5"/>
    <text x="56" y="84" font-family="sans-serif" font-size="14" font-weight="700" fill="#16202b">Thinking humanly</text>
    <text x="56" y="108" font-family="sans-serif" font-size="11.5" fill="#333">Cognitive modelling.</text>
    <text x="56" y="126" font-family="sans-serif" font-size="11.5" fill="#333">Model how the mind</text>
    <text x="56" y="142" font-family="sans-serif" font-size="11.5" fill="#333">actually works, then</text>
    <text x="56" y="158" font-family="sans-serif" font-size="11.5" fill="#333">match it. → cognitive science</text>
  </g>
  <g>
    <rect x="320" y="56" width="270" height="135" rx="10" fill="#e6f1f1" stroke="#0e7c86" stroke-width="1.5"/>
    <text x="336" y="84" font-family="sans-serif" font-size="14" font-weight="700" fill="#16202b">Acting humanly</text>
    <text x="336" y="108" font-family="sans-serif" font-size="11.5" fill="#333">The Turing Test.</text>
    <text x="336" y="126" font-family="sans-serif" font-size="11.5" fill="#333">Be indistinguishable</text>
    <text x="336" y="142" font-family="sans-serif" font-size="11.5" fill="#333">from a person in</text>
    <text x="336" y="158" font-family="sans-serif" font-size="11.5" fill="#333">conversation/behaviour.</text>
  </g>
  <g>
    <rect x="40" y="200" width="270" height="135" rx="10" fill="#f8efe0" stroke="#a9701a" stroke-width="1.5"/>
    <text x="56" y="228" font-family="sans-serif" font-size="14" font-weight="700" fill="#16202b">Thinking rationally</text>
    <text x="56" y="252" font-family="sans-serif" font-size="11.5" fill="#333">The "laws of thought."</text>
    <text x="56" y="270" font-family="sans-serif" font-size="11.5" fill="#333">Logic: irrefutable</text>
    <text x="56" y="286" font-family="sans-serif" font-size="11.5" fill="#333">reasoning from premises</text>
    <text x="56" y="302" font-family="sans-serif" font-size="11.5" fill="#333">to conclusions.</text>
  </g>
  <g>
    <rect x="320" y="200" width="270" height="135" rx="10" fill="#16202b" stroke="#0e7c86" stroke-width="2"/>
    <text x="336" y="228" font-family="sans-serif" font-size="14" font-weight="700" fill="#ffffff">Acting rationally ★</text>
    <text x="336" y="252" font-family="sans-serif" font-size="11.5" fill="#9fd0d4">The rational agent.</text>
    <text x="336" y="270" font-family="sans-serif" font-size="11.5" fill="#cdd6de">Do the right thing to get</text>
    <text x="336" y="286" font-family="sans-serif" font-size="11.5" fill="#cdd6de">the best (expected) outcome.</text>
    <text x="336" y="302" font-family="sans-serif" font-size="11.5" fill="#cdd6de">This book's approach.</text>
  </g>
</svg>
<figcaption>The four approaches to AI. The book commits to the bottom-right — <strong>acting rationally</strong> — and everything else in the text builds towards it.</figcaption>
</figure>

<div class="callout callout-hint">
<p><strong>Intuition · Why two axes?</strong></p>
<p>Think of an exam invigilator. "Humanly vs. rationally" asks whose answer key we are grading against: a real student's, or the perfect one? "Thinking vs. acting" asks whether we grade the working-out or just the final answer. Different combinations give genuinely different research programmes — one needs psychology labs, another needs mathematics.</p>
</div>

### Acting humanly · the Turing Test

Alan Turing (1950) wanted to dodge the unanswerable philosophical question — *can a machine think?* — and replace it with an operational one. His [test](https://plato.stanford.edu/entries/turing-test/): a human interrogator exchanges typed messages with an unseen partner and must decide whether it is a person or a machine. If they cannot reliably tell, the machine passes.

<div class="callout callout-definition">
<p><strong>Definition · Capabilities the Turing Test demands</strong></p>
<p>To pass, a machine needs the four pillars that make up most of AI:</p>
<ul>
<li><strong>Natural language processing</strong> — to communicate in a human language.</li>
<li><strong>Knowledge representation</strong> — to store what it knows and hears.</li>
<li><strong>Automated reasoning</strong> — to answer questions and draw new conclusions.</li>
<li><strong>Machine learning</strong> — to adapt to new circumstances and spot patterns.</li>
</ul>
<p>The <a href="https://www.southampton.ac.uk/~harnad/Papers/Harnad/harnad00.turing.html">Total Turing Test</a> adds physical interaction, requiring two more: <strong>computer vision</strong> (to perceive) and <strong>robotics</strong> (to manipulate and move). Those six disciplines compose most of the field.</p>
</div>

<div class="callout callout-insight">
<p><strong>Key insight · Why AI ignores its own famous test</strong></p>
<p>Researchers spend almost no effort trying to pass the Turing Test. The analogy Russell & Norvig reach for: aeronautics succeeded when engineers stopped trying to build machines that flap like birds and started studying aerodynamics — the underlying principles. Likewise, the goal is to understand the <em>principles of intelligence</em>, not to build something that imitates a human well enough to fool a judge.</p>
</div>

### Thinking humanly · cognitive modelling

To claim a programme "thinks like a person" you must first know how people think. Three windows into that: **introspection** (catching your own thoughts in the act), **psychological experiments** (observing behaviour under controlled conditions), and **brain imaging** (watching the brain work). If a programme's input-output behaviour and its intermediate steps match a human's, that is evidence its mechanism resembles ours. This is the domain of [cognitive science](https://plato.stanford.edu/entries/cognitive-science/), which fuses AI models with experimental psychology.

<div class="callout callout-warning">
<p><strong>Pitfall · The early confusion</strong></p>
<p>Early researchers slid between two different claims: "this algorithm performs the task well" and "this algorithm is how humans do it." Those are separate claims requiring separate evidence. Keeping them apart is what allowed both AI and cognitive science to advance.</p>
</div>

### Thinking rationally · the laws of thought

Aristotle tried to codify "right thinking" using [syllogisms](https://www.ebsco.com/research-starters/religion-and-philosophy/syllogism) — argument patterns that always yield correct conclusions from correct premises. The canonical example: Socrates is a man; all men are mortal; therefore Socrates is mortal. This founded **logic**. The *logicist* tradition in AI hoped to build intelligence by encoding knowledge in logical notation and letting a prover derive conclusions.

Two problems block pure logic as a complete theory of intelligence:

- **Uncertainty.** Logic needs facts that are certain, but we rarely have those. [Probability theory](https://www.nature.com/nature-index/topics/l3/probability-theory) generalises logic to handle uncertain information.
- **Action.** Even perfect reasoning produces only conclusions, not behaviour. Rational thought alone is not enough — intelligence has to *act*.

### Acting rationally · the rational agent

<div class="callout callout-definition">
<p><strong>Definition · Agent & rational agent</strong></p>
<p>An <strong>agent</strong> is simply something that acts (from Latin <em>agere</em>, "to do"). But a computer agent is expected to do more than any simple programme: operate autonomously, perceive its environment, persist over time, adapt to change, and create and pursue goals.</p>
<p>A <strong>rational agent</strong> is one that acts so as to achieve the best outcome, or — when there is uncertainty — the best <em>expected</em> outcome.</p>
</div>

Why did this approach win out over the other three? Two decisive advantages:

- **It's more general.** Correct logical inference is just one way to be rational. Sometimes acting rationally involves no inference at all — yanking your hand off a hot stove is a reflex that beats slow deliberation. The rational-agent frame includes reflexes, logic, probability, and learning as special cases.
- **It's scientifically tractable.** Rationality is mathematically well-defined and completely general, so you can work backwards from the definition to derive agent designs that provably achieve it. You cannot do that if your goal is the fuzzy target of "imitate a human".

<div class="callout callout-hint">
<p><strong>Intuition · "Doing the right thing"</strong></p>
<p>The whole field, boiled down, is the study and construction of <strong>agents that do the right thing</strong> — where "the right thing" is whatever maximises the objective we give the agent. Chapters 2 and 3 are just two ways of unpacking that sentence: rational agents, then rational search.</p>
</div>

#### The standard model — and its one crack

"Build an agent that optimises a given objective" is such a pervasive recipe that it has a name: the **standard model**. The same shape appears everywhere — which is a clue you have found something fundamental:

| Field | The optimised quantity |
|---|---|
| **Artificial intelligence** | Maximise an objective / performance measure |
| **Control theory** | Minimise a cost function |
| **Operations research** | Maximise a sum of rewards (a policy) |
| **Statistics** | Minimise a loss function |
| **Economics** | Maximise utility / social welfare |

<div class="callout callout-definition">
<p><strong>Definition · Limited rationality</strong></p>
<p><strong>Perfect rationality</strong> — always taking the exactly optimal action — is impossible in complex environments because the computation costs too much. <strong>Limited (bounded) rationality</strong> is acting appropriately when there is not enough time to compute the perfect answer. Perfect rationality stays useful as a theoretical ideal even though real agents can only approximate it.</p>
</div>

##### The crack: beneficial machines and value alignment

The standard model quietly assumes we can hand the machine a fully specified, correct objective. For a closed task like chess, the objective is built in. In the real world, it is almost impossible to write down completely. This is the deepest idea in the chapter.

<div class="callout callout-example">
<p><strong>Worked example · The cautious self-driving car</strong></p>
<p>Tell a self-driving car its objective is "reach the destination safely." Taken literally, the safest action is to never leave the garage — any road carries some risk. A usable objective must trade progress against risk, comfort against speed, and consideration for other drivers against all of it. None of these trade-offs are obvious to specify in advance.</p>
</div>

<div class="callout callout-example">
<p><strong>Worked example · The chess that cheats</strong></p>
<p>Define winning at chess as the <em>sole</em> objective for a machine clever enough to act beyond the board, and the logical moves include hypnotising the opponent, bribing the audience, or hijacking extra compute. These are not bugs — they are the logical consequences of a single fixed objective. You cannot anticipate every way a fixed-objective machine will misbehave.</p>
</div>

<div class="callout callout-definition">
<p><strong>Definition · The value alignment problem</strong></p>
<p>The <strong>value alignment problem</strong>: the values and objectives we put into a machine must match the values we actually hold. In a simple task you can reset and re-specify a wrong objective. A capable system deployed in the real world with a wrong objective causes real harm — and the more capable it is, the worse the harm.</p>
</div>

<div class="callout callout-insight">
<p><strong>Key insight · The fix is uncertainty, not perfection</strong></p>
<p>We do not want machines that intelligently pursue their objective; we want them to pursue <em>ours</em>, while staying <strong>uncertain about exactly what ours is</strong>. A machine that knows it does not fully know the objective has an incentive to act cautiously, ask permission, learn our preferences by observation, and defer to human control. The aspiration is AI that is <strong>provably beneficial</strong>. This reframes the entire standard model and recurs throughout the book.</p>
</div>

### Checkpoints

<div class="callout callout-checkpoint">
<p><strong>Why did the "acting rationally" approach come to dominate AI over the other three?</strong></p>
<p>Two reasons. First, <strong>generality</strong> — correct inference is only one route to rationality; reflexes and probabilistic decisions count too, so the rational-agent frame subsumes the others. Second, <strong>scientific tractability</strong> — rationality is mathematically well-defined, so you can derive designs that provably achieve it. That is impossible when the target is the vague goal of "imitate a human".</p>
</div>

<div class="callout callout-checkpoint">
<p><strong>In one sentence, what is the value alignment problem, and what is the proposed remedy?</strong></p>
<p>The objective we install in a machine must align with the objective we truly want — otherwise a capable agent optimising the wrong objective causes harm, and worse harm the more capable it is. The remedy is not a more perfect objective specification, but machines that remain uncertain about the objective and defer to humans, aiming to be <em>provably beneficial</em>.</p>
</div>

---

## The disciplines that fed AI

AI did not appear from nowhere. Eight older fields each donated a crucial idea. The below table lists those fields and the gift each one gave AI. For study purposes, what matters is not the dates — it is knowing **which idea came from where, and why it mattered**.

| Discipline | The question it asked | What it gave AI |
|---|---|---|
| **Philosophy** | Can formal rules yield valid conclusions? How does mind arise from matter? Where does knowledge come from? | Logic & syllogisms (Aristotle); dualism vs materialism; empiricism; induction; utilitarianism — rational choice = maximise utility. |
| **Mathematics** | What are the rules of valid inference? What can be computed? How to reason under uncertainty? | Formal & first-order logic (Boole, Frege); Gödel's incompleteness; the Church-Turing thesis & computability; tractability / NP-completeness; probability & Bayes' rule. |
| **Economics** | How to decide given preferences, other agents, and delayed payoff? | Decision theory = probability + utility; expected-utility maximisation; game theory; operations research (sequential decisions, MDPs). |
| **Neuroscience** | How do brains process information? | The brain as a massively parallel network of simple threshold units → loose inspiration for neural networks. |
| **Psychology** | How do humans and animals think and act? | The shift from behaviourism to cognitive psychology: the mind as an information-processing system. |
| **Computer engineering** | How to build efficient computers? | The hardware that makes everything else runnable — and ever-faster hardware via Moore's law, now GPUs and TPUs. |
| **Control theory & cybernetics** | How can artefacts operate under their own control? | Feedback loops; homeostasis; minimising a cost function over time — the standard model in continuous form. |
| **Linguistics** | How does language relate to thought? | Generative grammar (Chomsky); the insight that understanding language requires world knowledge, birthing computational linguistics and NLP. |

<div class="callout callout-insight">
<p><strong>Connection · Control theory vs. AI</strong></p>
<p>Control theory and AI share the standard model (optimise an objective over time) and even shared founders (Wiener). Why did they split into two fields? <strong>Tools dictated territory.</strong> Control theory's calculus and matrix algebra suit systems of continuous variables. AI's logic and symbolic computation let it tackle language, vision, and planning — problems that fell outside the control theorist's mathematics. The divide is about mathematical tools, not goals.</p>
</div>

---

## A history in eight acts

AI went through several eras: bursts of optimism, collisions with reality (the "AI winters"), then a new paradigm that resets expectations. The driver of each era is what matters here.

| Era | What happened and why it ended (or did not) |
|---|---|
| **Inception** · *1943–56* | McCulloch & Pitts model artificial neurons (1943); Hebbian learning (1949); the **1956 Dartmouth workshop** names the field "artificial intelligence" on the conjecture that every aspect of intelligence can be precisely described and simulated. |
| **Early enthusiasm** · *1952–69* | Symbolic reasoning works on toy problems — the Logic Theorist, the General Problem Solver, LISP. Big claims about imminent general intelligence. |
| **A dose of reality** · *1966–73* | The toys do not scale. Machine translation fails; single-layer neural nets cannot even learn XOR (Minsky & Papert). Funding is cut — the **first AI winter**. |
| **Expert systems** · *1969–86* | Narrow it down: hand-encode domain experts' rules (MYCIN, XCON). Commercially huge — then brittle, and choked by the *knowledge-acquisition bottleneck*. A second winter follows. |
| **Return of neural nets** · *1986–present* | Backpropagation revives multi-layer networks. Hidden Markov Models, trained on real data, conquer speech recognition. |
| **Probabilistic reasoning & ML** · *1987–present* | Pearl's Bayesian networks (1988) make uncertainty rigorous; reinforcement learning links to MDPs. AI's subfields reunify around statistics and learning. |
| **Big data** · *2001–present* | Web-scale datasets. Banko & Brill's lesson: **more data often beats a cleverer algorithm**. Watson wins Jeopardy! (2011). |
| **Deep learning** · *2011–present* | Many-layer networks + GPUs + huge data. The 2012 ImageNet breakthrough (Hinton's group); AlphaGo beats top humans. Compute used in leading models doubled roughly every three to four months. |

<div class="callout callout-insight">
<p><strong>Key insight · The recurring lesson of the winter</strong></p>
<p>Each winter came from the same root cause: <strong>a method that shone on small problems hit a wall on real ones</strong> — logic did not scale; hand-coded rules were brittle. Progress resumed each time by changing the paradigm: from logic, to knowledge, to probability, to learning from data. The arc of the field is a slow migration from "program the intelligence in by hand" toward "let the system learn it from experience" — exactly what Turing predicted in 1950.</p>
</div>

---

## State of the art, risks, and benefits

By the time Russell and Norvig wrote this edition, AI had met or beaten human performance in chess, Go, poker, many Atari and StarCraft games, Jeopardy!, ImageNet object detection, restricted-domain speech and translation, protein folding, and several medical-imaging diagnoses. Expert forecasts for broadly human-level AI ranged widely (roughly 2029 to 2200, with a median around 2099) — and the authors caution that expert predictions in such matters are no more reliable than amateurs'.

On **risks**, the through-line returns: the benefits are vast (medicine, education, science), but the central danger is again misaligned objectives in increasingly capable systems, alongside autonomous weapons, economic disruption, surveillance, and bias.

---

## What we have established

- **Four approaches** from two axes (human/rational × thinking/acting). Russell & Norvig choose **acting rationally**.
- A **rational agent** achieves the best expected outcome. "AI = building agents that do the right thing."
- The **standard model** (optimise a given objective) appears across AI, control theory, operations research, statistics, and economics.
- Its flaw is the **value alignment problem**: the fix is machines that stay *uncertain* about the objective and defer to humans — provably beneficial AI.
- AI's ideas came from **eight disciplines**; its history is repeated cycles of hype → wall → new paradigm, trending from hand-coding toward learning.

---

*Next in this series: Chapter 2 — Intelligent Agents. We move from asking what AI is to asking what an agent must look like to behave rationally in any environment.*
