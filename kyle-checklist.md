# BE Northcoders NC Games Portfolio Check List

Woopwoooooop! A cracking job Kyle :D You've covered all the end points and have nearly every appropriate test in too! Your code is well written and readable too.
Spotted a few of your comments to yourself of things than you need to go and fix, make sure you remove them when you've finished.

A little tip that doesn't really fit in anywhere below:
If sending back one thing (eg a review by reviewId, this should be sent back as an object, rather than an array). Ie `{review: {title, owner, review_id...}}`, not `{review: [{title, owner, review_id...}]}`

## Readme - Remove the one that was provided and write your own:

- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `.env.test` and `.env.development` files
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

## General

- [ ] Remove any unnecessary `console.logs` and comments
- [ ] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
- [x] Functions and variables have descriptive names

## Creating tables

- [x] Use `NOT NULL` on required fields
- [x] Default `created_at` in reviews and comments tables to the current date:`TIMESTAMP DEFAULT NOW()` or `DEFAULT CURRENT TIMESTAMP`

You are using nested `.then()` blocks in your seed.js. Remember using promises allows us to avoid the _*pyramid of doom*_ we had when using callbacks

## Inserting data

- [x] Drop tables and create tables in seed function in correct order
- [x] Make use of pg-format to insert data in the correct order

## Tests

- [x] Seeding before each test
- [x] Descriptive `it`/`test` block descriptions
- [x] If asserting inside a `forEach`, also has an assertion to check length is at least > 0
- [x] Evidence of building up complex query endpoints using TDD
- [ ] Ensure all tests are passing
  - most tests are. The current ones failing are the category query tests. Have a look in feedback.md for some hints
- [ ] Cover all endpoints and errors

  - ***

- `GET /api/categories`

  - [x] Status 200, array of category objects

- `GET /api/reviews/:review_id`

  - [x] Status 200, single review object (including `comment_count`)
    - Because we know the exact object we're getting back, the 200 test can specify the exact values in the object rather than `expect.any(String)` etc. Look at the data inside the db/data files. The order they are in the array is the order they'll be inserted into the db, so the second obj will have an id of 2
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999

- `PATCH /api/reviews/:review_id`

  - [x] Status 200, updated single review object
    - same comment about checking exact obj values from above applies here too :)
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 400, invalid inc_votes type, e.g. property is not a number
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [-] Status 200, missing `inc_votes` key. No effect to article.
    -You have chosen to handle this as a 400. Will leave it up to you whether you refactor to a 200

- `GET /api/reviews`

  - [x] Status 200, array of review objects (including `comment_count`, excluding `body`)
  - [x] Status 200, default sort & order: `created_at`, `desc`
    - Can see you are yet to implement jest sorted. Remember to add the extra section from the docs into your package.json
  - [x] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
  - [x] Status 200, accepts `order` query, e.g. `?order=desc`
    - I think you've got `asc` and `desc` the wrong way. Desc would be sorted from Z-A, asc would be A-Z
  - [x] Status 200, accepts `category` query, e.g. `?category=dexterity`
    - Do a test for this without a sort_by query to make sure it works
  - [x] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [x] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [x] Status 404. non-existent `category` query, e.g. `?category=bananas`
    - test currently failing. Check feedback.md for hints
  - [x] Status 200. valid `category` query, but has no reviews responds with an empty array of reviews, e.g. `?category=children's games`
    - see feedback.md

- `GET /api/reviews/:review_id/comments`

  - [x] Status 200, array of comment objects for the specified review
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 200, valid ID, but has no comments responds with an empty array of comments

- `POST /api/reviews/:review_id/comments`

  - [x] Status 201, created comment object
    - see feedback.md for info on what should be returned from the 201. Edit tests to reflect this
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 400, missing required field(s), e.g. no username or body properties
  - [x] Status 404, username does not exist
  - [x] Status 201, ignores unnecessary properties

- `DELETE /api/comments/:comment_id`

  - [x] Status 204, deletes comment from database
  - [x] Status 404, non existent ID, e.g 999
  - [x] Status 400, invalid ID, e.g "not-an-id"

- `GET /api`

  - [x] Status 200, JSON describing all the available endpoints

## Routing

- [x] Split into api, categories, users, comments and reviews routers
- [x] Use `.route` for endpoints that share the same path
  - check the routing notes for this

## Controllers

- [x] Name functions and variables well
- [x] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`)
  - Just one catch missing in categories controller!

## Models

- Protected from SQL injection
  - [x] Using parameterized queries for values in `db.query` e.g `$1` and array of variables
  - [x] Sanitizing any data for tables/columns, e.g. greenlisting when using template literals or pg-format's `%s`
- [x] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [x] Use `LEFT JOIN` for comment counts

## Errors

- [x] Use error handling middleware functions in app and extracted to separate directory/file
- [x] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Tasks - To be completed after hosting

- `GET /api/users`

  - [x] Status 200, responds with array of user objects

- `GET /api/users/:username`

  - [x] Status 200, responds with single user object
  - [x] Status 404, non existent ID, e.g 999
  - [?] Status 400, invalid ID, e.g "not-an-id"

- `PATCH /api/comments/:comment_id`

  - [x] Status 200, updated single comment object
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 400, invalid inc_votes type, e.g. property is not a number
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [?] Status 200, missing `inc_votes` key. No effect to comment.

## Extra Advanced Tasks

### Easier

- [ ] Patch: Edit a review body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an review by title
- [x] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get reviews created in last 10 minutes
- [ ] Get: Get all reviews that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for categories
