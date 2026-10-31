# claude-test-stack, branch mongo

T50 test: a one-service stack built from the repo root (`path: .`) with a MongoDB (`engine: mongodb`).
Reached through DATABASE_URL; /healthz pings it, /count writes and counts.
