const db = require("../../config/db");

// Fetch user by user_id
const getUserById = async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await db.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Update user by user_id
const updateUserById = async (req, res) => {
    const { user_id } = req.params;
    const { user_name, email, profile_pic } = req.body;
    try {
        await db.query(
            'UPDATE users SET user_name = $1, email = $2, profile_pic = $3 WHERE user_id = $4',
            [user_name, email, profile_pic, user_id]
        );
        res.send('User updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getUserById,
    updateUserById,
};
