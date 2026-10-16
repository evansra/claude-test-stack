# claude-test-stack

A throwaway two-service stack used to test EVA's `/app stack` in the home lab. Each service answers
`/healthz`, and `/` reports whether the database, the cache and its peer answer by internal name. Nothing is public.
