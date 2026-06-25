# Phase 0 — Setup & First Win
> **Time:** ~1 week at 2–5 hrs/wk · **Portfolio work:** none yet — your job this phase is to get a real page live on the internet

## Why this phase matters

By the end of this week you'll have a working developer setup and a real web page live at a URL you can text to a friend. No project build yet, on purpose. The whole point is to clear the boring-but-load-bearing stuff (tools, terminal, git) and get one early win on the board so the rest of the course has somewhere to land. People quit coding in week one because nothing feels real yet. We're fixing that first.

## What you'll learn

- What VS Code, Node.js + npm, and the browser DevTools are, and why you need each
- Terminal basics: the handful of commands you'll actually use daily
- The git & GitHub mental model: version control, commits as save-points, and the 6 commands you'll lean on
- What "deploying" actually means, and how to put a static page online for free

## The concepts (the actual teaching)

### Your three tools: VS Code, Node + npm, the browser

You need three things on your machine before you can build anything. Don't overthink them.

**VS Code** is your editor — the program where you write code. It's a fancy text editor that understands code: it colors your syntax, autocompletes, flags typos, and has a built-in terminal so you don't have to switch windows constantly. There are other editors, but VS Code is free, everyone uses it, and every tutorial assumes it. Install it and move on.

**Node.js** is a program that runs JavaScript on your computer instead of in a browser. Originally JS only ran inside web pages. Node freed it, which is why we can use JavaScript for the whole stack later. When you install Node, you also get **npm** (Node Package Manager) for free — that's the tool that downloads other people's code (packages) into your project so you don't reinvent everything. You'll type `npm install` a lot. Think of npm as the app store for code libraries.

**Your browser + DevTools.** You already have a browser. The new part is **DevTools** — the developer panel hiding inside it. Right-click any web page and choose "Inspect", or press F12. This opens a panel showing the page's HTML, its styles, a Console for running JavaScript, and a Network tab. You'll live in here for the next six phases. Try it right now on this page: right-click, Inspect, and poke around. Nothing breaks.

```bash
# After installing Node, prove it worked. Open a terminal and run:
node --version    # should print something like v24.x.x (the LTS line in 2026)
npm --version     # should print something like 11.x.x (ships with Node 24)
```

If those two commands print version numbers, your machine is ready. That's the bar.

- ⚠️ **Common mistake:** Installing Node from a random link, or getting a wildly outdated version. Use the official source (the Odin "Installations" lessons below walk you through it per OS), and grab the current **LTS** (Long-Term Support) version, not "Current" or some old one.
- 🧠 **Concept check:** What do you get for free when you install Node.js?
  <details><summary>Show answer</summary>npm — the package manager you'll use to install libraries and run project commands.</details>

### The terminal (don't skip this — you'll use it every day)

The terminal is a text window where you type commands instead of clicking buttons. It feels intimidating because it's just a blinking cursor with no menus. But it's faster than clicking once you know five commands, and a lot of dev tools only work from here. You don't need to become a terminal wizard. You need about six commands.

Here's the mental model: at any moment, the terminal is "standing in" one folder — your **current directory**. Commands act on wherever you're standing. So most of what you do is: move to the right folder, then run something.

```bash
pwd                  # "print working directory" — where am I right now?
ls                   # list the files/folders here (on Windows: dir)
cd projects          # "change directory" — walk into the projects folder
cd ..                # walk back up one level
mkdir my-first-site  # "make directory" — create a new folder
code .               # open the current folder in VS Code (the dot means "here")
```

That's basically it for now. `pwd` to see where you are, `ls` to see what's around, `cd` to move, `mkdir` to make a folder, and `code .` to open it in your editor. The `npm` commands you learned above also run here. Devs live in the terminal because it's scriptable and exact: a command does the same thing every time, and you can chain commands into automation. Clicking can't do that.

One tip that saves a lot of pain: press the **Tab** key to autocomplete file and folder names. Start typing `cd my-fir` and hit Tab — it fills in the rest. Fewer typos, less frustration.

