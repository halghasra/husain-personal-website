---
title: "Data Is Not Information"
slug: "data-is-not-information"
type: "note"
status: "evergreen"
summary: "Two bytes can be a word, two different numbers, a pair of grey pixels or a Chinese character. None of those meanings is in the bytes. Where information actually lives, and why Shannon threw meaning out on purpose."
date: "2023-06-01"
created: "2023-06-01"
updated: "2026-10-04"
topics: ["Computer Science", "Information"]
tags: ["Data", "Information Theory", "Encoding", "Knowledge Representation", "Python"]
linked_notes:
  - "garbage-in"
  - "writing-knowledge-down"
  - "why-data-is-a-matrix"
graph:
  show: true
  weight: 2
  cluster: "foundations"
seo:
  title: "Data Is Not Information"
  description: "The same bits mean different things to different receivers. Shannon, encoding, messages, the DIKW pyramid and where meaning really lives."
---

When I first studied this, I wrote myself a lesson on the difference between data and information. It had a tidy example. The raw data was `120, 98, 78, 145`. The information, after processing, was this sentence: "The students' scores on the test were 120, 98, 78 and 145."

Reading it back years later, I winced. Nothing had been processed. I had taken four numbers and wrapped a sentence round them, and the sentence raised more questions than it answered. Scores out of what? Two of them are above 100, so they are not percentages. Is 78 a fail? Is 145 the top of the class or the bottom? If you were the teacher, you could act on my "information" no better than on the bare numbers.

What my old example showed, by accident, is the very thing the lesson was trying to teach. Information is not data with a label stuck on it. It is what happens when data meets a receiver who knows enough to do something with it. That sounds like a soft, almost philosophical claim. It turns out to be one of the hardest edged ideas in computing, and the man who gave it that edge did so by deliberately throwing meaning away.

## The same two bytes

Start with the smallest case I can think of. Here are two bytes, written in hexadecimal: `48 49`. That is sixteen bits, sixteen tiny switches each set on or off. On a disk, in memory or on a wire, that is all there is.

What do they mean? It depends entirely on who is reading. This short Python script hands the same two bytes to five different imaginary receivers:

```python
data = bytes([0x48, 0x49])

readings = {
    "as ASCII text": data.decode("ascii"),
    "as a big-endian number": int.from_bytes(data, "big"),
    "as a little-endian number": int.from_bytes(data, "little"),
    "as two grey pixels (0 to 255)": list(data),
    "as UTF-16 text": data.decode("utf-16-be"),
}

print("bytes:", data.hex(" "))
for receiver, meaning in readings.items():
    print(f"{receiver:>30}: {meaning}")
```

Running it gives:

```text
bytes: 48 49
                 as ASCII text: HI
        as a big-endian number: 18505
     as a little-endian number: 18760
 as two grey pixels (0 to 255): [72, 73]
                as UTF-16 text: 䡉
```

Same sixteen bits, five answers. A text editor that assumes ASCII shows you a greeting. A program expecting a 16-bit whole number, reading the most significant byte first, sees 18505. One that reads the least significant byte first, which is how the processors in most laptops and phones store numbers in memory, sees 18760. An image viewer treating them as greyscale pixels draws two dark grey dots you could not tell apart, 72 and 73 on a scale where 0 is black and 255 is white. A program expecting UTF-16 text sees a single character from the shared Chinese, Japanese and Korean block of Unicode.

None of these readings is wrong. None of them is in the bytes. And the obvious fix, labelling the data, does not escape the problem. A file extension, a header saying "this is text", a type tag in a database: each of those is more bytes, and something has to already know how to read them.

So here is the vocabulary I wish my old lesson had used. **Data** is a recorded pattern: symbols, numbers, bits, marks on a form. An **encoding** is the agreement that maps patterns to things. **Information** is what a receiver gets when it applies the right agreement and the result tells it something it did not already know. Take the agreement away and the pattern is still there, perfectly intact, saying nothing.

## Shannon's deliberate omission

In 1948 Claude Shannon, a mathematician and engineer at Bell Labs, published "A Mathematical Theory of Communication". It is one of those rare papers that more or less founded a field in one go, and the thing that struck me most when I read it was a decision he makes on the first page:

> "Frequently the messages have meaning; that is they refer to or are correlated according to some system with certain physical or conceptual entities. These semantic aspects of communication are irrelevant to the engineering problem. The significant aspect is that the actual message is one selected from a set of possible messages."

