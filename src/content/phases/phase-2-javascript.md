# Phase 2 — JavaScript for real
> **Time:** ~5–7 weeks at 2–5 hrs/wk · **Portfolio work:** Project 2 — Habit Tracker (vanilla JS version)

## Why this phase matters

Phase 1 gave you a page that *looks* like something. This phase makes a page *do* something. By the end you'll have a real, interactive Habit Tracker: click a day to mark a habit done, add and delete habits with a form, and have all of it survive a page refresh. This is the flagship project of the whole course, and it starts here. Everything after this — React, TypeScript, the backend — is just better tools for doing what you're about to learn to do by hand.

> 🧗 **Heads up — this is the steepest single step in the course.** You're taking on the JavaScript language *plus* the DOM *plus* events *plus* array methods *plus* localStorage, all in one phase. That's a lot, and it's the classic place self-taught learners stall out. If it feels hard here, you're not behind — it's *supposed* to be the hard part. Go slow, lean on the 20-minute rule, and expect this phase to take a few weeks. Push through this one and the rest of the course feels downhill by comparison.

## What you'll learn

- JavaScript fundamentals: variables, types, functions, conditionals, loops, arrays, objects
- The DOM: treating the page as a tree of objects you can read and change with code
- Selecting elements, changing them, and adding/removing nodes
- Events, and **event delegation** (the trick that makes dynamically-added buttons actually work)
- The core array methods: `map`, `filter`, `forEach`, `find`
- `localStorage` + `JSON.stringify`/`JSON.parse` to save data across refreshes
- A light intro to async (promises, async/await, fetch) — just enough to recognize it

## The concepts (the actual teaching)

### Variables and types

A variable is a labeled box that holds a value. In modern JavaScript you make one with `const` or `let`. Use `const` by default — it means "this label won't be reassigned." Reach for `let` only when you genuinely need to reassign. Forget `var` exists; it has confusing scoping rules and you don't need it.

JavaScript has a handful of basic types you'll use constantly: **strings** (text, in quotes), **numbers** (no separate int/float — just numbers), **booleans** (`true`/`false`), `null` and `undefined` (two flavors of "nothing"), plus **objects** and **arrays** (covered below).

```js
const name = "Lars";        // string
let streak = 0;             // number, will change later
const isDone = false;       // boolean
streak = streak + 1;        // reassigning a `let` is fine
```

One thing that trips people up: `const` doesn't mean the value is frozen. It means the *label* can't be repointed. You can still change the contents of a `const` array or object — you just can't reassign the whole variable.

- ⚠️ **Common mistake:** Using `==` instead of `===`. The double-equals does sneaky type conversion (`0 == ""` is `true`), which causes weird bugs. Always use `===` and `!==`.
- 🧠 **Concept check:** Why does `const list = []; list.push(1);` work without error, even though `list` is `const`?
  <details><summary>Show answer</summary>Because `push` changes the *contents* of the array, not the variable's binding. `const` only stops you from doing `list = somethingElse`.</details>

### Functions

A function is a reusable chunk of logic you can run by name. You give it inputs (parameters), it does work, and it usually hands back a result with `return`. You'll write functions for everything: "toggle this day," "save the data," "render the list."

There are two shapes you'll see. The classic `function` declaration and the **arrow function**, which is shorter and what you'll use most:

```js
function add(a, b) {
  return a + b;
}

const double = (n) => n * 2;   // arrow function, returns n * 2

console.log(add(2, 3));  // 5
console.log(double(4));  // 8
```

If a function doesn't `return` anything, calling it gives you `undefined`. That's fine for functions whose whole job is a side effect, like updating the page.

- ⚠️ **Common mistake:** Forgetting `return`. If your function calculates something but doesn't return it, the caller gets `undefined` and you'll stare at the screen wondering why.
- 🧠 **Concept check:** What does `const f = (x) => { x * 2 };` return when called with `5`?
  <details><summary>Show answer</summary>`undefined`. The curly braces make it a block, so you need an explicit `return x * 2;`. Without the braces (`(x) => x * 2`) it returns automatically.</details>

### Conditionals and loops

Conditionals let your code make decisions. `if`/`else` is the workhorse. Loops let you repeat work — though once you learn array methods (below), you'll reach for those more than raw loops.

```js
const hour = 14;

if (hour < 12) {
  console.log("morning");
} else if (hour < 18) {
  console.log("afternoon");
} else {
  console.log("evening");
}

// a simple loop
for (let i = 0; i < 3; i++) {
  console.log("rep", i);
}
```

