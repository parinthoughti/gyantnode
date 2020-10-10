let express = require("express");
let bodyParser = require("body-parser");
let cors = require("cors");
let helmet = require("helmet");
let morgan = require("morgan");
let helpers = require("./helpers/helpers");
let passport = require("passport");

let app = express();

let router = require("./routes");

// adding Helmet to enhance your API's security
app.use(
  helmet({
    frameguard: false
  })
);

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json({ limit: "50mb" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// enabling CORS for all requests
// app.use(cors({ credentials: true, origin: true }));
app.use(cors());

// initialize passport
app.use(passport.initialize());

// require passport functions
require("./config/passport");

// eslint-disable-next-line eqeqeq
if (process.env.NODE_ENV != "production") {
  // adding morgan to log HTTP requests
  app.use(morgan("combined"));
}

// import router
app.use(router);
app.use((req, res, next) => {
  const err = new Error(process.env.ERR_404);
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let errCode = err.status || 501;
  return helpers.generateApiResponse(res, req, err.message, errCode, err);
});

module.exports = app;