He sets meaning aside on purpose. The engineering problem, as he states it, is reproducing at one point a message selected at another. Whether the message is a love letter or a share price is not the telephone company's concern. What matters is that it is one choice out of a set of possibilities, and that both ends know what the set is.

That framing lets him measure information without ever asking what it means. If there are two equally likely options, like the result of a coin toss, learning which one happened gives you one unit of information. Shannon called the unit a **bit**, a word he credited to his colleague John Tukey. Every doubling of the options adds one more bit.

<div class="formula">information in one choice from N equally likely options = log₂ N bits</div>

A coin toss is log₂ 2, exactly 1 bit. One letter picked from 26 equally likely letters is log₂ 26, about 4.7 bits. One value picked from the 65,536 that two bytes can hold is exactly 16 bits.

The condition matters, and it sits right there in the formula: equally likely. When some options are more probable than others, the receiver is less surprised by the common ones, so they carry less information. English letters are a long way from equally likely. After a "q" you can nearly bet your house on a "u". In a 1951 paper, Shannon had people guess the next letter of a passage and used their success to estimate that, with plenty of context, printed English carries roughly one bit per letter, a fraction of the 4.7 the alphabet would allow.

Look at what has happened here. Even in the theory that threw meaning out, information is defined relative to the receiver: what it already knows, what it was expecting, which set of possibilities it is choosing among. Shannon measured information as a reduction in the receiver's uncertainty. The signal is only the vehicle.

<figure>
<svg viewBox="0 0 720 250" role="img" aria-label="Shannon's model of communication: an information source passes a message to a transmitter, which sends a signal through a channel affected by noise to a receiver and then a destination. The encoding agreement must exist at both ends; only symbols cross the channel.">
  <defs>
    <marker id="dini-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" class="dg-accent"/>
    </marker>
  </defs>
  <rect x="302" y="10" width="116" height="40" rx="6" class="dg-subtle" stroke-width="1"/>
  <text x="360" y="35" font-size="13" text-anchor="middle" class="dg-text">Noise source</text>
  <line x1="360" y1="50" x2="360" y2="76" class="dg-accent-stroke" stroke-width="2" marker-end="url(#dini-arrow)"/>
  <rect x="10" y="80" width="116" height="56" rx="6" class="dg-box" stroke-width="1"/>
  <text x="68" y="104" font-size="13" text-anchor="middle" class="dg-text">Information</text>
  <text x="68" y="121" font-size="13" text-anchor="middle" class="dg-text">source</text>
  <rect x="156" y="80" width="116" height="56" rx="6" class="dg-box" stroke-width="1"/>
  <text x="214" y="113" font-size="13" text-anchor="middle" class="dg-text">Transmitter</text>
  <rect x="302" y="80" width="116" height="56" rx="6" class="dg-subtle" stroke-width="1"/>
  <text x="360" y="113" font-size="13" text-anchor="middle" class="dg-text">Channel</text>
  <rect x="448" y="80" width="116" height="56" rx="6" class="dg-box" stroke-width="1"/>
  <text x="506" y="113" font-size="13" text-anchor="middle" class="dg-text">Receiver</text>
  <rect x="594" y="80" width="116" height="56" rx="6" class="dg-box" stroke-width="1"/>
  <text x="652" y="113" font-size="13" text-anchor="middle" class="dg-text">Destination</text>
  <line x1="126" y1="108" x2="152" y2="108" class="dg-accent-stroke" stroke-width="2" marker-end="url(#dini-arrow)"/>
  <line x1="272" y1="108" x2="298" y2="108" class="dg-accent-stroke" stroke-width="2" marker-end="url(#dini-arrow)"/>
  <line x1="418" y1="108" x2="444" y2="108" class="dg-accent-stroke" stroke-width="2" marker-end="url(#dini-arrow)"/>
  <line x1="564" y1="108" x2="590" y2="108" class="dg-accent-stroke" stroke-width="2" marker-end="url(#dini-arrow)"/>
  <rect x="10" y="160" width="262" height="44" rx="6" class="dg-highlight" stroke-width="1"/>
  <text x="141" y="180" font-size="12" text-anchor="middle" class="dg-text">Meaning is packed into symbols</text>
  <text x="141" y="196" font-size="12" text-anchor="middle" class="dg-text">using an agreed encoding</text>
  <text x="360" y="180" font-size="12" text-anchor="middle" class="dg-muted">Only symbols</text>
  <text x="360" y="196" font-size="12" text-anchor="middle" class="dg-muted">cross here</text>
  <rect x="448" y="160" width="262" height="44" rx="6" class="dg-highlight" stroke-width="1"/>
  <text x="579" y="180" font-size="12" text-anchor="middle" class="dg-text">Meaning is unpacked only if the</text>
  <text x="579" y="196" font-size="12" text-anchor="middle" class="dg-text">same encoding is already here</text>
  <text x="360" y="236" font-size="12" text-anchor="middle" class="dg-muted">Shannon's 1948 diagram, with the part he left out written underneath</text>
