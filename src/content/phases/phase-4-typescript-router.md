# Phase 4 — TypeScript + leveling up React
> **Time:** ~5–7 weeks at 2–5 hrs/wk · **Portfolio work:** add TypeScript + routing to the **Habit Tracker** (today / stats / habit detail pages), and build **Project 4 — Movie/Recipe Search**

## Why this phase matters

By the end of this phase, your editor catches bugs *while you type* instead of you finding them when the app crashes. You'll add TypeScript to your React apps, split your Habit Tracker into real multi-page navigation, manage bigger state without your components turning into spaghetti, and pull live data from a real API on the internet. This is the point where your projects start looking like the kind of thing a junior dev ships at work.

## What you'll learn

- Why TypeScript exists and how it catches bugs before runtime
- Basic types, interfaces, and typing function parameters and return values
- Typing React: `.tsx` files, typed props, typed `useState`, and reading TS errors calmly
- **Custom hooks** — extracting reusable logic, and the `use` naming rule (e.g. `useLocalStorage`)
- **React Router** (current v7/v8, Declarative mode) — routes, links, URL params, multiple pages
- Bigger state with **useReducer** (built into React), and when to reach for **Zustand** (usually: don't yet)
- **Fetching a public API** with `fetch` + `async/await` + typed responses

> 🧭 **Pacing note:** this is the densest phase — more brand-new concepts than any other (TypeScript, typing React, custom hooks, Router, useReducer, fetching). Don't try to swallow it in big sittings. TypeScript and React Router are fairly independent threads, so if one is frustrating you, switch to the other — there's no rule that says you must finish TS before starting the Router. Spread it over a few weeks and let off-weeks happen.

## The concepts (the actual teaching)

### Why TypeScript

JavaScript lets you do nonsense and only complains when the app is already running. You call `user.name` but the API actually sent `user.fullName`, and you find out when the screen shows `undefined` in front of a user. TypeScript is JavaScript with a layer that checks your types *before the code runs* — usually right in your editor, with a red squiggle.

The big idea: you describe the *shape* of your data once, and TypeScript holds you to it everywhere. Pass a string where a number belongs? Red squiggle. Forget that `age` might be undefined? Red squiggle. It's a spell-checker for the structure of your data.

It compiles down to plain JavaScript, so the browser never sees TypeScript. The types exist to help *you*, then get stripped away.

```ts
// A type annotation: "title is a string, done is a boolean"
function toggleHabit(title: string, done: boolean): string {
  return `${title} is now ${done ? "done" : "not done"}`;
}

toggleHabit("Drink water", true); // fine
toggleHabit("Drink water", "yes"); // ❌ TS error: "yes" is not a boolean
```

- ⚠️ **Common mistake:** thinking TypeScript runs in the browser. It doesn't. It checks your code, then compiles to regular JS. If your types are wrong but you ignore the errors, the app may still *run* — TS is a safety net, not a wall.
- 🧠 **Concept check:** When does TypeScript catch a type error — while you write code, or when a user clicks the button?
  <details><summary>Show answer</summary>While you write code (and at build time). That's the whole point — it moves the discovery of bugs from "user clicks button in production" to "red squiggle in your editor."</details>

### Types, interfaces, and typing functions

You'll use a handful of basic types constantly: `string`, `number`, `boolean`, arrays like `string[]`, and `null`/`undefined`. For objects, you describe their shape with an `interface` (or a `type` — they're nearly interchangeable for objects; pick `interface` and move on).

An interface is a named description of an object's shape. Define it once, reuse it everywhere. This is the single most useful TypeScript feature for app building, because your whole app is objects flowing around: a habit, a movie, a user.

```ts
interface Habit {
  id: string;
  title: string;
  streak: number;
  done: boolean;
}

// Typing a function: each param has a type, and the part after `)` is the return type
function describe(habit: Habit): string {
  return `${habit.title} — ${habit.streak} day streak`;
}
```

For function parameters you write `name: type`. For what the function gives back, you write the return type after the parentheses: `function foo(): number`. Often you can leave the return type off and let TypeScript *infer* it, but writing it for important functions documents your intent and catches mistakes.

