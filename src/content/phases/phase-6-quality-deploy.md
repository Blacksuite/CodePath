# Phase 6 — Quality, polish & ship for real
> **Time:** ~4–6 weeks at 2–5 hrs/wk · **Portfolio work:** Habit Tracker (flagship, shipped publicly) + Bookmarks app → produces portfolio piece #1

## Why this phase matters
Up to now your apps have lived on your laptop. After this phase they live on the internet, at a real URL you can text to a friend or paste on a résumé. You'll also learn the things that separate a demo from a product: handling the moments when data is loading, empty, or broken; a few tests that catch your own mistakes before users do; and enough accessibility so the app works for people who don't use a mouse. This is the phase where the Habit Tracker stops being "a thing I built" and becomes portfolio piece #1.

## What you'll learn
- Deploying a React + Vite app to Vercel straight from GitHub
- The `VITE_` environment-variable prefix and why your secrets must never end up in the browser
- SPA rewrites so deep links (like `/habits/3`) don't 404 on refresh
- Real Git habits: feature branches, meaningful commits, a README that explains your project
- Data visualization with Recharts (streak and completion charts)
- Loading, empty, and error states — the mark of a real app
- Testing basics with Vitest + React Testing Library: what's worth testing and what isn't
- Basic accessibility: labels, alt text, keyboard focus, color contrast

## The concepts (the actual teaching)

### Deploying a Vite app to Vercel from GitHub
Deploying used to mean renting a server and configuring it by hand. You don't have to do any of that. Vercel watches your GitHub repo, and every time you push to your main branch it builds your app and puts the result online. Push code, get a URL. That's the whole loop.

Here's what happens under the hood. Your Vite project has a build command, `npm run build`, which turns your React code into a folder of plain HTML, CSS, and JavaScript (the `dist` folder). Vercel runs that command on its own machines, takes the `dist` folder, and serves it from a fast global network. You connect your GitHub repo once, and from then on it's automatic.

The setup is genuinely a few clicks: sign in to Vercel with GitHub, pick your repo, and it auto-detects that you're using Vite. You usually don't have to change a single setting. Confirm the build command is `npm run build` and the output directory is `dist`, then hit deploy.

```
# Vercel auto-detects these for a Vite project — you rarely touch them:
# Build Command:    npm run build
# Output Directory: dist
# Install Command:  npm install
```

- ⚠️ **Common mistake:** Trying to deploy a project that isn't pushed to GitHub yet, or pushing only some files because of a messy `.gitignore`. Vercel can only build what's in your repo. Make sure `node_modules` is ignored (it should never be committed) but everything else your app needs *is* committed. Do a fresh `git clone` of your repo into a temp folder and run `npm install && npm run build` there — if it builds, Vercel can build it too.
- 🧠 **Concept check:** Vercel builds your app on *its* machines, not yours. What does that tell you about anything that only exists on your laptop (like a file you forgot to commit, or an env var you set locally)?
  <details><summary>Show answer</summary>If it's not in your GitHub repo or configured in Vercel's dashboard, the build doesn't have it. "Works on my machine" means nothing to Vercel — it only sees what you pushed and what you told it.</details>

### The `VITE_` env-var prefix gotcha
Your Habit Tracker talks to Supabase, which means it needs a Supabase URL and an API key. Those go in environment variables, not hardcoded in your files. But Vite has a rule that trips up everyone the first time: **only variables that start with `VITE_` are exposed to your app's code.** Anything without that prefix stays hidden during the build and shows up as `undefined` in the browser.

This isn't Vite being annoying — it's a safety feature. Your React code runs in the user's browser, where anyone can open dev tools and read it. So Vite refuses to leak any variable into that code *unless you explicitly opt in* by prefixing it with `VITE_`. That prefix is you saying "yes, I know this ends up in the browser, and I'm okay with that."

```js
// .env  (and add .env to .gitignore — never commit it)
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

// In your code:
const url = import.meta.env.VITE_SUPABASE_URL   // ✅ works
const secret = import.meta.env.SECRET_KEY       // ❌ undefined — no VITE_ prefix
```

You set these same variables in Vercel's dashboard under Settings → Environment Variables, because remember: Vercel builds on its own machines and never sees your local `.env` file. Set them in both places.

