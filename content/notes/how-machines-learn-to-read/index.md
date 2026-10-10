---
title: "How Machines Learn to Read"
slug: "how-machines-learn-to-read"
type: "note"
status: "evergreen"
summary: "A person reads a sentence in a second. A machine has to cut it, count it, place it in space and weigh it, and every step either fixes a problem left by the last one or deletes something you needed. A walk through the stages, with code you can run."
date: "2026-09-11"
created: "2026-09-11"
updated: "2026-09-11"
topics: ["Artificial Intelligence", "Natural Language Processing"]
tags: ["AI", "NLP", "Machine Learning", "Python", "Data"]
linked_notes:
  - "the-naive-assumption-that-works"
  - "finding-the-needle"
  - "garbage-in"
graph:
  show: true
  weight: 2
  cluster: "language"
seo:
  title: "How Machines Learn to Read"
  description: "From tokenisation and bag of words to embeddings and attention: how a machine turns text into numbers, what each step fixes, and what each step throws away."
---

Here is a sentence you read in a second: *Don't buy it, it's NOT good!* Now here are three short programs reading it.

The first sees six pieces, and two of them have punctuation stuck to the end: `it,` and `good!`. The second sees eight pieces, with the comma and the exclamation mark standing on their own. The third also sees eight, but one of them is the lonely letter `t`, left over from a word it split in half.

None of the three is broken. Each is doing exactly what it was told. And every number a machine later computes about that sentence depends on which one you picked.

That is where reading starts for a machine: with a decision about where to cut. What follows is the path one review takes on its way to being understood, or at least being usable. Each stage solves a problem the previous stage left behind, and each one pays for it with something it throws away.

## Where the cuts go

Here are the three readings above as code. The sentence is the same each time.

```python
import re
s = "Don't buy it, it's NOT good!"
print(s.split())
print(re.findall(r"\w+(?:'\w+)?|[^\w\s]", s))
print(re.findall(r"[a-z]+", s.lower()))
```

```text
["Don't", 'buy', 'it,', "it's", 'NOT', 'good!']
["Don't", 'buy', 'it', ',', "it's", 'NOT', 'good', '!']
['don', 't', 'buy', 'it', 'it', 's', 'not', 'good']
```

Splitting on spaces leaves punctuation glued to words. The regular expression in the middle keeps contractions whole and pulls punctuation out, which is probably what you wanted. The last one keeps only letters, so `Don't` becomes `don` and `t`, and the model never learns that those two fragments were once one word. Splitting on spaces is also an English habit: some written languages do not put spaces between words at all.

These pieces are **tokens**, and the process is **tokenisation**. A word-level scheme has a second, quieter problem. Any word that was not in the vocabulary when the model was built is simply unknown, however ordinary it looks to you.

The usual fix is to cut below the word. **Byte-pair encoding** starts with single characters and repeatedly merges the pair of neighbours that occurs most often. Sennrich, Haddow and Birch brought the idea to machine translation in 2016. Here is the whole method in a few lines, run on a toy word list: *low* five times, *lower* twice, *newest* six times, *widest* three times, each word ending in a marker `</w>`.

```python
from collections import Counter

corpus = {"low": 5, "lower": 2, "newest": 6, "widest": 3}
words = {tuple(w) + ("</w>",): n for w, n in corpus.items()}

def pair_counts(words):
    c = Counter()
    for symbols, n in words.items():
        for a, b in zip(symbols, symbols[1:]):
            c[(a, b)] += n
    return c

def merge(words, pair):
    out = {}
    for symbols, n in words.items():
        new, i = [], 0
        while i < len(symbols):
            if i < len(symbols) - 1 and (symbols[i], symbols[i + 1]) == pair:
                new.append(symbols[i] + symbols[i + 1])
                i += 2
            else:
                new.append(symbols[i])
                i += 1
        out[tuple(new)] = n
    return out

merges = []
for step in range(1, 9):
    counts = pair_counts(words)
    pair, n = counts.most_common(1)[0]
    merges.append(pair)
    words = merge(words, pair)
    print(step, pair[0], "+", pair[1], n)

def segment(word):
    symbols = tuple(word) + ("</w>",)
    for pair in merges:
        symbols = merge({symbols: 1}, pair).popitem()[0]
    return symbols

print(segment("lowest"))
print(segment("newer"))
```

