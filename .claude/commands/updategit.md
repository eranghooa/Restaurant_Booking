# updategit

Push the project to GitHub with full pre-flight checks, set up GitHub Pages via Actions, resolve 404 issues, and keep the repo About/README in sync. Run all steps in order and report each result.

---

## Step 1 — Secrets & password scan

Scan every tracked file for secrets, API keys, and hardcoded passwords **before touching git**. Flag any match and **stop the entire command** if a real secret is found — do not push.

### 1a — Sensitive file types tracked by git
```bash
git ls-files | grep -E '\.(env|key|pem|p12|pfx|cer|crt|ppk|jks|keystore)$'
```

### 1b — API key & token patterns
```bash
git grep -E "(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{35}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_|xox[baprs]-[A-Za-z0-9-]+)"
```

### 1c — Hardcoded assignment patterns (excluding Markdown prose)
```bash
git grep -iE "(api_key|apikey|api_secret|access_key|access_secret|client_secret|auth_token|bearer)\s*[=:]\s*['\"]?[A-Za-z0-9+/\-_]{8,}" -- ":(exclude)*.md"
```

### 1d — Password patterns (new)
```bash
git grep -iE "(password|passwd|pwd|pass)\s*[=:]\s*['\"][^'\"]{4,}['\"]" -- ":(exclude)*.md"
git grep -iE "mongodb(\+srv)?://[^:]+:[^@]{4,}@" 
git grep -iE "(mysql|postgres|postgresql|mssql|jdbc)://[^:]+:[^@]{4,}@"
git grep -iE "Authorization\s*:\s*Basic\s+[A-Za-z0-9+/=]{8,}"
```

### 1e — `.env` files committed
```bash
git ls-files | grep -E '^\.env(\..+)?$'
```

**Decision logic:**
- If **any** scan returns output → list every match with file:line, print `BLOCKED — secrets detected`, and stop.
- If all scans return empty → print `Secrets scan: clean ✓` and proceed to Step 2.

---

## Step 2 — Fix 404 issues

GitHub Pages deploys this repo at `https://eranghooa.github.io/Restaurant_Booking/`. Absolute root-relative paths (e.g. `/styles.css`) resolve to `eranghooa.github.io/styles.css` — a 404. Fix all such paths and ensure a custom `404.html` exists.

### 2a — Scan for absolute root-relative paths
Search all `.html`, `.css`, and `.js` files for `href`, `src`, `action`, or `url(` references that begin with `/` but are **not** `//`, `https://`, or `http://`:
```bash
git grep -nE '(href|src|action)\s*=\s*["\x27]/[^/"\x27]' -- '*.html' '*.css' '*.js'
git grep -nE 'url\s*\(\s*["\x27]?/[^/"\x27]' -- '*.css' '*.js'
```

For every match found:
- Convert `href="/styles.css"` → `href="styles.css"` (or the correct relative path)
- Convert `url('/images/bg.jpg')` → `url('./images/bg.jpg')`
- Edit the file in-place using the Edit tool.
- After fixing, re-run the scan to confirm zero matches remain.

### 2b — Ensure `404.html` exists
Check if `404.html` is already tracked:
```bash
git ls-files 404.html
```

If it does **not** exist, create it with the Write tool:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="3; url=./index.html" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page not found — Maison Lumière</title>
  <link rel="stylesheet" href="styles.css" />
  <style>
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      gap: 1.5rem;
      padding: 2rem;
    }
    .not-found h1 { font-size: 6rem; margin: 0; opacity: .15; }
    .not-found h2 { font-size: 1.5rem; font-weight: 400; margin: 0; }
  </style>
</head>
<body>
  <main class="not-found">
    <h1>404</h1>
    <h2>Page not found</h2>
    <p>Redirecting you to <a href="./index.html">Maison Lumière</a> in 3 seconds…</p>
  </main>
  <script>
    setTimeout(() => { window.location.replace('./index.html'); }, 3000);
  </script>
