const express = require("express");
const router = express.Router();
const db = require("../services/db");

// Route to fetch all titles
router.get("/titles", async function (req, res, next) {
  try {
    const rows = await db.query("SELECT DISTINCT titres FROM links");
    res.json(rows.map((row) => row.titres));
  } catch (err) {
    console.error("Error fetching titles:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to fetch links by title
router.get("/", async function (req, res, next) {
  try {
    const { title } = req.query;

    console.log(`🔍 Incoming API request for title: "${title}"`);

    if (!title) {
      return res.status(400).json({ message: "Error: Title is required." });
    }

    const sql = "SELECT url, description FROM links WHERE titres = ?";
    const rows = await db.query(sql, [title]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No links found for this title." });
    }

    console.log(`Found ${rows.length} links for title: "${title}"`);
    res.json(rows);
  } catch (err) {
    console.error(`Database error: ${err.message}`);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add a new link
router.post("/", async function (req, res, next) {
  try {
    const { url, description, titres, userId, username } = req.body;

    if (!url || !titres) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Save the link in the database
    const sql = "INSERT INTO links (titres, url, description) VALUES (?, ?, ?)";
    await db.query(sql, [titres, url, description]);

    // Only add points if userId & username exist (i.e., request comes from the bot)
    if (userId && username) {
      const sqlUser = `
                INSERT INTO users (id, username, points)
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE points = points + 1
            `;
      await db.query(sqlUser, [userId, username]);
    }

    res.status(201).json({ message: "Link added successfully!" });
  } catch (err) {
    console.error("Error adding link:", err);
    res.status(500).json({ message: "Error adding link.", error: err.message });
  }
});

// Fetch top contributors
router.get("/top", async function (req, res, next) {
  try {
    const sql =
      "SELECT username, points FROM users ORDER BY points DESC LIMIT 10";
    const users = await db.query(sql);
    res.json(users);
  } catch (err) {
    console.error("Error fetching top users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Fetch a random veille link
router.get("/random", async function (req, res, next) {
  try {
    const sql = "SELECT url, description FROM links ORDER BY RAND() LIMIT 1";
    const [row] = await db.query(sql);

    if (!row) {
      return res.status(404).json({ message: "No links found." });
    }

    res.json(row);
  } catch (err) {
    console.error("Error fetching random link:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Deletes selected links
router.delete("/", async function (req, res, next) {
  try {
    console.log("DELETE Request Received:", req.body);

    if (!req.body || !req.body.description || !req.body.url) {
      console.log("Missing required fields:", req.body);
      return res.status(400).json({ message: "Missing required fields." });
    }

    const { description, url } = req.body;

    const checkSql = "SELECT * FROM links WHERE description = ? AND url = ?";
    const link = await db.query(checkSql, [description, url]);

    if (link.length === 0) {
      console.log("No matching link found.");
      return res.status(404).json({ message: "No matching link found." });
    }

    // Delete the link
    const deleteSql = "DELETE FROM links WHERE description = ? AND url = ?";
    const result = await db.query(deleteSql, [description, url]);

    if (result.affectedRows > 0) {
      console.log("Link deleted successfully.");
      return res.json({ message: "Link deleted successfully!" });
    } else {
      console.log("Deletion failed.");
      return res.status(500).json({ message: "Failed to delete the link." });
    }
  } catch (err) {
    console.error("Error deleting link:", err);
    return res
      .status(500)
      .json({ message: "Server error.", error: err.message });
  }
});

// Fetch all veille titles with their URLs and descriptions
router.get("/all", async function (req, res, next) {
  try {
    const sql =
      "SELECT titres, url, description FROM links ORDER BY titres ASC";
    const links = await db.query(sql);

    if (!links.length) {
      return res.status(404).json({ message: "No veille links found." });
    }

    res.json(links);
  } catch (err) {
    console.error("Error fetching all veille links:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