- ⚠️ **Common mistake:** Putting a *real* secret (like a database admin key or a service-role key) in a `VITE_` variable. The Supabase **publishable key** (older projects call it the **anon key**) is designed to be public and safe in the browser — that's fine. But anything you'd be upset to see leaked must never get the `VITE_` prefix, because that prefix guarantees it lands in code anyone can read. If you need a true secret, it belongs in a backend or a serverless function, not the frontend bundle.
- 🧠 **Concept check:** You add `VITE_API_KEY` to Vercel, redeploy, and it works. A teammate says "great, our secret is safe now." Are they right?
  <details><summary>Show answer</summary>No. Anything with the `VITE_` prefix is baked into the JavaScript the browser downloads. It is *not* secret — anyone can read it in dev tools. It's fine for keys meant to be public (like the Supabase publishable/anon key, which is protected by Row Level Security), but never for a true secret.</details>

### SPA rewrites so deep links don't 404
React Router makes it *look* like you have many pages — `/`, `/habits`, `/habits/3` — but your app is really one HTML file. The router just swaps what's on screen based on the URL. This works great while you're clicking around inside the app.

It breaks the moment someone loads a deep URL directly — by refreshing the page on `/habits/3`, or opening a link you sent them. Now the browser asks Vercel's server for a file at `/habits/3`. There is no such file. Only `index.html` exists. So the server returns a 404, and your user sees an error instead of your app.

The fix is a **rewrite**: a rule telling Vercel "for any path you don't recognize, serve `index.html` anyway, and let React Router sort out what to show." You add a small `vercel.json` file at the root of your project.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Now every URL loads `index.html`, React boots up, the router reads the URL, and shows the right screen. Deep links work, refresh works, shared links work.

- ⚠️ **Common mistake:** Testing only by clicking around in the deployed app and concluding "deep links work fine." They will — clicking never hits the server for a new file. You only discover the 404 when you *refresh* on a non-home route. Always test by hitting refresh on a deep page after deploying.
- 🧠 **Concept check:** Why does clicking a link to `/habits/3` inside your app work even without the rewrite, but refreshing on `/habits/3` doesn't?
  <details><summary>Show answer</summary>Clicking is handled entirely in the browser by React Router — no server request for a new file. Refreshing makes the browser ask the server for `/habits/3`, which doesn't exist as a file, so without the rewrite you get a 404.</details>

### Good Git habits: branches, commits, a real README
You've been using Git already. Now treat it like a professional, because a clean repo *is* part of your portfolio — recruiters and other developers will look at it.

**Feature branches.** Don't build everything on `main`. When you start a piece of work — say, adding charts — create a branch: `git checkout -b add-charts`. Build there, and when it's working, merge it back into `main`. This keeps `main` always-deployable and makes your history readable. It also means a half-finished experiment never breaks your live site.

**Meaningful commits.** A commit message should finish the sentence "This commit will…". `git commit -m "Add streak chart to dashboard"` tells a story. `git commit -m "stuff"` or `git commit -m "fix"` tells you nothing in three months. Commit in small, logical chunks — one idea per commit — not one giant commit at the end of the day.

```bash
git checkout -b add-charts        # start a feature branch
# ...write code...
git add .
git commit -m "Add weekly completion chart with Recharts"
git checkout main
git merge add-charts              # bring it into main
git push                          # Vercel auto-deploys
```

**A real README.** Your README is the front door to your repo. At minimum: what the app does (one or two sentences), a screenshot or the live link, the tech stack, and how to run it locally (`npm install`, set up `.env`, `npm run dev`). This is the single highest-leverage thing you can write for your portfolio — most people's repos have no README at all, so a good one makes you stand out instantly.

- ⚠️ **Common mistake:** Committing your `.env` file or `node_modules`. Once a secret is in Git history, it's there forever (even after you delete the file) and you have to rotate the key. Set up `.gitignore` *before* your first commit, and double-check `git status` doesn't list `.env`.
- 🧠 **Concept check:** Why keep `main` always-deployable instead of just committing directly to it as you go?
  <details><summary>Show answer</summary>Because Vercel deploys `main` automatically. If `main` is always in a working state, your live site is never broken by half-done work. Feature branches let you experiment freely and only merge when something actually works.</details>

### Data visualization with Recharts
Numbers in a list are forgettable. A chart showing your habit streak climbing over two weeks is satisfying and instantly readable. Recharts is a React charting library that fits the way you already think: you build a chart out of components, the same way you build the rest of your UI.

