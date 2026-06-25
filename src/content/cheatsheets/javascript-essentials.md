# JavaScript Essentials Cheat-Sheet

> **What this is:** The JS you use constantly — array methods, DOM, localStorage, and fetch — with tiny examples.

## Array methods

```js
const nums = [1, 2, 3, 4];

// map — transform every item, return a NEW array (same length)
nums.map(n => n * 2);            // [2, 4, 6, 8]

// filter — keep items that pass the test (new, shorter array)
nums.filter(n => n % 2 === 0);  // [2, 4]

// find — return the FIRST matching item (or undefined)
nums.find(n => n > 2);          // 3

// forEach — run code for each item, returns nothing
nums.forEach(n => console.log(n));

// reduce — boil the array down to a single value
nums.reduce((total, n) => total + n, 0);  // 10
```

⚠️ `map`/`filter` return new arrays — assign the result. `forEach` returns nothing, so don't try to use its return value.

## DOM — finding and changing elements

```js
// find elements
const el  = document.querySelector('.title');     // first match
const all = document.querySelectorAll('li');       // all matches (NodeList)

// read & change content
el.textContent = 'New text';      // set text (safe)
el.innerHTML   = '<b>Hi</b>';     // set HTML (only with trusted content)

// classes & attributes
el.classList.add('active');
el.classList.toggle('open');
el.setAttribute('disabled', '');

// create & insert
const li = document.createElement('li');
li.textContent = 'Item';
document.querySelector('ul').appendChild(li);
```

## Events

```js
const btn = document.querySelector('#save');

btn.addEventListener('click', (e) => {
  e.preventDefault();           // stop default (e.g. form submit / link)
  console.log('clicked!');
});
```

## localStorage (with JSON)

localStorage only stores strings, so convert objects with JSON.

```js
const user = { name: 'Sam', streak: 5 };

// SAVE — turn the object into a string
localStorage.setItem('user', JSON.stringify(user));

// LOAD — turn the string back into an object
const saved = JSON.parse(localStorage.getItem('user'));

// handle "nothing saved yet"
const data = JSON.parse(localStorage.getItem('habits')) || [];

localStorage.removeItem('user');   // delete one key
```

⚠️ `getItem` returns `null` if the key doesn't exist, and `JSON.parse(null)` is `null`. Use `|| []` or `|| {}` as a fallback.

## async / await + fetch

```js
async function getUsers() {
  try {
    const res = await fetch('https://api.example.com/users');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();   // parse the JSON body
    return data;
  } catch (err) {
    console.error('Failed to load:', err);
  }
}

getUsers().then(users => console.log(users));
```

- `await` pauses until the promise resolves — only works inside an `async` function.
- `fetch` does NOT throw on 404/500. Check `res.ok` yourself.
- Always wrap network calls in `try/catch`.