The most common condition you'll write in this project is "is this day already done?" — a boolean check that decides whether a click marks it done or un-done.

- ⚠️ **Common mistake:** Assigning instead of comparing inside an `if`: `if (done = true)` sets `done` to true every time. You want `if (done === true)` or just `if (done)`.
- 🧠 **Concept check:** What's a shorter way to write `if (isDone === true)`?
  <details><summary>Show answer</summary>`if (isDone)`. If `isDone` is already a boolean, you don't need to compare it to `true`.</details>

### Arrays

An array is an ordered list of values, written with square brackets. Your habits will live in an array. You read items by index (starting at 0), add to the end with `push`, and remove with methods like `splice` or `filter`.

```js
const habits = ["Drink water", "Read", "Stretch"];

console.log(habits[0]);     // "Drink water"
console.log(habits.length); // 3

habits.push("Sleep early");  // add to the end
```

Arrays are the backbone of this project. Your whole app state is basically "an array of habit objects," and rendering the page is "loop over that array and build HTML for each one."

- ⚠️ **Common mistake:** Off-by-one errors. The last item of a 3-element array is `habits[2]`, not `habits[3]`. `habits[3]` is `undefined`.
- 🧠 **Concept check:** How do you get the last item of an array `arr` of unknown length?
  <details><summary>Show answer</summary>`arr[arr.length - 1]`. (Modern JS also has `arr.at(-1)`.)</details>

### Objects

An object groups related values under named keys. It's perfect for "one habit" — which has a name, an id, and a record of which days are done. You access values with dot notation (`habit.name`) or bracket notation (`habit["name"]`).

```js
const habit = {
  id: 1,
  name: "Read 10 pages",
  days: [false, false, true, false, false, false, false],
};

console.log(habit.name);      // "Read 10 pages"
habit.days[2] = false;        // un-mark Wednesday
```

In this project, each habit is an object, and your `habits` variable is an array of these objects. That combination — an array of objects — is the single most common data shape in all of web development. Get comfortable with it now.

- ⚠️ **Common mistake:** Confusing dot and bracket access. Use dot when you know the key name (`habit.name`). Use brackets when the key is in a variable (`habit[someKey]`).
- 🧠 **Concept check:** Given the `habit` object above, how would you read whether Friday (index 4) is done?
  <details><summary>Show answer</summary>`habit.days[4]` — which is `false` in the example.</details>

> ☕ **Stop here and take a break if you've been going a while.** You just covered the entire core of the language. The next part — the DOM — is a fresh mental gear. Come back rested.

### The DOM: the page as a tree of objects

When a browser loads your HTML, it builds a live in-memory model of the page called the **DOM** (Document Object Model). Every tag becomes an object — a *node* — and they nest into a tree, exactly like your HTML nests. Your `<body>` has children, those have children, and so on.

JavaScript can read and change that tree while the page is open. Change a node, and the screen updates instantly. This is the whole magic: the DOM is the bridge between your code and what the user sees.

You reach into the tree with selectors. The two you'll use most:

```js
// find one element (first match for a CSS selector)
const title = document.querySelector("h1");

// find all matches (a list you can loop over)
const buttons = document.querySelectorAll(".day-button");
```

`querySelector` takes a CSS selector — the same syntax you learned in Phase 1 (`#id`, `.class`, `tag`). That's not a coincidence; the selector knowledge transfers directly.

- ⚠️ **Common mistake:** Running your JS before the page exists. If your `<script>` is in the `<head>`, `querySelector` finds nothing because the body hasn't loaded yet. Put your script tag at the end of `<body>`, or add `defer` to it.
- 🧠 **Concept check:** What's the difference between `querySelector(".day")` and `querySelectorAll(".day")`?
  <details><summary>Show answer</summary>`querySelector` returns the *first* matching element (or `null`). `querySelectorAll` returns a list of *all* matches, which you loop over.</details>

### Changing, adding, and removing nodes

Once you've selected a node, you can change it. The big three:

- `element.textContent` — read or set the text inside an element.
- `element.classList.add/remove/toggle("done")` — flip CSS classes on and off. This is how you'll show a day as "done" — toggle a class, and your CSS handles the color.
- `element.remove()` — delete the node from the page.

To add new content, you create elements and attach them, or set `innerHTML` from a string:

```js
const li = document.createElement("li");
li.textContent = "Drink water";
li.classList.add("habit");
document.querySelector("#habit-list").append(li);
```

