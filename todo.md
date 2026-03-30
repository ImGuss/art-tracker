# API Endpoint Testing Checklist

---

## Auth Endpoints

### POST `/api/auth/register`
- [X] Happy path — valid `{ username, email, password }` → `201`, user object, cookie set
- [X] Duplicate email — same email again → `400`/`409`, clean error message
- [X] Duplicate username — same username again → `400`/`409`
- [X] Missing fields — omit password → `400`

### POST `/api/auth/login`
- [X] Happy path — valid email + password → `200`, cookie set
- [x] Wrong password — correct email, bad password → `401`
- [X] Unknown email — nonexistent email → `401`
- [X] Missing fields — empty body → `400`

### POST `/api/auth/logout`
- [X] While logged in → `200`, cookie cleared
- [X] Without cookie → `200` (idempotent)

---

## Artist Endpoints

### GET `/api/artists`
- [X] Happy path → `200`, array of artists
- [X] After seeding — array is non-empty

### GET `/api/artists/:id`
- [X] Valid ID → `200`, single artist object
- [X] Non-existent ID (e.g. `99999`) → `404`, clean message
- [X] Non-numeric ID (e.g. `abc`) → `400`, "Invalid ID" message

### POST `/api/artists` *(protected)*
- [X] Happy path — cookie + full valid body → `201`, new artist
- [X] Duplicate artist — same name/birth/death → `409`/`400`, duplicate message
- [X] No cookie — omit cookie → `401`
- [X] Missing required fields — omit `name` → `400`

---

## Artwork Endpoints

### GET `/api/artworks`
- [X] Happy path → `200`, array

### GET `/api/artworks/:id`
- [X] Valid ID → `200`, artwork object
- [X] Non-existent ID → `404`
- [X] Non-numeric ID → `400`

### POST `/api/artworks` *(protected)*
- [X] Happy path — valid `title`, valid `artist_id`, optional `museum_id` → `201`
- [X] Missing `title` → `400`
- [X] Missing `artist_id` → `400`
- [X] Invalid `artist_id` FK violation (e.g. `99999`) → `400`, FK error message
- [] Invalid `museum_id` FK violation (e.g. `99999`) → `400`
- [X] No cookie — omit auth → `401`