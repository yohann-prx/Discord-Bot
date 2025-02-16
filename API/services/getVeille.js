const db = require("./db");
const helper = require("../helper");
const config = require("../config.json");

// get multiple veille
async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query("SELECT * FROM veille");
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

module.exports = {
  getMultiple,
};
