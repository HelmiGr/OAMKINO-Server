const {
  fetchPostsFromDb,
  fetchGroupNameFromDb,
  addPostToDb,
  updatePostInDb,
  deletePostFromDb,
  searchUsersByTerm,
} = require("../models/postModel");

// fetch all posts based on group_id
// fetch group name too
const fetchPosts = async (req, res) => {
  const { id } = req.params; // group_id
  try {
    const { rows } = await fetchPostsFromDb(id);
    // const result = await fetchGroupNameFromDb(id);
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error in postController", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// create a post
// const createPost = async (req, res) => {
//     const { message, group_id, user_id } = req.body;
//     try {
//       const newMessage = await addPostToDb(message, group_id, user_id);
//       return res.status(200).json(newMessage.rows[0]);
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
// }

// create a post and tag
const createPost = async (req, res) => {
  const { message, group_id, user_id } = req.body;

  if (!message || !group_id || !user_id) {
    return res
      .status(400)
      .json({ error: "Message, group_id, and user_id are required" });
  }

  const taggedUsernames =
    message
      .match(/@[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
      ?.map((tag) => tag.slice(1)) || [];

  try {
    const result = await pool.query(
      `SELECT user_name FROM Users WHERE user_name = ANY($1::text[])`,
      [taggedUsernames]
    );
    const validTaggedUsernames = result.rows.map((row) => row.user_name);

    const newMessage = await pool.query(
      `INSERT INTO Messages (content, group_id, user_id, tagged_users, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [message, group_id, user_id, JSON.stringify(validTaggedUsernames)]
    );

    res
      .status(200)
      .json({ ...newMessage.rows[0], taggedUsernames: validTaggedUsernames });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

// edit a specific post
const editPost = async (req, res) => {
  const { id } = req.params; // message_id
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: "Content is required." });
  }
  try {
    const { rows } = await updatePostInDb(id, message);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Post not found." });
    }
    return res
      .status(200)
      .json({ message: "Post updated successfully.", post: rows });
  } catch (error) {
    console.error("Error updating post:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// delete a specific post
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await deletePostFromDb(id);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Post not found." });
    }
    return res
      .status(200)
      .json({ message: `Post with ID ${id} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Controller to search users
async function searchUsersController(req, res) {
  const searchTerm = req.query.search; // User's input after '@'

  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const users = await searchUsersByTerm(searchTerm);
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  fetchPosts,
  createPost,
  editPost,
  deletePost,
  searchUsersController,
};
