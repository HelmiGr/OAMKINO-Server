const { fetchPostsFromDb, addPostToDb, updatePostInDb, deletePostFromDb } = require('../models/postModel');
// const Post = require('../dto/Post.js');

// fetch all posts based on group_id
const fetchPosts = async (req, res) => {
    const { id } = req.params; // group_id
    try {
      const { rows } = await fetchPostsFromDb(id);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error in postController', error.message);
      return res.status(500).json({ message: 'Internal server error.' });
    }
}

// create a post
const createPost = async (req, res) => {
    const { message, group_id, user_id } = req.body;
    try {
      const newMessage = await addPostToDb(message, group_id, user_id);
      return res.status(200).json(newMessage.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
}

// edit a specific post
const editPost = async (req, res) => {
    const { id } = req.params; // message_id
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Content is required.' });
    }
    try {
      const { rows } = await updatePostInDb(id, message);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Post not found.' });
      }
      return res.status(200).json({ message: 'Post updated successfully.', post: rows });
    } catch (error) {
      console.error('Error updating post:', error.message);
      return res.status(500).json({ message: 'Internal server error.' });
    }
}

// delete a specific post
const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
      const { rows } = await deletePostFromDb(id);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Post not found.' });
      }
      return res.status(200).json({ message: `Post with ID ${id} deleted successfully.` });
    } catch (error) {
      console.error('Error deleting post:', error.message);
      return res.status(500).json({ message: 'Internal server error.' });
    }
}


module.exports = { fetchPosts, createPost, editPost, deletePost };
