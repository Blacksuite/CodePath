# Phase 5 — Full-stack: backend + database + auth (Supabase)
> **Time:** ~6–9 weeks at 2–5 hrs/wk · **Portfolio work:** Habit Tracker (now full-stack) + start Project 5 — Bookmarks/Read-Later

## Why this phase matters

Up to now, everything you built lived in the browser. Close the tab, and your data was either gone or stuck in `localStorage` on one machine. After this phase, your apps have real accounts and a real database in the cloud. A user signs up on their laptop, logs in on their phone, and their data is there. That is the line between "a webpage" and "an app people use." This is the big one. When you finish it, you can honestly say: **I build full-stack apps.**

## What you'll learn

- The full-stack mental model: frontend ↔ API ↔ database, and what a "backend" and "database" actually are
- Relational database basics: tables, rows, columns, primary keys, and the all-important `user_id` foreign key
- What Supabase gives you (Postgres + an auto-generated API + auth) and why it lets one person go full-stack
- **CRUD** from React: create, read, update, and delete rows in a real database
- **Auth**: signup and login (email + password or magic link), and what a "session" actually is
- **Row Level Security (RLS)**: the single concept that silently breaks beginner apps, and how to get it right
- Loading and error states for network calls
- Migrating your data from `localStorage` to the cloud

## The concepts (the actual teaching)

### The full-stack mental model

Here's the whole picture in one sentence: your **frontend** (the React app in the browser) talks to an **API** (a set of URLs you can send requests to), and that API reads from and writes to a **database** (where data lives permanently). That's it. That's full-stack.

Think of a restaurant. The frontend is the dining room — what the customer sees and touches. The database is the walk-in fridge in the back — where all the food (data) is actually stored. The API is the waiter — the only one allowed to walk between the two. The customer never marches into the fridge themselves. They ask the waiter, the waiter goes to the back, grabs what's needed, and brings it out. Your React app never touches the database directly; it asks the API, and the API does the fetching.

