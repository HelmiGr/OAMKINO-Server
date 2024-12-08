const pool = require("../../config/db");

// Get user by ID
const getUserById = async (userId) => {
  try {
    return pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
  } catch {
    console.error("Error getting user by id from db:", error.message);
    throw new Error("Database query failed");
  }
};

// Check if an email exists
const checkEmailExists = async (email) => {
  try {
    return pool.query("SELECT * FROM users WHERE email = $1", [email]);
  } catch {
    console.error("Error checking if an email exists in db:", error.message);
    throw new Error("Database query failed");
  }
};

// Insert a new user
const insertUser = async (email, user_name, passwordHash) => {
  try {
    return await pool.query(
      "INSERT INTO Users (email, user_name, password_hash) VALUES ($1, $2, $3) RETURNING user_id",
      [email, user_name, passwordHash]
    );
  } catch (error) {
    console.error("Error inserting a new user to the database:", error.message);
    throw new Error("Database query failed");
  }
};

// Check if an email and user_name exists
const checkUserExists = async (email, user_name) => {
  try {
    const query =
      "SELECT email, user_name FROM Users WHERE email = $1 OR user_name = $2";
    const { rows } = await pool.query(query, [email, user_name]);
    return rows;
  } catch (error) {
    console.error("Error checking user existence:", error.message);
    throw new Error("Database query failed");
  }
};

// Delete user by ID
const deleteUserById = async (userId) => {
  try {
    return pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [
      userId,
    ]);
  } catch {
    console.error("Error deleting user by id from db:", error.message);
    throw new Error("Database query failed");
  }
};

module.exports = {
  getUserById,
  checkEmailExists,
  insertUser,
  checkUserExists,
  deleteUserById,
};
