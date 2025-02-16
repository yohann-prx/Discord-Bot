const mysql = require("mysql2/promise");
const { dbConfig } = require("../config.json");

// Query the database
async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
  });

  const [results] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query,
};