```text
1 e + s 9
2 es + t 9
3 est + </w> 9
4 l + o 7
5 lo + w 7
6 n + e 6
7 ne + w 6
8 new + est</w> 6
('low', 'est</w>')
('new', 'e', 'r', '</w>')
```

The first merge is a tie between `e + s` and `s + t`, nine occurrences each, and the code takes whichever it met first. By merge eight the algorithm has built `low`, `new` and the suffix `est</w>`. Then comes the part I like. The word *lowest* never appeared in the corpus, yet it comes out as `low` and `est</w>`: two pieces the method has already seen. A fixed list of pieces can cover words nobody wrote down.

It is also honest about its edges. *Newer* falls back to `new`, `e`, `r`, because nothing in this tiny corpus ever taught it `er`.

At full scale this is how real systems work. The Transformer paper (Vaswani and others, 2017) used a shared vocabulary of about 37,000 byte-pair tokens for English to German translation. The model never reads words. It reads pieces that a counting rule found. A piece is not always a meaningful unit either, and a rare name or a policy number can be chopped somewhat arbitrarily.

## Counting what is there

Once the text is cut, the oldest trick is to count. A **bag of words** turns a document into a vector of word counts and forgets the order. It is an almost insultingly simple idea, and it has an obvious flaw:

```python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

cv = CountVectorizer()
X = cv.fit_transform(["dog bites man", "man bites dog"])
print(cv.get_feature_names_out(), X.toarray().tolist())
```

```text
['bites' 'dog' 'man'] [[1, 1, 1], [1, 1, 1]]
```

*Dog bites man* and *man bites dog* give identical vectors. Those are not the same story.

The second flaw is subtler. In a pile of film reviews the word *movie* is in nearly every one, so a raw count lets it shout as loudly as *fantastic*. **TF-IDF** corrects for that. It multiplies how often a word appears in this document by an **inverse document frequency**, which shrinks as the word turns up in more documents. In its textbook form that factor is ln(N ÷ df), where N is the number of documents and df is how many of them contain the word.

<div class="callout callout-hint"><p><strong>Worked example</strong></p><p>Three tiny reviews: "movie fantastic", "dumb movie", "movie great". N = 3. The word <em>movie</em> is in all three, so its factor is ln(3 ÷ 3) = 0 and it vanishes. <em>Fantastic</em> is in one, so its factor is ln(3 ÷ 1) = 1.0986 and it survives. The word that says nothing has been erased and the one that says something remains.</p></div>

Libraries tweak the recipe so that a word in every document is not erased outright. scikit-learn's default uses ln((1 + N) ÷ (1 + df)) + 1 and then scales each row to length 1:

```python
tv = TfidfVectorizer()
T = tv.fit_transform(["movie fantastic", "dumb movie", "movie great"])
print(tv.get_feature_names_out(), tv.idf_.round(4))
print(T.toarray().round(4))
```

```text
['dumb' 'fantastic' 'great' 'movie'] [1.6931 1.6931 1.6931 1.    ]
[[0.     0.861  0.     0.5085]
 [0.861  0.     0.     0.5085]
 [0.     0.     0.861  0.5085]]
```

The two recipes disagree about what *movie* is worth: 0 in the textbook form, 1 here before scaling. A TF-IDF number only means something once you know the recipe that made it. These scores are engineering choices and not measurements of nature. The same weighting idea sits under document search, which I come back to in [Finding the Needle](/notes/finding-the-needle/).

Here is the odd part. A model that treats a review as a shuffled bag still reads sentiment surprisingly well. A bag-of-words Naive Bayes classifier I ran on 50,000 labelled film reviews classified 8,535 of 10,000 held-out reviews correctly, or 85.35% (the figure moves a little from run to run, because I did not fix the random split). Order and meaning are gone, and most of the signal is still there. My guess is that many reviews announce their verdict in a handful of strongly polar words such as *awful* or *superb*, but I have not tested that. Why counting works on language at all is the subject of [The Naive Assumption That Works Anyway](/notes/the-naive-assumption-that-works/).

## When cleaning deletes the answer

Counting is hungry for tidy input, so the standard recipe is to clean the text first. Remove **stop words**, the very common words such as *the* and *is*. Then **stem**, which means chop word endings by rule so that related forms collapse into one. Or **lemmatise**, which looks a word up and returns its dictionary form. A lemmatiser needs a vocabulary and usually the part of speech, and I have not run one here.

