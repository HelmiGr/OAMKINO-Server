const {
  fetchPostsFromDb,
  validateTaggedUsers,
  addPostToDb,
  updatePostInDb,
  deletePostFromDb,
  searchUsersByTerm,
} = require("../models/postModel");

// Fetch all posts for a specific group
const fetchPosts = async (req, res) => {
  const { id } = req.params; // group_id
  try {
    const { rows } = await fetchPostsFromDb(id);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error in postController", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const createPost = async (req, res) => {
  const { message, group_id, user_id } = req.body;

  if (!message || !group_id || !user_id) {
    return res
      .status(400)
      .json({ error: "Message, group_id, and user_id are required" });
  }

  const taggedUsernames =
    message.match(/@[a-zA-Z0-9._%+-]+/g)?.map((tag) => tag.slice(1)) || [];

  try {
    // Validate tagged users
    const validTaggedUsers = await validateTaggedUsers(taggedUsernames);

    if (validTaggedUsers.length === 0 && taggedUsernames.length > 0) {
      return res
        .status(400)
        .json({ error: "No valid tagged users found in the database." });
    }

    // Add the post to the database
    const newPost = await addPostToDb(
      message,
      group_id,
      user_id,
      validTaggedUsers
    );

    res.status(200).json({
      message: "Post created successfully",
      post: newPost.rows[0],
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Edit a specific post
const editPost = async (req, res) => {
  const { id } = req.params; // message_id
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Content is required." });
  }

  const taggedUsernames =
    message.match(/@[a-zA-Z0-9._%+-]+/g)?.map((tag) => tag.slice(1)) || [];

  try {
    const result = await updatePostInDb(id, message, taggedUsernames);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({
      message: "Post updated successfully.",
      post: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a specific post
const deletePost = async (req, res) => {
  const { id } = req.params; // message_id
  try {
    const result = await deletePostFromDb(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({
      message: `Post with ID ${id} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Search for users to tag
const searchUsersController = async (req, res) => {
  const searchTerm = req.query.search; // User's input after '@'

  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const users = await searchUsersByTerm(searchTerm);
    res.json(users);
  } catch (error) {
    console.error("Error in searchUsersController", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  fetchPosts,
  createPost,
  editPost,
  deletePost,
  searchUsersController,
};
