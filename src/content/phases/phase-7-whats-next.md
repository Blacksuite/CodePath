# Phase 7 — What's next (ongoing)

> **Time:** ongoing · a few hours to assemble the portfolio, then a monthly habit · **Portfolio work:** assemble all 5 projects into one presentable portfolio

## Why this phase matters

Here's the honest truth about where you are: you can build and ship your own React full-stack apps. Frontend, backend, auth, a real database, tests, deployment. That's the whole loop. Most people who say they "want to learn to code" never get here.

So this phase isn't a new pile of curriculum. It's about what carries you from "I finished a course" to "I'm a developer who keeps building." The thing that does that isn't another tutorial. It's reps.

## What you'll learn

- Why the next step is reps, not more tutorials, and how to get out of tutorial-hell.
- How to learn a new tool *when a real project demands it* instead of hoarding tools up front.
- A short "reach for this when…" menu of common tools, so you know what exists without learning it all now.
- How to keep momentum with ADHD: ship small, ship often, build in public, find people.
- How to turn your 5 projects into a portfolio that actually gets looked at.

## The concepts (the actual teaching)

### Reps, not tutorials

A tutorial gives you a path where every step works. Real projects don't do that. The gap between "I followed along" and "I built it myself" is the gap you close by building things where nobody hands you the next line.

That feeling of being stuck, googling an error, trying three things that don't work, then the fourth that does — that *is* the learning. It feels worse than watching a video, which is exactly why it teaches more. A video feels like progress. Struggling on your own *is* progress.

So the rule from here: build more than you watch. When you catch yourself queuing up a fifth tutorial on a thing you already half-know, stop and go build the smallest version of it instead.

```text
Tutorial-hell:   watch → watch → watch → feel behind → watch
The way out:     build → get stuck → fix it → ship → build again
```

- ⚠️ **Common mistake:** thinking you need to "finish learning" before you build real things. You don't. You already know enough. The remaining gaps get filled *by* building, one error at a time.
- 🧠 **Concept check:** You want to add drag-and-drop to your Habit Tracker and you've never done it. Do you (a) take a 4-hour course on UI interactions first, or (b) start building it and look things up as you hit them?
  <details><summary>Show answer</summary>(b). Start building. You'll learn the specific thing you need far faster than a broad course teaches it, and you'll actually remember it because you used it immediately.</details>

### Learn-when-needed

You don't pick tools because they're popular. You pick them when a real project starts hurting without them. The pain tells you what to learn next.

Writing `fetch` and managing loading state by hand on every component? That ache is your signal to look at a data-fetching library. Hand-writing the same CSS over and over and fighting your own stylesheets? That's your signal to try a styling tool. The need comes first, then the tool. Never the reverse.

This matters because tools learned without a problem don't stick. You'll read the docs, nod along, and forget it by next week because nothing in your brain has a hook to hang it on. Learned *against* a real annoyance, the same tool clicks in an afternoon.

- ⚠️ **Common mistake:** collecting tools like trading cards. Knowing the names of 20 libraries you've never used is worth less than having shipped 3 apps with plain React. Depth beats breadth here.
- 🧠 **Concept check:** Is "everyone says Tailwind is great" a good enough reason to stop and learn Tailwind right now?
  <details><summary>Show answer</summary>No. "I'm sick of writing the same CSS and my stylesheets are a mess" is the reason. The annoyance is the trigger, not the hype.</details>

### A "reach for this when…" menu

These are the tools worth knowing *exist*. Don't learn them now. Bookmark this, and when a project starts hurting in the matching way, that's your cue to pull one in. Each is in the resources table below.

- **TanStack Query (React Query)** — reach for this when manual `fetch` plus loading and caching state is getting painful and repetitive across your components.
- **Tailwind CSS** — reach for this when hand-writing CSS is slowing you down and you keep rewriting the same rules.
- **Next.js** — reach for this when you want routing, server rendering, and a backend in one framework instead of wiring pieces together.
- **Hono** — reach for this when you want a lightweight, modern backend to call your own. A good first "real backend."
- **Express** — reach for this when you want the classic Node backend with the biggest tutorial pool to lean on.

One at a time. Add a tool, ship something with it, *then* consider the next one. Adding three at once just means three new things confusing you at the same time.

- ⚠️ **Common mistake:** rewriting a working app just to use a new tool. If the app works and the tool isn't solving a real pain, leave it alone. Reach for the new tool on the *next* project.

### Momentum that survives ADHD

Motivation is unreliable, especially with ADHD. The off-weeks are coming. The trick isn't more willpower, it's lowering the bar so far that starting is easy and the wins are visible.

**Ship something small every month.** Not a big app. A tiny one. A tip calculator, a single-purpose tool, a weekend toy. The point is the *finish line*, monthly. Small and shipped beats big and abandoned, every time.

