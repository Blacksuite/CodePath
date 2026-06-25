# 00 — How to Learn This

Three things decide whether you finish this course: how you study, how you get unstuck, and how you
find answers on your own. None of them are about React. Read this once now, and come back to the
debugging section every single time you're stuck. This is the part most courses skip, and it's the
part that turns "I follow tutorials" into "I build things."

---

## Part 1 — The study system (built for an ADHD brain + a full-time job)

You have 2–5 hours a week and a brain that resists boredom and ambiguity. So the system is designed
to remove ambiguity and create frequent payoffs. The whole thing is a few habits:

**Show up for 20 minutes.** That's the only promise you make. Not "study tonight" (vague, easy to
skip) — "open the file and do 20 minutes." Twenty minutes is small enough that you can't talk
yourself out of it, and most nights you'll keep going past it because starting was the hard part.
On the nights you don't, you still moved forward. That counts.

**One tab, one task.** Before you start, decide the single thing this session is for ("learn
flexbox justify-content," "make the add-habit button work"). Open only what that needs. Every other
tab is a doorway out of focus. Close them.

**Stop in the middle, on purpose.** This is the counterintuitive one. Don't grind until you're
fried and then quit at a natural finish line. Stop *while you still know exactly what comes next* —
mid-feature, mid-sentence even. Leave yourself a one-line note: "next: wire the delete button."
Tomorrow you sit down and you're instantly moving, instead of spending your 20 minutes remembering
where you were. Restarting cold is the single biggest momentum killer; this defeats it.

**End every session with something that runs.** A button that does nothing yet. A page that's
slightly less ugly. A test that passes. The visible result is the dopamine that makes you come back.
Take a screenshot if it helps you feel the progress.

**Off-weeks are allowed.** Life happens. This course has no dates and no streak to break. You do not
fail by pausing for a week or three. You only fail by quitting. When you come back, you don't
restart — you pick up the note you left yourself.

**Build more than you watch.** Watching a video feels like learning and mostly isn't. The rule:
after about two videos with no code typed, stop and build something tiny with what you just saw,
even badly. The knowledge only sticks when your fingers use it.

> 🧠 The honest truth about "motivation": it won't show up reliably, so the system doesn't depend
> on it. Tiny promise, clear next step, visible win. That's the engine.

---

## Part 2 — Debugging is the actual job

Here's the thing nobody tells beginners: professional developers are stuck *constantly*. The
difference between you and them isn't that their code works the first time — it's that they have a
calm, repeatable method for when it doesn't. Right now a red error message feels like a wall. By the
end of this section it's just the next clue.

**First: errors are help, not punishment.** An error message is the computer telling you, as
precisely as it can, what went wrong and often *where*. Beginners panic and scroll past it. Slow
down and actually read it. Out loud, if that helps. Half the time the message says exactly what's
wrong ("x is not a function", "Cannot read properties of undefined (reading 'name')").

**The systematic get-unstuck method.** When something breaks, go in this order — don't skip steps,
don't thrash randomly:

1. **Read the error. The whole thing.** What type of error? What line and file does it point to?
   In the browser, that's the **Console** tab of DevTools (right-click → Inspect → Console).
2. **Find the exact line.** The error usually names a file and line number. Go look at that line and
   the one above it. The bug is almost always right there or just before it.
3. **Check what you *think* is true.** This is the big one. You believe some variable holds a
   certain value. Prove it. Add `console.log(theThing)` right before the broken line and look at
   what actually prints. Reality is usually different from your assumption — and that gap *is* the
   bug.
4. **Google the exact error text.** Copy the key part of the message (drop your specific variable
   names) and search it. Someone has hit this exact error. Read a couple of results — Stack
   Overflow, the official docs, a blog.
5. **Shrink the problem.** Comment out half the code. Does the error go away? Now you know which
   half. Repeat. This "cut it in half" move finds bugs fast and works on anything.
6. **Rubber-duck it.** Explain the problem out loud, step by step, to a rubber duck / your cat / a
   text file. You will very often catch the flaw yourself the moment you have to say it in order.
7. **Walk away for ten minutes.** Genuinely. Your brain keeps working on it in the background and
   the answer often arrives while you're making tea. This is a real technique, not giving up.

Ninety percent of the time you'll be unstuck by step 4. The point of the order is that you stay
*calm and methodical* instead of changing random things and hoping.

**Your tools for step 3 (`console.log`) and beyond:**
- `console.log("habits before save:", habits)` — print a labeled value so you can see what's real.
- The browser **Console** — where errors and your logs show up.
- The browser **Elements/Inspector** — see the actual HTML/CSS the page is using (great for "why
  is this the wrong color/size").
- Later: the **Network** tab — see the requests your app makes to a server and what came back
  (essential in Phase 5).

> ⚠️ The anti-pattern to avoid: changing code at random, re-running, changing something else,
> re-running, with no theory of what's wrong. That's thrashing. If you've made three changes and
> don't know which one mattered, stop, undo, and go back to step 1. One change, one check.

> 🧠 Concept check: your app crashes with "Cannot read properties of undefined (reading 'map')."
> What's your first move?
> <details><summary>Show answer</summary>Read it: something you expected to be an array is
> actually <code>undefined</code>, and you called <code>.map()</code> on it. Go to the line it
> names, and <code>console.log</code> that thing right before the <code>.map()</code> to see why
> it's undefined (often data that hasn't loaded yet, or a typo'd property name).</details>

---

## Part 3 — Reading docs & using AI (the skills that outlast every framework)

Frameworks change. The ability to find answers yourself doesn't. These two skills are what make you
independent.

### Reading official documentation

Beginners avoid docs because they look intimidating and assume knowledge. But docs are the *primary
source* — more accurate and more current than most tutorials. You don't read them front to back;
you learn to *scan* them.

- **Start with "Getting Started" / "Quickstart."** Almost every tool has one. It's the 10-minute
  "here's the minimum to do something real" path. Do that first.
- **Use the search box and the sidebar.** You're looking for one specific thing ("how do I type a
  useState," "what props does this take"). Search for it. Don't read the whole manual.
- **Read the code examples first, prose second.** Docs examples are usually copy-pasteable and show
  you the shape of the answer faster than the paragraphs around them.
- **Match the version.** If the docs say v8 and a random blog uses v5, trust the docs. (This course
  flags these traps for you — outdated React patterns, Supabase v1 vs v2, etc.)
- **"API reference" = the dictionary.** When you know *what* you want but not the exact name/options,
  the reference section lists every function and its parameters. Bookmark the reference pages for
  React (react.dev) and whatever you're using.

You'll build this muscle naturally — every phase points you at real docs on purpose, not just videos.

### Using AI as a tutor, not a crutch

You have AI tools (Claude, ChatGPT). They can accelerate your learning enormously or quietly prevent
it, depending entirely on *how* you use them. The line is simple:

**Good — AI as a tutor:**
- "Explain why this code works, line by line, like I'm new to React."
- "What does this error message mean and what usually causes it?"
- "Here's my code and what I expected vs what happened. What should I check?"
- "Give me three small exercises to practice array methods."
- "What's the difference between props and state, with a tiny example?"

**Bad — AI as a crutch:**
- "Write my habit tracker for me." (You learn nothing; you can't debug what you don't understand.)
- Pasting code you don't understand into your project because it made the error go away.
- Asking it to do the exercise instead of asking it to *check* your attempt.

The test: after the AI helps, could you explain what changed and why, and do it again yourself
tomorrow? If yes, you used it as a tutor. If no, you borrowed an answer you'll have to pay back later
when the same problem returns and you still can't solve it.

A great loop: try it yourself → get stuck → run the debugging method above → if still stuck, ask AI
to *explain the concept or the error* (not write the fix) → apply the understanding yourself. Pasted
code you don't understand is debt. Understanding is the asset.

> 🧠 Concept check: AI hands you a working 20-line function you don't fully follow. What do you do?
> <details><summary>Show answer</summary>Before using it: ask it to explain the function line by
> line, then re-type it yourself (don't paste) so you understand each piece. If you still couldn't
> rewrite it from memory, you're not ready to depend on it — narrow the question to the specific bit
> that's fuzzy.</details>

---

## Putting it together

A normal session looks like this: open the one file for tonight, set the one task, work in 20-minute
bites, lean on the cheat-sheets and docs, hit a wall, run the debugging method calmly, use AI to
*understand* not to *replace*, end with something that runs, and leave yourself a note for next time.

Do that a few hours a week for several months and you will, genuinely, be able to build your own
apps. Now go to **[Phase 0](phases/phase-0-setup.md)**.