A field can be optional with `?`: `notes?: string` means "notes might not be there." When something is optional, TypeScript forces you to check before you use it — which is exactly the bug it's saving you from.

- ⚠️ **Common mistake:** reaching for `any` the moment a type gets annoying. `any` turns TypeScript off for that value and lets all its bugs back in. If you're stuck, try `unknown` (forces you to check before using) or take a minute to describe the real shape. Treat every `any` as a small debt.
- 🧠 **Concept check:** What does `notes?: string` mean, and what does TypeScript make you do before using `habit.notes.length`?
  <details><summary>Show answer</summary>The `?` makes `notes` optional — it's `string | undefined`. Before calling `.length`, TS makes you confirm it exists, e.g. `if (habit.notes) { habit.notes.length }`, so you never call `.length` on `undefined`.</details>

### Typing React: .tsx, props, and useState

React with TypeScript uses the `.tsx` extension (the `x` is for JSX). Vite's React-TS template sets all of this up for you, so you start a typed project the same way you started a plain React one — just pick the TypeScript template.

The two things you'll type constantly are **props** and **state**. For props, you describe the shape the component expects with an interface, then annotate the function's parameter with it:

```tsx
interface HabitCardProps {
  title: string;
  streak: number;
  onToggle: () => void; // a function that takes nothing and returns nothing
}

function HabitCard({ title, streak, onToggle }: HabitCardProps) {
  return (
    <button onClick={onToggle}>
      {title} — {streak} days
    </button>
  );
}
```

Now if you forget to pass `streak`, or pass a string where a number goes, you get a red squiggle at the call site. Your components document themselves.

For `useState`, TypeScript usually *infers* the type from the initial value: `useState(0)` is a number, `useState("")` is a string. You only annotate when the initial value doesn't tell the full story — like a value that starts `null` but will later hold a `Habit`:

```tsx
const [habits, setHabits] = useState<Habit[]>([]); // empty array, but typed as Habit[]
const [selected, setSelected] = useState<Habit | null>(null); // null now, Habit later
```

- ⚠️ **Common mistake:** `useState([])` with no type. TS infers `never[]` (an array that can never hold anything), and you get confusing errors the moment you try to add a real item. Write `useState<Habit[]>([])` when the array starts empty.
- 🧠 **Concept check:** Why does `useState<Habit | null>(null)` need an explicit type but `useState(0)` doesn't?
  <details><summary>Show answer</summary>`useState(0)` gives TS enough info — the value is a number. `useState(null)` only tells TS "it's null," so without `<Habit | null>` it would never let you store a habit there later.</details>

### Reading TypeScript errors without panic

TypeScript errors look scary because they're verbose and sometimes point at the wrong-looking line. The trick: **read only the first line, ignore the wall of text underneath until you need it.** The first line almost always says what TS expected versus what it got.

A very common one: `Type 'string | undefined' is not assignable to type 'string'.` Translation: "this value might be undefined, but you're using it somewhere that requires a definite string." The fix is usually to check for the missing case (`if (value) {...}`) or provide a fallback (`value ?? "default"`).

When an error is genuinely confusing, hover over the variable in your editor — it shows you the type TS actually thinks it has. Nine times out of ten the surprise is "oh, this can be undefined and I forgot."

```ts
// Error: 'streak' is possibly 'undefined'
const habit = habits.find((h) => h.id === id); // find() can return undefined!
console.log(habit.streak); // ❌

// Fix: handle the "not found" case
if (habit) {
  console.log(habit.streak); // ✅ TS now knows habit exists here
}
```

- ⚠️ **Common mistake:** trying to "make the error go away" with `as` casts or `!` (the non-null assertion) without understanding *why* TS complained. That silences the warning but keeps the bug. Fix the cause, not the symptom.
- 🧠 **Concept check:** What is `Array.prototype.find` warning you about when it returns `Habit | undefined`?
  <details><summary>Show answer</summary>It might not find anything. `find` returns `undefined` when no element matches, so TS makes you handle the "not found" case before using the result.</details>

> ☕ **Stop here and take a break if you've been at it a while.** You just learned a whole new layer on top of React. Close the laptop, let it settle. The router stuff below is a fresh session.

