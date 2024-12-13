require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user:
    process.env.NODE_ENV === "development"
      ? process.env.DB_USER
      : process.env.RENDER_DB_USER,
  host:
    process.env.NODE_ENV === "development"
      ? process.env.DB_HOST
      : process.env.RENDER_DB_HOST,
  database:
    process.env.NODE_ENV === "development"
      ? process.env.DB_DATABASE
      : process.env.RENDER_DB_DATABASE,
  password:
    process.env.NODE_ENV === "development"
      ? process.env.DB_PASSWORD
      : process.env.RENDER_DB_PASSWORD,
  port:
    process.env.NODE_ENV === "development"
      ? process.env.DB_PORT
      : process.env.RENDER_DB_PORT,
  ssl:
    process.env.NODE_ENV === "development"
      ? false
      : { rejectUnauthorized: false },
});

module.exports.query = (text, params, callback) => {
  return pool.query(text, params, callback);
};
