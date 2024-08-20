const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// Initialize SQLite database
const db = new sqlite3.Database("./user.db");
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS Users (
      userID INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT UNIQUE NOT NULL, 
      email TEXT UNIQUE NOT NULL, 
      passwordHash TEXT NOT NULL
    )`
  );
});

// Add new user
app.post("/users", (req, res) => {
  const { username, email, password } = req.body;

  const stmt = db.prepare(
    `INSERT INTO Users (username, email, passwordHash) VALUES (?, ?, ?)`
  );

  stmt.run([username, email, password], function (err) {
    // store plain password directly
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ userID: this.lastID });
    }
  });

  stmt.finalize();
});

// Get user by ID
app.get("/users", (req, res) => {
  db.get(
    `SELECT username FROM Users WHERE userID = ?`,
    [req.query.userID],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "DB Error" });
      }
      if (!row) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User found", row });
    }
  );
});

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    db.get(
      `SELECT * FROM Users WHERE email = ? AND passwordHash = ?`, // match plain password directly
      [email, password],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: "DB Error" });
        }
        if (!row) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Login successful", row });
      }
    );
  } else {
    return res
      .status(400)
      .json({ error: "Bad Request. Email or Password missing" });
  }
});

// Signup API
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Bad Request. Username, Email or Password missing" });
  }

  db.get(`SELECT * FROM Users WHERE email = ?`, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "DB Error" });
    }
    if (row) {
      return res.status(409).json({ error: "User already exists" });
    }

    db.run(
      `INSERT INTO Users (username, email, passwordHash) VALUES (?, ?, ?)`,
      [username, email, password], // store plain password directly
      function (err) {
        if (err) {
          console.log("Error: ", err);
          return res.status(500).json({ error: err.message });
        }
        console.log("DONE");
        res.status(201).json({
          message: "User created successfully",
          userID: this.lastID,
        });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