**Rebuild an app you admire.** Pick something you use — a to-do app, a habit app, a notes tool — and rebuild a slice of it. You learn a lot from copying something good on purpose, because the design decisions are already made for you and you just focus on the building.

**Build in public.** Post what you made, even rough. A tweet, a short Reddit post, a screenshot. It does two things: it gives you a tiny external deadline, and it connects you to people doing the same thing. The accountability is the feature, not the audience size.

**Find people.** Coding alone with ADHD is the hard-mode. A Discord or a subreddit where you can ask "why is this broken" and see others struggling makes the whole thing lighter. See the community links below.

> ⏸️ **Stop here if you've been reading a while.** This section is the heart of the phase — the rest is the portfolio checklist. Close the file, and before you next open it, ship one tiny thing. Then come back and assemble the portfolio.

- ⚠️ **Common mistake:** waiting until you "have time for a big project." You won't. The monthly small thing is what keeps the muscle alive through the busy and the off weeks.
- 🧠 **Concept check:** Which is better for momentum: one ambitious app you work on for six months and never finish, or six tiny apps you actually ship?
  <details><summary>Show answer</summary>Six shipped tiny apps. Each finish gives you a visible win, a thing to show, and proof to yourself that you ship. Momentum is built from finishes, not from effort.</details>

### Turn projects into a portfolio that gets noticed

You have five real projects. Most beginners have zero finished, shippable things. The work now is making them easy for someone else to look at in 30 seconds — because that's all the attention a recruiter or a curious person gives.

Three things make a project look real:

**A live demo link.** People will not clone your repo and run it. They'll click a link or move on. A deployed URL (you already deployed in Phase 6) is the single most important thing.

**A README with a screenshot.** Open the repo, see a picture and two sentences on what it is and what you built. A screenshot at the top of the README does more than a paragraph.

**A portfolio page that ties it together.** You already built one in Project 1 (your Personal Portfolio Site). Now it earns its keep: list the five projects, each with a live link and a GitHub link.

```markdown
## Habit Tracker
A full-stack habit tracker with auth and a real database.
React · TypeScript · Supabase · deployed on the web.

🔗 Live demo: https://your-habit-tracker.example.app
💻 Code: https://github.com/you/habit-tracker
```

- ⚠️ **Common mistake:** a GitHub full of repos with no README, no live link, and a default name. To anyone scanning, that reads as "nothing here." A repo without a demo link and a one-line description might as well be private.

## Guided resources

| Resource | What to use it for | Link |
|---|---|---|
| TanStack Query (React Query) | When manual fetch/caching gets painful | https://tanstack.com/query |
| Tailwind CSS | When hand-writing CSS slows you down | https://tailwindcss.com |
| Next.js | When you want routing + server rendering + backend in one framework | https://nextjs.org |
| Hono | Lightweight modern backend, a good first "real backend" | https://hono.dev |
| Express | The classic Node backend, huge tutorial pool | https://expressjs.com |
| Community — The Odin Project Discord | Ask questions, see others learning, stay accountable | search: The Odin Project Discord |
| Community — r/learnprogramming | Build in public, ask questions, find people | https://www.reddit.com/r/learnprogramming/ |

## Portfolio build — assemble your 5 projects

Pull your five projects into one presentable portfolio. Work through this in short sessions — one project per sitting is fine.

- [ ] Confirm each of the 5 projects has a live, deployed URL that loads: Personal Portfolio Site, Habit Tracker, Quiz App, Movie/Recipe Search, Bookmarks / Read-Later.
- [ ] For each project repo, add or polish a README: one-line description, what you built, the tech used, and a screenshot at the top.
- [ ] Add a live-demo link and a GitHub link to the top of every README.
- [ ] Update your Personal Portfolio Site (Project 1) to list all 5 projects, each with its live link and GitHub link.
- [ ] Deploy the updated portfolio page and click every single link to confirm none are broken.
- [ ] Ship one tiny new app this month and add it to the portfolio when it's done.
- [ ] Post one project publicly (Reddit, a tweet, a Discord) and join one community from the list above.

## 🎯 Milestone & self-check

**Milestone:** a public portfolio page listing all 5 projects, each with a working live link and a GitHub link — and a habit of shipping something small every month.

**Prove it.** Can you, from where you are right now, with no hand-holding…

- [ ] Send someone one URL that shows all five of your projects, each clickable and live?
- [ ] Open any of your repos and have a stranger understand what it is in under a minute?
- [ ] Name the specific annoyance that would make you reach for one of the menu tools on your next project?
- [ ] Point to one small thing you shipped *after* finishing this course — not during it?
- [ ] Name one community you've actually posted in?

If you can tick those, you're not "learning to code" anymore. You're a developer who builds and ships. Keep the monthly habit and the rest takes care of itself.

## Time estimate

A few focused hours to assemble and polish the portfolio (spread across short sessions). After that, this phase is ongoing: roughly 2–5 hrs/week of building, with the goal of shipping one small thing each month. No deadline — the habit is the point.
