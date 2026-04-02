finalize app name

test visits api

start react front end

TEST collections API

# Collections API Tests

## POST `/collections`
- [x] Create a collection with a valid name — expect the new collection back
- [x] Try without a name — expect 400

## GET `/collections`
- [x] Confirm new collection appears in the list
- [x] Log in as a different user — confirm you only see that user's collections

## GET `/collections/:id`
- [x] Fetch the collection by id — confirm it has an empty `items` array
- [x] Try with a non-numeric id — expect 400
- [x] Try with an id that doesn't exist — expect 404
- [x] Log in as a different user and try to fetch it — expect 403

## DELETE `/collections/:id`
- [x] Try with a non-numeric id — expect 400
- [x] Try with an id that doesn't exist — expect 404
- [3] Log in as a different user and try to delete it — expect 403
- [x] Delete as the correct user — expect the deleted collection back

## POST `/collections/:id/items/:artworkId`
- [x] Add a valid artwork to a collection — expect the new item back
- [x] Try with a non-numeric id or artworkId — expect 400
- [x] Try with an artworkId that doesn't exist — expect 404 (23503)
- [x] Add the same artwork again — expect 400 (23505)
- [x] Log in as a different user and try — expect 403

## DELETE `/collections/:id/items/:artworkId`
- [x] Remove an artwork that's in the collection — expect the deleted item back
- [x] Try with a non-numeric id or artworkId — expect 400
- [x] Try with an artworkId that isn't in the collection — expect 404
- [x] Log in as a different user and try — expect 403

## PATCH `/collections/:id/items/:artworkId`
- [x] Toggle favorite on an item — expect `favorite: true`
- [x] Toggle again — expect `favorite: false`
- [x] Try with a non-numeric id or artworkId — expect 400
- [x] Try with an artworkId that isn't in the collection — expect 404
- [x] Log in as a different user and try — expect 403