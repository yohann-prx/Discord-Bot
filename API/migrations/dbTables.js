let mysql = require("mysql");
const { dbConfig } = require("../config.json");

let con = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  port: dbConfig.port,
  database: dbConfig.database,
});

con.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to Mysql ${dbConfig.database}`);
  const sql =
    "CREATE TABLE IF NOT EXISTS frangipane (id INT AUTO_INCREMENT PRIMARY KEY, amandes VARCHAR(255), quantity INT)";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(`CREER ET SUCER`);
  });
});
