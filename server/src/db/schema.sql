CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  birth_year INT,
  death_year INT,
  birth_place TEXT,
  description TEXT,
  met_reference_object_id INT UNIQUE,
  artic_id INT UNIQUE,
  UNIQUE (name, birth_year, death_year)
);

CREATE TABLE IF NOT EXISTS museums (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  image_url TEXT,
  UNIQUE (name, city)
);

CREATE TABLE IF NOT EXISTS artworks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL,
  museum_id INTEGER REFERENCES museums(id) ON DELETE SET NULL,
  year_created TEXT,
  medium TEXT,
  image_url TEXT,
  met_id INT UNIQUE,
  artic_id INT UNIQUE
);

CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_items (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  artwork_id INTEGER REFERENCES artworks(id) ON DELETE CASCADE,
  favorite BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (collection_id, artwork_id)
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS artwork_tags (
  artwork_id INTEGER REFERENCES artworks(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (artwork_id, tag_id)
);

CREATE TABLE IF NOT EXISTS visits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  museum_id INTEGER NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  UNIQUE (user_id, museum_id, visit_date)
);

CREATE TABLE IF NOT EXISTS visit_artworks (
  visit_id INTEGER REFERENCES visits(id) ON DELETE CASCADE,
  artwork_id INTEGER REFERENCES artworks(id) ON DELETE CASCADE,
  PRIMARY KEY (visit_id, artwork_id)
);