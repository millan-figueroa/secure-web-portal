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
- [x] Create project structure:
  - [x] `server.js` (or `app.js`)
  - [x] `config/` (db + passport config)
  - [x] `models/` (User, Bookmark)
  - [x] `routes/` (users, bookmarks)
  - [x] `utils/` (auth helpers)

---

### Task 2 — Models & Configuration

- [x] Set up MongoDB connection in `config/db.js` and import it in `server.js`
- [x] Create `models/User.js` with:
  - [x] `email` (unique, required)
  - [x] `password` (optional)
  - [x] `githubId` (optional)
- [ ] Create `models/Bookmark.js` with:
  - [ ] `title`
  - [ ] `url` or `content`
  - [ ] `user: { type: Schema.Types.ObjectId, ref: 'User' }`
- [ ] Create `config/passport.js`:
  - [ ] Configure GitHub strategy with env vars
  - [ ] Verify callback: find or create user
  - [ ] Export passport config function

---

### Task 3 — Local Authentication API

- [ ] Create `routes/users.js`
- [ ] Set up `/api/users` base path in server.js
- [ ] Create `utils/auth.js`
  - [ ] Reuse JWT logic from earlier labs
  - [ ] Function to sign a token for a user
  - [ ] Auth middleware to verify token and put user on `req.user`
- [ ] Implement `POST /api/users/register`:
  - [ ] Check if user exists by email
  - [ ] Hash password with `bcrypt`
  - [ ] Save user and respond
- [ ] Implement `POST /api/users/login`:
  - [ ] Find user by email
  - [ ] Compare password with `bcrypt.compare`
  - [ ] On success, sign JWT and return it
- [ ] Ensure hashed passwords never return to client
- [ ] Reuse local auth code from previous labs (DRY)

---

### Task 4 — GitHub OAuth

- [ ] Initialize Passport in `server.js`:
  - [ ] `app.use(passport.initialize())`
  - [ ] Require `config/passport`
- [ ] Create and configure passport strategy in `config/passport.js`:
  - [ ] Load credentials from `.env`
  - [ ] Verify callback: find or create a user by email or githubId
- [ ] Add GitHub routes in `routes/users.js`:
  - [ ] `GET /api/users/auth/github` → `passport.authenticate('github')`
  - [ ] `GET /api/users/auth/github/callback`:
    - [ ] Use `passport.authenticate('github', { session: false })`
    - [ ] If successful, sign JWT and return it (JSON or redirect)
- [ ] Test OAuth manually to confirm it returns a valid JWT

---

### Task 5 — Secure Bookmarks API

- [ ] Create `routes/bookmarks.js`
- [ ] Protect all bookmark routes with `authMiddleware`
- [ ] Implement:
  - [ ] `POST /api/bookmarks` — create bookmark with `user: req.user.id`
  - [ ] `GET /api/bookmarks` — fetch bookmarks for user making request
  - [ ] `GET /api/bookmarks/:id` — return only if owned by `req.user.id`
  - [ ] `PUT /api/bookmarks/:id` — update only if owned by user
  - [ ] `DELETE /api/bookmarks/:id` — delete only if owned by user
- [ ] Mount in `server.js`:
  - [ ] `app.use('/api/users', userRoutes)`
  - [ ] `app.use('/api/bookmarks', bookmarkRoutes)`
- [ ] Add authorization logic to confirm ownership before update/delete

---

### Task 6 — Testing & Cleanup

- [ ] Test register with Postman
- [ ] Test login and copy JWT
- [ ] Use JWT in `Authorization: Bearer <token>` header
- [ ] Create bookmarks as logged-in user
- [ ] Attempt bookmark access by another user (should fail)
- [ ] Test GitHub login flow and confirm JWT is returned
- [ ] Confirm `.env` is not committed to GitHub
- [ ] Clean up console logs and extra comments
