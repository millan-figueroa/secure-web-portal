const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiration = "2h";

function authMiddleware(req, res, next) {
  // token is sent via req.body, req.query, headers
  let token = req.body?.token || req.query?.token || req.headers?.authorization;
  // return split token string
  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }
  // block access if no token, return 401 error
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // attach user data to request
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next();
  } catch (err) {
    console.log("Invalid token", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
}

function signToken({ username, email, _id, role }) {
  const payload = { username, email, _id, role };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

module.exports = {
  authMiddleware,
  adminOnly,
  signToken,
};
