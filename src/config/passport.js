/* eslint-disable consistent-return */
var bcrypt = require("bcryptjs");
var jwtSecret = require("./jwtConfig");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var JWTstrategy = require("passport-jwt").Strategy;
var ExtractJWT = require("passport-jwt").ExtractJwt;
// var User = require("../models").User;
const con = require("../database/connection.js");
var Admin = require("../helpers/admin");

const BCRYPT_SALT_ROUNDS = 12;

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false
    },
    async (email, password, done) => {
      try {
        let user = await Admin.login(email);
        if (user === "false") {
          return done(null, false, { message: "Invalid email." });
        }
        user = user[0];
        bcrypt.compare(password, user.password).then(response => {
          if (response !== true) {
            return done(null, false, { message: "Invalid credentials." });
          }
          return done(null, user);
        });
      } catch (err) {
        done(err);
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: jwtSecret.secret
};

passport.use(
  "jwt",
  new JWTstrategy(opts, (jwtPayload, done) => {
    try {
      let user = {
        id: 1
      };
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  })
);