- ⚠️ **Common mistake:** Running a command while standing in the wrong folder, then wondering why it can't find your files. When something's not working, run `pwd` and `ls` first. Nine times out of ten you're not where you think you are.
- 🧠 **Concept check:** You ran `ls` and don't see the file you expected. What two commands help you figure out what's going on?
  <details><summary>Show answer</summary>`pwd` to confirm which folder you're standing in, and `ls` (or `dir` on Windows) to see what's actually there. You're probably in the wrong directory — `cd` to the right one.</details>

### Git & GitHub: the mental model

**Git is version control.** Imagine the "save game" feature in a video game, but for your code. Every time you reach a good spot, you create a save-point. If you wreck things later, you reload an earlier save. Git lets you do exactly that with your project: snapshot the state, keep a full history, and rewind if needed. Those snapshots are called **commits**. A commit is a save-point with a label, like "added the about section" or "fixed the broken link".

**GitHub is not git.** This trips everyone up, so let's be clear. *Git* is the tool that runs on your computer and tracks your save-points locally. *GitHub* is a website that hosts copies of git projects in the cloud. Git is the camera; GitHub is the photo album you share online. You can use git with zero GitHub. But pushing your work to GitHub gives you a backup, a portfolio, and a way to deploy (you'll use it for GitHub Pages below).

You'll use six git commands almost every day. Here's the whole daily loop:

```bash
git clone <url>        # copy a GitHub project down to your machine (do once)
git status             # what's changed? run this constantly — it's free and tells you everything
git add .              # stage your changes (mark them to be saved in the next commit)
git commit -m "message"  # create the save-point with a short description
git push               # upload your commits to GitHub
git pull               # download commits others (or future-you) pushed to GitHub
```

The everyday rhythm is: change some files, `git status` to see what moved, `git add .` to stage it, `git commit -m "what I did"` to snapshot it, `git push` to back it up. That `add` → `commit` → `push` trio is 90% of git. Commit small and often — a commit per finished thought, not one giant commit at the end of the day. Future-you reading the history will thank you.

- ⚠️ **Common mistake:** Confusing "saving the file in VS Code" with "committing in git". Saving a file just writes it to disk. Git doesn't snapshot anything until you `add` and `commit`. Two separate saves, two separate purposes.
- 🧠 **Concept check:** What's the difference between git and GitHub?
  <details><summary>Show answer</summary>Git is the version-control tool running locally on your computer that creates commits (save-points). GitHub is a website that hosts copies of git projects online for backup, sharing, and collaboration. You can use git without ever touching GitHub.</details>

### Deploying a static page

"Deploying" sounds like a big-deal word. It just means: your files end up on a computer that's always on and connected to the internet, so anyone with the link can load them. Your laptop can't be that computer — it's not always on, and you don't want strangers reaching it. So you hand your files to a hosting service whose whole job is to keep them online.

A **static** page is one that's just plain files — HTML, CSS, images — with no server doing work behind the scenes. That's perfect for a first deploy because hosting static files is dead simple and free. You'll do a richer, dynamic deploy later in the course. For now: one `index.html`, online, done.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>I'm live!</title>
  </head>
  <body>
    <h1>Hi, I'm [your name] and this page is on the internet.</h1>
    <p>I built and shipped this in my first week of learning to code.</p>
  </body>