### Custom hooks (and the `use` rule)

When you find yourself copy-pasting the same `useState` + `useEffect` logic between components, that's a custom hook waiting to happen. A custom hook is just a function whose name starts with `use` and that calls other hooks inside it. That's the entire definition. It lets you extract stateful logic, name it, and reuse it.

The `use` prefix isn't decoration — React's rules-of-hooks linter relies on it to know "this function contains hooks, so apply the hook rules here." Name it `getLocalStorage` instead of `useLocalStorage` and the linter stops protecting you.

A classic example is `useLocalStorage`, which behaves like `useState` but also saves to `localStorage` so the value survives a page refresh. Perfect for the Habit Tracker:

```tsx
import { useState, useEffect } from "react";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const; // as const keeps the tuple type [T, setter]
}

// Use it exactly like useState:
const [habits, setHabits] = useLocalStorage<Habit[]>("habits", []);
```

Notice it *returns* the state and setter, just like `useState`. Custom hooks don't render anything — they package up logic. The component using it stays clean.

- ⚠️ **Common mistake:** trying to call a hook (custom or built-in) inside a loop, condition, or event handler. Hooks must be called at the top level of a component or another hook, in the same order every render. The `use` prefix + linter exists to catch exactly this.
- 🧠 **Concept check:** Why must a custom hook's name start with `use`?
  <details><summary>Show answer</summary>So React's rules-of-hooks linter knows the function contains hooks and enforces hook rules inside it. It's also a signal to other developers. Drop the prefix and you lose the linter's protection.</details>

### React Router — multiple pages

So far your app has been one screen. React Router lets you have real pages with real URLs: `/today`, `/stats`, `/habit/3`. When the URL changes, Router swaps which component renders — without a full page reload, so it stays fast and app-like.

You'll use the current version (v7/v8) in **Declarative mode**, which is the simplest setup. You wrap your app in a `<BrowserRouter>`, list your pages in `<Routes>`, and use `<Link>` instead of `<a>` so navigation doesn't reload the page.

```tsx
import { BrowserRouter, Routes, Route, Link } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/today">Today</Link>
        <Link to="/stats">Stats</Link>
      </nav>
      <Routes>
        <Route path="/today" element={<TodayPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/habit/:id" element={<HabitDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

The `:id` in `/habit/:id` is a **URL parameter** — a slot. `/habit/3` and `/habit/7` both match, and the page reads which one with the `useParams` hook:

```tsx
import { useParams } from "react-router";

function HabitDetailPage() {
  const { id } = useParams(); // id is the ":id" from the URL, as a string
  // ...look up the habit with this id
}
```

This is the standard way real apps show a list page that links into detail pages: list at `/habits`, click a row, land on `/habit/3`.

> ⚠️ **Version trap:** use **reactrouter.com** (v7/v8) for tutorials. Two outdated patterns to avoid: (1) **v5.reactrouter.com** with `<Switch>` and `component={...}` props — old API, close it. (2) Imports from **`react-router-dom`** — that package was folded into React Router in v8; in the current version everything you use here imports from **`react-router`** (e.g. `import { BrowserRouter, Routes, Route, Link, useParams } from "react-router"`). If a tutorial imports from `react-router-dom`, it predates v8 — the concepts still apply, just change the import.

- ⚠️ **Common mistake:** using a plain `<a href="/stats">` for in-app navigation. That triggers a full browser reload and throws away your React state. Use `<Link to="/stats">` for internal navigation; save `<a>` for links to other websites.
- 🧠 **Concept check:** In `<Route path="/habit/:id" />`, what does `:id` do, and how do you read it inside the page?
  <details><summary>Show answer</summary>`:id` is a URL parameter — a wildcard slot, so `/habit/3` and `/habit/7` both match the route. You read it inside the page with `const { id } = useParams()`.</details>

### Bigger state: useReducer (learn this first)

`useState` is great until a component has several pieces of state that change *together* in structured ways — add a habit, toggle one, delete one, reset streaks. When you've got five `setX` calls scattered around, the logic gets hard to follow. `useReducer` gathers all those changes into one place.

The mental model: instead of calling setters directly, you *dispatch actions* ("ADD_HABIT", "TOGGLE_HABIT"), and a single **reducer** function decides how the state changes for each action. All your state logic lives in one tidy function you can read top to bottom.

```tsx
import { useReducer } from "react";

