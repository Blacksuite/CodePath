# Phase 3 — React

> **Time:** ~6–8 weeks at 2–5 hrs/wk · **Portfolio work:** Habit Tracker (rebuilt in React) + Quiz App (new)

## Why this phase matters

In Phase 2 you built the Habit Tracker in vanilla JS, and you felt the pain: every time the data changed, you had to find the right DOM node, update its text, toggle a class, maybe rebuild a whole list by hand. Keeping the screen in sync with your data was *your* job, and it got messy fast. React flips that around. You describe what the UI should look like for a given set of data, and React figures out what to change on screen. After this phase you can build interactive apps where the UI just *follows* your data, you'll rebuild the Habit Tracker the React way, and you'll prove the skill transfers by building a brand-new Quiz App from scratch.

## What you'll learn

- Why React exists, and how "declarative UI" fixes the manual-DOM pain from Phase 2
- Components, JSX, and props (passing data into components)
- State with `useState`, and handling events (clicks, typing)
- Rendering lists with `.map()` and keys, plus conditional rendering
- Controlled forms and inputs
- `useEffect`, and persisting to `localStorage` the React way (with the `useState` lazy initializer to load)

## The concepts (the actual teaching)

> ⚠️ **Read this before you watch any tutorial.** Use **modern React only**: function components + hooks, scaffolded with **Vite**. If a tutorial starts with `create-react-app` or `class extends React.Component`, it's out of date — close it and pick another. The resources below are all modern. One more note: Josh Comeau has a great free "Common Beginner Mistakes" article, but he has **no** standalone free useEffect article. The real, authoritative useEffect lesson is react.dev's **"Synchronizing with Effects."**

### Why React exists (from manual DOM to declarative UI)

Remember the Habit Tracker from Phase 2. When someone checked off a habit, you wrote code like "find the `<li>`, add a `done` class, update the streak counter, re-render the list." You were giving the browser step-by-step *instructions*. That's **imperative** code, and the bugs come from the gaps: you forget to update one place, or two updates fight each other, and the screen no longer matches your data.

React is **declarative**. Instead of instructions, you write a description: "given this data, here's what the screen looks like." When the data changes, you don't touch the DOM yourself — React compares the new description to the old one and updates only what changed. Your job shrinks to "keep the data correct and describe the UI." That's a huge load off your brain.

Here's the mental model in one line: **UI = f(state)**. Your screen is a function of your data. Change the data, and the screen redraws itself.

```jsx
// You never write document.querySelector here.
// You describe the UI for a given `count`, and React keeps the screen in sync.
function Counter({ count }) {
  return <p>You clicked {count} times</p>;
}
```

- ⚠️ **Common mistake:** Trying to "help" React by also poking the DOM with `document.querySelector` or `.innerHTML`. Don't. In React you change *data*, never the DOM directly. The moment you reach for `querySelector`, stop and ask "what piece of state should I change instead?"
- 🧠 **Concept check:** What does "declarative" mean, and why does it reduce bugs compared to the Phase 2 approach?
  <details><summary>Show answer</summary>Declarative means you describe *what* the UI should look like for some data, not the step-by-step instructions to change it. It reduces bugs because React keeps the screen in sync with your data automatically — you can't forget to update one of five places, because you only describe the end result once.</details>

### Components, JSX, and props

A **component** is a function that returns some UI. That's it. The name must start with a capital letter (`HabitItem`, not `habitItem`), and you use it in markup like a custom HTML tag: `<HabitItem />`. Components let you build your app out of small, reusable, named pieces instead of one giant blob.

The HTML-looking stuff a component returns is **JSX**. It's not really HTML — it's JavaScript that *looks* like HTML, and it compiles down to function calls. A few gotchas: you write `className` instead of `class`, `htmlFor` instead of `for`, you must close every tag (`<img />`, `<br />`), and a component can only return **one** top-level element. If you need to return siblings, wrap them in a `<div>` or an empty `<>...</>` fragment. Inside JSX, anything in `{curly braces}` is live JavaScript.

**Props** are how you pass data *into* a component, like arguments to a function. The parent writes `<Greeting name="Sam" />`, and the component reads it from its props object. Props flow **one way**, parent → child, and a child must never change its own props. Think of props as read-only.

```jsx
function Greeting({ name }) {        // destructure the prop you want
  return <h2>Hello, {name}!</h2>;    // {name} runs JavaScript inside JSX
}

function App() {
  return (
    <div>
      <Greeting name="Sam" />
      <Greeting name="Alex" />
    </div>
  );
}
```

