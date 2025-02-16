let mysql = require("mysql");
const { dbConfig } = require("../config.json");


// Create Database
async function dbCreate() {
    let con = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected to MySQL!");

        con.query("CREATE DATABASE IF NOT EXISTS botAPI", function (err, results) {
            if (err) throw err;
            console.log("Database 'botAPI' created!");
            con.end(); // Close connection after creating DB
        });
    });
}

dbCreate();
