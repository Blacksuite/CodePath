# The 5 Projects — Your Portfolio Map

This is your "what am I actually building, and why" page. By the end of this course you'll have five real apps you can show people, link from a CV, or just point to when someone asks "so what can you build?" Each one is deployed and live on the internet.

## Why projects, not just lessons

You don't learn to build apps by watching people build apps. You learn by getting stuck, fixing it, and shipping something that works. Every concept in this course exists to unblock a project. You read a little, then you build.

That matters extra if you've got limited time and a brain that wants a visible win. A finished, deployed app is a checkpoint you can see. It's proof. When you come back after an off-week, you can open the live link and remember: I made this, it still works, I'm not starting from zero.

The portfolio is also your real goal. You said you want to build and ship **your own** apps. These five aren't toy exercises you throw away. They're the skeleton of "I can do this." Once you've shipped a full-stack app with login and a database, building your own idea is the same moves in a different order.

One honest note before you start: the **Habit Tracker is the flagship**. You build it across five phases, and it grows up with you — plain JavaScript, then React, then typed, then a real backend, then tested and deployed. It's the spine of the whole course. The other four are focused side-builds. Each one drills one specific muscle, ships fast, and gets out of the way. That mix is on purpose: one project that teaches you depth, four that give you quick, complete wins.

## The map

| # | Project | Phase(s) | What it proves | Rough time |
|---|---------|----------|----------------|-----------|
| 1 | Personal Portfolio Site | P1 | HTML structure, CSS, responsive layout — a page that looks right on a phone | ~1 week |
| 2 | **Habit Tracker (flagship)** | P2 → P6 | The whole stack, end to end: JS logic, React, types, auth, database, tests, deploy | grows across all phases |
| 3 | Quiz App | P3 | React fundamentals — state, props, components, conditional rendering. No backend | ~1 week |
| 4 | Movie/Recipe Search | P4 | Calling a public API, `fetch`, async, and TypeScript on real-world data | ~1 week |
| 5 | Bookmarks / Read-Later | P5 → P6 | You can build a full-stack Supabase app *on your own* — the independence proof | ~1.5 weeks |

Read the side-builds (3, 4, 5) as breathers and confidence hits between bigger Habit Tracker pushes. They're small on purpose.

---

## 1. Personal Portfolio Site

**What it is:** A single static web page about you — name, a short bio, a few projects, a way to get in touch. Plain HTML and CSS, no JavaScript framework, no backend. Your first thing live on the internet.

**Why this project:** It forces you to actually learn HTML structure and CSS layout instead of skimming past them. There's nowhere to hide — if the spacing is wrong, you see it. And "make it work on a phone" teaches responsive design in the most concrete way possible: shrink the window, watch it break, fix it. This is also the page that'll eventually link to the other four projects, so you're building your own front door.

**Core features (MVP):**
- [ ] A header with your name and one sentence about what you do
- [ ] A short "about me" section
- [ ] A list or grid of projects (placeholders are fine for now)
- [ ] A contact link (email or a social link)
- [ ] Readable and not broken on a phone screen