type Action =
  | { type: "add"; title: string }
  | { type: "toggle"; id: string };

function habitsReducer(state: Habit[], action: Action): Habit[] {
  switch (action.type) {
    case "add":
      return [...state, { id: crypto.randomUUID(), title: action.title, streak: 0, done: false }];
    case "toggle":
      return state.map((h) => (h.id === action.id ? { ...h, done: !h.done } : h));
  }
}

function HabitList() {
  const [habits, dispatch] = useReducer(habitsReducer, []);
  // dispatch({ type: "add", title: "Stretch" });
  // dispatch({ type: "toggle", id: "abc" });
}
```

Notice the reducer never *mutates* state — it returns a new array/object each time (`[...state, newItem]`, `state.map(...)`). That's the same immutability rule you learned with `useState`, just in one organized place. And typing the `Action` union means TypeScript catches a typo'd action type instantly.

Start with `useReducer` for anything beyond simple state. It's built into React, there's nothing to install, and it scales surprisingly far.

- ⚠️ **Common mistake:** mutating state inside the reducer (`state.push(...)` or `state[0].done = true`). Reducers must return a *new* value. Mutating in place breaks React's change detection and causes ghosts where the UI doesn't update.
- 🧠 **Concept check:** What's the difference between calling `setHabits(...)` and calling `dispatch({ type: "add", title: "..." })`?
  <details><summary>Show answer</summary>`setHabits` directly sets the new state from wherever you call it. `dispatch` sends an action describing *what happened*, and the reducer function (in one place) decides how state changes. It centralizes the logic instead of scattering setters.</details>

### Zustand — only when you actually need it

Zustand is a small library for global state — state that many far-apart components need to share. It's genuinely nice. But here's the honest advice: **you probably don't need it yet.** React's built-in tools (`useState`, `useReducer`, and passing props, plus Context when prop-drilling gets painful) handle the great majority of apps, including everything in this course.

Reach for Zustand only when you hit a real wall: the same state is needed in many distant components, and threading it through props or Context has become genuinely annoying. When that day comes, the API is tiny — you create a store and read from it with a hook. Until then, adding it is complexity you're paying for and not using.

```tsx
// Only if you actually need shared global state:
import { create } from "zustand";

const useHabitStore = create<{ count: number; inc: () => void }>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));

// Any component, no props needed:
const count = useHabitStore((s) => s.count);
```

The default answer in this course is **don't add Zustand.** Knowing it exists and what problem it solves is enough for now.

- ⚠️ **Common mistake:** reaching for a global state library on day one "to be safe." Global state you don't need makes apps *harder* to follow, because any component can change anything. Keep state as local as you can; promote it only when you feel real pain.
- 🧠 **Concept check:** What's the signal that it might finally be time to add a global state library?
  <details><summary>Show answer</summary>The same state is needed in many components far apart in the tree, and passing it via props or Context has become genuinely painful to maintain. Until you feel that pain, built-in tools are the right call.</details>

### Fetching a public API (typed)

This is what powers Project 4. A public API is a server on the internet that returns data — usually JSON — when you request a URL. You fetch it with the browser's built-in `fetch`, wait for it with `async/await`, and then *type the response* so the rest of your code knows the shape of what came back.

The pattern in a component: a piece of state for the data, one for loading, one for errors. You fetch inside `useEffect` (or on a button click), await the response, parse JSON, and store it.

```tsx
interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
}

