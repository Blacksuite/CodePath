# Terminal & Git Cheat-Sheet

> **What this is:** The terminal and git commands you'll actually type every day. Keep it open while you work.

## Terminal — moving around

```bash
pwd                 # print working directory (where am I?)
ls                  # list files in this folder
ls -la              # list ALL files (incl. hidden) with details
cd projects         # change into the "projects" folder
cd ..               # go up one folder
cd ~                # go to your home folder
cd -                # go back to the previous folder
```

## Terminal — files & folders

```bash
mkdir my-app        # make a new folder
mkdir -p a/b/c      # make nested folders in one go
touch index.html    # create an empty file
cp file.txt copy.txt        # copy a file
cp -r src/ backup/          # copy a folder (recursive)
mv old.txt new.txt          # rename (or move) a file
rm file.txt         # delete a file (no trash — it's gone)
rm -r old-folder    # delete a folder and everything in it
cat file.txt        # print a file's contents
clear               # clear the screen
```

⚠️ `rm` does not move to trash. There's no undo. Double-check the path before you hit enter.

## Git — the daily commands

```bash
git clone <url>            # download a repo to your machine
git status                 # what's changed? (run this constantly)
git add file.txt           # stage one file for the next commit
git add .                  # stage everything you changed
git commit -m "message"    # save staged changes with a message
git push                   # send your commits to GitHub
git pull                   # grab the latest changes from GitHub
git log --oneline          # see commit history, one line each
git diff                   # see exactly what you changed (unstaged)
```

## Git — branches

```bash
git branch                 # list branches (* = current)
git branch feature-x       # create a new branch
git checkout feature-x     # switch to a branch
git checkout -b feature-x  # create AND switch in one step
git merge feature-x        # merge feature-x into your current branch
```

## A typical day

```bash
git pull                       # start fresh with the latest
git checkout -b add-navbar     # branch off for your task
# ... write code ...
git status                     # check what you touched
git add .                      # stage it
git commit -m "Add navbar"     # save it
git push -u origin add-navbar  # push the new branch up
# ... open a Pull Request on GitHub ...
```

## Mental model

- **add** = "I want to include this in my next save."
- **commit** = "Save these staged changes as one checkpoint."
- **push** = "Upload my checkpoints to GitHub."
- **pull** = "Download checkpoints from GitHub."

## Stuck? quick fixes

```bash
git restore file.txt           # throw away unstaged changes to a file
git restore --staged file.txt  # unstage a file (keep the changes)
git commit --amend -m "msg"    # fix the LAST commit's message
git log --oneline              # find a commit hash to look back at
```

⚠️ If a command opens a weird full-screen text editor (vim), press `Esc`, type `:q`, press enter to escape.