For this project, a clean approach is to keep your data in a `habits` array and write one `render()` function that rebuilds the list from that array. Change the data, call `render()`, done. You'll think in terms of "update the data, redraw the page" — which, not by accident, is exactly how React works later.

- ⚠️ **Common mistake:** Building HTML by mashing user input into `innerHTML`. For a personal project it's fine, but know that `innerHTML` with untrusted text is a security hole (it can run injected scripts). `textContent` is always safe.
- 🧠 **Concept check:** You want a day button to look "done" when clicked and "not done" when clicked again. Which `classList` method does that in one line?
  <details><summary>Show answer</summary>`element.classList.toggle("done")` — it adds the class if absent, removes it if present.</details>

### Events: making the page respond

An **event** is something that happens: a click, a key press, a form submit. You respond by attaching a listener — a function that runs when the event fires.

```js
const button = document.querySelector("#add");

button.addEventListener("click", () => {
  console.log("clicked!");
});
```

The listener gets an **event object** (usually called `e`) with details about what happened. Two you'll use a lot: `e.target` (the exact element that was clicked) and `e.preventDefault()` (stops the browser's default behavior — essential for forms, which otherwise reload the page on submit).

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();           // stop the page reload
  const input = form.querySelector("input");
  console.log(input.value);     // the typed text
});
```

- ⚠️ **Common mistake:** Forgetting `e.preventDefault()` on form submit. Without it, the page reloads, your JS state vanishes, and it looks like nothing happened.
- 🧠 **Concept check:** What does `e.target` give you inside a click listener?
  <details><summary>Show answer</summary>The specific element the user actually clicked — which may be a child of the element you attached the listener to.</details>

### Event delegation (the important one)

Here's a real problem you'll hit in this project. You add a "delete" button to each habit, and you attach a click listener to each button. Then the user adds a *new* habit. Its delete button has no listener — you only attached listeners to the buttons that existed at the time. Click it, nothing happens.

**Event delegation** fixes this. Instead of listening on each button, you put one listener on a parent that's always there (like the habit list container). Events "bubble" up from the clicked element to its ancestors, so the parent hears every click on its children — including children that didn't exist yet. You then check `e.target` to figure out what was actually clicked.

```js
const list = document.querySelector("#habit-list");

list.addEventListener("click", (e) => {
  if (e.target.matches(".delete")) {
    const id = e.target.dataset.id;     // read data-id="..."
    deleteHabit(id);
  }
  if (e.target.matches(".day-button")) {
    toggleDay(e.target);
  }
});
```

One listener, on a parent that never gets replaced, handling clicks for every habit and every day button — even ones you add five minutes from now. This is exactly why delegation matters for your habit day-buttons. Learn it here and you'll use it forever.

- ⚠️ **Common mistake:** Re-attaching all your listeners every time you re-render. It works but it's fragile and leaks. Delegation means you attach *once* and never think about it again.
- 🧠 **Concept check:** Why can't you attach a listener directly to a button that hasn't been created yet?
  <details><summary>Show answer</summary>Because there's no element to attach to. The button object doesn't exist yet. Delegation listens on a parent that *does* exist, and catches the click when it bubbles up later.</details>

> ☕ **Good stopping point.** Delegation is the conceptual peak of this phase. If it clicked, you're over the hump. If it didn't yet, watch the delegation video below and come back — it's worth a second pass.

### Core array methods: map, filter, forEach, find

You *could* do everything with `for` loops, but these four methods are clearer and you'll see them everywhere — especially in React. Each takes a function and runs it on every item.

- **`forEach`** — do something for each item. No return value. Use it for side effects, like building DOM.
- **`map`** — transform each item into a new one, returns a *new array* of the same length. "Turn each habit into an `<li>` string."
- **`filter`** — keep only items that pass a test, returns a *new array* (possibly shorter). "Keep every habit except the one I'm deleting."
- **`find`** — return the *first single item* that passes a test (or `undefined`). "Find the habit with this id."

```js
const habits = [
  { id: 1, name: "Read", done: true },
  { id: 2, name: "Run", done: false },
];

