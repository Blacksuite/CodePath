# React Hooks Cheat-Sheet

> **What this is:** The React patterns you write in every component — state, effects, props, lists, forms, and a custom hook.

## Component skeleton

```jsx
function Greeting() {
  return <h1>Hello</h1>;   // a component returns JSX
}

export default Greeting;
```

## useState — local state

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);   // [value, setter], initial 0

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

⚠️ Never assign state directly (`count = 5`). Always call the setter (`setCount(5)`), or React won't re-render. When the new value depends on the old, use a function: `setCount(c => c + 1)`.

## useEffect — run code on render / change

```jsx
import { useEffect, useState } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);   // CLEANUP: runs before re-run/unmount
  }, []);                             // DEPS: [] = run once on mount

  return <p>{seconds}s</p>;
}
```

The dependency array (the second argument):

- `[]` — run once, when the component mounts.
- `[count]` — run again whenever `count` changes.
- *(omitted)* — run after every single render (rarely what you want).

The returned function is **cleanup** — use it to cancel timers, listeners, or subscriptions.

## Props — passing data down

```jsx
function App() {
  return <Welcome name="Sam" />;
}

function Welcome({ name }) {       // destructure props
  return <p>Welcome, {name}!</p>;
}
```

## Rendering lists (with keys)

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>   // key = stable, unique id
      ))}
    </ul>
  );
}
```

⚠️ Every item in a `.map` needs a unique `key`. Use a real id, not the array index (index breaks when items reorder or get deleted).

## Controlled form

```jsx
function NameForm() {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();          // stop the page reload
    console.log(name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}                          // input shows state
        onChange={(e) => setName(e.target.value)}  // state follows input
      />
      <button>Save</button>
    </form>
  );
}
```

"Controlled" = React state is the single source of truth: `value` reads it, `onChange` updates it.

## Custom hook — useLocalStorage

A custom hook is just a function starting with `use` that calls other hooks.

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;   // load once
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));  // save on change
  }, [key, value]);

  return [value, setValue];   // same shape as useState
}

// usage:
const [habits, setHabits] = useLocalStorage('habits', []);
```

## Rules of hooks

- Only call hooks at the top level of a component (not in loops, conditions, or nested functions).
- Only call hooks from React components or other custom hooks.