</html>
```

You've got two easy paths to get that online, and you'll try both:

- **Netlify Drop** — the instant-gratification route. You literally drag a folder onto a web page and it hands you back a live URL. No account, no terminal, takes about thirty seconds. Great for your very first win.
- **GitHub Pages** — the permanent route. You push your files to a GitHub repo, flip a setting, and GitHub serves them at a stable URL for free, forever. This is the one you keep.

- ⚠️ **Common mistake:** Naming your file `index.htm`, `Index.html`, or `home.html` and wondering why the live URL shows nothing. Hosts look for exactly `index.html` (all lowercase) as the default page. Get the name right and it just works.
- 🧠 **Concept check:** Why can't you just leave the site running on your own laptop and send people the link?
  <details><summary>Show answer</summary>Your laptop isn't always on or publicly reachable, and you wouldn't want it to be. A hosting service runs a computer that stays on 24/7 and is built to serve your files to anyone with the link.</details>

## Guided resources

| Resource | What to use it for | Link |
|---|---|---|
| Odin Foundations — "Installations" lessons | Installing VS Code, Node, and extensions correctly for your specific OS | https://www.theodinproject.com/paths/foundations/courses/foundations |
| Net Ninja — Git & GitHub for Beginners (~12 short videos) | Watch-along to actually understand git; do it against the practice repo | https://www.youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR · practice repo https://github.com/iamshaunjp/git-playlist |
| Netlify Drop | Drag-drop a folder → instant live URL, no account | https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/ · tool https://app.netlify.com/drop |
| GitHub Pages quickstart | Permanent free hosting for your page | https://docs.github.com/en/pages/quickstart |
| Terminal basics | The handful of commands every dev uses | `search: terminal command line basics for beginners` |

## Exercises (do these — don't just read)

- [ ] In a terminal, run `pwd`, then `mkdir code-practice`, then `cd code-practice`, then `ls`. Narrate to yourself what each one did.
- [ ] Create a folder, open it with `code .`, and confirm VS Code launches into that folder.
- [ ] Make a tiny `notes.txt` file, then turn the folder into a git repo: `git init`, `git status`, `git add .`, `git commit -m "first commit"`. Run `git status` before and after each step and watch what changes.
- [ ] Clone the Net Ninja practice repo (`git clone https://github.com/iamshaunjp/git-playlist`), `cd` into it, and run `git status` and `git log` to poke around someone else's history.
- [ ] Create a free GitHub account if you don't have one, make an empty repo on the site, and `git push` your `code-practice` folder up to it.
- [ ] Open DevTools on any website (F12 or right-click → Inspect), find the Console tab, type `2 + 2`, and press Enter.

## Portfolio build — first live page (no project yet)

This phase has no portfolio project — that starts in Phase 1. Your build task is the deploy itself.

- [ ] Make a new folder called `first-site` and `cd` into it.
- [ ] Create `index.html` and paste in the starter from above; change the heading to your own name.
- [ ] Open the file in your browser (double-click it, or drag it into a browser tab) and confirm it looks right locally.
- [ ] **The fast win:** go to Netlify Drop, drag your `first-site` folder onto it, and copy the live URL it gives you. You're online.
- [ ] **The keeper:** push `first-site` to a GitHub repo, then follow the GitHub Pages quickstart to publish it at a permanent URL.
- [ ] Text the live URL to a friend. This step is not optional — that's the whole milestone.

⏸️ **Stop-here cue:** Getting the very first Netlify URL is a natural place to close the laptop and feel good about it. The GitHub Pages version can absolutely be a separate session another day. Don't burn yourself out trying to do everything in one sitting — the win is already on the board.

## 🎯 Milestone & self-check

**Milestone:** a live URL, hosting a page you wrote, that you've actually sent to another human.

**Prove it** — can you, from a blank terminal with no copying:

- [ ] Make a new folder and `cd` into it using only the terminal?
- [ ] Explain, out loud, the difference between git and GitHub?
- [ ] Take a folder from nothing to a committed git repo (`init` → `add` → `commit`) without looking up the order?
- [ ] Say what "deploying" means in one plain sentence?
- [ ] Open DevTools and run a line of JavaScript in the Console?

If you can tick all five, you're genuinely set up and you've shipped something real. That's a bigger week than it looks.

## Time estimate

Roughly **4–6 hours** total: about 2 hours on installs and terminal practice, 1–2 hours on the Net Ninja git videos plus the git exercises, and under an hour on the deploy itself. Spread it across two or three short sessions — there's no prize for cramming it into one.
