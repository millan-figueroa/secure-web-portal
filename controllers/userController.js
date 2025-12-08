const User = require("../models/User");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiration = "2h"; // token will be valid for 2 hours

// get all users (should be protected, usually admin only)
async function getAllUsers(req, res) {
  try {
    console.log(req.user);

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "you must be logged in to see this" });
    }

    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error getting users" });
  }
}

function getUserById(req, res) {
  res.send(`data for user: ${req.params.id}`);
}

/**
 * Register New User
 */
async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email, and password are required" });
    }

    // check if user exists
    const dbUser = await User.findOne({ email });

    if (dbUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    // create new user (password hash happens in user model pre save)
    const user = await User.create({ username, email, password });

    // create payload
    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // create token
    const token = jwt.sign({ data: payload }, secret, {
      expiresIn: expiration,
    });

    // return token and safe user data
    res.status(201).json({
      message: "user registered successfully",
      token,
      user: payload,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error during registration" });
  }
}

/**
 * login user
 */
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // check fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    // check if user exists
    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(400).json({ message: "incorrect email or password" });
    }

    const passwordMatched = await dbUser.isCorrectPassword(password);

    if (!passwordMatched) {
      return res.status(400).json({ message: "incorrect email or password" });
    }

    // create payload
    const payload = {
      _id: dbUser._id,
      username: dbUser.username,
      email: dbUser.email,
      role: dbUser.role,
    };

    // create token
    const token = jwt.sign({ data: payload }, secret, {
      expiresIn: expiration,
    });

    // return token and safe user data
    res.json({ token, user: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error during login" });
  }
}

/**
 * get current logged in user
 * requires authmiddleware to have set req.user
 */
async function getMe(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "not authorized" });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error getting current user" });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  getMe,
};
