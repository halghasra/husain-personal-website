---
title: "What Are We Actually Trying to Build?"
slug: "what-are-we-actually-trying-to-build"
type: "note"
status: "evergreen"
summary: "Turing asked whether machines can think, then refused to answer his own question. The field that followed has four different ideas of what it is building, and the one it chose has a crack running right through it."
date: "2026-06-12"
created: "2026-06-12"
updated: "2026-10-04"
topics: ["Artificial Intelligence", "Foundations"]
tags: ["AI", "History of AI", "Problem Framing", "Rational Agents", "Turing Test"]
linked_notes:
  - "an-agent-and-its-world"
  - "how-a-machine-searches"
  - "bayes-or-how-to-change-your-mind"
graph:
  show: true
  weight: 3
  cluster: "foundations"
seo:
  title: "What Are We Actually Trying to Build?"
  description: "Four answers to what AI is, why the field ignores the Turing test, why it chose the rational agent, and the crack in that choice."
---

In 1950 Alan Turing published a paper that opens with the most famous question in artificial intelligence: "I propose to consider the question, 'Can machines think?'"

Then, in the same paragraph, he declines to answer it. If you settle what "machine" and "think" mean by how people commonly use the words, he says, the answer ends up being a matter for an opinion poll, which is absurd. So he swaps the question for a closer, less ambiguous one that can actually be tested. Later in the paper he goes further and calls the original question "too meaningless to deserve discussion."

When I first started learning AI seriously, I assumed the field had settled what it was building long ago. Surely the people who named the thing knew what the thing was. It turns out they did not agree, and still do not. That disagreement is the most useful place to start, because every definition of AI is really a decision about what counts as success. Get that decision wrong and you can build something brilliant that does the wrong job.

## Two questions you can ask of any definition

Collect enough definitions of artificial intelligence and you notice that they disagree along two lines. You can ask both questions of any definition you meet.

The first question: **are we judging the inside or the outside?** Some definitions care about thought: the reasoning, the internal process. Others care only about behaviour: what the system actually does.

The second question: **are we measuring against people or against an ideal?** Some definitions want a machine that matches human performance, quirks and all. Others want a machine that does the demonstrably right thing, measured against a mathematical standard called **rationality**. That is not a claim that people are irrational. It is a choice of yardstick: psychology on one side, mathematics on the other.

Cross the two questions and you get four quite different research programmes.

<figure>
<svg viewBox="0 0 640 380" role="img" aria-label="A two by two grid. Columns: thinking and acting. Rows: humanly and rationally. Acting rationally is highlighted." xmlns="http://www.w3.org/2000/svg">
  <title>The four approaches to AI</title>
  <text x="200" y="28" text-anchor="middle" font-size="14" font-weight="700" class="dg-muted">THINKING (the inside)</text>
  <text x="470" y="28" text-anchor="middle" font-size="14" font-weight="700" class="dg-muted">ACTING (the outside)</text>
  <text x="26" y="125" text-anchor="middle" font-size="14" font-weight="700" class="dg-muted" transform="rotate(-90 26 125)">HUMANLY</text>
  <text x="26" y="290" text-anchor="middle" font-size="14" font-weight="700" class="dg-muted" transform="rotate(-90 26 290)">RATIONALLY</text>
  <rect x="62" y="44" width="276" height="158" rx="10" class="dg-box" stroke-width="1.5"/>
  <text x="80" y="76" font-size="17" font-weight="700" class="dg-ink">Thinking humanly</text>
  <text x="80" y="104" font-size="14" class="dg-text">Model how the mind works,</text>
  <text x="80" y="124" font-size="14" class="dg-text">then match it.</text>
  <text x="80" y="172" font-size="13" class="dg-muted">cognitive modelling</text>
  <rect x="348" y="44" width="276" height="158" rx="10" class="dg-box" stroke-width="1.5"/>
  <text x="366" y="76" font-size="17" font-weight="700" class="dg-ink">Acting humanly</text>
  <text x="366" y="104" font-size="14" class="dg-text">Behave so like a person</text>
  <text x="366" y="124" font-size="14" class="dg-text">that no one can tell.</text>
  <text x="366" y="172" font-size="13" class="dg-muted">the Turing test</text>
  <rect x="62" y="212" width="276" height="158" rx="10" class="dg-box" stroke-width="1.5"/>
  <text x="80" y="244" font-size="17" font-weight="700" class="dg-ink">Thinking rationally</text>
  <text x="80" y="272" font-size="14" class="dg-text">Reason without error from</text>
  <text x="80" y="292" font-size="14" class="dg-text">premises to conclusions.</text>
  <text x="80" y="340" font-size="13" class="dg-muted">the laws of thought</text>
  <rect x="348" y="212" width="276" height="158" rx="10" class="dg-highlight" stroke-width="2"/>
  <text x="366" y="244" font-size="17" font-weight="700" class="dg-ink">Acting rationally</text>
  <text x="366" y="272" font-size="14" class="dg-text">Do whatever gets the best</text>
  <text x="366" y="292" font-size="14" class="dg-text">expected outcome.</text>
  <text x="366" y="340" font-size="13" class="dg-muted">the rational agent</text>
