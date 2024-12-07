const express = require('express');
const { authToken } = require('../../config/auth');
const { fetchPosts, createPost, editPost, deletePost } = require('../controllers/postController');
const postRouter = express.Router();

// GET to fetch posts from db (group_id)
postRouter.get('/:id', fetchPosts); 

// POST to add a new post
postRouter.post('/', authToken, createPost); 

// PUT to edit a post in db (message_id)
postRouter.put('/:id', editPost);   

// DELETE to delete a post from db (message_id)
postRouter.delete('/:id', deletePost); 


module.exports = postRouter;
