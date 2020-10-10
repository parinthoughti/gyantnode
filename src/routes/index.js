var express = require("express");
var router = express.Router();
var helpers = require("../helpers/helpers");
var Admin = require("../helpers/admin");
var localStorage = require("localStorage");
const passport = require("passport");
var authRoutes = require("./auth");
var AuthLogin = require("./authLogin");
var axios = require("axios");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

router.get("/", (req, res) => {
  return helpers.generateApiResponse(
    res,
    req,
    "Server is up and running.",
    200,
    []
  );
});

router.all("/status", (req, res) => {
  return helpers.generateApiResponse(
    res,
    req,
    "Server is up and running.",
    200,
    []
  );
});

router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let login = await Admin.login(email, password);
  res.status(200).send(login);
});

router.use("/auth", authRoutes);
router.use("/admin", AuthLogin);

module.exports = router;
