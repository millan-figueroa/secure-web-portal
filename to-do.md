# Secure Web Portal – To-Do List

### Task 1 — Project Setup

- [x] Create project folder and run `npm init -y`
- [x] Install dependencies: `express`, `mongoose`, `bcrypt`, `jsonwebtoken`, `dotenv`, `passport`, `passport-github2`
- [x] (Optional) Install dev dependency: `nodemon`
- [x] Create `.env` file with:
  - [x] `MONGO_URI`
  - [x] `PORT`
  - [x] `JWT_SECRET`
  - [x] `GITHUB_CLIENT_ID`
  - [x] `GITHUB_CLIENT_SECRET`
  - [x] `GITHUB_CALLBACK_URL`
- [x] Create `.gitignore` (ignore `node_modules`, `.env`)
- [x] Open `server.js` and verify:
  - [x] Express app is created
  - [x] JSON body parsing is enabled (`app.use(express.json())`)
  - [x] MongoDB connection is imported / used
  - [x] `userRoutes` is mounted at `/api/users`

---

### Task 2 — Models & Configuration

- [x] Update `models/User.js` to support both local and GitHub auth:
  - [x] `email` (String, unique, required)
  - [x] `password` (String, optional for local auth)
  - [x] `githubId` (String, optional for GitHub auth)
  - [ ] Field for private resources (e.g. `bookmarks: [ { title, url, createdAt } ]`)
- [ ] Configure Passport GitHub strategy in `config/passport.js`:
  - [ ] Load `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL` from `process.env`
  - [ ] Define GitHub strategy using `passport-github2`
  - [ ] Implement verify callback:
    - [ ] Find user by `githubId` or email
    - [ ] If not found, create a new user
  - [ ] Export the configured `passport` instance
- [ ] Ensure `server.js` imports `config/passport.js` and calls:
  - [ ] `app.use(passport.initialize())`

---

### Task 3 — Local Authentication API

- [x] Open `middleware/auth.js` (or create if empty) and:
  - [x] Implement JWT `auth` middleware:
    - [x] Read token from `Authorization: Bearer <token>`
    - [x] Verify with `JWT_SECRET`
    - [x] Attach user data to `req.user`
- [x] In `controllers/userController.js`, implement:
  - [x] `registerUser`:
    - [x] Check if user with email exists
    - [x] Hash password with `bcrypt` (via pre-save hook)
    - [x] Create and save new user
    - [x] Return safe user data or token (no plain password)
  - [x] `loginUser`:
    - [x] Find user by email
    - [x] Compare password with `bcrypt.compare` / `isCorrectPassword`
    - [x] On success, sign JWT and return it
- [x] In `userController.js` or a helper, add:
  - [x] Functionality to sign JWT for a user (using `jsonwebtoken`)
- [x] In `routes/userRoutes.js`, wire routes to controllers:
  - [x] `POST /api/users/register` → `registerUser`
  - [x] `POST /api/users/login` → `loginUser`
  - [x] `GET /api/users/me` → protected with `authMiddleware`
- [x] Make sure hashed passwords never get returned in responses

---

### Task 4 — GitHub OAuth

- [ ] In `routes/userRoutes.js`, add GitHub OAuth routes:
  - [ ] `GET /api/users/auth/github`:
    - [ ] Calls `passport.authenticate('github', { scope: ['user:email'] })`
  - [ ] `GET /api/users/auth/github/callback`:
    - [ ] Uses `passport.authenticate('github', { session: false })`
    - [ ] On success, signs a JWT for `req.user`
    - [ ] Returns token (JSON or redirect with `?token=...`)
- [ ] Confirm `config/passport.js` and `server.js` are wired so Passport works
- [ ] Test the full GitHub flow and confirm you get a valid JWT

---

### Task 5 — Secure “Bookmarks” API (inside User)

- [ ] In `models/User.js`, confirm the user has a bookmarks (or similar) field, e.g.:
  - [ ] `bookmarks: [ { title: String, url: String, createdAt: Date } ]`
- [ ] In `controllers/userController.js`, add bookmark handlers that work off `req.user`:
  - [ ] `createBookmark` — push a new bookmark into the logged-in user’s `bookmarks` array and save
  - [ ] `getBookmarks` — return only `req.user`’s bookmarks
  - [ ] `getBookmarkById` — return a single bookmark by its id/index from the logged-in user
  - [ ] `updateBookmark` — update a specific bookmark for that user
  - [ ] `deleteBookmark` — remove a specific bookmark for that user
- [ ] In `routes/userRoutes.js`, add routes protected by `auth` middleware, for example:
  - [ ] `POST /api/users/bookmarks` → `auth` → `createBookmark`
  - [ ] `GET /api/users/bookmarks` → `auth` → `getBookmarks`
  - [ ] `GET /api/users/bookmarks/:id` → `auth` → `getBookmarkById`
  - [ ] `PUT /api/users/bookmarks/:id` → `auth` → `updateBookmark`
  - [ ] `DELETE /api/users/bookmarks/:id` → `auth` → `deleteBookmark`
- [ ] Ensure authorization:
  - [ ] Bookmarks are always filtered by the logged-in user (no access to others)
  - [ ] All bookmark routes require a valid JWT

---

### Task 6 — Testing & Cleanup

- [x] Test `POST /api/users/register` in Postman
- [x] Test `POST /api/users/login` and copy the JWT from the response
- [ ] Use JWT in `Authorization: Bearer <token>` for bookmark routes
- [ ] Verify:
  - [ ] You can create and read your own bookmarks
  - [ ] Another user cannot access or modify your bookmarks
- [ ] Test GitHub OAuth and confirm it returns a usable JWT
- [x] Confirm `.env` is not tracked in Git
- [ ] Remove extra console logs and commented-out code
- [ ] Commit and push your final version
