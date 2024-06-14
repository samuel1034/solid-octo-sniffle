const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const UsersModel = require('../models/UsersModel');

const usersModel = new UsersModel();

// Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in database
      let user = await usersModel.getUserByEmail(profile.email);

      if (!user) {
        // If user doesn't exist, create a new user in the database
        user = await usersModel.createUser(profile.displayName, profile.email, ''); // Password can be empty or a placeholder
      }

      return done(null, user); // Pass the user object to done
    } catch (err) {
      return done(err);
    }
  }
));

// Local Strategy (for email/password)
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await usersModel.getUserByEmail(email);

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      if (password !== user.password) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersModel.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
