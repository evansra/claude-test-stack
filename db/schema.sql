-- users and their notes
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TABLE users (
  id serial PRIMARY KEY,
  email citext NOT NULL UNIQUE,
  age integer,
  nickname text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE notes (id bigserial PRIMARY KEY, user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE, body text);
CREATE TABLE sessions (token text PRIMARY KEY, user_id integer REFERENCES users(id));
CREATE INDEX notes_user_idx ON notes (user_id);
