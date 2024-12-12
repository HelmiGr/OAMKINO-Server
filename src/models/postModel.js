const pool = require("../../config/db");

// Fetch all posts for a group
async function fetchPostsFromDb(groupId) {
  try {
    const query = `
      SELECT message_id, message, group_id, user_id, timestamp, tagged_users 
      FROM messages 
      WHERE group_id = $1`;
    const result = await pool.query(query, [groupId]);
    return result;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw new Error("Database query failed");
  }
}

// Validate tagged users
async function validateTaggedUsers(usernames) {
  try {
    const query = `
      SELECT user_name 
      FROM users 
      WHERE user_name = ANY($1::text[])
    `;
    const result = await pool.query(query, [usernames]);
    return result.rows.map((row) => row.user_name);
  } catch (error) {
    console.error("Error validating tagged users:", error.message);
    throw new Error("Database query failed");
  }
}

// async function validateTaggedUsers(usernames) {
//   try {
//     const query = `
//       SELECT user_name
//       FROM users
//       WHERE LOWER(user_name) = ANY($1::text[])
//     `;
//     const result = await pool.query(query, [
//       usernames.map((u) => u.toLowerCase()),
//     ]);
//     return result.rows.map((row) => row.user_name);
//   } catch (error) {
//     console.error("Error validating tagged users:", error.message);
//     throw new Error("Database query failed");
//   }
// }

// Add a post to the database
async function addPostToDb(message, group_id, user_id, taggedUsers) {
  try {
    const query = `
      INSERT INTO messages (message, group_id, user_id, tagged_users, timestamp)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING message_id, message, group_id, user_id, tagged_users, timestamp
    `;
    const result = await pool.query(query, [
      message,
      group_id,
      user_id,
      JSON.stringify(taggedUsers),
    ]);
    return result;
  } catch (error) {
    console.error("Error creating post:", error.message);
    throw new Error("Database query failed");
  }
}

// Update a post in the database
async function updatePostInDb(messageId, message, taggedUsers) {
  try {
    const query = `
      UPDATE messages 
      SET message = $1, tagged_users = $2, timestamp = CURRENT_TIMESTAMP
      WHERE message_id = $3
      RETURNING *`;
    const result = await pool.query(query, [
      message,
      JSON.stringify(taggedUsers),
      messageId,
    ]);
    return result;
  } catch (error) {
    console.error("Error updating post:", error.message);
    throw new Error("Database query failed");
  }
}

// Delete a post from the database
async function deletePostFromDb(messageId) {
  try {
    const query = `DELETE FROM messages WHERE message_id = $1 RETURNING *`;
    const result = await pool.query(query, [messageId]);
    return result;
  } catch (error) {
    console.error("Error deleting post:", error.message);
    throw new Error("Database query failed");
  }
}

async function searchUsersByTerm(searchTerm) {
  const result = await pool.query(
    `SELECT user_id, user_name FROM Users WHERE user_name ILIKE $1 LIMIT 10`,
    [`%${searchTerm}%`]
  );
  return result.rows;
}

module.exports = {
  fetchPostsFromDb,
  validateTaggedUsers,
  addPostToDb,
  updatePostInDb,
  deletePostFromDb,
  searchUsersByTerm,
};
