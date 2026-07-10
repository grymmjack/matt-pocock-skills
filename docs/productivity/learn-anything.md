Quickstart:

```bash
npx skills add grymmjack/matt-pocock-skills --skill=learn-anything
```

```bash
npx skills update learn-anything
```

[Source](https://github.com/grymmjack/matt-pocock-skills/tree/main/skills/productivity/learn-anything)

## What it does

`learn-anything` drops a topic into Rick's own [Learn Anything framework](https://github.com/grymmjack/learning) and works it across many sessions in a stateful per-topic workspace — the 5 Ws, gathered resources, critical observations, the practice lab, and mastery.

It is the inverse of [teach](https://aihero.dev/skills-teach): the learner drives, not the agent. You set the direction and the depth; the skill is your research partner, lab assistant, and continuum tracker. And it does not assume every topic is worth mastering — the continuum's depth verdict is a first-class outcome, so a topic you're only casually curious about gets placed and parked instead of over-taught.

## When to reach for it

You invoke this by typing `/learn-anything {topic}` — the agent won't reach for it on its own.

Reach for it when you want to learn a topic _your way_, over time, and want the sessions to accumulate rather than evaporate — whether you're chasing mastery or just deciding whether a tool is worth your time. For a one-off explanation, ask directly. For a topic where you want the agent to devise the lessons and drive you forward, use [teach](https://aihero.dev/skills-teach) instead; `learn-anything` hands you the wheel.

## Prerequisites

`learn-anything` builds a workspace per topic — one folder each, mirroring the [`learning` repo](https://github.com/grymmjack/learning) — so run it somewhere you're happy to keep. Over time it writes:

- `TOPIC.md` — the 5 Ws, your interest level, and your target and current rung on the continuum. Everything traces back to it.
- `RESOURCES.md` — the gathered sources, filed by type (official site, repo, docker, sandbox, docs, CLI help, videos, books, cheat sheets, docsets, the VS Code lab).
- `OBSERVATIONS.md` — how the topic is similar to, unique from, and connected to what you already know.
- `GLOSSARY.md` — the topic's terms, acronyms, languages, and formats.
- `./learning-records/*.md` — captured observations, discoveries, and continuum transitions.
- `./lessons/*.html`, `./reference/*.html` — deep dives and the reference cards you return to.
- `./probes/*.sh` + `./lab/` — the Instant Gratification Nerdery Lab: reproducible follow-alongs, and a gitignored scratch area.
- `./assets/*`, `NOTES.md`, `index.html` — shared components, your preferences, and the course home.

## The continuum, and the depth fork

The word to think with is the **continuum of learning** — eleven rungs from _Clueless_ ("I know what it's called") to _Continue?_ ("this will improve my career or nerd life"). The continuum is both a depth gauge and a state machine the workspace keeps current.

Its job is the fork the skill turns on: right after the 5 Ws, you set a **target rung**. A **mastery topic** climbs the whole ladder and works all seven parts of the framework to the demonstrable bar — _can you explain it to someone else, unaided_. A **reconnaissance topic** aims only for a **depth verdict** — establish the 5 Ws, skim resources, make the critical observations, then honestly park it or promote it. Deciding "Curious-and-done" is a real, recorded outcome, not a failure to finish.

## Never trust parametric knowledge

Before anything lands in the workspace, it's grounded in a trusted source — official docs and man pages over blogs, primary over secondary. Parametric memory is a pointer to _what to go find_, never the source of truth. Populating `RESOURCES.md` well is the precondition for every deep dive.

## Where it fits

`learn-anything` is a reach-for-it-anytime standalone — a long-running, learner-driven project you drive topic by topic, not a step in a build chain. Its nearest neighbour is [teach](https://aihero.dev/skills-teach), which runs the same stateful-workspace idea from the opposite side (agent-as-teacher rather than learner-as-driver). When you're unsure which skill or flow fits, [ask-matt](https://aihero.dev/skills-ask-matt) routes you.
