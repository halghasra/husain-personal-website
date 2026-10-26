---
title: "Finding the Needle: How Retrieval Ranks Documents"
slug: "finding-the-needle"
type: "note"
status: "evergreen"
summary: "Search begins by reading in advance, but finding a word is only the easy part. I work through indexing, ranking and the surprisingly fragile business of deciding whether retrieval actually worked."
date: "2026-09-29"
created: "2026-09-29"
updated: "2026-09-29"
topics: ["Information Retrieval", "Natural Language Processing"]
tags: ["NLP", "Search", "Python", "Mathematics", "Data"]
linked_notes:
  - "how-machines-learn-to-read"
  - "writing-knowledge-down"
  - "garbage-in"
graph:
  show: true
  weight: 2
  cluster: "retrieval"
seo:
  title: "Finding the Needle: How Retrieval Ranks Documents"
  description: "How search finds and ranks documents: the inverted index, cosine similarity, BM25, and a retrieval score that was secretly always 1.0. With runnable Python."
---

If I need "photosynthesis" in a biology textbook, I do not begin at page one. I use the index, trusting that somebody has already read the book closely enough to file the subject under the right word. The index turns a slow reading problem into a quick lookup.

A search engine makes a similar bargain at a scale a printed index could never survive. It processes the collection in advance, records where terms occur, and consults that structure when a query arrives. Yet locating the documents that contain a word is only the beginning. Search still has to decide which result deserves the first position, and we still need a way to tell whether that ordering is any good.

Those two problems, ranking and evaluation, are where this note eventually leads. I begin with the inverted index because everything else depends on it, move through cosine similarity and BM25, and finish with a retrieval metric that returned an excellent score even when every answer was wrong.

## Filing the answer in advance

Documents are naturally stored one at a time, each carrying its own text. Search reverses that arrangement. An **inverted index** starts with a term and points to the documents that contain it; the document identifiers attached to each term form its **postings list**. A book index does the same thing with page numbers.

Here is one for four tiny documents. I drop a few stop words and record each remaining word's document and position:

```python
from collections import defaultdict
docs = {1: "the cat sat on the mat", 2: "the dog chased the cat", 3: "a dog sat on the log", 4: "cats and dogs"}
stop = {"the", "a", "on", "and"}
index = defaultdict(list)
for d, text in docs.items():
    for pos, w in enumerate(text.split()):
        if w not in stop:
            index[w].append((d, pos))
postings = {w: sorted({d for d, _ in v}) for w, v in index.items()}
for w in sorted(postings):
    print(w, postings[w])
def AND(a, b):
    i = j = steps = 0
    out = []
    while i < len(a) and j < len(b):
        steps += 1
        if a[i] == b[j]:
            out.append(a[i]); i += 1; j += 1
        elif a[i] < b[j]:
            i += 1
        else:
            j += 1
    return out, steps
print("cat AND sat", AND(postings["cat"], postings["sat"]))
print("dog AND NOT cat", [d for d in postings["dog"] if d not in postings["cat"]])
print("cat OR dog", sorted(set(postings["cat"]) | set(postings["dog"])))
print(index["cat"], index["sat"])
```

```text
cat [1, 2]
cats [4]
chased [2]
dog [2, 3]
dogs [4]
log [3]
mat [1]
sat [1, 3]
cat AND sat ([1], 2)
dog AND NOT cat [3]
cat OR dog [1, 2, 3]
[(1, 1), (2, 4)] [(1, 2), (3, 2)]
```

For `cat AND sat`, the engine retrieves `[1, 2]` and `[1, 3]`, then walks through the sorted lists together. It finds document 1 after two comparisons without opening any of the four documents. The immediate cost depends on the postings being merged, not on the full length of every text in the collection. OR takes their union; NOT removes one list from another.

The last line shows the positional version. "Cat" sits at position 1 in document 1 and position 4 in document 2. Keep positions and you can answer a phrase query by checking that two words are neighbours.

