const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Cria (ou abre) o banco de dados SQLite
const db = new sqlite3.Database(path.join(__dirname, "../db.sqlite"));

// Cria as tabelas se não existirem
db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON`);

  db.run(`
    CREATE TABLE IF NOT EXISTS "Order" (
      orderId      TEXT PRIMARY KEY,
      value        REAL NOT NULL,
      creationDate TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Items (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId   TEXT NOT NULL,
      productId INTEGER NOT NULL,
      quantity  INTEGER NOT NULL,
      price     REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES "Order"(orderId) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
