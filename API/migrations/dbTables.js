let mysql = require("mysql");
const { dbConfig } = require("../config.json");

// Create Tables in the botAPI Database
async function dbTables() {
  let con = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    // Create Users Table
    const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                points INT DEFAULT 0
            );
        `;
    con.query(createUsersTable, (err, results) => {
      if (err) {
        console.error("❌ Error creating 'users' table:", err);
        return;
      }
      console.log("Table 'users' created or already exists.");
    });

    // Create Links Table
    const createLinksTable = `
            CREATE TABLE IF NOT EXISTS links (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titres VARCHAR(255) NOT NULL,
                url TEXT NOT NULL UNIQUE,
                description TEXT
            );
        `;
    con.query(createLinksTable, (err, results) => {
      if (err) {
        console.error("❌ Error creating 'links' table:", err);
        return;
      }
      console.log("Table 'links' created or already exists.");
    });

    // Close the connection after queries execute
    con.end((err) => {
      if (err) {
        console.error("❌ Error closing the connection:", err);
        return;
      }
      console.log("Database setup complete. Connection closed.");
    });
  });
}

dbTables();
