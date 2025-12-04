# Secure Web Portal

A secure backend service for **Innovate**, built with **Express**, providing user authentication (email/password + GitHub OAuth) and private bookmark management.  
This project implements secure user identity management, JWT-based session handling, GitHub OAuth integration, and protected CRUD operations for user-owned resources.

---

## 🚀 Overview

The Secure Web Portal is a single-entry backend for managing:

- **User Registration and Login**
  - Local auth using email + password (hashed via bcrypt)
  - GitHub OAuth using passport-github2
- **JWT Authentication**
  - Login returns signed tokens
  - Protected routes require valid JWTs
- **Private User Resources**
  - Users can create, read, update, and delete their own bookmarks
  - Authorization ensures users cannot access others’ data

The project follows a **modular, DRY architecture**, reusing utilities and patterns from previous labs.

---

## 🧰 Tech Stack

- **Node.js + Express**
- **MongoDB + Mongoose**
- **bcrypt** → password hashing
- **jsonwebtoken** → token signing & verification
- **dotenv** → environment management
- **passport** + **passport-github2** → GitHub OAuth
- **Modular Project Structure** (config, models, routes, utils)

---

## 📁 Project Structure (Suggested)

SECURE-WEB-PORTAL/<br>
│<br>
├── config/<br>
│ └── passport.js<br>
│<br>
├── controllers/<br>
│ └── userController.js<br>
│<br>
├── middleware/<br>
│ └── auth.js<br>
│<br>
├── models/<br>
│ └── User.js<br>
│<br>
├── routes/<br>
│ ├── bookmarkRoutes.js<br>
│ └── userRoutes.js<br>
│<br>
├── node_modules/<br>
├── .env<br>
├── .gitignore<br>
├── package.json<br>
├── package-lock.json<br>
├── README.md<br>
└── server.js

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/millan-figueroa/secure-web-portal
cd secure-web-portal
```

### 2. Install dependencies

```bash
npm install
```

(Ensure these packages are included: express, mongoose, bcrypt, jsonwebtoken, dotenv, passport, passport-github2.)

### 3. Create your .env file

```bash
MONGO_URI='your_mongo_uri'
PORT='5000'
JWT_SECRET='your_jwt_secret'
GITHUB_CLIENT_ID='your_client_id'
GITHUB_CLIENT_SECRET='your_client_secret'
GITHUB_CALLBACK_URL='http://localhost:5000/api/users/auth/github/callback'
```

### 4. Start the server

```bash
npm start
```

Server will run at:

```bash
npm start
```

## 🔐 Authentication Endpoints

### Local Authentication

| Method | Endpoint            | Description                                        |
| ------ | ------------------- | -------------------------------------------------- |
| POST   | /api/users/register | Creates a new user account with email and password |
| POST   | /api/users/login    | Authenticates user and returns a signed JWT        |

---

## 🌐 GitHub OAuth Authentication

| Method | Endpoint                        | Description                                            |
| ------ | ------------------------------- | ------------------------------------------------------ |
| GET    | /api/users/auth/github          | Starts GitHub OAuth flow by redirecting user to GitHub |
| GET    | /api/users/auth/github/callback | OAuth callback; on success returns a signed JWT        |

**Behavior:**

- If GitHub user exists → authenticate and return JWT
- If new → create user, then return JWT
- Typically sent back to frontend via redirect with `?token=<jwt>`

---

## 📘 Protected Bookmark API

All bookmark routes require:

- **Authentication** (valid JWT using authMiddleware)
- **Authorization** (user may only access their own bookmarks)

### Endpoints

| Method | Route              | Description                                    |
| ------ | ------------------ | ---------------------------------------------- |
| POST   | /api/bookmarks     | Create a new bookmark for the logged-in user   |
| GET    | /api/bookmarks     | Retrieve all bookmarks for the logged-in user  |
| GET    | /api/bookmarks/:id | Retrieve a single bookmark (must be the owner) |
| PUT    | /api/bookmarks/:id | Update a bookmark (owner only)                 |
| DELETE | /api/bookmarks/:id | Delete a bookmark (owner only)                 |

---

## 🛡️ Security Features

- Passwords hashed using **bcrypt**
- JWT used for stateless session authentication
- OAuth integration via **passport-github2**
- Ownership checks prevent users from accessing others' bookmarks
- Environment variables stored securely in `.env`
- `.gitignore` prevents sensitive files from being committed

---