The result also exposes an early design decision. `cat` does not retrieve document 4 because that document contains `cats`, a different token in this tiny index. Tokenisation, stemming and stop-word removal happen before the query, but they determine what the query can later recover. An index is therefore not a neutral filing cabinet. Its preprocessing rules decide what receives a drawer and which words are treated as the same thing.

## Relevance as an angle

The index supplies candidates, not an ordering. To rank them, one classical approach turns text into geometry and asks how closely a document points in the direction of the query.

Give every word in the vocabulary its own axis. A document becomes an arrow from the origin, with a coordinate on each axis equal to the word's weight in that document. A query is an arrow too. Two arrows pointing the same way describe similar content. The standard measure is the **cosine** of the angle between them:

<div class="formula">cos(a, b) = (a · b) / (|a| × |b|)</div>

It is 1 when the arrows point the same way, and 0 when they share no words. A small check by hand. Take a = (3, 0, 1) and b = (1, 2, 0). The dot product is 3 × 1 + 0 × 2 + 1 × 0 = 3, the lengths are √10 and √5, and the cosine is 3 / 7.0711 = 0.4243, an angle of 64.9 degrees. The reason to use an angle and not a distance shows up in the second half of this snippet:

```python
import numpy as np
a = np.array([3., 0., 1.])
b = np.array([1., 2., 0.])
cos = a @ b / (np.linalg.norm(a) * np.linalg.norm(b))
print(a @ b, round(np.linalg.norm(a), 4), round(np.linalg.norm(b), 4), round(cos, 4), round(np.degrees(np.arccos(cos)), 1))
a10 = 10 * a
print(round(a @ a10 / (np.linalg.norm(a) * np.linalg.norm(a10)), 4), a @ a10, round(np.linalg.norm(a - a10), 2))
```

```text
3.0 3.1623 2.2361 0.4243 64.9
1.0 100.0 28.46
```

A vector multiplied by ten keeps the same direction, so its cosine with the original remains 1.0. The raw dot product grows to 100 and the Euclidean distance to 28.46, both dominated by magnitude. Cosine deliberately ignores that magnitude. In a text model, this helps prevent a long document from looking dissimilar merely because it contains more words.

The weights matter as much as the geometry. If every word counts equally, "the" outvotes "mortgage". **TF-IDF** fixes that by multiplying how often a word appears in this document by how rare the word is across the collection, so words found everywhere count for little. (I cover the same idea from the classification side in [How Machines Learn to Read](/notes/how-machines-learn-to-read/).) Now a real search over the same four documents, with the query "cat sat":

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
corpus = ["the cat sat on the mat", "the dog chased the cat", "a dog sat on the log", "cats and dogs"]
tv = TfidfVectorizer(stop_words="english")
T = tv.fit_transform(corpus)
print(list(tv.get_feature_names_out()))
q = tv.transform(["cat sat"])
print(cosine_similarity(q, T).round(4))
print(T[0].toarray().round(3), q.toarray().round(3))
```

```text
['cat', 'cats', 'chased', 'dog', 'dogs', 'log', 'mat', 'sat']
[[0.7444 0.3722 0.3722 0.    ]]
[[0.526 0.    0.    0.    0.    0.    0.668 0.526]] [[0.707 0.    0.    0.    0.    0.    0.    0.707]]
```

Document 1 contains both query terms and scores 0.7444. Documents 2 and 3 match one term each and tie at 0.3722. Document 4 again disappears because `cats` occupies a different dimension from `cat`.

That last result is not an accidental flaw in the example. In a bag-of-words space, unrelated axes are orthogonal by construction. `car` and `automobile` are no closer than `car` and `photosynthesis` unless another method supplies their relationship. The geometry can rank lexical overlap elegantly, but meaning is not automatically inside it.

## Two dials on the formula

TF-IDF and cosine give a useful baseline, but term frequency still needs restraint. Repeating a query word sixteen times should not usually make a page sixteen times more relevant, and document length should not become an unearned advantage.

**BM25** is a ranking formula that fixes both with two dials. It grew out of the Okapi retrieval work of Stephen Robertson and colleagues in the 1990s, and it is still a strong baseline that newer methods have to beat. Open-source search software such as Lucene uses it. For a query Q and document D:

<div class="formula">score(D, Q) = ∑ over query words t of IDF(t) × f × (k₁ + 1) / ( f + k₁ × (1 − b + b × |D| / avgdl) )</div>

Here f is the word's count in D, |D| is the document's length and avgdl is the average length across the collection. The dial k₁ controls how quickly repeats stop mattering, and b controls how hard length is penalised (0 ignores length, 1 applies the full penalty). I use k₁ = 1.5 and b = 0.75, common settings, and the IDF variant `ln(1 + (N − n + 0.5) / (n + 0.5))`, where N is the number of documents and n is how many contain the word. Variants exist, and they change the numbers.

```python
import math
docs = {"d1": "cat cat cat cat sat", "d2": "cat dog", "d3": "dog sat log mat pond field tree river",
        "d4": "dog log mat", "d5": "river pond field", "d6": "tree log field"}
