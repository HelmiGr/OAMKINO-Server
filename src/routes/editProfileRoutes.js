const express = require('express');
const router = express.Router();
const { getUserById, updateUserById } = require('../controllers/editProfileController');

// Fetch user by user_id
router.get('/user/:user_id', getUserById);

// Update user by user_id
router.put('/user/:user_id', updateUserById);

module.exports = router;
