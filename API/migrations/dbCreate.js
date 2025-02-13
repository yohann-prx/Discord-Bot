let mysql = require("mysql");
const { dbConfig } = require("../config.json");

let con = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  port: dbConfig.port,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Mysql");
  con.query("CREATE DATABASE IF NOT EXISTS botAPI", (err, result) => {
    if (err) throw err;
    console.log("Database botAPI created !");
  });
});
