const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
  new LocalStrategy(
    // Our user will sign in using an email, rather than a "username"
    {
      usernameField: "email" || "username"
    },
    (email, password, done) => {
      // When a user tries to sign in this code runs
      db.Parent.findOne({
        where: {
          email: email
        }
      }).then(dbParent => {
        // If there's no user with the given email
        if (!dbParent) {
          db.Child.findOne({
            where: {
              username: email
            }
          }).then(dbChild => {
            // If there's no user with the given email
            if (!dbChild) {
              return done(null, false, {
                message: "Incorrect email or username."
              });
            }
            // If there is a user with the given email, but the password the user gives us is incorrect
            else if (!dbChild.validPassword(password)) {
              return done(null, false, {
                message: "Incorrect password."
              });
            }
            // If none of the above, return the user
            return done(null, dbChild);
          });
        }
        // If there is a user with the given email, but the password the user gives us is incorrect
        else if (!dbParent.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        // If none of the above, return the user
        else {return done(null, dbParent);}
      });
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;