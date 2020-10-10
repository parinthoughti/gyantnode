/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
var express = require("express");
var axios = require("axios");
const session = require("express-session");
const smart = require("fhirclient");
var router = express.Router();
var helpers = require("../helpers/helpers");
var localStorage = require("localStorage");
const simpleOauthModule = require("simple-oauth2");
const jwt = require("jsonwebtoken");
const passport = require("passport");
var jwtSecret = require("../config/jwtConfig");
const Client = require("../lib/smart_fhir/client");

const APP_URL = process.env.APP_URL;
const CLIENT_URL = process.env.CLIENT_URL;

// The SMART state is stored in a session. If you want to clear your session
// and start over, you will have to delete your "connect.sid" cookie!
router.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false
  })
);

// The settings that we use to connect to our SMART on FHIR server
const smartSettings = {
  clientId: process.env.CERNER_CLIENT_ID,
  redirectUri: APP_URL + "/auth/callback",
  scope: "launch patient/Patient.read user/Practitioner.read openid fhirUser",
  iss:
    "https://launch.smarthealthit.org/v/r2/sim/eyJrIjoiMSIsImIiOiJzbWFydC03Nzc3NzA1In0/fhir"
};

// eslint-disable-next-line consistent-return
router.get("/launch", async (req, res, next) => {
  const fhirResorce = req.query.via;
  localStorage.setItem("fhirResorce", fhirResorce);
    smart(req, res)
      .authorize(smartSettings)
      .catch(next);
});

// eslint-disable-next-line consistent-return
router.get("/callback", async (req, res) => {
    console.log('callback -----');
    smart(req, res)
      .ready()
      .then(async client => {
        let patientInfo = await helpers.handlerfunction(client);
        console.log('patientInfo -----');
        // let jwtToken = jwt.sign(
        //   {
        //     id: 1,
        //     refreshToken: "refreshToken",
        //     accessToken: "accessToken",
        //     patientId: patientFHIRId
        //   },
        //   jwtSecret.secret,
        //   {
        //     expiresIn: 60 * 60
        //   }
        // );
        // let redirectAfterAuth =
        //   CLIENT_URL +
        //   "?id=1&token=" +
        //   jwtToken +
        //   "&patientId=" +
        //   patientFHIRId;
        // await res.redirect(redirectAfterAuth);
        // return true;
        return helpers.generateApiResponse(
          res,
          req,
          "Patient Data found.",
          200,
          patientInfo
        );
      });
  //   res.status(200).send("sucess");
});
module.exports = router;
