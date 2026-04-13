const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

const socialLoginCallback = async (accessor, profile, done) => {
  try {
    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;
    const avatar = photos?.[0]?.value || "";

    // 1. Check if user already exists with this providerId
    let user = await User.findOne({ providerId: id, provider: accessor });

    if (user) {
      return done(null, user);
    }

    // 2. Check if user exists with the same email (Linking account logic)
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        // Link the provider to existing account
        user.provider = accessor;
        user.providerId = id;
        if (!user.avatar) user.avatar = avatar;
        await user.save();
        return done(null, user);
      }
    }

    // 3. Create a new user if not found
    user = await User.create({
      name: displayName || profile.username || "Social User",
      email: email || `${id}@${accessor}.com`, // Fallback for providers without email
      provider: accessor,
      providerId: id,
      avatar: avatar,
      role: 'user'
    });

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => socialLoginCallback('google', profile, done)
  ));
} else {
  console.warn("[PASSPORT] Google Client ID/Secret missing. Google Login disabled.");
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback"
    },
    (accessToken, refreshToken, profile, done) => socialLoginCallback('github', profile, done)
  ));
} else {
  console.warn("[PASSPORT] GitHub Client ID/Secret missing. GitHub Login disabled.");
}

// Discord Strategy
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  passport.use(new DiscordStrategy({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "/api/auth/discord/callback",
      scope: ['identify', 'email']
    },
    (accessToken, refreshToken, profile, done) => socialLoginCallback('discord', profile, done)
  ));
} else {
  console.warn("[PASSPORT] Discord Client ID/Secret missing. Discord Login disabled.");
}

// Serialize user for session (standard passport but we use JWT)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
