---
name: python-env
description: Explore a Python environment the fuzzy way — browse installed packages, read their source, and jump to their PyPI/docs, with fzf.
disable-model-invocation: true
---

# Python Env

Introspect a Python environment interactively. It answers "what does this project actually depend on, what is each thing for, and how do I learn to use it?" without leaving the terminal.

The centrepiece is **`pybrowse`**, an fzf browser (a sibling of `brewbrowse`/`aptbrowse`) that reads the active environment's packages via `importlib.metadata`. The agent cannot drive an interactive fzf for you — so this is a skill *you* run.

## Install `pybrowse`

The tool lives at [`scripts/pybrowse.sh`](./scripts/pybrowse.sh). Source it from your shell rc once:

```bash
echo 'source '"$PWD"'/scripts/pybrowse.sh' >> ~/.zshrc   # or ~/.bashrc
```

Requires `fzf` and `python3` (or `python`). `bat` (or Debian's `batcat`) gives the source-file preview syntax highlighting; without it, the preview falls back to `cat`.

## Run it

```bash
pybrowse                    # the active environment (respects an activated venv)
pybrowse /path/to/venv/bin/python   # a specific interpreter / venv
pybrowse python3.12         # a specific python on PATH
```

**Level 1 — packages.** Each row is `<name> <version> <summary>`. Type to fuzzy-filter across name *and* description. The preview pane shows the full metadata: summary, homepage, docs URL, PyPI URL, license, install `Location`, `Requires`, `Required-by`, and the first source files.

**Level 2 — source.** Press **Enter** on a package to drill into its own `.py` files with a `bat` preview — read exactly what a dependency is made of. **Enter** on a file opens it in `$EDITOR`; **Esc** pops back to the package list; **Esc** on the list quits.

### Keys

Keys are **Alt-chords**, not the bare `w`/`d`/`h` — a plain letter would be swallowed by fzf's type-to-filter box, and filtering is the point of the list.

| Key | Action |
|-----|--------|
| `Enter` | Drill into the package's source files |
| `Alt-W` | Open the package's PyPI page (`https://pypi.org/project/<name>/`) |
| `Alt-D` | Open its documentation / homepage (from the package metadata) |
| `Alt-H` | `pydoc` help for the package, paged through `$PAGER`/`less` |
| `Esc` | Back one level / quit |

## In-chat fallback

When you want the tour written down rather than browsed — a dependency audit, a "what is each of these for" summary, or a starting point for a new codebase — ask in chat instead of running the tool. The same data is available non-interactively:

- `python3 scripts/pybrowse.sh`-style logic, or directly:
  `python3 -c "import importlib.metadata as m; [print(d.metadata['Name'], d.version, '—', d.metadata['Summary']) for d in m.distributions()]"`
- `pip show <name>` for one package's summary, homepage, `Requires`, `Required-by`, and `Location`.
- Source lives at `<Location>/<top-level-module>/`; PyPI is `https://pypi.org/project/<name>/`.

Produce a grouped, linked summary (runtime deps vs. transitive, with each package's one-line purpose and its PyPI/docs links) so the human can decide what to read next — then point them at `pybrowse` for hands-on exploration.
