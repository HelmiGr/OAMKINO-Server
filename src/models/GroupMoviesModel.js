const pool = require("../../config/db");

// Check if a user has access to a group
async function checkGroupAccess(groupId, userId) {
  const result = await pool.query(
    `SELECT * FROM GroupMemberships 
     WHERE group_id = $1 AND user_id = $2 AND status = 'accepted'`,
    [groupId, userId]
  );
  return result.rows;
}

// Add a movie to a group
async function addMovieToGroup(groupId, movieId, userId) {
  await pool.query(
    `INSERT INTO GroupMovies (group_id, movie_id, added_by, added_at) 
     VALUES ($1, $2, $3, NOW())`,
    [groupId, movieId, userId]
  );
}

// Get movies associated with a group
async function fetchGroupMovies(groupId) {
  const result = await pool.query(
    `SELECT gm.id, gm.movie_id, gm.added_by, gm.added_at, u.user_name AS added_by_user
     FROM GroupMovies gm
     JOIN Users u ON gm.added_by = u.user_id
     WHERE gm.group_id = $1`,
    [groupId]
  );
  return result.rows;
}

module.exports = {
  checkGroupAccess,
  addMovieToGroup,
  fetchGroupMovies,
};
