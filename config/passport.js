const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL, // e.g., 'http://localhost:3001/api/users/auth/github/callback'
    },
    // this is the "verify" callback
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("github profile:", profile.id, profile.username);

        // try to find existing user by github id
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // if no user found, create a new user
          user = new User({
            githubId: profile.id,
            username: profile.username,
            email: profile.emails ? profile.emails[0].value : "test@mail.com",
            // some providers return an array of emails
            // random password (will be hashed by pre-save middleware)
            password: Math.random().toString(36).slice(-8),
          });

          console.log("creating new github user:", user);
          await user.save();
        }

        // either way (existing or new), finish by calling done with the user
        return done(null, user);
      } catch (err) {
        console.error("github strategy error:", err);
        return done(err);
      }
    }
  )
);

// these functions are needed for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = passport;
