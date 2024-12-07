const express = require("express");
const { authToken } = require("../../config/auth");
const { getUser, registerUser, loginUser, deleteUser, logoutUser } = require("../controllers/userController");
const userRouter = express.Router();

// Get user by ID
userRouter.get("/:user_id", authToken, getUser);

// Register a new user
userRouter.post("/registration", registerUser);

// User login
userRouter.post("/login", loginUser);

// Delete a user
userRouter.delete("/delete/:id", authToken, deleteUser);

// Logout user
userRouter.post("/logout", authToken, logoutUser);


module.exports = userRouter;