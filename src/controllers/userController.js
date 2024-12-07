const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserById, checkEmailExists, insertUser, deleteUserById } = require("../models/userModel");

// Get user by ID
const getUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id, 10);

    if (isNaN(userId)) {
      return res.status(400).send({ error: "User ID must be a number" });
    }

    const result = await getUserById(userId);

    if (result.rows.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to get user information:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required" });
    }

    const existingUser = await checkEmailExists(email);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        error: "Password must contain at least one capital letter and one number.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await insertUser(email, passwordHash);

    res.status(200).json({ id: result.rows[0].user_id });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = await checkEmailExists(email);
    const user = userQuery.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15h" }
    );

    res.json({
      message: "Login successful",
      token,
      userId: user.user_id,
      email: user.email,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const result = await deleteUserById(userId);
    
    /*if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }*/

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout user
const logoutUser = (req, res) => {
  try {
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};


module.exports = { getUser, registerUser, loginUser, deleteUser, logoutUser };