</svg>
<figcaption>Shannon's model of a communication system. The maths is about the middle: getting symbols across a noisy channel. The meaning lives at the two ends, and the agreement that carries it never travels with the signal.</figcaption>
</figure>

A year later the paper was republished as a book with an introduction by Warren Weaver, who drew the line more explicitly. He split communication into three levels. Level A is technical: how accurately can the symbols be transmitted? Level B is semantic: how precisely do the transmitted symbols convey the intended meaning? Level C is effectiveness: does the received meaning change the receiver's behaviour in the way the sender wanted? Shannon's theory is a theory of level A. Weaver was clear that the other two are different and harder problems.

I find that split useful far beyond telecoms. Almost every argument about data I have watched in a meeting room was a level B or C problem dressed up as a level A one. The file arrived. Every byte was intact. It still did not mean what the sender meant.

## What a message carries

In computing, a **message** is a unit of communication passed from one system or person to another: an email, a network packet, a request to a web service, a row landing in a queue. The textbook way to describe one is content plus metadata. The content is the payload, the "Hi, how are you?" of an email. The **metadata** is everything that helps the message get handled: who sent it, to whom, when, how long it is, how it is encoded.

What I missed when I first wrote that down is that metadata is not a different kind of substance. It is more data, and it only works because both ends agreed in advance how to read it. An email can carry a header line like `Content-Type: text/plain; charset=utf-8`. That line is the sender telling the receiver which encoding to apply to the body. It works because the email standards define what the line means and mail programs were built to follow them. Context does not travel inside a message. Pointers to context do, and they only point somewhere if the receiver holds the same map.

This is why every working communication system rests on a **protocol**: a written agreement about what each field means, in what order, under what conditions. A protocol is context made explicit, so that sender and receiver do not have to share a brain. When it is missing or mismatched, you get familiar small disasters. The name "José", saved as UTF-8 and read back as Latin-1, turns into "JosÃ©": the five bytes are untouched, the agreement is wrong. Spreadsheets that silently turned gene names such as SEPT2 into dates caused errors that researchers found throughout the published genetics literature, and in 2020 the committee that names human genes renamed several of them rather than wait for spreadsheets to change.

Every one of those failures is a level B failure. The symbols arrived. The meaning did not.

## The pyramid and its cracks

The picture most people meet for all this is a pyramid. Data at the bottom, information above it, knowledge above that, wisdom at the top: the **DIKW hierarchy**. Each layer is supposed to be made from the one below by processing. Organise data and you get information. Apply information and you get knowledge. Reflect on knowledge and you get wisdom. The version most often cited is the systems thinker Russell Ackoff's 1989 paper "From Data to Wisdom", though the idea is older, and people like to put T. S. Eliot's lines from *The Rock* (1934) above it:

> Where is the wisdom we have lost in knowledge?
> Where is the knowledge we have lost in information?

I like the pyramid as a warning. A dashboard full of numbers is not understanding, and a person drowning in reports can still know very little. But the more I read about it, the less I trusted it as a description of how knowing actually works, and I am not the first to feel that.

In 2007 Jennifer Rowley looked at how textbooks defined the four layers and found that, while they broadly agreed on the shape, there was much less agreement on what the terms meant or on how one layer turns into the next. Martin Frické went further in 2009. He argued that the hierarchy rests on a mistaken picture of how we come to know things: that you can start from raw data, free of any theory, and climb upwards by processing alone.

That criticism landed for me because of the claims form I will come to in a moment, and because of my four test scores. Somebody decided to record scores and not, say, time spent on each question. Somebody chose the scale. Somebody designed the thermometer, the sensor, the form, the database table. Every piece of data that exists was shaped by someone's prior knowledge of what was worth recording and how. The historian Lisa Gitelman edited a book in 2013 whose title, borrowed from Geoffrey Bowker, says it in three words: *"Raw Data" Is an Oxymoron*.

