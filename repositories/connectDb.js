const mysql = require("mysql")
const mysqlData = require("../db.json")

const connectDb = mysql.createConnection(mysqlData);
module.exports = connectDb;