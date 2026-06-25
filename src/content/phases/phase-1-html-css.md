# Phase 1 — HTML + CSS

> **Time:** ~3–5 weeks at 2–5 hrs/wk · **Portfolio work:** Project 1 — Personal Portfolio Site (and a static Habit Tracker UI as a stretch)

## Why this phase matters

By the end of this phase you can build a real web page from a blank file and make it look good on a phone, a tablet, and a laptop. No frameworks, no build tools, no magic. Just the two languages every website on earth is made of. When you finish, you'll have a portfolio site that's actually live on the internet at a URL you can text to someone. That's a genuine "I made this" moment, and you'll get there in a few weeks of short sessions.

## What you'll learn

- HTML as structure and meaning: elements, nesting, attributes, and semantic tags
- Why semantics matter (accessibility and clarity)
- CSS basics: selectors, properties, and how styles get applied
- The box model — content, padding, border, margin (this is where beginners get stuck, so we'll go slow)
- Flexbox for one-dimensional layout (a row or a column)
- CSS Grid for two-dimensional layout (rows and columns at once)
- Responsive, mobile-first design: media queries, relative units, and why you start small

## The concepts (the actual teaching)

### HTML is structure and meaning

HTML doesn't make things pretty. That's CSS's job. HTML's job is to say what each piece of your page *is*: this is a heading, this is a paragraph, this is a button, this is a list. You write content and wrap it in **tags** that label its role.

An **element** is an opening tag, some content, and a closing tag. Tags **nest** inside each other like boxes inside boxes, and the indentation in your code should mirror that nesting so you can read it.

```html
<article>
  <h1>My first page</h1>
  <p>Hello. This paragraph lives inside the article.</p>
</article>
```

Here `<article>` contains an `<h1>` (a top-level heading) and a `<p>` (a paragraph). The heading and paragraph are *siblings*; both are *children* of the article. Get used to seeing the page as a tree of nested boxes, because CSS and JavaScript both think about it that way.

Most elements come in pairs (`<p>...</p>`). A few are self-closing because they have no inner content, like `<img>` and `<br>`.

- ⚠️ **Common mistake:** Forgetting to close a tag, or closing them in the wrong order. `<p><strong>text</p></strong>` is wrong — you must close the inner tag before the outer one: `<p><strong>text</strong></p>`. Nest boxes properly.
- 🧠 **Concept check:** In `<ul><li>Coffee</li></ul>`, which element is the parent and which is the child?
  <details><summary>Show answer</summary>The `<ul>` (unordered list) is the parent; the `<li>` (list item) is its child. The `<li>` is nested inside the `<ul>`.</details>

### Attributes give elements extra info

Tags can carry **attributes** — name/value pairs written inside the opening tag that configure the element. A link needs to know where it goes (`href`), an image needs to know its file and a text description (`src`, `alt`), and you'll constantly use `class` to hook elements up to CSS.

```html
<a href="https://example.com">Visit example</a>
<img src="cat.jpg" alt="A ginger cat asleep on a keyboard">
```

The `alt` text on an image is not optional busywork. It's what a screen reader announces to a blind user, and what shows up if the image fails to load. Write it like you're describing the picture to someone on the phone.

- ⚠️ **Common mistake:** Leaving `alt` empty or writing `alt="image"`. If the image is meaningful, describe it. If it's purely decorative, use `alt=""` (empty) so screen readers skip it — that's a deliberate signal, not laziness.

### Semantic tags: say what things mean

You *could* build an entire site out of `<div>` (a generic, meaningless box). Please don't. HTML gives you tags that carry meaning: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`. Using them is called writing **semantic HTML**.

Why bother? Two big reasons. First, **accessibility**: screen readers and other assistive tech use these tags to let users jump straight to the main content or navigate by landmarks. A page built from `<div>` soup is a wall with no doors for them. Second, **clarity**: six months from now, `<nav>` tells you instantly what a block is. `<div class="nav-thing-2">` tells you nothing.

```html
<header>
  <nav><a href="#projects">Projects</a></nav>
</header>
<main>
  <section id="projects">
    <h2>Projects</h2>
  </section>
</main>
<footer>© 2026 you</footer>
```

One that matters a lot: use a real `<button>` for things you click to do something, not a styled `<div>`. A real button is keyboard-focusable and announces itself as a button for free. You'd have to rebuild all of that by hand on a div, and you'll get it wrong.

- ⚠️ **Common mistake:** Reaching for `<div>` out of habit. Before you type `<div>`, ask "is there a tag that *means* this?" Often there is.
- 🧠 **Concept check:** You're adding a clickable "Submit" control. `<div>` or `<button>`, and why?
  <details><summary>Show answer</summary>`<button>`. It's focusable with the keyboard, announces itself to screen readers as a button, and fires on Enter/Space automatically. A `<div>` gives you none of that.</details>

### CSS: selectors and properties

CSS is how you style HTML. Every rule has the same shape: a **selector** that picks which elements to style, and a block of **declarations** (a property and a value) that say how.

```css
p {
  color: navy;
  font-size: 18px;
}
```

That reads: "for every `<p>` element, set the text color to navy and the font size to 18px." The selector here is the tag name. You'll mostly select by **class** instead, using a dot: `.card { ... }` styles every element with `class="card"`. You can also select by `#id` (a single unique element). Classes are your everyday tool; reach for them first.

Where does CSS live? In a separate `.css` file that you link from your HTML's `<head>`:

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

Keep your CSS in its own file from day one. Mixing styles into your HTML gets messy fast.

- ⚠️ **Common mistake:** Confusing `.` and `#`. `.menu` selects `class="menu"`; `#menu` selects `id="menu"`. Classes can repeat across many elements; an id should appear once per page.
- 🧠 **Concept check:** What does the selector `.btn` match?
  <details><summary>Show answer</summary>Every element with `class="btn"` (or that includes `btn` among its classes).</details>

### The box model (slow down here)

Every element on a page is a rectangular box, and that box has four layers from the inside out: **content**, then **padding**, then **border**, then **margin**. This is the single most confusing thing for beginners, so read this twice.

- **Content** is the text or image itself.
- **Padding** is space *inside* the box, between the content and the border. Padding is part of the box; if the box has a background color, the padding is colored too.
- **Border** is the line around the padding.
- **Margin** is space *outside* the box, pushing other elements away. Margin is always transparent.

Think of a framed photo on a wall. The photo is the content. The mat board around it is padding. The frame is the border. The gap between this frame and the next frame on the wall is margin.

```css
.card {
  padding: 16px;          /* space inside, around the content */
  border: 2px solid gray; /* the frame */
  margin: 24px;           /* space pushing other boxes away */
}
```

Now the part that bites everyone. By default, when you set `width: 300px`, that 300px is just the *content*. Padding and border get *added on top*, so the box actually takes up more than 300px on screen. That math is maddening. The fix is one rule you should put at the top of every stylesheet you ever write:

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

With `border-box`, `width: 300px` means the *whole box* is 300px — padding and border are included, and the content shrinks to fit. This is what you almost always want. Set it once and stop fighting the math.

- ⚠️ **Common mistake:** Wondering why a box is wider than the width you set. It's because padding and border are added outside the content by default. Add the `box-sizing: border-box` rule above and it behaves.
- 🧠 **Concept check:** You want space *inside* a button between its text and its edge. Padding or margin?
  <details><summary>Show answer</summary>Padding. Padding is inside the box (and takes the background color). Margin is outside, for pushing other elements away.</details>

> ☕ **Stop here and take a break if you've been going a while.** The box model is the hump. Once it clicks, the rest of CSS gets a lot friendlier. Walk away, come back, then play a layout game in the next section to make it stick.

### Flexbox: laying things out in one direction

You've got boxes. Now you need to arrange them — a row of nav links, a column of cards, a header with a logo on the left and a menu on the right. **Flexbox** is built for exactly this: laying items out along *one* axis, a row or a column, and aligning them.

You turn any element into a flex container with `display: flex`. Its direct children become flex items that line up in a row by default. Then you control them with a handful of properties:

- `justify-content` aligns items along the **main axis** (horizontally, for a row). Try `space-between`, `center`, `flex-start`.
- `align-items` aligns items along the **cross axis** (vertically, for a row). `center` is the famous one — it vertically centers a row of items, which used to be genuinely hard.
- `gap` adds even spacing between items without fiddly margins.

```css
.navbar {
  display: flex;
  justify-content: space-between; /* logo left, menu right */
  align-items: center;            /* vertically centered */
  gap: 16px;
}
```

Switch to a column with `flex-direction: column`, and now `justify-content` works vertically and `align-items` horizontally. The axes flip with the direction, which trips people up, so say it out loud when you set it: "main axis is the direction I chose; cross axis is the other one."

- ⚠️ **Common mistake:** Mixing up `justify-content` and `align-items`. Main axis = the direction items flow (`justify-content`). Cross axis = perpendicular (`align-items`). When you flip `flex-direction`, the two swap meaning.
- 🧠 **Concept check:** In a default row, which property centers items *vertically*?
  <details><summary>Show answer</summary>`align-items: center` — it works on the cross axis, which is vertical when items flow in a row.</details>

### CSS Grid: laying things out in two directions

Flexbox handles one direction at a time. When you need real *rows and columns at once* — a photo gallery, a dashboard, a card layout that wraps neatly — reach for **CSS Grid**.

You define a grid container with `display: grid` and describe the columns with `grid-template-columns`. The `fr` unit means "a fraction of the leftover space," so `1fr 1fr 1fr` makes three equal columns. `gap` works here too, for the gutters between cells.

```css
.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* three equal columns */
  gap: 16px;
}
```

A trick worth learning early: `repeat(auto-fit, minmax(200px, 1fr))` makes a responsive grid that automatically fits as many columns as will fit, each at least 200px wide, with no media query needed. Items wrap to new rows on their own as the screen shrinks. It feels like magic the first time.

The rule of thumb: **Flexbox for content that flows in a line, Grid for a real two-dimensional layout.** They're friends, not rivals. You'll often use Grid for the page skeleton and Flexbox inside each piece.

- ⚠️ **Common mistake:** Forcing Grid to do a simple row, or forcing Flexbox to fake a 2-D layout with awkward wrapping. Match the tool to the shape: line → Flexbox, table-like → Grid.
- 🧠 **Concept check:** What does `1fr 2fr` give you as `grid-template-columns`?
  <details><summary>Show answer</summary>Two columns where the second is twice as wide as the first. `fr` units split the available space by ratio, so it's a 1:2 split.</details>

### Responsive, mobile-first design

Your site will be viewed on a 375px-wide phone and a 1440px-wide laptop. **Responsive design** means one set of HTML and CSS that adapts to both instead of breaking. The modern way to do it is **mobile-first**: write your base styles for the small screen, then add overrides for bigger screens as the screen *grows*.

Why start small? Because a phone layout is usually a single simple column — easy to get right. Then you progressively add complexity (more columns, bigger spacing) as you gain room. Doing it the other way, cramming a desktop layout down onto a phone, is a constant fight. Start small, add room.

Two tools make this work:

**Relative units** instead of fixed pixels. Use `rem` for font sizes and spacing (it scales with the user's chosen base size, which respects their accessibility settings), and `%` or `fr` for widths so things flex with the screen. Hardcoding everything in `px` makes a rigid page.

**Media queries** apply CSS only above (or below) a screen width. Mobile-first means you use `min-width`: the base styles apply everywhere, and the query adds desktop tweaks once there's enough room.

```css
/* base: mobile, a single column */
.gallery { grid-template-columns: 1fr; }

/* wider screens: three columns */
@media (min-width: 768px) {
  .gallery { grid-template-columns: 1fr 1fr 1fr; }
}
```

One line you must put in every page's `<head>` or none of this works on real phones — it tells the browser to use the actual device width instead of pretending to be a desktop:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- ⚠️ **Common mistake:** Forgetting the viewport `<meta>` tag, then wondering why your "responsive" site looks like a tiny zoomed-out desktop on your phone. Add it to every page.
- 🧠 **Concept check:** In mobile-first CSS, do you write `min-width` or `max-width` media queries, and why?
  <details><summary>Show answer</summary>`min-width`. Base styles target mobile, and `min-width` queries layer on changes *as the screen gets bigger*. That's the "start small, add room" direction.</details>

## Guided resources

| Resource | What to use it for | Link |
|---|---|---|
| Odin Foundations — HTML & CSS (the spine) | Your main path through this phase. Work it in order; it ties everything together. | https://www.theodinproject.com/paths/foundations/courses/foundations |
| freeCodeCamp — Responsive Web Design v9 | In-browser drills to build muscle memory without local setup. Great for short sessions. | https://www.freecodecamp.org/learn/responsive-web-design-v9 |
| Kevin Powell — Learn Flexbox the easy way (~34 min) | Watch once before the Flexbox exercises; he makes the axes click. | https://www.youtube.com/watch?v=u044iM9xsWU |
| Flexbox Froggy (game, 24 levels) | Practice Flexbox properties by playing. Finish all 24 levels. | https://flexboxfroggy.com/ |
| Kevin Powell — Learn CSS Grid the easy way (~37 min) | Watch before the Grid exercises. | https://www.youtube.com/watch?v=rg7Fvvl3taU |
| Grid Garden (game, 28 levels) | Practice Grid by playing. Finish all 28 levels. | https://cssgridgarden.com/ |
| Kevin Powell — Conquering Responsive Layouts (free 21-day email course) | A short daily nudge that builds real responsive instincts over three weeks. | https://courses.kevinpowell.co/conquering-responsive-layouts |
| (optional all-in-one video) | A single long video if you prefer one continuous watch-along. | search: Learn HTML and CSS Full Course freeCodeCamp Scrimba |

## Exercises (do these — don't just read)

- [ ] Hand-write a small page from a blank file using only semantic tags (`header`, `nav`, `main`, `section`, `footer`) — no `<div>` allowed. Add one image with real `alt` text.
- [ ] Take any box on a page, give it a visible `border`, then add `padding` and `margin` and watch where each one pushes. Then add `box-sizing: border-box` and note what changes.
- [ ] Build a navbar with Flexbox: logo on the left, three links on the right, vertically centered, with even `gap`.
- [ ] Finish all 24 levels of Flexbox Froggy and all 28 levels of Grid Garden.
- [ ] Build a card gallery with Grid that shows one column on mobile and three columns at `min-width: 768px`. Resize your browser to watch it switch.
- [ ] Take any layout you've built and make it fully responsive with a single `min-width` media query. Confirm it on your phone (or your browser's device toolbar).

## Portfolio build — Personal Portfolio Site

Build this incrementally. Each checkbox is a small win you can finish in a short session.

- [ ] Create a project folder with `index.html` and `styles.css`, linked together. Add the viewport `<meta>` tag and the `box-sizing: border-box` reset.
- [ ] Lay out the page with semantic tags: a `<header>` with your name and a `<nav>`, a `<main>` with sections, a `<footer>` with contact links.
- [ ] Write a short "About me" section and a "Projects" section. For projects, use real or placeholder cards (you'll link Project 1 and the Habit Tracker here as you build them).
- [ ] Style it mobile-first: single column, readable font sizes in `rem`, comfortable spacing. Make it look intentional before you add complexity.
- [ ] Use Flexbox for the nav and any in-card rows; use Grid for the projects gallery.
- [ ] Add one `min-width` media query so the projects gallery goes multi-column on wider screens. Check it on a real phone.
- [ ] Put the project on GitHub and turn on **GitHub Pages** so it's live at a public URL. (`search: GitHub Pages enable repository settings`)

**Stretch — static Habit Tracker UI (no JavaScript yet):** Build the *look* of a habit tracker as static HTML/CSS: a list of habits, a row of day-circles for each, a header, an "add habit" button (it won't do anything yet — that's Phase 2). Doing this now means Phase 2 starts with a UI already in place, so you can focus purely on making it work.

- [ ] Lay out the habit list with semantic HTML and a real `<button>` for "add habit".
- [ ] Use Grid or Flexbox for the day-circles row.
- [ ] Make it responsive and commit it to your GitHub Pages site too.

## 🎯 Milestone & self-check

**Milestone:** Your Personal Portfolio Site (and ideally the static Habit Tracker UI) is live on GitHub Pages at a real URL, looks like an actual app, and works on a phone. You can send the link to a friend and they can open it.

**Prove it.** Can you, from a blank file with no copying…

- [ ] Build a small page using semantic tags, and explain *why* you chose `<button>` over `<div>` for a clickable control?
- [ ] Draw the box model from memory (content, padding, border, margin) and say which one creates space *inside* a box versus *between* boxes?
- [ ] Center a row of items both horizontally and vertically with Flexbox, naming the property for each?
- [ ] Make a three-column Grid that collapses to one column on mobile using a `min-width` media query?
- [ ] Explain why mobile-first uses `min-width` queries and why the viewport `<meta>` tag matters?

If any of those make you hesitate, that's not failure — it's a signpost. Go back to that one section and the matching game, then try again.

## Time estimate

Roughly **3–5 weeks** at 2–5 hours per week (about **12–18 hours** total). A reasonable split: ~5–6 hours on HTML and CSS basics plus the box model, ~3–4 hours on Flexbox and Grid (videos + both games), ~2–3 hours on responsive design, and ~3–5 hours building and shipping the portfolio site. Off-weeks happen. The work waits for you.
