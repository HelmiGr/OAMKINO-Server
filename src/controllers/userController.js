const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  getUserById,
  checkEmailExists,
  insertUser,
  checkUserExists,
  deleteUserById,
} = require("../models/userModel");

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

const registerUser = async (req, res) => {
  try {
    const { email, user_name, password } = req.body;
    if (!email || !user_name || !password) {
      return res
        .status(400)
        .json({ error: "Email, username, and password are required." });
    }
    const existingUsers = await checkUserExists(email, user_name);
    if (existingUsers.length > 0) {
      const conflict = existingUsers[0];
      if (conflict.email === email) {
        return res.status(400).json({ error: "Email already exists." });
      }
      if (conflict.user_name === user_name) {
        return res.status(400).json({ error: "Username already exists." });
      }
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least one capital letter and one number.",
      });
    }
    const hashedPassword = await hash(password, 10);
    const { rows: newUser } = await insertUser(
      email,
      user_name,
      hashedPassword
    );

    res.status(201).json({
      message: "User registered successfully.",
      user_id: newUser[0].user_id,
    });
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

    const isPasswordValid = await compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15h" }
    );

    res.status(200).json({
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
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Invalid token." });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY); // Validate token
    const result = await deleteUserById(userId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token." });
    }
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout user
const logoutUser = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Invalid token." });
    }
    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

module.exports = { getUser, registerUser, loginUser, deleteUser, logoutUser };
