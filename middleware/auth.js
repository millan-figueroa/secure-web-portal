const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiration = "2h";

// this middleware checks whether the incoming request has a valid token
function authMiddleware(req, res, next) {
  // token is sent via any of these 3 places (body/ query/ headers)
  let token = req.body?.token || req.query?.token || req.headers?.authorization;
  // return split token string
  if (req.headers.authorization) {
    // splits on space, .pop() takes the last word, .trim() removes extra whitespace (so we end up with just the token)
    token = token.split(" ").pop().trim();
  }
  // block access if no token, return 401 error (return ensures we dont continue on to protected route)
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // jwt.verify() check if token is valid, was it signed using secret, is it current?
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    // if successful returns payload
    req.user = data;
    next(); // since this is auth middleware (not mongoose) we can use next()
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