- ⚠️ **Common mistake:** Lowercase component names. `<greeting />` is treated as a plain HTML tag and silently does nothing useful. Capitalize: `<Greeting />`.
- 🧠 **Concept check:** Why must props be treated as read-only inside a component?
  <details><summary>Show answer</summary>Props are owned by the parent. Data flows one way (parent → child), so the child reading and rendering props is fine, but if a child mutated its props it would break React's model of who owns what — the parent wouldn't know, and the UI could fall out of sync. If a child needs to change something, it asks the parent (via a callback prop) or uses its own state.</details>

### State with useState, and events

Props come from outside. **State** is data a component owns and can change over time — the count in a counter, the text in a search box, which habits are checked. When state changes, React re-renders that component so the screen updates. State is the engine behind interactivity.

You create state with the `useState` **hook**. It hands you back two things: the current value, and a function to update it. Calling the updater (e.g. `setCount`) tells React "the data changed, re-render me." The argument to `useState` is the *initial* value, used only on the first render.

**Events** are how the user triggers changes. In JSX you attach handlers with camelCase props like `onClick` and `onChange`, and you pass a *function* (not a function call). When something needs to update based on the previous value, use the **functional updater** form `setCount(c => c + 1)` so you're never working off a stale value.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);   // [value, updater], initial = 0

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}
```

- ⚠️ **Common mistake:** Mutating state directly, like `count++` or `todos.push(newTodo)`. React won't notice and won't re-render. Always call the setter, and for arrays/objects make a **new** one: `setTodos([...todos, newTodo])`.
- ⚠️ **Common mistake:** Writing `onClick={handleClick()}` with parentheses. That *calls* the function during render and passes its return value. Pass the function itself: `onClick={handleClick}` (or `onClick={() => handleClick(id)}` when you need an argument).
- 🧠 **Concept check:** What's the difference between props and state?
  <details><summary>Show answer</summary>Props are passed in from a parent and are read-only inside the component. State is owned by the component itself and can change over time. Changing state triggers a re-render; you can't change props. Rough rule: if the data needs to change in response to the user, it's state; if it just comes from above, it's a prop.</details>

### Rendering lists (.map + keys) and conditional rendering

Most real UIs show a list of things: habits, quiz questions, search results. In React you take an **array** of data and turn it into an array of elements with `.map()`. React renders the resulting array. You don't write a loop that builds DOM — you transform data into JSX.

Every item in a mapped list needs a **`key`** prop: a stable, unique string (usually an `id` from your data). Keys let React match items across re-renders so it can update the list efficiently and not mix up state between rows. Use a real id; only fall back to the array index if the list never reorders or changes (and even then, prefer a real id).

**Conditional rendering** is just JavaScript deciding what to return. Use a ternary for either/or, and `&&` to show something or nothing. Watch one trap with `&&`: if the left side is the number `0`, React will render `0` on screen. Guard with a real boolean like `list.length > 0 &&`.

```jsx
function HabitList({ habits }) {
  if (habits.length === 0) {
    return <p>No habits yet. Add one!</p>;   // conditional: early return
  }

  return (
    <ul>
      {habits.map(habit => (
        <li key={habit.id}>                  // key = stable unique id
          {habit.name} {habit.done ? "✅" : "⬜"}   // ternary
        </li>
      ))}
    </ul>
  );
}
```

- ⚠️ **Common mistake:** Using the array index as a key in a list that can reorder, filter, or delete. React can then attach the wrong state to the wrong row (a half-typed input jumps to another item). Use a stable id.
- 🧠 **Concept check:** Why does React need a `key` on each list item?
  <details><summary>Show answer</summary>Keys give each item a stable identity across re-renders. React uses them to tell which items were added, removed, or moved, so it can update only what changed and keep each row's state attached to the right data. Without good keys, lists update inefficiently and can show bugs when items reorder.</details>

### Controlled forms and inputs

In a **controlled** input, React state is the single source of truth for what's in the box. You set the input's `value` from state, and you update that state on every keystroke via `onChange`. The data lives in React, not hidden in the DOM, which means you can read it, validate it, clear it, or pre-fill it whenever you want.

The loop is: `value={text}` shows the current state in the box, and `onChange={e => setText(e.target.value)}` pushes each keystroke back into state. They form a cycle, which is why it's "controlled."

For a form, put your logic in an `onSubmit` handler on the `<form>` and call `e.preventDefault()` first, or the browser reloads the page (an old default that breaks single-page apps). After submitting, you usually clear the input by setting its state back to `""`.

```jsx
import { useState } from "react";