Install it with `npm install recharts`. The key idea is that you feed a chart an array of plain objects (your data), and tell it which keys map to the x-axis and which to the lines or bars. Each piece — the chart, the axes, the line, the tooltip — is its own component you nest inside.

```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', completed: 3 },
  { day: 'Tue', completed: 5 },
  { day: 'Wed', completed: 4 },
]

function StreakChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="completed" stroke="#4f46e5" />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

Notice `ResponsiveContainer`. Charts need an explicit width and height to draw, but you don't know how wide the screen is. `ResponsiveContainer` measures its parent and sizes the chart to fit, so the same chart looks right on a phone and a laptop. Wrap your charts in it almost every time.

Your real job here is shaping your habit data into the array Recharts wants — usually one object per day with a count. The charting itself is the easy part once the data is in the right shape.

- ⚠️ **Common mistake:** Forgetting to give the chart a height, or putting `ResponsiveContainer` inside a parent that has no height of its own. The chart silently renders at zero height and you see nothing. Give the container an explicit `height`, and make sure its parent isn't collapsed.
- 🧠 **Concept check:** Why does Recharts make you wrap a chart in `ResponsiveContainer` instead of just figuring out the size itself?
  <details><summary>Show answer</summary>SVG charts need concrete pixel dimensions to draw, but those depend on the screen and layout, which Recharts can't know in advance. `ResponsiveContainer` measures the parent element at runtime and passes real dimensions down to the chart.</details>

### Loading, empty, and error states
This is the single biggest thing that separates a real app from a demo, and almost no tutorial teaches it. Whenever your app fetches data, there are at least three moments to handle, not one:

- **Loading** — the request is in flight. Show a spinner or skeleton, not a blank screen. Without this, users stare at nothing and assume the app is broken.
- **Empty** — the request succeeded but there's no data. A new user with zero habits should see a friendly "Add your first habit" prompt, not a void. Empty states are a chance to guide the user, not an error to hide.
- **Error** — the request failed (offline, server down, bad permissions). Show a clear message and ideally a retry button. Never let the app just silently break or show a cryptic crash.

```jsx
function HabitList() {
  const { habits, loading, error } = useHabits()

  if (loading) return <p>Loading your habits…</p>
  if (error)   return <p>Couldn't load habits. <button onClick={retry}>Try again</button></p>
  if (habits.length === 0) return <EmptyState message="No habits yet — add your first one!" />

  return <ul>{habits.map(h => <HabitRow key={h.id} habit={h} />)}</ul>
}
```

Get in the habit of asking, for every data fetch: what does the user see while it loads, when there's nothing, and when it breaks? Handle those three and your app instantly feels finished.

> ⏸️ **Good place to stop.** You've covered a lot of ground — deploying, env vars, Git, charts, and states. If you only have an hour today, deploy your existing Habit Tracker to Vercel and stop there. Come back fresh for testing and accessibility. Shipping *something* live is a real win; bank it.

- ⚠️ **Common mistake:** Handling only the happy path — you test with your own account that already has data and a fast connection, so you never see the loading flash or the empty screen. Test deliberately: throttle your network in dev tools, and create a brand-new account with no data to see what a first-time user actually experiences.
- 🧠 **Concept check:** Your app shows a blank white screen for a second before habits appear. Which of the three states is missing, and why does it matter?
  <details><summary>Show answer</summary>The loading state. During the fetch, you're rendering nothing instead of a "loading" indicator. A blank screen reads as "broken" to users; a spinner or skeleton tells them the app is working and to wait a moment.</details>

### Testing basics with Vitest + React Testing Library
Tests are code that checks your other code still works. The payoff: you change something, run your tests, and instantly know whether you broke anything — instead of clicking through the whole app by hand every time. **Vitest** is the test runner (it finds and runs your tests). **React Testing Library (RTL)** helps you render a component and interact with it the way a user would.

The golden rule of RTL is **"test how users use it."** Don't test internal details like "this state variable is now `true`." Test what a user would see and do: "when I type a habit name and click Add, the habit appears in the list." If your test reads like a user story, you're doing it right. A bonus: tests written this way don't break when you refactor the internals, because the user-facing behavior didn't change.

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect } from 'vitest'
import AddHabit from './AddHabit'

test('adds a habit when the form is submitted', async () => {
  render(<AddHabit />)
  await userEvent.type(screen.getByLabelText(/habit name/i), 'Drink water')
  await userEvent.click(screen.getByRole('button', { name: /add/i }))
  expect(screen.getByText('Drink water')).toBeInTheDocument()
})
```