My own position, for what it is worth: the pyramid is fine as a reminder and wrong as a recipe. The arrows run both ways. Knowledge decides what gets recorded and how it is encoded. Data, read with that knowledge, becomes information. Information, acted on, changes what we know, which changes what we record next. It is a loop, not a staircase, and the receiver is standing inside it the whole time.

## A claims form

My working life is in insurance products, and a claims form is the clearest example I know.

Picture three fields on an incoming claim. Date of loss: `03/04/2025`. Cause code: `07`. Amount: `1250`.

Each one is perfectly good data, and each one is useless until the reader holds the same agreement as the writer. Read with the UK convention, that date is 3 April 2025. Read by a system set up for the US convention, it is 4 March 2025, and a month's difference can decide whether the loss fell inside the policy period at all. Cause code `07` means something only to someone holding the code list it came from, and the right version of that list, because code lists get revised and old claims do not update themselves. And `1250` is pounds, or pence, or a currency the form never stated.

Nothing about those fields is broken in Shannon's sense. Every character arrived. The failure, if there is one, happens at Weaver's level B, and it happens silently. The claim still flows through every system, the totals still add up, the reports still render. They just compute the wrong thing with complete confidence. When that kind of drift ends up in the data a model learns from, it becomes one of the main ways machine learning goes quietly wrong, which is the subject of [Garbage In](/notes/garbage-in/).

What I take from this is that the most valuable part of a form is not on the form. It is the shared, written, maintained understanding of what each field means.

## Processing, looked at again

My old lesson described a tidy pipeline: collect the data, process it, store it, transmit it. I still think that is a fair description of what systems do. What I would change is the point of it. Each stage is a place where context is either kept or lost.

**Collection** is where the first encoding choices are made: what to record, in which units, with which codes. Those choices are knowledge, baked in before any processing starts.

**Processing** is sorting, filtering, totalling, averaging, running a model. It is the step that turns data into an answer to a question, which means it only makes sense once you know the question. The average of my four scores is 110.25. Python will compute that without complaint. Whether it means anything depends on whether all four were marked on the same scale, and the numbers cannot tell you.

**Storage** keeps the bytes safe for years. The context often lives somewhere far less durable: in a column name that made sense to whoever created it, in a spreadsheet tab nobody opens, in the head of a colleague who has since moved on. Writing that context down in a form both people and machines can use is its own discipline, and an old one in AI, which I come back to in [Writing Knowledge Down](/notes/writing-knowledge-down/).

**Transmission** sends the message. As Shannon's diagram makes plain, only the symbols move. The agreement has to be at the other end already.

Seen this way, "processing data into information" is mostly a matter of matching. The computation is usually the easy part. The hard part is making sure the receiver, whether a person, a program or a model, reads the symbols with the same agreement that wrote them.

## Back to the four numbers

So my old example was wrong in a useful way. The numbers 120, 98, 78 and 145 did not become information when I put a sentence round them. They would have become information when a teacher who knew the test was marked out of 150, and knew what a pass looked like, glanced at them and decided who needed help on Monday.

Bits travel well. Meaning has to be waiting when they arrive.

---

**Sources**

- C. E. Shannon, "A Mathematical Theory of Communication", *Bell System Technical Journal*, 27, 1948.
- C. E. Shannon, "Prediction and Entropy of Printed English", *Bell System Technical Journal*, 30, 1951.
- C. E. Shannon and W. Weaver, *The Mathematical Theory of Communication*, 1949 (Weaver's introduction sets out the three levels).
- R. L. Ackoff, "From Data to Wisdom", *Journal of Applied Systems Analysis*, 16, 1989.
- J. Rowley, "The wisdom hierarchy: representations of the DIKW hierarchy", *Journal of Information Science*, 33(2), 2007.
- M. Frické, "The knowledge pyramid: a critique of the DIKW hierarchy", *Journal of Information Science*, 35(2), 2009.
- L. Gitelman (ed.), *"Raw Data" Is an Oxymoron*, MIT Press, 2013.
- M. Ziemann, Y. Eren and A. El-Osta, "Gene name errors are widespread in the scientific literature", *Genome Biology*, 17, 2016.
