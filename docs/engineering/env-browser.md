Quickstart:

```bash
npx skills add mattpocock/skills --skill=env-browser
```

```bash
npx skills update env-browser
```

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/env-browser)

## What it does

Explore a project's package environment interactively: browse its installed packages, read their actual source, and jump to their registry and docs — all from the terminal, across five ecosystems with one set of habits. It installs a family of fzf browsers — `pybrowse` (Python), `nodebrowse` (npm), `rustbrowse` (Cargo), `gobrowse` (Go modules), `gembrowse` (Ruby gems) — each reading the *active* environment for its language.

Its centrepiece is an interactive fzf browser, which the agent cannot drive for you — so this is a skill you type, not one the model reaches for. The value it trades on is that a project's dependencies are a reading list nobody hands you: these tools turn `pip freeze` / `node_modules` / `cargo metadata` into a navigable one, where every row carries its own purpose, links, and source.

## When to reach for it

You invoke this by typing `/env-browser` — the agent won't reach for it on its own; it installs and explains a family of terminal commands you then run yourself (`pybrowse`, `nodebrowse`, `rustbrowse`, `gobrowse`, `gembrowse`).

Reach for it when you've landed in an unfamiliar codebase and want to know what it leans on and why, when a dependency is doing something surprising and you want to read its source without hunting through `node_modules` or `site-packages`, or when you're deciding whether to adopt a package and want its docs, registry page, and code one keystroke apart. When you'd rather have the tour written down — a dependency audit or a grouped summary — ask in chat instead; the skill carries a non-interactive path for exactly that.

## Prerequisites

`fzf` on `PATH`, plus the toolchain for whichever browser you use (`python3`, `npm`, `cargo`, `go`, `gem`); the node and go browsers also use `jq`. `bat` (Debian's `batcat` also works) gives the source-file preview syntax highlighting; without it the preview falls back to `cat`. Install by sourcing the files in `scripts/` from your shell rc once — they define the `*browse` functions in bash or zsh.

## One shape, five ecosystems

Every browser is the same **drill**, not a flat list. Level one is the package list — `<name> <version> <description>`, fuzzy-searchable across name *and* description, with a preview pane of homepage, registry, docs, license, install location, requires, and required-by. **Enter** drops to level two: the selected package's own source tree, previewed with `bat`, rows showing the package-relative path rather than the full absolute one. **Esc** climbs back; **Esc** at the top quits.

The action keys are `Alt-W` (registry), `Alt-D` (docs/homepage), `Alt-H` (help — `pydoc`, README, `go doc`, or crate docs). They are Alt-chords on purpose — a bare `w` or `d` would be eaten by fzf's type-to-filter box, and filtering the list is the whole point. Under the hood the four non-Python browsers share a single engine and differ only in a small backend exposing `list`/`show`/`files`/`url`/`help`, so the family stays consistent and a sixth ecosystem is a short addition. This is the same fuzzy-browser shape as `brewbrowse` and `aptbrowse`, aimed at language package managers instead of the system one.

## It's working if

- Typing filters the list by description as well as name, and the preview names each package's purpose, docs, and required-by.
- `Enter` opens the package's real source files — not a docs stub — with syntax highlighting, showing short package-relative paths.
- `Alt-W`/`Alt-D` open the right pages in your browser; `Alt-H` pages real help text.
- `rustbrowse`/`gobrowse` reflect the project in `$PWD`, while `pybrowse`/`nodebrowse` follow the active venv / `node_modules` (or global with a flag).

## Where it fits

A reach-for-it-anytime standalone — it sits off the main build flow entirely, a companion for the moment you need to understand a codebase's dependencies rather than change them. Its nearest neighbour is [research](https://aihero.dev/skills-research), because both feed understanding into the main flow rather than producing deliverables — research reads the web, `env-browser` reads the environment on your disk. For the whole map of how the skills relate, see [ask-matt](https://aihero.dev/skills-ask-matt).
