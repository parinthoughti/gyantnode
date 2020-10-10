require("dotenv").config({
//   path: "/var/www/html/"
});
let app = require("./app");
let helpers = require("./helpers/helpers");
let http = require("http");
let https = require("https");
let fs = require("fs");

const APP_PORT = process.env.APP_PORT || 5003;
const APP_URL = process.env.APP_URL || `http://localhost:${APP_PORT}`;
const CLIENT_URL = process.env.CLIENT_URL || `http://localhost:3001`;

// create http server

// create http server with self-signed ssl certificates
const httpsOptions = {
  key: fs.readFileSync("./src/ssl/server-key.pem"),
  cert: fs.readFileSync("./src/ssl/server-cert.pem")
};
const server = https.createServer(httpsOptions, app);

// starting the server
server.listen(APP_PORT, () => {
  helpers.logMessage(
    `\nApp started successfully.\nServer running on: ${APP_URL}\nClient running on: ${CLIENT_URL}\n`
  );
});