You don't need 100% coverage, and chasing it is a waste of your time. Test the things that would actually hurt if they broke: your core logic (does the streak calculation give the right number?) and your key interactions (can a user add and complete a habit?). A handful of meaningful tests beats a hundred that check trivia. Notice the test above finds the input by its *label* — which only works if your form has a proper label, so testing nudges you toward accessible markup for free.

- ⚠️ **Common mistake:** Testing implementation details instead of behavior — reaching into a component to check a piece of state, or relying on a specific CSS class. These tests break every time you refactor, even when nothing's actually wrong, and they don't prove the app works for users. Query by what a user sees: visible text, labels, roles, button names.
- 🧠 **Concept check:** Two tests both pass. One checks "the `isOpen` state is `true` after clicking." The other checks "the menu is visible after clicking." Which is the better test and why?
  <details><summary>Show answer</summary>The second. It tests user-visible behavior (the menu appears), so it stays valid even if you rename or restructure the state. The first is tied to internal details and will break on a harmless refactor while telling you nothing about what the user experiences.</details>

### Basic accessibility
Accessibility (often written **a11y**) means your app works for people who don't use it the way you do — people using a screen reader, navigating by keyboard, or with low vision. It's not a niche concern, and a lot of it is just doing things properly. Four high-impact basics:

- **Labels on inputs.** Every form field needs a real `<label>` tied to it, so a screen reader announces "Habit name, text field" instead of just "text field." Bonus, as you saw: it makes your tests easier to write.
- **Alt text on images.** A meaningful image needs `alt` describing it (`alt="Weekly streak chart"`). A purely decorative image gets `alt=""` so screen readers skip it. Missing alt text leaves blind users with "image" and nothing else.
- **Keyboard focus.** Everything clickable must be reachable and usable with the Tab key and Enter, and the focused element must be visibly highlighted. Don't remove the focus outline unless you replace it with something just as clear.
- **Color contrast.** Light-gray text on a white background is unreadable for many people. Aim for strong contrast between text and background; browser dev tools and free checkers will flag failures.

```jsx
// Label tied to its input via htmlFor / id:
<label htmlFor="habit-name">Habit name</label>
<input id="habit-name" type="text" />

// Meaningful image gets real alt text; decorative one gets empty alt:
<img src="/streak.png" alt="Weekly completion chart" />
<img src="/divider.svg" alt="" />
```

Use real semantic elements, too — a `<button>` for actions and an `<a>` for links — instead of a `<div>` with an `onClick`. Real buttons and links are keyboard-accessible and announced correctly for free; you'd have to rebuild all of that by hand on a `<div>`.