**Stretch goals (when you're motivated):**
- [ ] A dark/light look you actually like
- [ ] Smooth scrolling or a small hover animation
- [ ] A custom domain name
- [ ] A downloadable CV link

**Done looks like:** The page is live at a public URL (deploy free on GitHub Pages or Netlify), it loads fast, and it doesn't look broken when you open it on your phone. You can text the link to a friend without apologizing for it.

---

## 2. Habit Tracker — the flagship

**What it is:** An app for tracking daily habits. Add a habit, mark it done for the day, see your streak. This is the one you build over and over as you level up, so by Phase 6 it's a real full-stack app with accounts and a database.

This is the spine of the course. Here's how it grows:

- **P2 — vanilla JavaScript:** habits live in the browser (`localStorage`). You write the logic by hand: add, toggle, save, render.
- **P3 — React:** same app, rebuilt with components and state. You feel *why* React exists when the manual DOM updates from P2 turn into clean re-renders.
- **P4 — TypeScript:** you add types. The compiler starts catching the bugs you used to find at runtime.
- **P5 — full-stack with Supabase:** real accounts (auth) and a real database. Your habits now follow you to any device and survive a refresh from a different computer.
- **P6 — tested & deployed:** you add tests so changes don't silently break things, then ship it live.

**Why this project:** Rebuilding the *same* app at each level is the fastest way to feel what each tool actually buys you. You're not guessing why React or types or a backend matter — you lived the version without them. By the end you've touched every layer of a full-stack app, and you understand how they connect because you wired them together yourself.

**Core features (MVP — by the end of Phase 5/6):**
- [ ] Sign up and log in (Supabase auth)
- [ ] Add a habit
- [ ] Mark a habit done for today
- [ ] See your current streak per habit
- [ ] Data is saved to the database and survives logout/login
- [ ] Delete a habit

**Stretch goals (when you're motivated):**
- [ ] A weekly or monthly calendar view of completions
- [ ] Reminders or a "you haven't checked in today" nudge
- [ ] Stats: best streak, completion rate
- [ ] Reorder or categorize habits
- [ ] A polished mobile layout

**Done looks like:** Live on a public URL (deploy free on Vercel or Netlify). A stranger can sign up, add habits, close the tab, come back tomorrow on a different device, log in, and their data is exactly where they left it. It has at least a few tests that pass. This is the app you point to first.

---

## 3. Quiz App

**What it is:** A multiple-choice quiz. Show a question with a few answers, the user picks one, you tell them if they're right, move to the next question, then show a final score. All in React, no backend — questions live in a file in your code.

**Why this project:** This is where React fundamentals stop being abstract. Tracking "which question are we on" and "what's the score" forces you to actually understand `useState`. Showing "correct!" vs "nope" teaches conditional rendering. Looping over answer choices teaches rendering lists and `props`. It's small enough to finish, but it hits every core React idea you need.

**Core features (MVP):**
- [ ] Show one question with multiple answer choices
- [ ] Highlight or mark the answer when clicked
- [ ] Move to the next question
- [ ] Track and show the final score at the end
- [ ] A "play again" button that resets everything

**Stretch goals (when you're motivated):**
- [ ] A countdown timer per question
- [ ] Pull questions from a free trivia API instead of a local file (`search: Open Trivia DB API`)
- [ ] A progress bar ("question 3 of 10")
- [ ] Save high scores to `localStorage`

**Done looks like:** Live on a public URL (Vercel or Netlify). You can play a full quiz start to finish, get a score, and replay — with no errors in the console. You wrote the state logic yourself and can explain what each `useState` is doing.

---

## 4. Movie/Recipe Search

**What it is:** A search box that hits a real public API and shows results. Type "chicken" (recipes) or a movie title (movies), get back a grid of cards with images and details. This is your first app that talks to the outside world, written in TypeScript.

**Why this project:** Real data is messy, and that's the point. You learn `fetch`, async/await, loading states ("searching…"), and what to do when the API returns nothing or errors. TypeScript here is genuinely useful: the API hands you an object with a specific shape, and typing it means your editor tells you exactly what fields exist instead of you guessing and crashing.

**Which API to use:** Go with **TheMealDB** (recipes) for zero friction — it needs **no API key at all**, so you can start fetching immediately. Reference: `https://www.themealdb.com/api.php` (verify on open). If you'd rather build a movie search, use **TMDB** (`https://www.themoviedb.org/`, verify on open) — it's free but you sign up for an API key first, which is a small extra step. Pick recipes if you want the smoothest start.

**Core features (MVP):**
- [ ] A search box you can type into
- [ ] Fetch results from the API on submit
- [ ] Show results as a grid of cards (image + title)
- [ ] A "loading…" state while the request is in flight
- [ ] A sensible message when there are no results
- [ ] Typed API responses (TypeScript)

**Stretch goals (when you're motivated):**
- [ ] A detail view when you click a card (full recipe / movie info)
- [ ] Handle and display API errors gracefully
- [ ] Debounce the search so it doesn't fire on every keystroke
- [ ] A "favorites" list saved in `localStorage`

**Done looks like:** Live on a public URL (Vercel or Netlify). You can search, see real results from a live API, and the app handles "no results" and "still loading" without breaking. The API data is typed, and your editor autocompletes the fields.

---

## 5. Bookmarks / Read-Later

**What it is:** A "save it for later" app. Paste a link with a title, it gets saved to your account, you see your list, you can mark things read or delete them. It's a second full-stack Supabase app — auth plus a database, same shape as the Habit Tracker.

**Why this project:** This is your independence proof. By now you've built the Habit Tracker full-stack *with the course holding your hand step by step*. This time you do the same kind of build with far less guidance. If you can stand up auth, a database table, and the read/create/delete flows on your own here, you've crossed the line from "following a tutorial" to "I can build my own apps." That's the whole goal of the course in one project.

**Core features (MVP):**
- [ ] Sign up and log in (Supabase auth)
- [ ] Add a bookmark (URL + title)
- [ ] See your list of saved bookmarks
- [ ] Mark a bookmark as read / unread
- [ ] Delete a bookmark
- [ ] Each user only sees their own bookmarks

**Stretch goals (when you're motivated):**
- [ ] Tags or folders to organize bookmarks
- [ ] Search or filter your list
- [ ] Auto-grab the page title from the URL
- [ ] Tests, the same way you tested the Habit Tracker in P6

**Done looks like:** Live on a public URL (Vercel or Netlify). Two different people can sign up and each sees only their own bookmarks — never each other's. You built the auth and database wiring with the course stepping back, and you can explain how a logged-in user's data stays separate. When this is done and live, you've proven you can ship a full-stack app on your own.

---

That's the set. Five live apps, one of them a real full-stack flagship, four sharp side-builds. Build them in order, deploy each one, and link them all from your Portfolio Site. By the last one you won't be following a course — you'll just be building.