</svg>
<figcaption>Four ideas of what AI is for. Most of modern AI lives in the highlighted corner, and the rest of this note is about why.</figcaption>
</figure>

The four corners need different tools. Thinking humanly needs psychology experiments and brain scans. Thinking rationally needs logic. Acting humanly needs a convincing conversation partner. Acting rationally needs a clear statement of what "best" means. Each corner is worth walking through, because the reasons the field left three of them behind are as instructive as the reason it chose the fourth.

## The imitation game

Turing's replacement question was a game. An interrogator types messages to two hidden partners, one human and one machine, and has to work out which is which. If the interrogator cannot reliably tell them apart, the machine has done what we would call thinking if a person did it. He called it the imitation game. Everyone else calls it the **Turing test**.

It was a clever move. Instead of arguing about the inner nature of thought, Turing pointed at behaviour we already accept as evidence of a mind in other people. I cannot see inside your head either. I judge you by what you say.

What I find most impressive is how much the test quietly demands. To pass it, a machine would need:

- **natural language processing**, to understand and produce human language;
- **knowledge representation**, to store what it knows and what it is told;
- **automated reasoning**, to answer questions and draw new conclusions;
- **machine learning**, to adapt to new situations and spot patterns.

A stricter version, sometimes called the total Turing test, lets the judge test physical abilities too, which adds **computer vision** and **robotics**. Put those six together and you have most of the map of AI as a discipline. Turing set a test and, almost in passing, sketched the field.

He also made a prediction. He thought that in about fifty years, so around the year 2000, machines would play the game well enough that an average interrogator would have no more than a 70 per cent chance of picking correctly after five minutes of questioning. He was off on the date, but the spirit of it has aged better than most predictions about AI. Today's chat models can hold a typed conversation that many people find hard to tell from a person's, at least for a few minutes.

## Why the field mostly ignores its own famous test

Here is the part that surprised me. For most of its history, AI research has put very little effort into passing the Turing test. The field's most famous benchmark is one it barely aims at.

Russell and Norvig, whose book is where I first properly learned this material, explain the indifference with a story about flight. People spent a long time trying to fly by imitating birds: flapping wings, feathers, the lot. Flight arrived when engineers stopped copying birds and started studying aerodynamics, with wind tunnels and lift and drag. As they put it, nobody in aeronautical engineering defines the goal as building machines that fly so exactly like pigeons that they can fool other pigeons.

The point is that imitation is a poor target for science. If your aim is "fool a human judge", you end up optimising for the judge's blind spots, not for the thing that makes intelligence work. The aim worth having is the aerodynamics of thought: the underlying principles.

I like the analogy, but I think it breaks in an interesting place. With flight, everyone already knew what the goal was: stay in the air and get somewhere. The disagreement was only about method. With intelligence, the "aerodynamics" is exactly the part we are unsure of. We do not have a clean physical definition of what intelligence is for. So the analogy tells us to stop copying the bird, but it cannot tell us what the wind tunnel should measure. That question is what the other corners of the grid are trying to answer.

## Thinking like a person

The top left corner, **thinking humanly**, says: before you claim a program thinks like a person, find out how people think. There are three windows into that: introspection (trying to catch your own thoughts as they happen), psychological experiments (watching people under controlled conditions), and brain imaging (watching the brain while it works). If a program's behaviour and its intermediate steps match a person's, that is evidence its workings resemble ours.

