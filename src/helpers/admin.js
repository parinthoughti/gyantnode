const con = require("../database/connection.js");

var admin = {
  login: async email => {
    let sql = "SELECT * from user where email = '" + email + "'";
    let result = await con.promise().query(sql);
    if (result[0].length > 0) {
      return result[0];
    }
    return "false";
  }
};

module.exports = admin;
