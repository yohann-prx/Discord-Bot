const express = require("express");
const router = express.Router();
const frangipanes = require("../services/getFrangipane");

router.get("/", async function (req, res, next) {
  try {
    res.json(await frangipanes.getMultiple(req.query.page));
  } catch (err) {
    console.log(`CALINER ET TERMINER: ${err.message}`);
    next(err);
  }
});

module.exports = router;
