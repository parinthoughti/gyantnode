/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
var express = require("express");
var router = express.Router();
var passport = require("passport");
var jwt = require("jsonwebtoken");
var jwtSecret = require("../config/jwtConfig");
var helpers = require("../helpers/helpers");
var Admin = require("../helpers/admin");
// eslint-disable-next-line node/no-extraneous-require
var moment = require("moment");
var now = new Date();
var localStorage = require("localStorage");

const APP_URL = process.env.APP_URL;
const CLIENT_URL = process.env.CLIENT_URL;
router.post("/login", async (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate("login", (err, users, info) => {
    if (err) {
      return helpers.generateApiResponse(res, req, err, 401, []);
    }
    if (info !== undefined) {
      if (info.message === "bad email") {
        return helpers.generateApiResponse(res, req, info.message, 401, []);
      }
      return helpers.generateApiResponse(res, req, info.message, 403, []);
    }
    req.logIn(users, async () => {
      let user = await Admin.login(req.body.email);
      if (user === "false") {
        return helpers.generateApiResponse(
          res,
          req,
          "User is inactive.",
          401,
          []
        );
      }
      user = user[0];
      let jwtData = {
        id: user.id,
        firstName: user.name,
        lastName: "",
        accessToken: "",
        refreshToken: ""
      };
      const token = jwt.sign(jwtData, jwtSecret.secret, {
        expiresIn: 60 * 60
      });
      return helpers.generateApiResponse(res, req, "Login successful.", 200, {
        auth: true,
        uid: user.id,
        // utype: user.type,
        // facilityId: user.facilityId,
        token
      });
    });
  })(req, res, next);
});

router.get("/logout", function(req, res) {
  return helpers.generateApiResponse(res, req, "Logout succesful.", 200, []);
});

module.exports = router;