async function searchMovies(query: string): Promise<Movie[]> {
  const res = await fetch(`https://example-api.com/?s=${query}`);
  if (!res.ok) throw new Error("Request failed");
  const data = await res.json(); // data is `any` until you say otherwise
  return data.Search as Movie[]; // tell TS the shape you expect
}
```

Two things matter. First, `res.json()` gives you `any` — the network can't be type-checked, so *you* assert the shape (`as Movie[]`) based on the API's docs. Second, always handle the unhappy paths: the request can fail, return nothing, or be slow. Show a loading state while you wait and an error message when it breaks. Users will type garbage and the wifi will drop.

```tsx
const [movies, setMovies] = useState<Movie[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function handleSearch(query: string) {
  setLoading(true);
  setError(null);
  try {
    setMovies(await searchMovies(query));
  } catch (e) {
    setError("Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
}
```

- ⚠️ **Common mistake:** assuming `fetch` rejects on a 404 or 500. It doesn't — a "successful" fetch can still be an HTTP error. You must check `res.ok` yourself and throw if it's false, or you'll try to read JSON from an error page.
- 🧠 **Concept check:** After `const data = await res.json()`, what type is `data`, and whose job is it to give it a real shape?
  <details><summary>Show answer</summary>It's `any` — TypeScript can't know what the network returned. It's *your* job to assert the shape (e.g. `as Movie[]`) based on the API's documentation, and ideally to validate it if the data is critical.</details>

## Guided resources

| Resource | What to use it for | Link |
|---|---|---|
| Total TypeScript — Beginner's TypeScript (18 exercises; **FREE** — the /tutorials are free, Pro courses are paid) | Hands-on TS fundamentals, one tiny exercise at a time | https://www.totaltypescript.com/tutorials/beginners-typescript |
| Net Ninja — TypeScript Tutorial (short episodes; GitHub branch per lesson) | Watchable walkthrough of TS basics in small chunks | https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI · files https://github.com/iamshaunjp/typescript-tutorial |
| React TypeScript Cheatsheet | Lookup: "how do I type *this* in React?" | https://react-typescript-cheatsheet.netlify.app/ |
| react.dev — Reusing Logic with Custom Hooks | The official, clear explanation of custom hooks | https://react.dev/learn/reusing-logic-with-custom-hooks |
| Web Dev Simplified — useLocalStorage custom hook | A concrete custom-hook walkthrough you'll actually use | https://blog.webdevsimplified.com/2019-11/how-to-write-custom-hooks/ |
| react.dev — useReducer + Scaling up with reducer & context | Reference + the "why" of reducers, with context | https://react.dev/reference/react/useReducer · https://react.dev/learn/scaling-up-with-reducer-and-context |
| React Router — official Declarative mode guide (v8) | Install + Routes, links, URL params — matches the `<BrowserRouter>`/`<Routes>` code in this phase | https://reactrouter.com/start/declarative/installation · routing https://reactrouter.com/start/declarative/routing |
| Zustand — Intro (**only if needed**) | Reference for *when* you actually hit the global-state wall | https://zustand.docs.pmnd.rs/ |

> ⚠️ Use **reactrouter.com** (v7/v8). Do **NOT** use **v5.reactrouter.com** — it's the old `<Switch>` API and will not match this course. And remember: Total TypeScript's **/tutorials are free**; the Pro courses are paid — you don't need Pro for this phase.

## Exercises (do these — don't just read)

- [ ] Write an `interface Movie` with `title: string`, `year: number`, and optional `poster?: string`. Then write a function `summary(m: Movie): string` that returns `"Title (year)"`. Make TS yell at you by passing a string for `year`, then fix it.
- [ ] Convert one small existing React component to `.tsx`: add a props interface and type its `useState`. Fix every red squiggle until it's clean — no `any`.
- [ ] Write a `useToggle` custom hook that returns `[value, toggle]` (a boolean and a function that flips it). Use it in a component to show/hide something.
- [ ] Build a 3-page mini app with React Router: `/`, `/about`, and `/item/:id`. Make the home page link to `/item/1` and `/item/2`, and have the item page print the id from `useParams`.
- [ ] Rewrite a `useState`-heavy component to use `useReducer` with a typed `Action` union of at least three action types. Confirm TS catches a misspelled action type.
- [ ] Fetch from any free public API (your choice) and render the results, including a loading state and an error state. Force the error path by breaking the URL on purpose and confirm your error message shows.

## Portfolio build — Habit Tracker (typed + routed) and Project 4 (Movie/Recipe Search)

### Part A — Add TypeScript + routing to the Habit Tracker

- [ ] Start a fresh Vite project with the **React + TypeScript** template (or migrate your existing one file by file).
- [ ] Define a `Habit` interface in one place and import it everywhere a habit is used.
- [ ] Type every component's props with an interface, and type all `useState` calls (watch out for empty arrays — use `useState<Habit[]>([])`).
- [ ] Extract a `useLocalStorage<T>` custom hook and use it to persist habits across refreshes.
- [ ] Move habit state into a `useReducer` with typed actions: `add`, `toggle`, `delete`, and a streak update.
- [ ] Install React Router (v7/v8) and add three pages: **/today** (today's habits), **/stats** (streaks and totals), **/habit/:id** (one habit's detail).
- [ ] Add a nav bar with `<Link>`s between pages. Make a habit row on /today link to its `/habit/:id` detail page.
- [ ] Read the `:id` with `useParams` on the detail page and show that habit's info; handle the "no habit with that id" case gracefully.
- [ ] Confirm there are **zero** TypeScript errors and **zero** `any` types in your own code.

### Part B — Build Project 4: Movie/Recipe Search

- [ ] Pick one public API and sign up for a free key if needed (`search: OMDb API free key` for movies, or `search: TheMealDB free API` for recipes — both have free tiers).
- [ ] New Vite React + TypeScript project. Define an interface for one result item (e.g. `Movie` or `Recipe`) matching the API's real response.
- [ ] Build a search input + button. On submit, fetch results with `async/await`, check `res.ok`, and store typed results in state.
- [ ] Render the results as a grid of cards (title, image, year/category).
- [ ] Add `loading` and `error` state and show a spinner/message for each. Handle "no results found" as its own friendly case.
- [ ] (Stretch) Add a detail view at `/item/:id` using React Router that fetches and shows full details for one result.
- [ ] Keep your API key out of your committed code — read it from an environment variable (`search: Vite environment variables import.meta.env`).

> ☕ **Pacing cue:** Part A and Part B are two separate sittings, maybe two separate weeks. Don't try to do both in one go. Ship a working typed-and-routed Habit Tracker *first*, take a break, then start the Search app fresh.

## 🎯 Milestone & self-check

**Milestone:** a fully-typed, multi-page **Habit Tracker** (today / stats / habit detail, persisted via a custom hook, state in a typed reducer) *and* a working, API-driven **Movie/Recipe Search** app with loading and error states. Both with zero TypeScript errors and no `any` in your code. Deploy at least one of them (you learned deploying earlier — push it live and share the link).

**Prove it.** Can you, from a blank file with no copying…

- [ ] Write an `interface` for a data object and a function that takes and returns typed values?
- [ ] Type a React component's props and its `useState`, and explain why `useState<Thing[]>([])` needs the type?
- [ ] Write a custom hook (name starting with `use`) that wraps `useState` + `useEffect`, and say why the `use` prefix matters?
- [ ] Set up React Router with three routes including one URL param, and read that param with `useParams`?
- [ ] Write a typed `useReducer` with at least two actions, without mutating state inside the reducer?
- [ ] Fetch a public API with `async/await`, check `res.ok`, type the JSON, and handle loading + error states?

If you can do all six from scratch, you've got Phase 4. If any one makes you reach for old code, redo that exercise before moving on — Phase 5 (full-stack with Supabase) builds directly on typed React.

> 🔁 **Before Phase 5 — quick async gut-check.** Phase 5 leans hard on promises and `async/await`: every database read, write, and login is asynchronous. You practiced this with the Search app's `fetch`. If `async/await`, `await`, and `try/catch` still feel shaky, spend one short session re-reading [javascript.info async/await](https://javascript.info/async-await) and re-doing the API-fetch exercise above. Reaching Supabase auth without solid async is the classic stall — close that gap now while it's cheap.

## Time estimate

Roughly **5–7 weeks** at 2–5 hrs/week (~15–25 hours total). A reasonable split: 1–2 weeks on TypeScript fundamentals and converting a component, 1 week on custom hooks + useReducer, 1–2 weeks on React Router and wiring up the Habit Tracker pages, 1–2 weeks building the Search app. Off-weeks happen — the milestone waits for you.
