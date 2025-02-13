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

  const sql = "INSERT INTO frangipane (amandes, quantity) VALUES ?";
  const values = [
    ["Plein", 200],
    ["Partout", 199],
    ["Nope", 20],
    ["Là", 2],
    ["Peut être", 666],
    ["Peut être", 666],
    ["Peut être", 666],
    ["Peut être", 666],
    ["Peut être", 666],
    ["Peut être", 666],
    ["Peut être", 666],
    ["Peut être", 666],
    ["Peut être", 666],
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("AJOUTER ET LECHER : " + result.affectedRows);
  });
});
