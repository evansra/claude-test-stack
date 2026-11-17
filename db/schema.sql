CREATE EXTENSION IF NOT EXISTS citext;
CREATE TABLE users (
  id serial PRIMARY KEY,
  email citext NOT NULL UNIQUE,
  age bigint,                                   -- type change
  created_at timestamptz NOT NULL DEFAULT now(),
  display_name text NOT NULL DEFAULT 'anon'     -- added; nickname dropped
);
CREATE TABLE notes (id bigserial PRIMARY KEY, user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE, body text, pinned boolean NOT NULL DEFAULT false);
CREATE TABLE tags (id serial PRIMARY KEY, note_id bigint NOT NULL REFERENCES notes(id), "Label" varchar(40) NOT NULL);
CREATE INDEX notes_user_idx ON notes (user_id);
CREATE UNIQUE INDEX tags_note_label ON tags (note_id, "Label");
