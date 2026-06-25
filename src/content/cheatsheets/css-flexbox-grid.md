# CSS Flexbox & Grid Cheat-Sheet

> **What this is:** The layout properties you reach for over and over, plus a few copy-ready recipes.

## The box model

Every element is a box: content → padding → border → margin (inside out).

```css
.box {
  width: 200px;
  padding: 16px;          /* space INSIDE the border */
  border: 1px solid #ccc;
  margin: 24px;           /* space OUTSIDE the border */
  box-sizing: border-box; /* width now includes padding + border */
}
```

⚠️ Without `box-sizing: border-box`, padding and border get ADDED to your width. Set it globally:

```css
* { box-sizing: border-box; }
```

## Flexbox — for rows and columns (1 dimension)

```css
.container {
  display: flex;              /* turn on flexbox */
  flex-direction: row;        /* row (default) | column */
  justify-content: center;    /* align along the main axis */
  align-items: center;        /* align along the cross axis */
  gap: 16px;                  /* space between items */
  flex-wrap: wrap;            /* let items wrap to next line */
}
```

`justify-content` values: `flex-start` · `center` · `flex-end` · `space-between` · `space-around` · `space-evenly`

`align-items` values: `stretch` (default) · `center` · `flex-start` · `flex-end`

On a child item:

```css
.item {
  flex: 1;        /* grow to fill available space (share equally) */
  flex: 0 0 200px;/* don't grow, don't shrink, stay 200px wide */
}
```

## Grid — for rows AND columns (2 dimensions)

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
  gap: 16px;                           /* space between cells */
}
```

`fr` = a fraction of the free space. `1fr 2fr` = first column gets 1 share, second gets 2.

Responsive columns that fit automatically:

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
```

Make one item span multiple columns:

```css
.feature {
  grid-column: span 2;   /* this cell takes up 2 columns */
}
```

## Recipe: center anything

```css
.parent {
  display: flex;
  justify-content: center;  /* horizontal */
  align-items: center;      /* vertical */
  min-height: 100vh;        /* full viewport height */
}
```

## Recipe: navbar (logo left, links right)

```css
.navbar {
  display: flex;
  justify-content: space-between;  /* push to opposite ends */
  align-items: center;
  padding: 12px 24px;
}
```

## Recipe: responsive card grid

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}
```

## Flexbox vs Grid — which one?

- **Flexbox:** content in a line (navbar, button row, centering). One direction.
- **Grid:** a real grid of rows and columns (photo gallery, page layout). Two directions.