toks = {k: v.split() for k, v in docs.items()}
N = len(toks)
avgdl = sum(len(t) for t in toks.values()) / N
def idf(w):
    n = sum(w in t for t in toks.values())
    return math.log(1 + (N - n + 0.5) / (n + 0.5))
def bm25(query, d, k1=1.5, b=0.75):
    s = 0.0
    for w in query:
        f = toks[d].count(w)
        s += idf(w) * f * (k1 + 1) / (f + k1 * (1 - b + b * len(toks[d]) / avgdl))
    return s
q = ["cat", "sat"]
print(N, avgdl, round(idf("cat"), 4))
for d in toks:
    print(d, round(bm25(q, d), 4))
print([round(f * 2.5 / (f + 1.5), 4) for f in (1, 2, 3, 4, 8, 16)])
print([round(2.5 / (1 + 1.5 * (0.25 + 0.75 * l / 5)), 4) for l in (2, 5, 20)])
```

```text
6 4.0 1.0296
d1 2.7065
d2 1.3285
d3 0.7101
d4 0.0
d5 0.0
d6 0.0
[1.0, 1.4286, 1.6667, 1.8182, 2.1053, 2.2857]
[1.3699, 1.0, 0.4255]
```

By hand for d1. "Cat" and "sat" each appear in 2 of the 6 documents, so IDF = ln(1 + 4.5 / 2.5) = ln 2.8 = 1.0296. Document d1 has 5 words against an average of 4, so the length factor is 1.5 × (0.25 + 0.75 × 1.25) = 1.78125. For "cat" (f = 4): 4 × 2.5 / (4 + 1.78125) = 1.7297, times 1.0296 gives 1.7810. For "sat" (f = 1): 2.5 / (1 + 1.78125) = 0.8989, times 1.0296 gives 0.9255. The total is 2.7065, matching the output. As a cross-check I ran the same six documents through the `rank_bm25` package. It uses a different IDF, so its raw numbers differ, but when I gave my function the package's IDF, both produced 1.5451, 0.7584 and 0.4054 for d1 to d3.

The last two lists are the two dials, printed. The first is the repetition part of the score for 1, 2, 3, 4, 8 and 16 occurrences in a document of average length. It climbs towards a ceiling of k₁ + 1 = 2.5 and never gets there. Four mentions are worth 1.82 times one mention, not four times, and sixteen are worth 2.29. The second list is the length effect on a single occurrence: 1.37 in a document of 2 words, 1.0 at the average of 5, and 0.43 in a document of 20.

The formula looks forbidding until those two controls are visible. Much of BM25's behaviour comes from an argument about evidence: how much an additional occurrence should add, and how much of that evidence should be discounted because the document had more opportunities to contain the word.

## The first half of an answer

Ranking also becomes the first stage of many question-answering systems. A **retriever** reduces a large collection to a small set of candidate passages; a **reader** or language model works from those candidates. If the relevant passage is absent, later sophistication cannot recover evidence it was never given. Retrieval therefore places a ceiling on the answer before generation begins.

The same work matters wherever an assistant answers from a company's own documents. I work close to insurance, where the shape is familiar: a person asks which clause applies, a retriever fetches candidates, and someone needs to see which passage the answer came from.

Here is a miniature, with five invented paragraphs and three questions. I know which paragraph answers each question (the `gold` list), so I can see where the right one lands:

```python
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

