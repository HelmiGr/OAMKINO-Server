const pool = require('../../config/db');

// Get user by ID
const getUserById = async (userId) => {
  try {
    return pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
  } catch {
    console.error('Error getting user by id from db:', error.message);
    throw new Error('Database query failed');
  }
};

// Check if an email exists
const checkEmailExists = async (email) => {
  try {
    return pool.query("SELECT * FROM users WHERE email = $1", [email]);
  } catch {
    console.error('Error checking if an email exists in db:', error.message);
    throw new Error('Database query failed');
  }
};

// Insert a new user
const insertUser = async (email, passwordHash) => {
  try {
  return pool.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id",
    [email, passwordHash]
  );
  } catch {
    console.error('Error inserting a new user to the db:', error.message);
    throw new Error('Database query failed');
  }
};

// Delete user by ID
const deleteUserById = async (userId) => {
  try {
  return pool.query("DELETE FROM users WHERE user_id = $1 RETURNING *", [
    userId,
  ]);
  } catch {
    console.error('Error deleting user by id from db:', error.message);
    throw new Error('Database query failed');
  }
};


module.exports = { getUserById, checkEmailExists, insertUser, deleteUserById };