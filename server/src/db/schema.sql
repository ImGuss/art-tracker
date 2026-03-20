CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  birth_year INT,
  death_year INT,
  birth_place TEXT,
  description TEXT,
  met_id INT UNIQUE,
  artic_id INT UNIQUE
);

CREATE TABLE IF NOT EXISTS museums (
  id SERIAL PRIMARY KEY,
  name TEXT,
  city TEXT,
  country TEXT,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS artworks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id INTEGER REFERENCES artists(id),
  museum_id INTEGER REFERENCES museums(id),
  year_created TEXT,
  medium TEXT,
  image_url TEXT,
  met_id INT UNIQUE,
  artic_id INT UNIQUE
);

CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_items (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id),
  artwork_id INTEGER REFERENCES artworks(id),
  favorite BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS artwork_tags (
  artwork_id INTEGER REFERENCES artworks(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (artwork_id, tag_id)
);

CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  museum_id INTEGER REFERENCES museums(id),
  visit_date DATE
);

CREATE TABLE IF NOT EXISTS visit_artworks (
  visit_id INTEGER REFERENCES visits(id),
  artwork_id INTEGER REFERENCES artworks(id),
  PRIMARY KEY (visit_id, artwork_id)
);