habits.forEach((h) => console.log(h.name));        // logs each name
const names = habits.map((h) => h.name);           // ["Read", "Run"]
const doneOnes = habits.filter((h) => h.done);     // [{ id: 1, ... }]
const run = habits.find((h) => h.id === 2);        // { id: 2, ... }
```

The mental model: `map` and `filter` give you a new array and don't touch the original. That "make a new one instead of mutating" habit is gold — it's the foundation of how React handles state. You'll use `filter` to delete a habit (keep all the others) and `find` to locate the one you clicked.

- ⚠️ **Common mistake:** Expecting `map` to filter, or `filter` to transform. `map` always returns the same number of items; `filter` returns the same items (just fewer). Don't try to make one do the other's job.
- 🧠 **Concept check:** You want to delete the habit with `id === 3` from the `habits` array. Which method, and roughly how?
  <details><summary>Show answer</summary>`habits = habits.filter((h) => h.id !== 3)` — keep every habit whose id is *not* 3.</details>

### localStorage: surviving a refresh

Right now, everything your app knows lives in memory. Refresh the page and it's gone. **`localStorage`** is a small key-value store built into the browser that persists across refreshes and even browser restarts. It's perfect for a personal habit tracker.

The catch: localStorage only stores **strings**. Your habits are an array of objects. So you convert with JSON:

- `JSON.stringify(value)` — turn an array/object into a string, to save it.
- `JSON.parse(string)` — turn that string back into an array/object, to load it.

```js
// save
localStorage.setItem("habits", JSON.stringify(habits));

