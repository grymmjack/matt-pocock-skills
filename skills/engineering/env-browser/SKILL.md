---
name: env-browser
description: Explore a project's package environment the fuzzy way — browse installed packages, read their source, and jump to their registry/docs — for Python, Node, Rust, Go, and Ruby.
disable-model-invocation: true
---

# Env Browser

Introspect a package environment interactively. It answers "what does this project actually depend on, what is each thing for, and how do I learn to use it?" without leaving the terminal — across five ecosystems, one muscle memory.

Each browser is an fzf tool (a sibling of `brewbrowse`/`aptbrowse`) that reads the *active* environment's packages, shows their metadata in a preview pane, drills into their source on Enter, and opens their registry/docs/help on Alt-chords. The agent cannot drive an interactive fzf for you — so these are commands *you* run.

| Command | Environment | Registry | Reads from |
|---------|-------------|----------|------------|
| `pybrowse` | Python (active venv / interpreter) | PyPI | `importlib.metadata` |
| `nodebrowse [-g]` | `./node_modules`, or global with `-g` | npm | `package.json` |
| `rustbrowse` | the Cargo project in `$PWD` | crates.io + docs.rs | `cargo metadata` |
| `gobrowse` | the Go module in `$PWD` | pkg.go.dev | `go list -m all` |
| `gembrowse` | installed Ruby gems (global) | rubygems.org | `Gem::Specification` |

## Install

The tools live in [`scripts/`](./scripts/) — `pybrowse.sh` (Python) and `env-browsers.sh` (the other four, sharing one engine). Source them from your shell rc once:

```bash
for f in "$PWD"/scripts/*.sh; do echo "source $f" >> ~/.zshrc; done   # or ~/.bashrc
```

Requires `fzf` (+ `jq` for the node/go browsers) and the relevant toolchain. `bat` (or Debian's `batcat`) gives the source-file preview syntax highlighting; without it, the preview falls back to `cat`.

## Run it

```bash
pybrowse                 # active Python env; pybrowse /venv/bin/python for a specific one
nodebrowse               # ./node_modules   (nodebrowse -g for global)
rustbrowse               # run inside a Cargo project
gobrowse                 # run inside a Go module
gembrowse                # installed gems
```

**Level 1 — packages.** Each row is `<name> <version> <description>`. Type to fuzzy-filter across name *and* description. The preview pane shows the metadata: summary, homepage, registry + docs URLs, license, install location, requires, and (where cheap to compute) required-by.

**Level 2 — source.** Press **Enter** on a package to drill into its own source files with a `bat` preview — read exactly what a dependency is made of. Rows show the package-relative path (`macholib/dyld.py`), not the full absolute path. **Enter** on a file opens it in `$EDITOR`; **Esc** pops back to the package list; **Esc** on the list quits.

### Keys

Keys are **Alt-chords**, not bare `w`/`d`/`h` — a plain letter would be swallowed by fzf's type-to-filter box, and filtering is the point of the list.

| Key | Action |
|-----|--------|
| `Enter` | Drill into the package's source files |
| `Alt-W` | Open the package's registry page (PyPI / npm / crates.io / pkg.go.dev / rubygems) |
| `Alt-D` | Open its documentation / homepage (from the package metadata) |
| `Alt-H` | Help — `pydoc` / README / `go doc` / crate docs — paged through `$PAGER`/`less` |
| `Esc` | Back one level / quit |

## Adding an ecosystem

The four non-Python browsers share one engine (`_pkgbrowse_engine`); per-ecosystem logic is a small backend script exposing five sub-commands — `list`, `show <name>`, `files <name>`, `url <mode> <name>`, `help <name>` — selected at runtime via `$PKGBROWSE_BACKEND`. A new ecosystem is one backend plus a three-line public function.

## In-chat fallback

When you want the tour written down rather than browsed — a dependency audit, a "what is each of these for" summary, or a starting point for a new codebase — ask in chat instead of running the tool. The same data is available non-interactively per ecosystem:

- **Python** — `pip show <name>`; source at `<Location>/<module>/`.
- **Node** — `jq '{name,version,description,homepage,dependencies}' node_modules/<name>/package.json`.
- **Rust** — `cargo metadata --format-version 1 | jq '.packages[] | select(.name=="<name>")'`.
- **Go** — `go list -m -json all`; `go doc <path>`.
- **Ruby** — `gem specification <name>`.

Produce a grouped, linked summary (each package's one-line purpose and its registry/docs links) so the human can decide what to read next — then point them at the matching `*browse` command for hands-on exploration.
