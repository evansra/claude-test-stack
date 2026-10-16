# claude-test-stack

The home lab's **test repo** (kept long term, Richard 2026-10-16): Claude pushes whatever an app or stack test needs
here, so a deploy with a specific configuration can be tried on Coolify (VM 112) without touching a real repo.

- **`main`** holds the EVA manual-test stack: `datahooks.stack.yml` with two internal services (`lobby`, `world`), a
  scratch database and a cache. Each service answers `/healthz`, and `/` reports whether the database, the cache and its
  peer answer by internal name. Nothing is public.
- **Other configurations go on their own branch**, named for what they test (`dockerfile-port`, `static-site`, ...), so
  `main` stays the known-good stack the manual test uses.
- Everything deployed from here is named **`claude-test-*`**, with scratch data only, so the lab's `cleanup-test`
  removes it.

Written to from the lab's container through a write deploy key (`claude-lab-test-stack`). Nothing secret belongs here:
the repo is public.