function AddHabit({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();              // stop the page reload
    if (!text.trim()) return;        // ignore empty input
    onAdd(text);                     // tell the parent
    setText("");                     // clear the box
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button>Add</button>
    </form>
  );
}
```

> 🧘 **Stop here and take a break if you need one.** Controlled inputs are a real mental gear-shift — the value goes *out* to the box and the change comes *back* into state, and it can feel circular the first few times. Close the laptop, let it sit, come back and re-read this section. It'll click. You don't have to finish forms and useEffect in the same sitting.

- ⚠️ **Common mistake:** Forgetting `e.preventDefault()` in the submit handler. The page reloads, your state resets, and it looks like "nothing happened." Add it as the first line.
- ⚠️ **Common mistake:** Setting `value={text}` but forgetting `onChange`. Now the box is frozen — you type and nothing appears, because state never updates. A controlled input needs both halves of the loop.
- 🧠 **Concept check:** In a controlled input, where does the text actually "live"?
  <details><summary>Show answer</summary>In React state. The input element just *displays* whatever the state currently is (`value={text}`) and reports keystrokes back up (`onChange`). State is the single source of truth, not the DOM.</details>

### useEffect, and persisting to localStorage the React way

Most of your code runs *during* rendering and should be pure: take props and state, return JSX, touch nothing else. But sometimes you need to reach *outside* React — save to `localStorage`, set a timer, fetch data, subscribe to something. Those are **side effects**, and `useEffect` is where they go. It runs *after* React has rendered and painted the screen.

`useEffect` takes a function and a **dependency array**. The array controls when the effect re-runs: React re-runs the effect after any value in the array changes. `[]` (empty) means "run once after the first render." `[habits]` means "run again whenever `habits` changes." Leaving the array out entirely means "run after *every* render," which is almost never what you want and a classic source of infinite loops.

For the Habit Tracker, persistence is two halves. **Saving** is a side effect: a `useEffect` that writes `habits` to `localStorage` whenever `habits` changes. **Loading** is *not* a side effect — you want the data ready on the very first render, so use the **lazy initializer** form of `useState`: pass it a function, and React runs that function only once to compute the initial state.

```jsx
import { useState, useEffect } from "react";

