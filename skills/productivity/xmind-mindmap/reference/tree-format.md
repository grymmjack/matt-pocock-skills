# The topic tree format

`generate-xmind.js` reads **one JSON file** describing the mind map as a tree.
The tree is the single source of truth — the `.xmind`, the Mermaid `.mmd`, and
the Markdown outline are all derived from it.

## Canonical shape

```json
{
  "title": "Central Topic",
  "theme": "snowbrush",
  "layout": "multi",
  "children": [
    {
      "title": "A top-level branch",
      "children": [
        { "title": "A child" },
        { "title": "A parent", "children": [ { "title": "A grandchild" } ] }
      ]
    }
  ]
}
```

### Fields

| Field      | Where            | Meaning |
|------------|------------------|---------|
| `title`    | every node       | **Required.** The displayed text. Emoji are fine and render in XMind. |
| `children` | any node         | Optional array of child nodes. Omit for a leaf. Nesting depth is unlimited. |
| `theme`    | root only        | Optional. `snowbrush` (default), `robust`, or `business`. `--theme` overrides it. |
| `layout`   | root only        | Optional. `single`, `multi`, or `auto` (default). `--layout` overrides it. |

`children` at the root may also be given under the key `tree`, and a **bare
JSON array** is accepted as the list of top-level branches (supply the central
title with `--title`).

## Single vs multi-sheet

- **single** — one sheet, the whole tree hanging off one central topic. Best for
  small maps (a single concept, a cheat sheet).
- **multi** — an **Overview** sheet whose nodes are the top-level branches, each
  **hyperlinked** to its own detail sheet; every detail sheet's root **back-links**
  to the Overview. Best for broad subjects with several big branches.
- **auto** (default) — multi when there is more than one top-level branch, else single.

## Authoring guidance

- Keep each node a **short label**, not a sentence — a mind map is a skeleton.
- One idea per node; push detail down into children rather than into long titles.
- Aim for a readable fan-out (≈3–7 children per node); very wide levels read poorly.
- Titles are used verbatim in the `.xmind`. For the Mermaid twin, the shape
  characters `()[]{}` are stripped from labels automatically.