</body>
</html>
```

If `404.html` already exists, read it, confirm it redirects to `./index.html`, and fix the redirect target if it does not.

### 2c — Verify cross-page navigation
Check that every `<a href="...">` in `about.html` that references another page uses a relative path (e.g. `index.html`, `./index.html`) and not an absolute URL or root-relative path. Fix any found.

Report: number of absolute paths fixed, whether `404.html` was created or already present.

---

## Step 3 — GitHub Actions Pages workflow

Ensure `.github/workflows/deploy.yml` exists and deploys this static site to GitHub Pages on every push to `main`.

### 3a — Check if the workflow exists
```bash
git ls-files .github/workflows/deploy.yml
```

### 3b — Create the workflow if missing
If not found, create the directory and file:

**`.github/workflows/deploy.yml`**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload site artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

If the file already exists, read it, verify the above structure is present, and update it if the `on:`, `permissions:`, or `jobs:` sections are missing or wrong.

### 3c — Enable GitHub Pages via the API (Actions source)
After the workflow file is in place, enable Pages on the repo using the GitHub API:
```bash
gh api repos/eranghooa/Restaurant_Booking/pages \
  --method POST \
  --field build_type=workflow 2>&1 || \
gh api repos/eranghooa/Restaurant_Booking/pages \
  --method PUT \
  --field build_type=workflow 2>&1
```
(POST creates, PUT updates — ignore "already exists" errors from POST and attempt PUT in that case.)

Report: whether workflow was created or already existed, and whether Pages was enabled via the API.

---

## Step 4 — Stage, commit, and push

1. Run `git status --short`.
2. If there are untracked or modified files:
   a. Stage all: `git add -A`
   b. Auto-generate a commit message summarising the changes (e.g. "Add GitHub Pages workflow and 404 page").
   c. Commit: `git commit -m "<message>"`
3. Push: `git push origin main`
4. Report commit SHA, branch, and remote URL.

---

## Step 5 — Update README on GitHub

1. Read [README.md](../README.md) from disk.
2. Fetch the live SHA and content from GitHub:
   ```bash
   gh api repos/eranghooa/Restaurant_Booking/contents/README.md --jq '.sha'
   ```
3. If the local file differs from the remote (or remote doesn't exist), push it:
   ```bash
   gh api repos/eranghooa/Restaurant_Booking/contents/README.md \
     --method PUT \
     --field message="Update README" \
     --field content="$(base64 -w0 README.md)" \
     --field sha="<sha-from-step-2>"
   ```
   Omit `sha` if the file is new.
4. Report: updated or already in sync.

> Note: after Step 4's push the README is already on GitHub via git. This step is a safety-net sync only if a discrepancy is detected.

---

## Step 6 — Update GitHub repo About

```bash
gh repo edit eranghooa/Restaurant_Booking \
  --description "Maison Lumière — upscale French restaurant booking site for Singapore (static HTML/CSS/JS)" \
  --homepage "https://eranghooa.github.io/Restaurant_Booking/" \
  --add-topic restaurant \
  --add-topic booking \
  --add-topic french-cuisine \
  --add-topic singapore \
  --add-topic static-site \
  --add-topic github-pages
```

Report the updated description, homepage, and topics.

---

## Final report

Print a summary table:

| Step | Status | Notes |
|------|--------|-------|
| Secrets scan | ✓ Clean / ✗ BLOCKED | patterns checked, any matches |
| 404 fixes | ✓ N paths fixed + 404.html created / — Already clean | |
| Actions workflow | ✓ Created / — Already exists | deploy.yml path |
| Pages enabled | ✓ Enabled / — Already active | pages URL |
| Push | ✓ Pushed / — Nothing to push | commit SHA |
| README | ✓ Updated / — In sync | |
| Repo About | ✓ Updated | description, topics |

If Step 1 was BLOCKED, all subsequent steps must show `— Skipped (blocked)`.
