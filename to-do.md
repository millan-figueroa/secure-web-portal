# Secure Web Portal – To-Do List

---

### Task 1 — Project Setup

- [ ] Create project folder and run `npm init -y`
- [ ] Install dependencies: `express`, `mongoose`, `bcrypt`, `jsonwebtoken`, `dotenv`, `passport`, `passport-github2`
- [ ] (Optional) Install dev dependency: `nodemon`
- [ ] Create `.env` file with:
  - [ ] `MONGO_URI`
  - [ ] `PORT`
  - [ ] `JWT_SECRET`
  - [ ] `GITHUB_CLIENT_ID`
  - [ ] `GITHUB_CLIENT_SECRET`
  - [ ] `GITHUB_CALLBACK_URL`
- [ ] Create `.gitignore` (ignore `node_modules`, `.env`)
- [ ] Create project structure:
  - [ ] `server.js` (or `app.js`)
  - [ ] `config/` (db + passport config)
  - [ ] `models/` (User, Bookmark)
  - [ ] `routes/` (users, bookmarks)
  - [ ] `utils/` (auth helpers)

---

### Task 2 — Models & Configuration

- [ ] Set up MongoDB connection in `config/db.js` and import it in `server.js`
- [ ] Create `models/User.js` with:
  - [ ] `email` (unique, required)
  - [ ] `password` (optional)
  - [ ] `githubId` (optional)
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
- [ ] Implement `POST /api/users/register`:
  - [ ] Check if user with email exists
  - [ ] Hash password with `bcrypt`
  - [ ] Save user and respond
- [ ] Implement `POST /api/users/login`:
  - [ ] Find user by email
  - [ ] Compare password with `bcrypt.compare`
  - [ ] On success, sign JWT and return it
- [ ] Create `utils/auth.js`:
  - [ ] Helper to sign JWT
  - [ ] `authMiddleware` to verify token and set `req.user`

---

### Task 4 — GitHub OAuth

- [ ] Initialize passport in `server.js`:
  - [ ] `app.use(passport.initialize())`
  - [ ] Require `config/passport`
- [ ] In `routes/users.js`, add:
  - [ ] `GET /api/users/auth/github` → `passport.authenticate('github', ...)`
  - [ ] `GET /api/users/auth/github/callback`:
    - [ ] Use `passport.authenticate('github', { session: false })`
    - [ ] On success, sign JWT for the user
    - [ ] Return token (JSON or redirect with token in query string)

---

### Task 5 — Secure Bookmarks API

- [ ] Create `routes/bookmarks.js`
- [ ] Protect all routes with `authMiddleware`
- [ ] Implement:
  - [ ] `POST /api/bookmarks` — create bookmark with `user: req.user.id`
  - [ ] `GET /api/bookmarks` — return bookmarks where `user === req.user.id`
  - [ ] `GET /api/bookmarks/:id` — return only if `bookmark.user === req.user.id`
  - [ ] `PUT /api/bookmarks/:id` — update only if owner
  - [ ] `DELETE /api/bookmarks/:id` — delete only if owner
- [ ] Mount routes in `server.js`:
  - [ ] `app.use('/api/users', userRoutes)`
  - [ ] `app.use('/api/bookmarks', bookmarkRoutes)`

---

### Task 6 — Testing & Cleanup

- [ ] Test registration with Postman/Insomnia
- [ ] Test local login and copy JWT
- [ ] Use JWT in `Authorization: Bearer <token>` header for bookmarks routes
- [ ] Test GitHub login flow and confirm JWT is returned
- [ ] Create two users and confirm:
  - [ ] Each can only see their own bookmarks
  - [ ] Cannot read/update/delete another user’s bookmarks
- [ ] Clean up console logs and error handling
- [ ] Commit and push to GitHub (verify `.env` is not tracked)
