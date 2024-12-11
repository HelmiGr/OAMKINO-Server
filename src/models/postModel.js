const pool = require("../../config/db");

// gets all posts from db
async function fetchPostsFromDb(groupId) {
  try {
    const query = `SELECT * FROM messages WHERE group_id = $1`;
    const result = await pool.query(query, [groupId]);
    return result;
  } catch {
    console.error("Error fetching posts:", error.message);
    throw new Error("Database query failed");
  }
}

// gets group name
async function fetchGroupNameFromDb(groupId) {
  try {
    const query = `SELECT group_name FROM groups WHERE group_id = $1`;
    const result = await pool.query(query, [groupId]);
    return result;
  } catch {
    console.error("Error fetching group name:", error.message);
    throw new Error("Database query failed");
  }
}

// adds a new post to db
async function addPostToDb(message, group_id, user_id) {
  try {
    const newMessage = await pool.query(
      `INSERT INTO messages (message, group_id, user_id)
         VALUES ($1, $2, $3)
         RETURNING message, group_id, user_id, message_id`,
      [message, group_id, user_id]
    );
    return newMessage;
  } catch {
    console.error("Error creating post:", error.message);
    throw new Error("Database query failed");
  }
}

// updates a post's content in db
async function updatePostInDb(messageId, message) {
  try {
    const query = `UPDATE messages SET messages = $1, timestamp = CURRENT_TIMESTAMP WHERE message_id = $2 RETURNING *;`;
    const result = await pool.query(query, [message, messageId]);
    return result;
  } catch {
    console.error("Error updating post:", error.message);
    throw new Error("Database query failed");
  }
}

// deletes a post from db
async function deletePostFromDb(messageId) {
  try {
    const query = `DELETE FROM messages WHERE message_id = $1 RETURNING *`;
    const result = await pool.query(query, [messageId]);
    return result;
  } catch {
    console.error("Error deleting post:", error.message);
    throw new Error("Database query failed");
  }
}

//tag user_name
async function searchUsersByTerm(searchTerm) {
  const result = await pool.query(
    `SELECT user_id, user_name FROM Users WHERE user_name ILIKE $1 LIMIT 10`,
    [`%${searchTerm}%`]
  );
  return result.rows;
}

module.exports = {
  fetchPostsFromDb,
  fetchGroupNameFromDb,
  addPostToDb,
  updatePostInDb,
  deletePostFromDb,
  searchUsersByTerm,
};
