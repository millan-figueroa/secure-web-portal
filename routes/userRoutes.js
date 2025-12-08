const passport = require("passport");
const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/userController");

const { authMiddleware } = require("../middleware/auth");

// router
const router = express.Router();

/**
 * post /api/users/register
 */
router.post("/register", registerUser);

/**
 * post /api/users/login
 */
router.post("/login", loginUser);

/**
 * get /api/users/me
 * protected route
 */
router.get("/me", authMiddleware, getMe);

/**
 * get /api/users/auth/github
 * start github oauth flow
 */
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// disable github routes for now while testing local auth
module.exports = router;
