finalize app name

start react front end


# Visits API — Endpoint Test Checklist

---

## Setup
- [x] Log in to get a valid cookie (POST `/api/auth/login`)
- [x] Note a valid `museum_id` from your seeded data
- [x] Note a valid `artwork_id` from your seeded data
- [x] Have a second user account ready for 403 tests

---

## POST `/api/visits` — Create a visit

- [x] Valid `museum_id` and `visit_date` → 201 with new visit object
- [x] Missing `museum_id` → 400 `'Museum id, and visit date are required'`
- [x] Missing `visit_date` → 400 `'Museum id, and visit date are required'`
- [x] Fake `museum_id` (e.g. 99999) → 400 `'Museum not found'`
- [x] Same `museum_id` + `visit_date` twice → 409 `'You already have a visit to this museum on that date'`
- [x] Not logged in → 401

---

## GET `/api/visits` — Get all visits for logged-in user

- [x] Logged in, visits exist → 200 with array of visits
- [x] Logged in, no visits yet → 200 with empty array `[]`
- [x] Results are ordered by `visit_date DESC`
- [x] Not logged in → 401

---

## GET `/api/visits/:id` — Get visit by ID

- [x] Valid ID, own visit → 200 with visit object including nested `items` array
- [x] Valid ID, visit with no artworks → 200 with `items: []`
- [x] Valid ID, another user's visit → 403
- [x] Non-existent ID (e.g. 99999) → 404 `'Visit not found'`
- [x] Non-numeric ID (e.g. `abc`) → 400 `'Invalid visit id'`
- [x] Not logged in → 401
- [x] Response includes `museum_id`, `museum_name`, `visit_date`, `user_id`, `items`

---

## DELETE `/api/visits/:id` — Delete a visit

- [x] Valid ID, own visit → 200 with deleted visit object
- [x] Valid ID, another user's visit → 403
- [x] Non-existent ID → 404 `'Visit not found'`
- [x] Non-numeric ID → 400 `'Invalid visit id'`
- [x] Not logged in → 401
- [x] Confirm visit is gone with GET `/api/visits/:id` → 404

---

## POST `/api/visits/:id/artworks/:artworkId` — Add artwork to visit

- [x] Valid visit ID + valid artwork ID → 201 with inserted row
- [x] Same artwork added twice → 409 `'Artwork already added to this visit'`
- [x] Fake artwork ID (e.g. 99999) → 400 `'Artwork not found'`
- [x] Another user's visit → 403
- [x] Non-existent visit ID → 404 `'Visit not found'`
- [x] Non-numeric visit ID → 400 `'Visit id and artwork id must be numbers'`
- [x] Non-numeric artwork ID → 400 `'Visit id and artwork id must be numbers'`
- [x] Not logged in → 401
- [x] Confirm artwork appears in GET `/api/visits/:id` response

---

## DELETE `/api/visits/:id/artworks/:artworkId` — Remove artwork from visit

- [] Valid visit ID + valid artwork ID → 200 with deleted row
- [x] Artwork not in visit → 404 `'Item not found in visit'`
- [x] Another user's visit → 403
- [x] Non-existent visit ID → 404 `'Visit not found'`
- [x] Non-numeric visit ID → 400 `'Visit id and artwork id must be numbers'`
- [x] Non-numeric artwork ID → 400 `'Visit id and artwork id must be numbers'`
- [x] Not logged in → 401
- [x] Confirm artwork is gone from GET `/api/visits/:id` response