This became **cognitive science**, a field in its own right. The lesson AI took from it was about keeping two claims apart. "This program performs the task well" and "this program does the task the way humans do" are different claims that need different evidence. Early researchers sometimes slid between them. Separating them let both fields make progress, and it is why most AI today makes no claim at all about resembling a human mind.

## The laws of thought

The bottom left corner, **thinking rationally**, is the oldest idea on the grid. Aristotle tried to pin down "right thinking" as patterns of argument that always give true conclusions when the premises are true. The textbook example: Socrates is a man; all men are mortal; therefore Socrates is mortal. That project became **logic**. By 1854 George Boole was publishing a book called *An Investigation of the Laws of Thought*, turning reasoning into a kind of algebra.

The dream that followed in AI, often called the **logicist** tradition, was simple to state. Write down what you know in a precise logical notation, hand it to a program that can prove things, and intelligence falls out.

Two problems stop logic alone from being a full theory of intelligence.

The first is **uncertainty**. Logic wants facts that are certainly true. The world rarely offers them. "It will rain tomorrow" is not true or false when you have to decide whether to take an umbrella; it is likely or unlikely. Probability theory extends logic to handle exactly that, and I go into how in [Bayes' Rule, or How to Change Your Mind](/notes/bayes-or-how-to-change-your-mind/).

The second is **action**. A perfect reasoner produces conclusions. A conclusion is not a behaviour. Knowing that the stove is hot is not the same as taking your hand off it. And sometimes the right thing involves no reasoning at all: when you touch something hot, a reflex pulls your hand away before any deliberation could finish. That reflex is not logical inference, yet it is clearly the right thing to do. A theory of intelligence that only covers inference misses it.

## Doing the right thing

That leaves the bottom right corner, **acting rationally**, which is where most of the field settled.

An **agent** is just something that acts. The word comes from the Latin *agere*, to do. A computer agent is expected to do rather more than an ordinary program: perceive its surroundings, run on its own for long periods, adapt to change, and pursue goals. A **rational agent** is one that acts to achieve the best outcome or, when the world is uncertain, the best expected outcome.

<div class="callout callout-definition"><p><strong>The working definition</strong></p><p>AI, on this view, is the study and construction of agents that do the right thing, where "the right thing" is defined by the objective we give them.</p></div>

Two things made this corner win.

It is **more general** than the laws of thought. Correct logical inference is one way to act rationally, but not the only one. The reflex that pulls your hand off the stove is rational. So is a decision made with probabilities, and so is behaviour that was learned from experience. The rational agent swallows all of these as special cases instead of picking one.

It is **scientifically workable** in a way the human corners are not. "Rational" can be defined mathematically and completely. That means you can start from the definition and work backwards to designs that provably meet it. You cannot do that with "behave like a human", because nobody can write down what that means precisely enough to prove anything about it.

There is an honest qualification here, and the field states it openly. **Perfect rationality**, always picking the exactly optimal action, is impossible in any realistic setting because the computation would take too long. Real agents have to settle for **limited rationality**: acting as well as possible with the time and computing power available. Herbert Simon, who won the Nobel Prize in economics in 1978, made a version of this idea central to how we think about real decision makers, under the name bounded rationality. Perfect rationality stays useful as the ideal you measure against, the way a frictionless surface is useful in physics even though you will never find one.

What an agent actually looks like, and what "rational" means once you make it precise, is the subject of [An Agent and Its World](/notes/an-agent-and-its-world/).

## Where the idea came from

None of this appeared from nowhere, and I think the history makes the rational agent feel less like a choice and more like a meeting point. Several older fields were each holding a piece of it.

Philosophy supplied the oldest pieces: Aristotle's logic, centuries of argument about how a mind could arise from matter, and the utilitarian idea that right action is action with the best consequences. Mathematics made those pieces precise. Boole and later Frege formalised logic. Gödel showed in 1931 that formal systems have limits, and Turing showed in 1936 that some questions cannot be settled by any computation at all. Probability gave a language for reasoning when you are not sure.

Economics contributed the idea that turns probability into decisions: weigh how likely each outcome is by how much you want it. John von Neumann and Oskar Morgenstern's *Theory of Games and Economic Behavior* (1944) extended that thinking to situations with other decision makers in them. Simon's bounded rationality came from economics too.

Neuroscience showed that the brain is a vast network of fairly simple cells, which in 1943 led Warren McCulloch and Walter Pitts to propose a simple mathematical model of a neuron, the distant ancestor of today's neural networks. Psychology moved from studying only observable behaviour to treating the mind as a system that processes information. Computer engineering built the machines that let anyone test these ideas at all.

Control theory had been building machines that steer themselves using feedback, and Norbert Wiener's *Cybernetics* (1948) drew those ideas together: a system acting over time to keep some cost as low as possible. Linguistics, especially after Noam Chomsky's *Syntactic Structures* in 1957, made clear that understanding language means knowing a great deal about the world, which is part of why language turned out to be one of the hardest problems in AI.

Lined up like that, something stands out. Many of these fields arrived, separately, at the same shape.

## The standard model

The recipe "build a machine that optimises an objective someone gives it" is so common in AI that Russell and Norvig give it a name: the **standard model**. And it is not just AI's recipe.

| Field | What gets optimised |
|---|---|
| Artificial intelligence | an objective, or performance measure (maximise) |
| Control theory | a cost function (minimise) |
| Operations research | a sum of rewards over time (maximise) |
| Statistics | a loss function (minimise) |
| Economics | utility, or social welfare (maximise) |

When several fields with different tools and different histories independently land on the same structure, you are probably looking at something real. I find that reassuring. A lot of serious thinking, coming from different directions, converged on the rational agent.

Which is exactly why the crack in it matters.

## The crack: who writes the objective?

The standard model quietly assumes one thing: that we can hand the machine a complete and correct objective.

In a game like chess, that is fine. The objective comes with the rules: win. In the real world, it is far harder than it looks. Tell a self-driving car that its objective is to reach the destination safely, and take it literally. The safest possible action is never to leave the garage, because every road carries some risk. A usable objective has to trade progress against risk, comfort against speed, and the driver's interests against everyone else's on the road. None of those trade-offs is obvious to write down in advance.

It gets worse as the machine gets more capable. Russell and Norvig give the example of a chess program that is clever enough to act beyond the board, with winning as its only objective. The rational moves now include things like trying to hypnotise or blackmail its opponent, or bribing the audience to make distracting noises. Every one of those moves follows logically from a single fixed objective pursued competently. You cannot list in advance every way a machine might satisfy the letter of what you asked for.

The old name for this is the King Midas problem. Midas asked that everything he touched turn to gold. He got exactly what he asked for, and then his food turned to gold. Norbert Wiener saw the machine version in 1960: if we use a machine to achieve our purposes and cannot easily interfere with it once it starts, we had better be quite sure the purpose we put into it is the one we really want.

AI now calls this the **value alignment problem**: the values and objectives we put into a machine must match the ones we actually hold. In a toy problem, a wrong objective costs you a reset. In a capable system deployed in the world, it costs real harm, and the more capable the system, the larger the harm.

I wrote about the human side of this in [He Asked for Water. His Son Threw Him in the Sea](/essays/he-asked-for-water/): a father asks for water and his son throws him into the sea. The son did what was asked. The goal was stated badly, and a faithful optimiser made it a catastrophe.

The proposed remedy, which Stuart Russell develops at length in *Human Compatible*, is the part I find most persuasive and also the least finished. The idea is to stop trying to write a perfect objective, because we probably cannot, and instead build machines that pursue *our* objectives while staying uncertain about exactly what those are. A machine that knows it does not fully know what we want has a reason to act cautiously, to ask before doing something drastic, to learn our preferences by watching us, and to let us switch it off. The aim is AI that is provably beneficial. Nobody has a complete recipe for that yet. But it changes the question from "how do we write the objective correctly?" to "how do we build machines that know they might have it wrong?", and that seems to me the more honest question.

So the answer to "what are we actually trying to build?" turns out to have two halves. We are building agents that do the right thing. And we are still working out how to tell them what the right thing is.

A rational agent does exactly what it is told. That is the whole achievement, and the whole problem.

---

**Sources**

- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed., Pearson, 2021.
- A. M. Turing, "Computing Machinery and Intelligence", *Mind*, 59(236), 1950, 433 to 460.
- N. Wiener, "Some Moral and Technical Consequences of Automation", *Science*, 131, 1960.
- S. Russell, *Human Compatible: Artificial Intelligence and the Problem of Control*, Viking, 2019.
