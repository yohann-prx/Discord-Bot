let mysql = require("mysql");
const { dbConfig } = require("../config.json");

// Add information to the table links
async function dbFixtures() {
  let con = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    // Add information to the table links
    const insertLinksQuery = `
        `;

    con.query(insertLinksQuery, (err, results) => {
      if (err) throw err;
      console.log("Links inserted or already exist.");
    });

    con.end();
  });
}

dbFixtures();
