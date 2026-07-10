Quickstart:

```bash
npx skills add mattpocock/skills --skill=xmind-mindmap
```

```bash
npx skills update xmind-mindmap
```

[Source](https://github.com/mattpocock/skills/tree/main/skills/productivity/xmind-mindmap)

## What it does

Turns any subject into a **real `.xmind` file** — the actual XMind document you
can open and keep editing — plus optional static renders (SVG / PNG / PDF) for
sharing. The whole map is derived from **one hierarchical topic tree** you author
as JSON: you build the tree, a bundled Node generator turns it into the `.xmind`,
and a render script turns its Mermaid twin into images. It produces a genuine
editable mind-map document, not a picture of one — the distinction that separates
it from asking for a diagram.

## When to reach for it

- **Invocation mode.** Type `/xmind-mindmap {topic}`, or the agent reaches for it
  automatically when a task fits — you ask for a mind map, an `.xmind` file, or to
  visualise / map / diagram a subject.
- **Trigger boundary.** Reach for it when the deliverable is a **structured map of
  a subject** — a knowledge tree you'll navigate and edit. To *learn* a topic over
  time, use [learn-anything](https://aihero.dev/skills-learn-anything) or
  [teach](https://aihero.dev/skills-teach) and let this render the result; this
  skill draws the map, it doesn't run the learning.

## Prerequisites

The generator needs its one npm dependency installed once inside the skill's own
folder (`npm install` there); `node_modules` is gitignored. Image rendering pulls
Mermaid CLI on demand via `npx` and drives a headless Chromium — `render.sh`
auto-detects a pre-installed browser so nothing extra downloads. The `.xmind`
output itself needs no browser. The skill writes wherever you point `--out`
(default: the current directory); pointed at a `teach` / `learn-anything`
workspace's `./reference/`, its output sits alongside the other cards.

## The topic tree

The one piece of real work is the **topic tree**: a central `title` and nested
`children`, authored as JSON. Everything else — the `.xmind`, the Mermaid `.mmd`,
the Markdown outline — is generated from it, so the tree is the single source of
truth. Keep nodes to short labels, one idea each, a readable ~3–7 per parent, and
ground the content in trusted sources rather than parametric guesswork — the same
discipline `teach` and `learn-anything` insist on.

## Single vs multi-sheet

The fork that shapes the output. **Single-sheet** hangs the whole tree off one
central topic — right for one concept or a cheat sheet. **Multi-sheet** builds an
Overview sheet whose branches are **hyperlinked** to per-branch detail sheets,
each **back-linking** to the Overview — right for a broad subject with several big
branches, and the same structure as DRAW's 20-sheet feature map. Left on `auto`,
it picks multi when there's more than one top-level branch.

## It's working if

- The run prints node/sheet counts and paths, and a `.xmind` you can open in XMind
  appears — with, in multi-sheet mode, clickable Overview → branch links and
  working back-links.
- Alongside it sit a `.mmd` and `.md` twin, and `render.sh` turns the `.mmd` into
  `.svg` / `.png` / `.pdf` without downloading a browser.

## Where it fits

A reach-for-it-anytime standalone that also composes with the learning skills:
point it at a [learn-anything](https://aihero.dev/skills-learn-anything) topic
(the framework *is* a mind map — 5 Ws, resources, observations, glossary, practice,
mastery) or a [teach](https://aihero.dev/skills-teach) workspace to render the
subject as a map dropped into `./reference/`. It grew out of DRAW's XMind generator
and generalises the same toolchain to any subject. For where it sits among the rest,
see [ask-matt](https://aihero.dev/skills-ask-matt), the router over the whole set.