paras = [
    "The Lisbon metro and tram networks carry many a tourist each day.",
    "Porto and the Algarve are popular tourist destinations in Portugal.",
    "Portugal exports cork and wine.",
    "The Douro valley is famous for port wine and terraced vineyards.",
    "Lisbon is the capital and largest city of Portugal.",
]
questions = ["What are the tourist hotspots in Portugal?",
             "Where should I holiday in Portugal?",
             "What is the capital of Portugal?"]
gold = [1, 1, 4]   # the paragraph that really answers each question

tv = TfidfVectorizer(stop_words="english", binary=True)
P = tv.fit_transform(paras)
ranks = []
for q, g in zip(questions, gold):
    sims = cosine_similarity(tv.transform([q]), P)[0]
    order = np.argsort(-sims)
    ranks.append(int(np.where(order == g)[0][0]) + 1)
    print(q, "->", [(int(j), round(float(sims[j]), 2)) for j in order[:3]], "gold at rank", ranks[-1])
print("hit@3:", np.mean([r <= 3 for r in ranks]), "MRR:", round(np.mean([1 / r for r in ranks]), 4))
```

```text
What are the tourist hotspots in Portugal? -> [(1, 0.46), (0, 0.25), (2, 0.24)] gold at rank 1
Where should I holiday in Portugal? -> [(2, 0.38), (4, 0.33), (1, 0.3)] gold at rank 3
What is the capital of Portugal? -> [(4, 0.59), (2, 0.21), (1, 0.17)] gold at rank 1
hit@3: 1.0 MRR: 0.7778
```

Questions 1 and 3 put the correct paragraph first. The second question uses `holiday`, a word that appears nowhere in the collection. After preprocessing, little remains beyond `portugal`, so a short paragraph about cork and wine outranks the intended passage, which reaches third place only because it mentions the country.

The ranking is consistent with the representation it was given. The failure belongs to the gap between the user's vocabulary and the document's. Embedding-based retrieval tries to reduce that gap by representing related language nearby, and practical systems often combine dense retrieval with lexical methods such as BM25 rather than assuming either one is sufficient alone.

The last line gives two numbers. **Hit at 3** asks whether the right paragraph is anywhere in the top three. **Mean reciprocal rank** (MRR) averages 1 divided by the rank of the right answer: (1 + 1/3 + 1) / 3 = 0.7778. One says every question was covered. The other says one of them was covered only just. Neither is wrong, and they tell different stories, which is worth remembering before you pick one to report.

## The score that was always 1.0

While learning this, I found a tutorial notebook that applied TF-IDF and cosine similarity to 18,891 paragraphs and 87,599 questions, returning three candidates for each question. It reported 98.92 per cent top-three accuracy, or 86,650 successful questions. For a plain bag-of-words retriever, that result was striking enough that the evaluation deserved as much attention as the model.

The check, as I reconstructed it from the notebook's description, had this shape: for each true paragraph id, test whether it appears in the predictions. The predictions were a two-dimensional array, one row per question. Python's `in` on a NumPy array asks whether the value appears anywhere in the array, not in that question's own row. So a question counted as correct if its right paragraph was retrieved for any question at all.

```python
import numpy as np

def hit_at_k_buggy(y_true, y_pred):
    return sum(1 for t in y_true if t in y_pred) / len(y_true)

def hit_at_k(y_true, y_pred):
    return sum(t in row for t, row in zip(y_true, y_pred)) / len(y_true)