A **backend** is just code that runs on a server (a computer that's always on, somewhere that isn't the user's browser) instead of in the browser. A **database** is a program built for one job: storing data in an organized way and handing it back fast when asked. Normally, building a backend means writing server code, setting up a database, wiring up authentication, and deploying all of it. That's a lot of moving parts for one person. Supabase collapses most of that work, which is exactly why you're using it.

```
[ React app in browser ]  ⇄  [ API ]  ⇄  [ Database ]
       frontend              waiter         the fridge
```

- ⚠️ **Common mistake:** Thinking the database lives "inside" your React app. It doesn't. It lives on a server in the cloud. Your app sends requests over the internet to reach it, which is why every database call can be slow or fail — and why you'll need loading and error states.
- 🧠 **Concept check:** In the restaurant analogy, which part is responsible for actually storing your habits long-term?
  <details><summary>Show answer</summary>The database (the walk-in fridge). The frontend just displays things; the API just shuttles requests back and forth.</details>

### Relational databases: tables, rows, columns, keys

A relational database stores data in **tables**, which are basically spreadsheets. A `habits` table has **columns** (the fields every habit has: `id`, `name`, `created_at`, `user_id`) and **rows** (one row per actual habit). One row = one habit.

Every row needs a way to be uniquely identified. That's the **primary key** — usually a column called `id` that's guaranteed to be unique for every row. No two habits share an `id`. When you want to update or delete one specific habit, you find it by its `id`.

The word "relational" comes from how tables **relate** to each other. Your `habits` table has a `user_id` column. That value points to the `id` of a row in the users table. This is a **foreign key**: a column in one table that holds the primary key of a row in another table. It's the link that says "this habit belongs to that user." This one column is what makes per-user data possible — every habit knows whose it is.

```
users table
 id        | email
-----------+------------------
 abc-123   | sam@example.com

habits table
 id   | name           | user_id   ← foreign key points to users.id
------+----------------+----------
 h1   | Drink water    | abc-123
 h2   | Read 10 min    | abc-123
```

- ⚠️ **Common mistake:** Forgetting the `user_id` column entirely. Without it, every habit in your database is in one big shared pile and you have no way to know whose is whose. Add `user_id` from the very first version of the table.
- 🧠 **Concept check:** What's the difference between a primary key and a foreign key?
  <details><summary>Show answer</summary>A primary key uniquely identifies a row *within its own table* (e.g. `habits.id`). A foreign key is a column that holds the primary key of a row in *another* table (e.g. `habits.user_id` holds a `users.id`), creating a link between them.</details>

### Supabase: what it actually gives you

Supabase is a hosted package of three things you'd otherwise have to build and run yourself:

1. **A Postgres database** — Postgres is a mature, widely-used relational database. You make tables in a friendly web dashboard (the Table Editor) or by writing SQL.
2. **An auto-generated API** — this is the magic part. The moment you create a table, Supabase gives you an API to read and write it. You don't write any server code. You call it from React using their JavaScript client library (`@supabase/supabase-js`).
3. **Auth** — built-in signup, login, sessions, password reset, magic links, and social logins. It plugs straight into the database so a logged-in user automatically has an `id` you can use as that `user_id` foreign key.

That bundle is why a solo developer can ship a full-stack app in a weekend. You write frontend code and a bit of database setup; Supabase handles the server, the API, and the auth plumbing. There's a free tier that's plenty for learning and small projects.

```js
// You create one client and reuse it everywhere.
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,      // your project URL
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY  // the public "publishable" key (older projects call it the "anon" key)
)
```

The publishable key (labeled `anon` in older projects) is safe to ship in your frontend — it's *meant* to be public. What actually keeps users' data private is Row Level Security, which you'll meet shortly. (Never put your `service_role`/secret key in frontend code, though. That one bypasses all security.)

> ⚠️ **Version warning — read this once and remember it.** Supabase released SDK **v2** a while back, and it changed the auth function names. Tutorials from **2021–2022 use v1**, where login looked like `supabase.auth.signIn(...)`. That function **does not exist in v2**. In v2 it's `supabase.auth.signInWithPassword(...)`. If you follow an older video and your login code throws "signIn is not a function," you've hit this exact trap. The official Supabase docs linked below are current v2 — trust those over any random tutorial. (One more naming trap: newer Supabase projects show a **publishable key** where older tutorials say **anon key** — they're the same thing and do the same job, so use whichever your dashboard shows.)

- ⚠️ **Common mistake:** Pasting your Supabase URL and key directly into a component instead of into a `.env` file. Use environment variables (`VITE_SUPABASE_URL`, etc.) so keys aren't hardcoded all over your code, and so you never accidentally commit the wrong one.
- 🧠 **Concept check:** Why don't you have to write any backend server code to read your `habits` table from React?
  <details><summary>Show answer</summary>Supabase auto-generates an API for every table you create. The `supabase-js` client calls that API for you, so the "backend" already exists the moment the table does.</details>

### CRUD from React

**CRUD** is the four things you do to data: **C**reate, **R**ead, **U**pdate, **D**elete. Almost every app is mostly CRUD. With the Supabase client, each one is a short method chain. Notice the shape: pick a table with `.from()`, then say what you want.

```js
// READ — get this user's habits
const { data, error } = await supabase
  .from('habits')
  .select('*')

// CREATE — add a habit
const { data, error } = await supabase
  .from('habits')
  .insert({ name: 'Drink water', user_id: user.id })
  .select()   // ask for the new row back

// UPDATE — rename habit h1
const { error } = await supabase
  .from('habits')
  .update({ name: 'Drink more water' })
  .eq('id', 'h1')   // "where id = h1"

// DELETE — remove habit h1
const { error } = await supabase
  .from('habits')
  .delete()
  .eq('id', 'h1')
```

Two things to burn in. First, every call returns an object with **both** `data` and `error`. Supabase does *not* throw on a failed request — it hands you `{ data, error }` and expects you to check `error` yourself. Second, `.eq('id', 'h1')` is how you target a specific row — it means "where the `id` column equals `'h1'`." Forget the `.eq()` on an update or delete and you'll change *every* row you're allowed to touch.

Because these are network calls (they go over the internet), they're `async`. You `await` them, and while you wait, your UI should show a loading state. More on that below.

- ⚠️ **Common mistake:** Calling `.delete()` or `.update()` without a `.eq()` filter. With no filter, the operation hits every row your permissions allow. Always filter to the exact `id`.
- 🧠 **Concept check:** After `await supabase.from('habits').insert(...)`, how do you know whether it actually worked?
  <details><summary>Show answer</summary>Check the returned `error`. Supabase doesn't throw — you destructure `{ data, error }` and handle `error` if it's not null. A successful insert has `error === null`.</details>

### Auth: signup, login, and what a session is

Authentication answers one question: **who is this?** Supabase Auth handles the whole flow. You give it an email and password (or send a magic link), and it manages the rest.

A **session** is proof that a user is logged in. After a successful login, Supabase hands the browser a token (think of it as a wristband at an event — it proves you paid to get in, so you don't show your ID at every door). The `supabase-js` client stores that token and automatically attaches it to every database request. That's how the database knows *which* user is asking — and that's what powers per-user data.

```js
// Sign up a new user
const { data, error } = await supabase.auth.signUp({
  email: 'sam@example.com',
  password: 'a-strong-password',
})

// Log an existing user in  (v2 — note the function name!)
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'sam@example.com',
  password: 'a-strong-password',
})

// Log out
await supabase.auth.signOut()
```

You don't want to re-check auth all over your app, so listen for changes in one place and store the session in React state (or context):

```js
useEffect(() => {
  // get the current session on load
  supabase.auth.getSession().then(({ data }) => setSession(data.session))

  // then react to login / logout anywhere in the app
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
  })
  return () => sub.subscription.unsubscribe()
}, [])
```

When `session` is `null`, show the login screen. When it's set, show the app. The logged-in user's id lives at `session.user.id` — that's the value you write into the `user_id` column when creating habits.

- ⚠️ **Common mistake:** Using v1's `signIn()` (from older tutorials) and getting "is not a function." It's `signInWithPassword()` in v2. Also: with email/password signup, Supabase often requires email confirmation by default — if login "silently fails" right after signup, check whether the user confirmed their email, or turn off email confirmation in your project settings while developing.
- 🧠 **Concept check:** What is a session, in one sentence, and what does the client do with it on each request?
  <details><summary>Show answer</summary>A session is a token proving the user is logged in; the `supabase-js` client stores it and attaches it to every database request so the backend knows who's asking.</details>

### Row Level Security (RLS) — read this twice

This is the concept that quietly wrecks beginner Supabase apps, so slow down here. It's worth more than any other section in this phase.

By default, when you turn on RLS, your table is **locked**. No rows go in or out — every query comes back empty, every insert is rejected. Beginners hit this, see "no data, no error message," and lose an afternoon. The fix isn't to turn RLS off (that would make your data public to anyone with your anon key). The fix is to **write policies**.

A **policy** is a rule that gets automatically bolted onto every query as an extra `WHERE` clause. You never write `WHERE user_id = ...` in your React code — the policy adds it for you, on the server, where it can't be tampered with. The classic policy uses `auth.uid()`, a function that returns the id of the currently logged-in user (pulled from their session). The rule you want is: **a user can only touch rows where the row's `user_id` matches their own id.**

```sql
-- 1) Turn RLS on for the table (locks it by default)
alter table habits enable row level security;

-- 2) Let users SELECT only their own rows
create policy "Users read own habits"
on habits for select
using ( auth.uid() = user_id );

-- 3) Let users INSERT rows only as themselves
create policy "Users insert own habits"
on habits for insert
with check ( auth.uid() = user_id );

-- (You'd add similar policies for update and delete.)
```

Read `using ( auth.uid() = user_id )` as: "this row is visible only if its `user_id` equals the logged-in user's id." For inserts you use `with check` instead — it validates the row *going in* so a user can't create a habit owned by someone else. This is real security: even if someone opened the browser console and tried to query another user's habits directly, the policy blocks it at the database. The privacy doesn't depend on your frontend code being careful — it's enforced where it can't be bypassed.

The two failure modes to recognize:
- **RLS on, no policies** → everything comes back empty. (You forgot to write policies.)
- **RLS off** → everything works in development, but anyone with your public anon key can read every user's data. (Dangerous. Don't ship this.)

The correct state is: **RLS enabled, with policies that scope rows to `auth.uid() = user_id`.** When you build the Habit Tracker, you'll prove this works by logging in as two different accounts and confirming each one sees only its own habits.

- ⚠️ **Common mistake:** Seeing empty results after enabling RLS and assuming your CRUD code is broken. It usually isn't — you enabled RLS but didn't add policies, so the database is correctly refusing to return rows. Add the policies.
- 🧠 **Concept check:** You enabled RLS and now every `select` returns an empty array, with no error. What's almost certainly wrong, and what's the fix?
  <details><summary>Show answer</summary>RLS is on but you have no policies, so the table is locked and returns nothing. Fix: add policies (e.g. a `select` policy with `using (auth.uid() = user_id)`). The answer is never to disable RLS.</details>

### Loading and error states

Every database call travels over the internet, so it takes time and can fail. A request that's instant on your fast laptop wifi can take two seconds on a phone with one bar — or never come back. Your UI has to account for all three: loading, success, and error. If you don't, users stare at a frozen screen and assume your app is broken.

The pattern is three pieces of state per data operation:

```jsx
const [habits, setHabits] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('habits').select('*')
    if (error) setError(error.message)
    else setHabits(data)
    setLoading(false)
  }
  load()
}, [])

if (loading) return <p>Loading…</p>
if (error)   return <p>Something went wrong: {error}</p>
return <HabitList habits={habits} />
```

Always set `loading` back to `false` whether the call succeeded *or* failed — otherwise a failed request leaves a spinner spinning forever.

- ⚠️ **Common mistake:** Only handling the happy path. You test on fast wifi where everything's instant, ship it, and the first user on a slow connection sees a blank screen for three seconds with no feedback. Add the loading state from the start.
- 🧠 **Concept check:** Why does *every* Supabase call need a loading state when a `useState` update doesn't?
  <details><summary>Show answer</summary>Supabase calls are network requests that go over the internet — they take real time and can fail. A `useState` update is instant and local to the browser. The delay and the chance of failure are what force you to show loading and error states.</details>

### Migrating from localStorage to the cloud

Your Phase 3/4 Habit Tracker stored habits in `localStorage`. That data is trapped on one browser. Now you're moving it to Supabase so it follows the user everywhere. Conceptually, this is a swap: anywhere your code did `localStorage.getItem`/`setItem`, it now does a Supabase `select`/`insert`.

Do it in small steps, not one giant rewrite. First, get reading from Supabase working (with auth and RLS) while leaving the old code in place. Then switch creating, then updating, then deleting, one at a time, testing after each. Only when all four work do you delete the `localStorage` code. If you want to preserve existing local data, you can write a one-time function that reads from `localStorage` and inserts each item into Supabase — but for a learning project, it's completely fine to just start fresh in the cloud.

```js
// Before (Phase 3): habits lived in the browser
localStorage.setItem('habits', JSON.stringify(habits))

// After (Phase 5): habits live in Postgres, scoped to this user by RLS
await supabase.from('habits').insert({ name, user_id: session.user.id })
```

- ⚠️ **Common mistake:** Rewriting all four CRUD operations at once, then having nothing work and no idea which change broke it. Migrate one operation at a time and test between each.
- 🧠 **Concept check:** What's the main thing the cloud version gives a user that the `localStorage` version never could?
  <details><summary>Show answer</summary>Their data follows them across devices and browsers (and survives clearing the browser). It lives on a server tied to their account, not in one specific browser.</details>

## Guided resources

| Resource | What to use it for | Link |
|---|---|---|
| Fireship — Supabase in 100 Seconds | The 2-minute mental model before you start | https://www.youtube.com/watch?v=zBZgdTb-dns |
| Supabase docs — Use Supabase with React (quickstart) | Get a project + client wired into React fast | https://supabase.com/docs/guides/getting-started/quickstarts/reactjs |
| Supabase docs — Build a User Management App with React | The spine: auth + user table + RLS + CRUD, all together | https://supabase.com/docs/guides/getting-started/tutorials/with-react |
| Supabase docs — Row Level Security | The authoritative explainer on RLS and policies | https://supabase.com/docs/guides/auth/row-level-security |
| freeCodeCamp — Supabase for Beginners (~5h, chaptered) | Reference library — jump to the chapter you need | https://www.freecodecamp.org/news/supabase-for-beginners/ |
| CRUD build-along — React + Supabase To-Do | Build-along that maps 1:1 onto habits (verify on open) | https://www.youtube.com/watch?v=X3DAmdEnuRw |

> Reminder: any 2021–2022 video may use SDK **v1** (`signIn()`). You want **v2** (`signInWithPassword()`). The Supabase docs above are current v2 — they win any disagreement.

## Exercises (do these — don't just read)

- [ ] In the Supabase dashboard, create a `habits` table with columns `id`, `name`, `created_at`, and `user_id`. Add two rows by hand in the Table Editor.
- [ ] Wire up `@supabase/supabase-js` in a throwaway React file and `console.log` the result of a `select('*')` on your table. Confirm you see `{ data, error }`.
- [ ] Add signup and login forms. Sign up a test account, log in, and `console.log(session.user.id)`. Confirm logging out sets the session to `null`.
- [ ] Enable RLS on `habits` with no policies, run your read, and watch it return an empty array. Then add a `select` policy with `using (auth.uid() = user_id)` and watch your rows come back. Feel the failure and the fix.
- [ ] Build a tiny "delete by id" button that calls `.delete().eq('id', ...)`. Then deliberately remove the `.eq()` and observe what RLS still protects (and what it doesn't). Put the `.eq()` back.
- [ ] Add a loading state and an error state to one read, then throttle your network in browser DevTools to *see* the loading state actually appear.

## Portfolio build — Habit Tracker (now full-stack)

- [ ] Create a Supabase project (free tier). Save your project URL and **publishable key** (it's labeled "anon" in projects created before late 2025) into a `.env` file as `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- [ ] Create a `supabaseClient.js` that exports a single configured client. Import it everywhere.
- [ ] Create the `habits` table with a `user_id` column. Plan it to hold per-user data from row one.
- [ ] Build signup, login, and logout. Store the session in state via `onAuthStateChange`. Show the login screen when `session` is null, the app when it's set.
- [ ] **Enable RLS** on `habits` and write four policies (select, insert, update, delete), each scoped with `auth.uid() = user_id`.
- [ ] Replace the `localStorage` **read** with a Supabase `select` — one operation, then test.

  ⏸️ **Good place to stop and take a break.** You've got reading-from-the-cloud working with real auth and RLS. That's a genuine milestone. Walk away, let it settle, come back fresh for the other three CRUD operations.

- [ ] Replace **create** with `insert` (set `user_id: session.user.id`), then test.
- [ ] Replace **update** and **delete** with `.update().eq()` and `.delete().eq()`, then test.
- [ ] Add loading and error states to every data operation.
- [ ] Delete the old `localStorage` code once all four operations work in the cloud.
- [ ] **Prove the isolation:** create a *second* account, add different habits, and confirm each account sees only its own. This is your RLS working.

## Portfolio build — start Project 5: Bookmarks / Read-Later

This is your independence proof — a second Supabase app, built mostly on your own, reusing what you just learned.

- [ ] New Supabase project (or a new `bookmarks` table). Columns: `id`, `url`, `title`, `created_at`, `user_id`.
- [ ] Reuse your auth setup (signup/login/logout + session handling) from the Habit Tracker.
- [ ] Enable RLS and add the four `auth.uid() = user_id` policies before writing any CRUD.
- [ ] Build "add a bookmark" (create) and "list my bookmarks" (read) with loading and error states.
- [ ] Add delete. (Update — e.g. editing the title — is a stretch goal.)

## 🎯 Milestone & self-check

**The milestone:** a real, full-stack Habit Tracker. Accounts you can sign up for and log into. Per-user data living in a cloud Postgres database. Data that syncs across devices because it's no longer trapped in one browser. And data isolation you've *verified* with two separate accounts, each seeing only its own habits. This is the moment you can say, truthfully: **"I build full-stack apps."**

**Prove it.** Can you, from a blank file with no copying…

- [ ] Explain the frontend ↔ API ↔ database flow, and say what a `user_id` foreign key is for?
- [ ] Write the four CRUD calls (`select`, `insert`, `update`, `delete`) with the correct `.eq()` filters?
- [ ] Set up signup + login with the **v2** function names and store the session correctly?
- [ ] Write an RLS policy scoped to `auth.uid() = user_id`, and explain why an empty result after enabling RLS means "add policies," not "disable RLS"?
- [ ] Add loading and error states to a Supabase call and explain why a network call needs them when a `useState` update doesn't?

If you can do those without looking things up, the concept is yours.

## Time estimate

Roughly **6–9 weeks** at 2–5 hrs/week (about **20–35 hours** total). Budget the largest chunk for auth + RLS — that's where the genuinely new thinking lives, and where rushing causes the most pain. The second app (Bookmarks) goes much faster than the first because you're reusing the auth and RLS patterns. If RLS frustrates you, that's normal and expected; reread the RLS section, lean on the official RLS doc, and remember: empty results almost always mean "write a policy."
