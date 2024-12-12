const express = require("express");
const { authToken } = require("../../config/auth");

const postRouter = express.Router();
const {
  fetchPosts,
  createPost,
  editPost,
  deletePost,
  searchUsersController,
} = require("../controllers/postController");

// Search users for tagging
postRouter.get("/search", authToken, searchUsersController);

// Fetch all posts for a group
postRouter.get("/:id", fetchPosts);

// Create a post
postRouter.post("/", authToken, createPost);

// Edit a specific post
postRouter.put("/:id", authToken, editPost);

// Delete a specific post
postRouter.delete("/:id", authToken, deletePost);

module.exports = postRouter;