# two questions, both answered wrongly: each wrong answer is the other's right one
y_true = np.array([0, 1])
y_pred = np.array([[1], [0]])
print(hit_at_k_buggy(y_true, y_pred), hit_at_k(y_true, y_pred))

# pure guessing: 2,000 questions, 500 paragraphs, 3 random guesses each
rng = np.random.default_rng(0)
y_true = rng.integers(0, 500, 2000)
y_pred = rng.integers(0, 500, (2000, 3))
print(hit_at_k_buggy(y_true, y_pred), round(hit_at_k(y_true, y_pred), 3))
```

```text
1.0 0.0
1.0 0.004
```

The first example gets both questions wrong and still receives 1.0. The second guesses randomly. Its 6,000 guesses cover almost every one of the 500 paragraph identifiers somewhere in the matrix, so the buggy function again returns 1.0; the row-wise version gives 0.004, close to the chance expectation of 3/500.

The notebook's 98.92 per cent was therefore not measuring top-three retrieval accuracy as claimed. I have not substituted a corrected headline figure because I could not reproduce the original run. The point is narrower and more useful: the metric had stopped associating each question with its own predictions.

This is not a story about an unusually careless author. It is an ordinary programming mistake in the line of code granted authority over the rest of the experiment. Metrics deserve unit tests of their own: a ranking that is entirely wrong, one that is perfect, and one that guesses. If the implementation cannot distinguish those cases, no dataset can rescue the number it reports.

There are more honest metrics than hit rate and MRR, and they reward different things. Take one ranked list of ten documents where d2, d4 and d5 are relevant and found, and d11 is relevant but never retrieved:

```python
ranking = ["d7", "d2", "d9", "d4", "d1", "d5", "d3", "d8", "d6", "d10"]
relevant = {"d2", "d4", "d5", "d11"}
rel = [1 if d in relevant else 0 for d in ranking]
for k in (1, 3, 5, 10):
    print(k, round(sum(rel[:k]) / k, 4), round(sum(rel[:k]) / len(relevant), 4))
hits, ap = 0, 0.0
for i, x in enumerate(rel, 1):
    if x:
        hits += 1
        ap += hits / i
print(round(ap / len(relevant), 4))
```

```text
1 0.0 0.0
3 0.3333 0.25
5 0.4 0.5
10 0.3 0.75
0.375
```

The columns are k, precision at k (the share of the top k that is relevant) and recall at k (the share of all relevant documents that made it into the top k). At k = 10, precision is 0.3 and recall is 0.75: most of what exists was found, but most of what was shown is noise. The final number is average precision, 0.375. The relevant documents sit at ranks 2, 4 and 6, each worth a precision of 1/2, and the sum of 1.5 is divided by four, because the document that was never found still counts. Missing something costs you.

## Where the reading goes

Everything here still begins with strings. The inverted index finds them, cosine compares their weights, and BM25 adjusts what repetition and length should contribute. None of those operations knows on its own that a holiday may be a vacation. Explicit representations of meaning lead towards [Writing Knowledge Down](/notes/writing-knowledge-down/); learned representations lead elsewhere.

The more immediate lesson is about trust. Search becomes fast because much of the reading and filing happened before the query arrived. Evaluating search requires another kind of reading after the experiment: the code that decided what counted as a correct result. As [Garbage In](/notes/garbage-in/) explores more broadly, a convincing score is an output too, and it can inherit every mistake that came before it.

---

## References

- C. D. Manning, P. Raghavan and H. Schütze, [*Introduction to Information Retrieval*](https://nlp.stanford.edu/IR-book/), Cambridge University Press, 2008.
- S. Robertson and H. Zaragoza, ["The Probabilistic Relevance Framework: BM25 and Beyond"](https://doi.org/10.1561/1500000019), *Foundations and Trends in Information Retrieval*, 3(4), 2009, 333–389.
- S. Russell and P. Norvig, [*Artificial Intelligence: A Modern Approach*](https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003500), 4th ed., Pearson, 2021.
