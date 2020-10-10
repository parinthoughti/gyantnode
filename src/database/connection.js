const mysql = require("mysql2");
const dotenv = require("dotenv").config();
let helper = require("../helpers/helpers");

var dbConfig = {
  host: dotenv.parsed.DB_HOST,
  user: dotenv.parsed.DB_USER,
  password: dotenv.parsed.DB_PASS,
  database: dotenv.parsed.DB_NAME
};

var connection;
connection = mysql.createPool(dbConfig);
connection.getConnection((err, conn) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  if (conn) console.log("db connected");
});
// connection.release();

module.exports = connection;