Here is the cleaning step on a four-word review:

```python
import re
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS as SW

ps = PorterStemmer()
text = "This movie was NOT good"
toks = re.findall(r"[a-z]+", text.lower())
print(toks)
print([t for t in toks if t not in SW])
print("not" in SW, len(SW))
print([ps.stem(w) for w in ["flying", "flies", "fly", "universe", "universal", "studies"]])
```

```text
['this', 'movie', 'was', 'not', 'good']
['movie', 'good']
True 318
['fli', 'fli', 'fli', 'univers', 'univers', 'studi']
```

Read the second line again. *This movie was NOT good* has become `movie good`. The scikit-learn stop list has 318 words, and *not* is one of them. The tidy-up has reversed the review.

The last line shows what stemming really does. A stem is not a word. *Flying*, *flies* and *fly* all become `fli`, which is a perfectly good key for counting and a poor thing to show a human. Stemmers also over-reach: *universe* and *universal* land on the same `univers`.

None of this makes cleaning wrong. It makes it a hypothesis, and one that can be tested. A 2020 study of toxic comment classification (Maslej-Krešňáková and others) began from the suspicion that standard clean-up may strip the very traits that mark toxic language, and reported no significant benefit from the traditional steps once word embeddings were in use. The result belongs to that task and those models, so I would not export it to others. The habit it argues for travels fine: every step you remove from the data is a decision about what does not matter, so test the decision rather than inherit it. I come back to the unglamorous side of this in [Garbage In](/notes/garbage-in/).

## Words as positions

There is a deeper limit in the bag. *Buy used cars* and *purchase old automobiles* mean much the same, and a bag-of-words model sees two sentences with nothing in common. Each word is its own column and every column is a stranger to every other.

The linguist J. R. Firth put the way out in 1957: you shall know a word by the company it keeps. Turn that into arithmetic. Describe each word by the words that appear near it, and compare the descriptions. Here is a toy version with twelve short sentences that I wrote so that *buy* and *purchase* turn up in the same slots. For each word, count the words within two places of it, then compare the count vectors by cosine similarity (1 means the same direction, 0 means nothing shared).

```python
import numpy as np
sents = ["i buy a used car", "i purchase a used car", "we buy an old car",
         "we purchase an old car", "i buy a new phone", "we purchase a new phone",
         "she will buy a used phone", "she will purchase a used phone",
         "i eat a ripe apple", "we eat a ripe pear", "she will eat a new apple",
         "i eat an old pear"]
toks = [s.split() for s in sents]
vocab = sorted({w for t in toks for w in t})
idx = {w: i for i, w in enumerate(vocab)}
C = np.zeros((len(vocab), len(vocab)))
for t in toks:
    for i, w in enumerate(t):
        for j in range(max(0, i - 2), min(len(t), i + 3)):
            if j != i:
                C[idx[w], idx[t[j]]] += 1
def cos(a, b):
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))
for a, b in [("buy", "purchase"), ("buy", "eat"), ("apple", "pear"), ("car", "apple")]:
    print(a, b, round(cos(C[idx[a]], C[idx[b]]), 4))
```

```text
buy purchase 0.9565
buy eat 0.8261
apple pear 0.6124
car apple 0.4082
```

As separate columns in a bag, *buy* and *purchase* would score exactly 0. Here they score 0.9565, higher than *buy* and *eat* (0.8261), and *apple* sits nearer *pear* (0.6124) than *car* (0.4082). The ordering is right. The margins are thin, because with twelve sentences the little words such as *a* and *i* dominate the counts, and I would not read anything into the exact figures. Real systems are trained on billions of words.

Real systems also compress the idea. A method such as word2vec learns a short list of a few hundred numbers for each word, by training a network to predict a word from its neighbours or the neighbours from the word. In a Transformer the table of word vectors is learned together with the rest of the network. Such a list is a **word embedding**: a position in a space where distance tracks similarity of use.

Two things to hold on to. A static embedding gives one vector per word, so *apple* the company and *apple* the fruit share a position. And the space remembers everything the text ever said, including what we would rather it forgot. Bolukbasi and colleagues showed in 2016 that vectors trained on news text encode gender stereotypes about occupations, which is precisely what you should expect from a method whose whole principle is that meaning is the company a word keeps.

## Letting every word look at every other

Embeddings fix the stranger problem and still hand the model one fixed vector per word. The sentence around the word does not change it. The next step is to let each word look at its neighbours and adjust.