// load (with a fallback if nothing's saved yet)
const saved = localStorage.getItem("habits");
const habits = saved ? JSON.parse(saved) : [];
```

The pattern for the whole app: load `habits` from localStorage when the page opens, and call `localStorage.setItem(...)` every time the data changes (after adding, deleting, or toggling). That's it — that's the entire persistence layer, and it's what makes a toggled habit survive a refresh.

- ⚠️ **Common mistake:** Forgetting to `JSON.parse` on load. `getItem` always returns a string, so if you skip parsing you'll be treating `"[{...}]"` (a string) as an array, and indexing into it gives you single characters. Confusing bugs follow.
- 🧠 **Concept check:** Why do you need `JSON.stringify` and `JSON.parse` at all — why not store the array directly?
  <details><summary>Show answer</summary>Because localStorage can only hold strings. `stringify` packs your array into a string to store; `parse` unpacks it back into a real array when you read it.</details>

### A light look at async (just recognize it)

Your habit tracker is fully local, so you don't need async code yet. But you'll see it constantly when you start fetching data from servers in Phase 4, so let's name the pieces now so they aren't a shock later.

Some operations take time — fetching data over the network, for example. JavaScript doesn't freeze while waiting; it hands you a **promise**, an IOU for a value that'll arrive later. The modern way to wait for a promise is **`async`/`await`**: mark a function `async`, then `await` the slow thing as if it were normal code.

```js
async function getData() {
  const response = await fetch("https://example.com/data");
  const data = await response.json();
  console.log(data);
}
```

You don't need to write this in Phase 2. The goal is recognition: when you see `async`, `await`, `fetch`, or `.then()`, you'll know it means "this takes time, and we're waiting for it." We'll go deep on it in Phase 4 when there's a real API to call.

- ⚠️ **Common mistake:** Expecting `fetch(...)` to hand you data directly. It hands you a promise. You have to `await` it (and usually `await response.json()` too) to get the actual data.
- 🧠 **Concept check:** In one sentence, what is a promise?
  <details><summary>Show answer</summary>A placeholder for a value that isn't ready yet but will be (or will fail) later.</details>

## Guided resources

| Resource | What to use it for | Link |
|---|---|---|
| Odin Foundations — JavaScript Basics (spine) | Your main path through JS fundamentals; do the assignments | https://www.theodinproject.com/paths/foundations/courses/foundations |
| javascript.info — First steps | Best free written JS reference; read alongside Odin | https://javascript.info/first-steps |
| Net Ninja — Modern JavaScript (video spine alt.) | Video alternative, 5–10 min clips (2019 but core JS is unchanged) | https://www.youtube.com/playlist?list=PLqyUgadpThTIh8UiNG0F8f46QVSRL_K8L |
| Web Dev Simplified — Learn DOM Manipulation in 18 Minutes | Fast, solid intro to selecting and changing the DOM | https://www.youtube.com/watch?v=y17RuWkWdn8 |
| javascript.info — Event delegation | Read this until delegation clicks; it's the key idea | https://javascript.info/event-delegation |
| javascript.info — localStorage | The persistence pattern you'll use in the project | https://javascript.info/localstorage |
| freeCodeCamp — map/filter/reduce explained (article) | Examples for the array methods | https://www.freecodecamp.org/news/javascript-map-reduce-and-filter-explained-with-examples/ |
| Build-along: Tuts+ Todo App w/ Local Storage (video) | Watch a full vanilla-JS app get built with persistence | https://www.youtube.com/watch?v=y71CdVq5SvI |
| Build-along: Tuts+ Todo App w/ Local Storage (article) | The written version of the same build-along | https://webdesign.tutsplus.com/tutorials/to-do-app-with-vanilla-javascript--cms-35258 |

## Exercises (do these — don't just read)

Small drills to build muscle memory before and during the project. Open the browser console (F12) or a scratch HTML file to run them.

- [ ] Write a function `greet(name)` that returns `"Hi, <name>!"`. Call it with three different names and log each result.
- [ ] Given `const nums = [4, 1, 8, 2];`, use `filter` to get only numbers greater than 3, and `map` to double every number. Log both new arrays and confirm `nums` is unchanged.
- [ ] On any page, use `querySelectorAll` to grab all the `<a>` links, then `forEach` to log each one's `textContent`.
- [ ] Build a tiny page with a button and an empty `<ul>`. Each click should `createElement("li")` and `append` it to the list. (Counter optional.)
- [ ] Add one parent-level click listener to that `<ul>` that removes whichever `<li>` you click. (This is event delegation — no per-item listeners.)
- [ ] Save an array of three strings to `localStorage` with `JSON.stringify`, refresh the page, load it back with `JSON.parse`, and log it.

## Portfolio build — Habit Tracker (vanilla JS version)

This is the flagship. Build it in small steps; commit after each one so you always have a working version to fall back to.

- [ ] Create a new project folder with `index.html`, `style.css`, and `script.js`. Link the script at the end of `<body>` (or with `defer`).
- [ ] Sketch the data shape: a `habits` array, where each habit is an object with `id`, `name`, and a `days` array of 7 booleans (one per day of the week).
- [ ] Build the static HTML shell: a heading, a form with a text input and "Add" button, and an empty container (e.g. `<ul id="habit-list">`).
- [ ] Write a `render()` function that clears the list and rebuilds it from the `habits` array (use `map` or `forEach` to make each habit's row, with 7 day-buttons and a delete button).
- [ ] Wire up the form's `submit` event: `preventDefault`, read the input value, push a new habit object into `habits`, clear the input, and `render()`.
- [ ] Use **event delegation**: one click listener on the list container that handles both toggling a day button and deleting a habit (check `e.target` and a `data-id` attribute).
- [ ] Make day-buttons toggle: clicking flips that day's boolean in the data and toggles a `done` CSS class so it changes color.
- [ ] Make delete work: `filter` the clicked habit out of the array by its id, then `render()`.
- [ ] Add persistence: a `save()` function that does `localStorage.setItem("habits", JSON.stringify(habits))`, called after every change. On page load, read and `JSON.parse` the saved habits (with an empty-array fallback).
- [ ] Style it so "done" days are obviously different (color/checkmark) and the layout is clean. Reuse your Phase 1 CSS skills.
- [ ] Test the milestone: toggle a habit, refresh the page, confirm the toggle survived.
- [ ] Deploy it (GitHub Pages or Netlify, like your Phase 1 site) and add the live link to your portfolio.

## 🎯 Milestone & self-check

**Milestone:** A working, frontend-only Habit Tracker, deployed and live. You can add habits, delete them, click days to toggle done/not-done — and a toggled habit survives a full page refresh because it's saved to localStorage.

**Prove it.** Can you, from a blank file with no copying:

- Select an element by class and change its text, and toggle a CSS class on it?
- Attach a *single* delegated click listener to a parent that correctly handles clicks on children that didn't exist when the listener was attached?
- Use `filter` to remove one item from an array of objects by its `id`, without mutating the original?
- Save an array of objects to localStorage and load it back as a real array (not a string)?
- Explain out loud why `JSON.stringify`/`JSON.parse` are needed and what `e.preventDefault()` does on a form?

If you can do those five cold, you understand this phase. If one feels shaky, that's your signal for where to re-read or re-watch — not a reason to feel behind.

## Time estimate

Roughly **5–7 weeks** at 2–5 hrs/week, so about **15–30 hours** total. Expect the language fundamentals and DOM basics to go faster than the project, where delegation and localStorage will each take a focused session or two to truly click. That's normal. The Habit Tracker you finish here is the same app you'll rebuild in React next phase — so the effort compounds.