function HabitTracker() {
  // LOAD: lazy initializer runs once, reads localStorage for the starting value
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : [];
  });

  // SAVE: side effect re-runs whenever `habits` changes
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // ...render and update habits with setHabits([...])
}
```

Two things worth saying out loud. First, `localStorage` only stores strings, so you `JSON.stringify` on the way in and `JSON.parse` on the way out. Second, notice the *lazy* initializer is a function `() => {...}`, not `useState(localStorage.getItem(...))`. If you skip the arrow function, that `localStorage.getItem` runs on *every* render even though it's only used once — wasteful and a subtle gotcha.

- ⚠️ **Common mistake:** Omitting the dependency array, then setting state inside the effect. The effect runs after every render, the state change triggers another render, which runs the effect again — an infinite loop. Always think carefully about the dependency array.
- ⚠️ **Common mistake:** Reaching for `useEffect` to compute a value from existing state (like a filtered list). You don't need an effect for that — just calculate it during render. Effects are for talking to the *outside world* (storage, network, timers), not for in-React data transforms. (Josh Comeau's article covers this trap well.)
- 🧠 **Concept check:** Why load with the `useState` lazy initializer but save with `useEffect`?
  <details><summary>Show answer</summary>Loading needs to happen *before* the first render so the data is on screen immediately — that's exactly what the lazy initializer does (runs once to set the starting state). Saving is a side effect that should happen *after* render, every time the data changes — that's what `useEffect` with `[habits]` does. Loading is "where do I start," saving is "react to changes."</details>

## Guided resources

| Resource | What to use it for | Link |
|---|---|---|
| react.dev — Learn (official, modern, interactive) | Your main reference. Read alongside this file; it's interactive and always current. | https://react.dev/learn |
| react.dev — Adding Interactivity (useState + events) | The official deep dive on state and events. | https://react.dev/learn/state-a-components-memory |
| react.dev — Synchronizing with Effects (the real useEffect lesson) | The authoritative useEffect lesson. Use this, not a video, when effects confuse you. | https://react.dev/learn/synchronizing-with-effects |
| react.dev — Tic-Tac-Toe tutorial | A guided build to practice components, props, and state end-to-end. | https://react.dev/learn/tutorial-tic-tac-toe |
| Scrimba — Learn React (FREE standalone course; their newest full curriculum is Pro/paid) | Interactive, code-in-the-browser practice. Use the free course. | https://scrimba.com/learn-react-c0e |
| freeCodeCamp / Bob Ziroll — Learn React full course (~15h, Vite+hooks, projects) | Long, thorough, project-based. Same Bob Ziroll course as the free Scrimba one above, just the YouTube version — pick one format, you don't need both. Modern (Vite + hooks). | search: freeCodeCamp Learn React Bob Ziroll full course (writeup https://www.freecodecamp.org/news/learn-react-2024/) |
| Josh Comeau — Common Beginner Mistakes (free article, incl. useEffect gotchas) | Read once after you've written some hooks. Names the traps you'll actually hit. | https://www.joshwcomeau.com/react/common-beginner-mistakes/ |

## Exercises (do these — don't just read)

- [ ] **Counter:** Build a counter with `+`, `−`, and `reset` buttons using one piece of `useState`. Use the functional updater `setCount(c => c + 1)`.
- [ ] **Greeting list:** Make a `Greeting` component that takes a `name` prop, then render it from a `.map()` over an array of names — with correct `key`s.
- [ ] **Live text mirror:** A controlled input whose current text shows live in a `<p>` below it. Add a character counter (`{text.length}`).
- [ ] **Toggle / show-hide:** A button that flips a boolean in state to show or hide a paragraph. Use conditional rendering (`&&` and a ternary).
- [ ] **Filtered list:** Render a list with an "All / Done / Not done" filter. Compute the filtered array *during render* (no `useEffect`) — proves you understand effects are for the outside world only.
- [ ] **Persisted note:** A single `<textarea>` that saves to `localStorage` on change and reloads its content on refresh — load with the lazy initializer, save with `useEffect`.

## Portfolio build — Habit Tracker (React) + Quiz App

### Build A — Rebuild the Habit Tracker in React (Vite)

- [ ] Scaffold a new app: `npm create vite@latest habit-tracker -- --template react`, then `cd habit-tracker`, `npm install`, `npm run dev`.
- [ ] Delete the boilerplate in `App.jsx` and start from a clean component.
- [ ] Hold habits in state: `const [habits, setHabits] = useState(...)` where each habit is `{ id, name, done }`.
- [ ] Build an `AddHabit` controlled form; on submit, add a new habit with a unique `id` (e.g. `crypto.randomUUID()`).
- [ ] Render the list with `.map()` and a stable `key={habit.id}`.
- [ ] Toggle a habit's `done` by mapping to a **new** array (never mutate).
- [ ] Delete a habit by filtering it out into a new array.
- [ ] Show an empty-state message when there are no habits (conditional rendering).
- [ ] Split into components: `App`, `AddHabit`, `HabitList`, `HabitItem`. Pass data down as props and actions up as callback props.
- [ ] Persist: load with the `useState` lazy initializer, save with `useEffect(..., [habits])`.
- [ ] **Deploy it.** Run `npm run build`, then push to GitHub and deploy the `dist` folder (Netlify or Vercel, free tier). Confirm the live URL works and your habits persist on refresh.

### Build B — Quiz App (transfer drill, no backend)

This is the proof that the skills generalize. Build it from scratch — resist copying the Habit Tracker.

- [ ] Scaffold a fresh Vite React app: `quiz-app`.
- [ ] Hard-code an array of questions: `{ id, prompt, options: [...], answer }`.
- [ ] Track `currentIndex` and `score` in state.
- [ ] Render the current question and its options as buttons (`.map()` over `options` with keys).
- [ ] On answering: check against `answer`, update `score`, advance `currentIndex`.
- [ ] Conditionally render a "Results" screen when you run out of questions (show score + a "Play again" button that resets state).
- [ ] Optional: show which answer was right/wrong before moving on, or add a question counter ("3 of 10").
- [ ] Deploy this one too.

## 🎯 Milestone & self-check

**Milestone:** Your Habit Tracker is a real, deployed React app — components, state, controlled form, list with keys, and `localStorage` persistence — live at a public URL. Your Quiz App works and is deployed too. You built the second one without leaning on the first.

**Prove it.** Can you, from a blank file with no copying…

- [ ] Scaffold a new Vite React app and render a component with a prop?
- [ ] Add a `useState` counter and an `onClick` that updates it with the functional updater?
- [ ] Build a controlled input (both `value` and `onChange`) and read its text in state?
- [ ] Render an array with `.map()` and correct `key`s, plus one conditional (empty state)?
- [ ] Persist state to `localStorage` — saving with `useEffect`, loading with the lazy initializer?
- [ ] **Explain, in your own words, the difference between props and state** — and give an example of each from your Habit Tracker?

If you can do all six, you've got the React fundamentals. Move on.

## Time estimate

Roughly **6–8 weeks** at 2–5 hrs/week (about **18–30 hours** total):

- Concepts + react.dev "Learn" + small exercises: ~6–10 hrs
- A video course for depth and practice (freeCodeCamp/Bob Ziroll): ~4–8 hrs (skim/skip what you already know)
- Habit Tracker rebuild + deploy: ~5–8 hrs
- Quiz App build + deploy: ~3–4 hrs

Spread it across short sessions. It's normal to take an off-week. The two deployed apps are what matter, not the calendar.
