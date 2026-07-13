Quickstart:

```bash
npx skills add mattpocock/skills --skill=python-env
```

```bash
npx skills update python-env
```

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/python-env)

## What it does

Explore a Python environment interactively: browse its installed packages, read their actual source, and jump to their PyPI and docs — all from the terminal. The tool it installs, `pybrowse`, reads the *active* interpreter's world through `importlib.metadata`, so an activated venv is what you see; point it at another interpreter and you see that one instead.

Its centrepiece is an interactive fzf browser, which the agent cannot drive for you — so this is a skill you type, not one the model reaches for. The value it trades on is that a project's dependencies are a reading list nobody hands you: `pybrowse` turns `pip freeze` into a navigable one, where every row carries its own purpose, links, and source.

## When to reach for it

You invoke this by typing `/python-env` — the agent won't reach for it on its own; it installs and explains a terminal tool you then run yourself.

Reach for it when you've landed in an unfamiliar Python codebase and want to know what it leans on and why, when a dependency is doing something surprising and you want to read its source without hunting through `site-packages`, or when you're deciding whether to adopt a package and want its docs, PyPI page, and code one keystroke apart. When you'd rather have the tour written down — a dependency audit or a grouped summary — ask in chat instead; the skill carries a non-interactive path for exactly that.

## Prerequisites

`fzf` and `python3` (or `python`) on `PATH`. `bat` (Debian's `batcat` also works) gives the source-file preview syntax highlighting; without it the preview falls back to `cat`. Install by sourcing `scripts/pybrowse.sh` from your shell rc once — it defines the `pybrowse` function in bash or zsh.

## Two levels, and why the keys are Alt-chords

`pybrowse` is a **drill**, not a flat list. Level one is the package list — `<name> <version> <summary>`, fuzzy-searchable across name *and* description, with a preview pane showing homepage, docs, PyPI, license, install location, `Requires`, and `Required-by`. **Enter** drops to level two: the selected package's own `.py` source tree, previewed with `bat`. **Esc** climbs back; **Esc** at the top quits.

The action keys are `Alt-W` (PyPI), `Alt-D` (docs/homepage), `Alt-H` (`pydoc` help). They are Alt-chords on purpose — a bare `w` or `d` would be eaten by fzf's type-to-filter box, and filtering the list is the whole point. This is the same fuzzy-browser shape as `brewbrowse` and `aptbrowse`, aimed at pip instead of a system package manager.

## It's working if

- Typing filters the list by description as well as name, and the preview names each package's purpose, docs, and `Required-by`.
- `Enter` opens the package's real source files — not a docs stub — with syntax highlighting.
- `Alt-W`/`Alt-D` open the right pages in your browser; `Alt-H` pages real `pydoc` output.
- `pybrowse /some/venv/bin/python` shows a *different* package set than the bare `pybrowse`.

## Where it fits

A reach-for-it-anytime standalone — it sits off the main build flow entirely, a companion for the moment you need to understand a codebase's dependencies rather than change them. Its nearest neighbour is [research](https://aihero.dev/skills-research), because both feed understanding into the main flow rather than producing deliverables — research reads the web, `python-env` reads the environment on your disk. For the whole map of how the skills relate, see [ask-matt](https://aihero.dev/skills-ask-matt).
