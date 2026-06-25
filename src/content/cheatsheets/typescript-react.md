# TypeScript + React Cheat-Sheet

> **What this is:** Just enough TypeScript to type your React components, state, events, and API data.

## Basic types

```ts
let name: string = 'Sam';
let age: number = 30;
let active: boolean = true;
let tags: string[] = ['a', 'b'];        // array of strings
let pair: [string, number] = ['x', 1];  // tuple (fixed shape)

let id: string | number = 5;            // union: either type
let nickname: string | undefined;       // might not be set

function add(a: number, b: number): number {
  return a + b;
}
```

## interface vs type

Both describe the shape of an object. Use whichever you like; stay consistent.

```ts
interface User {
  id: number;
  name: string;
  email?: string;   // optional (the ? means "may be missing")
}

type Status = 'idle' | 'loading' | 'done';   // union of exact strings
```

Rule of thumb: `interface` for object shapes (it can be extended), `type` for unions and aliases.

## Typing props

```tsx
interface CardProps {
  title: string;
  count: number;
  onClick: () => void;     // a function taking nothing, returning nothing
}

function Card({ title, count, onClick }: CardProps) {
  return <button onClick={onClick}>{title}: {count}</button>;
}
```

For children:

```tsx
import { ReactNode } from 'react';

interface BoxProps {
  children: ReactNode;     // anything renderable (text, elements, etc.)
}
```

## Typing useState

```tsx
const [count, setCount] = useState(0);          // inferred as number
const [name, setName] = useState('');           // inferred as string

const [user, setUser] = useState<User | null>(null);  // be explicit
const [items, setItems] = useState<string[]>([]);     // empty array needs a type
```

⚠️ For an empty array or `null` initial value, TypeScript can't guess the type — add `<Type>` yourself.

## Typing events

```tsx
// click event on a button
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
}

// input change event
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setName(e.target.value);
}

// form submit event
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}
```

## Typing an API response

Describe the data shape, then tell `fetch` what you expect.

```tsx
interface Movie {
  id: number;
  title: string;
  year: number;
}

async function getMovies(): Promise<Movie[]> {
  const res = await fetch('https://api.example.com/movies');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: Movie[] = await res.json();   // assert the shape
  return data;
}
```

⚠️ `res.json()` returns `any` — TypeScript won't actually verify the shape at runtime. Typing it (`data: Movie[]`) gives you autocomplete and catches typos, but the server could still send something different. For real safety, validate (search: zod schema validation).

## Quick reference

- `?` after a name = optional.
- `Type[]` = array of that type.
- `A | B` = union (one or the other).
- `useState<Type>()` = tell state what it holds.
- Props get an `interface`; pass it as the parameter type.
