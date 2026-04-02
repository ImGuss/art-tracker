finalize app name

create visits api
test visits api

create collections api
test collections api

start react front end

TEST collections API

# Collections API Tests

## POST `/api/collections`
- [ ] Create a collection with a valid name — expect the new collection back
- [ ] Try without a name — expect 400

## GET `/api/collections`
- [ ] Confirm new collection appears in the list
- [ ] Log in as a different user — confirm you only see that user's collections

## GET `/api/collections/:id`
- [ ] Fetch the collection by id — confirm it has an empty `items` array
- [ ] Try with a non-numeric id — expect 400
- [ ] Try with an id that doesn't exist — expect 404
- [ ] Log in as a different user and try to fetch it — expect 403

## DELETE `/api/collections/:id`
- [ ] Try with a non-numeric id — expect 400
- [ ] Try with an id that doesn't exist — expect 404
- [ ] Log in as a different user and try to delete it — expect 403
- [ ] Delete as the correct user — expect the deleted collection back

## POST `/api/collections/:id/items/:artworkId`
- [ ] Add a valid artwork to a collection — expect the new item back
- [ ] Try with a non-numeric id or artworkId — expect 400
- [ ] Try with an artworkId that doesn't exist — expect 404 (23503)
- [ ] Add the same artwork again — expect 400 (23505)
- [ ] Log in as a different user and try — expect 403

## DELETE `/api/collections/:id/items/:artworkId`
- [ ] Remove an artwork that's in the collection — expect the deleted item back
- [ ] Try with a non-numeric id or artworkId — expect 400
- [ ] Try with an artworkId that isn't in the collection — expect 404
- [ ] Log in as a different user and try — expect 403

## PATCH `/api/collections/:id/items/:artworkId`
- [ ] Toggle favorite on an item — expect `favorite: true`
- [ ] Toggle again — expect `favorite: false`
- [ ] Try with a non-numeric id or artworkId — expect 400
- [ ] Try with an artworkId that isn't in the collection — expect 404
- [ ] Log in as a different user and try — expect 403