- ⚠️ **Common mistake:** Removing the focus outline (`outline: none`) because it looks "ugly," with nothing to replace it. Now keyboard users can't tell where they are on the page, and your app is unusable for them. If you don't like the default outline, style a nicer one — never just delete it.
- 🧠 **Concept check:** You build a clickable card using `<div onClick={...}>`. What two things does a real `<button>` give you that this `<div>` doesn't?
  <details><summary>Show answer</summary>Keyboard access (a `<button>` is focusable with Tab and activates on Enter/Space automatically) and correct screen-reader semantics (it's announced as a button). A `<div>` has neither unless you manually add `tabIndex`, key handlers, and a `role` — far more work than just using the right element.</details>

## Guided resources

| Resource | What to use it for | Link |
|---|---|---|
| Vercel — Vite on Vercel | Deploying, the `VITE_` prefix, and SPA rewrites | https://vercel.com/docs/frameworks/frontend/vite |
| Vercel — Environment Variables | Setting your Supabase keys in the Vercel dashboard | https://vercel.com/docs/environment-variables |
| Vercel — Deploy GitHub projects | Connecting your repo for auto-deploys on push | https://vercel.com/docs/git/vercel-for-github |
| Recharts — Getting Started / Installation | Installing and your first chart | https://recharts.github.io/en-US/guide/getting-started/ · https://recharts.github.io/en-US/guide/installation/ |
| Build Charts in React w/ Recharts in 7 Minutes (short) | A fast visual walkthrough of a real chart | https://www.youtube.com/watch?v=Fu_YFp-9xoQ (verify on open) |
| Vitest — Getting Started | Setting up the test runner in a Vite project | https://vitest.dev/guide/ |
| React Testing Library — Intro | The "test how users use it" philosophy and core API | https://testing-library.com/docs/react-testing-library/intro/ |
| React Testing Full Course 2026 (Vitest + RTL; watch in chunks) | Deeper, hands-on testing practice | https://www.youtube.com/watch?v=6dOpQIwyV6g (verify on open) |
| Accessibility — W3C WAI tips / MDN | Practical a11y checklist and deeper learning | https://www.w3.org/WAI/tips/developing/ · https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility |

## Exercises (do these — don't just read)
- [ ] Deploy *any* existing Vite project to Vercel from GitHub and confirm the live URL loads. Then break it on purpose: refresh on a deep route *before* adding the rewrite, watch the 404, then add `vercel.json` and watch it work.
- [ ] Take one component that fetches data and add all three states — loading, empty, error. Throttle your network in dev tools to actually see the loading state, and use a fresh empty account to see the empty state.
- [ ] Build one Recharts chart from a hardcoded array (start small), then swap the hardcoded array for real data you've shaped from your app. Wrap it in `ResponsiveContainer` and resize the window to confirm it adapts.
- [ ] Write three tests for a single component: one for rendering, one for a user interaction (type + click), and one for your core logic. Run them, then intentionally break the component and watch a test fail.
- [ ] Run an accessibility pass on one page: tab through it with no mouse (can you reach and activate everything?), check every input has a label and every image has appropriate alt text, and run a contrast checker on your text.
- [ ] Write a real README for one project: what it does, a screenshot or live link, the stack, and local setup steps.

## Portfolio build — Habit Tracker (ship it publicly) + Bookmarks
This is the milestone build. Work in small commits on feature branches and merge to `main` when each piece works.

- [ ] **Clean the repo.** Confirm `.gitignore` excludes `node_modules` and `.env`. Run `git status` and make sure no secrets are staged.
- [ ] **Add states.** Give the Habit Tracker proper loading, empty, and error states everywhere it fetches data.
- [ ] **Add a chart.** Install Recharts and add a streak or weekly-completion chart to the dashboard, wrapped in `ResponsiveContainer`.
- [ ] **Accessibility pass.** Labels on every input, alt text on images, visible keyboard focus, readable contrast. Tab through the whole app with no mouse.
- [ ] **Write tests.** Add Vitest + RTL and write a small set of meaningful tests: your streak/completion logic and the core add-and-complete-a-habit interaction. Make them pass.
- [ ] **Write the README.** What it does, a screenshot, the live link (you'll fill this in after deploying), the stack, and how to run it locally.
- [ ] **Deploy to Vercel.** Connect the GitHub repo, set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` env vars in the Vercel dashboard, add `vercel.json` for SPA rewrites, and deploy.
- [ ] **Verify the live app.** Sign up as a brand-new user, add and complete habits, refresh on a deep route (no 404), and confirm the chart and all three states behave on the real URL.
- [ ] **Repeat the essentials for the Bookmarks app.** Loading/empty/error states, an accessibility pass, a couple of tests, a README, and deploy it too. This is your independence proof — fewer hand-holds, same checklist.

## 🎯 Milestone & self-check
**Milestone:** A polished, tested, deployed full-stack Habit Tracker living at a public URL, backed by a clean GitHub repo with a real README — plus the Bookmarks app deployed alongside it. **This is portfolio piece #1. It's done and it's public.**

**Prove it** — Can you, from a blank file with no copying…
- [ ] Explain why a variable needs the `VITE_` prefix to reach your React code, and why that means it's *not* secret?
- [ ] Explain why refreshing on `/habits/3` 404s without a rewrite, and write the `vercel.json` that fixes it?
- [ ] Name the three data-fetch states and say what the user sees in each?
- [ ] Write a React Testing Library test that fills a form and asserts the result appears — querying by label and role, not by internal state?
- [ ] List four accessibility basics and explain why a real `<button>` beats a clickable `<div>`?

If you can do all five from memory, you've genuinely learned this — not just followed steps.

## Time estimate
Roughly **18–28 hours** over 4–6 weeks at 2–5 hrs/week. Rough split: deploy + Git + env vars (4–6h), loading/empty/error states (3–5h), Recharts (3–4h), testing setup + writing tests (4–6h), accessibility pass + README (2–4h), then repeating the essentials for the Bookmarks app (3–5h). Spread it across short sessions — most of these are small, satisfying wins you can knock out one at a time.