The 2017 Transformer paper is titled as a dare: *Attention Is All You Need*. The translation models of the day read a sentence one position at a time. The authors removed that step entirely, built the network from attention and small feed-forward layers, and reported translation results that beat the best earlier ones. The smaller of their two models trained in about twelve hours on eight GPUs.

The core is three familiar operations. Each token is turned into three vectors: a **query** (what I am looking for), a **key** (what I offer) and a **value** (what I hand over if chosen). Dot products of queries with keys score every pair of tokens, a softmax turns each row of scores into weights that sum to 1, and the output for each token is a weighted mix of the values.

<div class="formula">Attention(Q, K, V) = softmax(Q Kᵀ ÷ √d) V</div>

Here it is on three tokens with two numbers each. To keep the arithmetic readable I set the query and key to equal the input itself, where a real model would learn separate matrices for them, and I made up the value matrix.

```python
import numpy as np
X = np.array([[1., 0.], [0., 1.], [1., 1.]])
Wv = np.array([[1., 2.], [3., 0.]])
Q = K = X
V = X @ Wv
scores = Q @ K.T
scaled = scores / np.sqrt(2)
e = np.exp(scaled - scaled.max(axis=1, keepdims=True))
A = e / e.sum(axis=1, keepdims=True)
print(scores)
print(A.round(4))
print((A @ V).round(4))
```

```text
[[1. 0. 1.]
 [0. 1. 1.]
 [1. 1. 2.]]
[[0.4011 0.1978 0.4011]
 [0.1978 0.4011 0.4011]
 [0.2483 0.2483 0.5035]]
[[2.5989 1.6044]
 [3.0056 1.1978]
 [3.007  1.5035]]
```

<div class="callout callout-hint"><p><strong>Row one by hand</strong></p><p>The scores for token 1 are [1, 0, 1]. Divide by √2 to get [0.7071, 0, 0.7071]. The exponentials are 2.0281, 1 and 2.0281, which sum to 5.0562, so the weights are [0.4011, 0.1978, 0.4011]. The values are [1, 2], [3, 0] and [4, 2]. The output is 0.4011 × [1, 2] + 0.1978 × [3, 0] + 0.4011 × [4, 2] = [2.5989, 1.6044]. Token 1 listens mostly to itself and to token 3, because those are the ones its query matches.</p></div>

Why divide by the square root? The paper's footnote gives the reason. If the components of a query and a key are independent with mean 0 and variance 1, their dot product has variance equal to the number of dimensions. I simulated it with 100,000 random pairs: at 64 dimensions the variance came out at about 64, and at 512 about 515, falling back to about 1 after the division. Without it, big scores push the softmax towards a single winner and learning stalls.

The real architecture adds more. Eight attention heads run in parallel and their results are joined. Layers are stacked, and because attention alone has no idea of word order, position information is added to the embeddings. I will not pretend that the toy above is a language model. What it does show is that the central move is a lookup whose rules are learned: each word asks a question, every word answers, and the answers are blended by relevance.

Two honest limits from the paper itself. Self-attention compares every position with every other, so the cost grows with the square of the sequence length. And the attention weights look like an explanation of what the model is doing, but the paper offers only example pictures, and later work has argued that they are not an adequate explanation on their own.

## What stays missing

Line the stages up and each one is a patch. Cutting makes text countable. Counting loses order, so people add word pairs, and it loses synonyms, so there are embeddings. A single vector per word ignores context, so there is attention. Each patch keeps something the stage before it lost, and none of them can tell you what the writer meant by *good*.

A machine never reads the sentence you wrote. It reads the one we prepared for it, and the preparing is where most of the reading is decided.

---

**Sources**

- A. Vaswani and others, *Attention Is All You Need*, 2017.
- R. Sennrich, B. Haddow and A. Birch, *Neural Machine Translation of Rare Words with Subword Units*, 2016.
- J. R. Firth, *A Synopsis of Linguistic Theory 1930 to 1955*, in *Studies in Linguistic Analysis*, 1957.
- T. Bolukbasi and others, *Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings*, 2016.
- V. Maslej-Krešňáková and others, *Deep Learning Models and Text Pre-processing for Toxic Comments Classification*, 2020.
- scikit-learn documentation for `CountVectorizer`, `TfidfVectorizer` and the English stop-word list.
