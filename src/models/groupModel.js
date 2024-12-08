const pool = require("../../config/db");

// Create a group
async function createGroupToDb(groupName, ownerId) {
  try {
    const groupResult = await pool.query(
      `INSERT INTO Groups (group_name, owner_id) VALUES ($1, $2) RETURNING group_id`,
      [groupName, ownerId]
    );
    return groupResult;
  } catch {
    console.error("Error creating group:", error.message);
    throw new Error("Database query failed");
  }
}

// Add creator to GroupMemberships as admin
async function addGroupAdmin(groupId, ownerId) {
  try {
    const result = await pool.query(
      `INSERT INTO GroupMemberships (group_id, user_id, role, status) VALUES ($1, $2, 'admin', 'accepted')`,
      [groupId, ownerId]
    );
    return result;
  } catch {
    console.error("Error adding admin to group:", error.message);
    throw new Error("Database query failed");
  }
}

// Fetch all groups
async function getAllGroups() {
  try {
    const queryResult = await pool.query(`
      SELECT 
        g.group_id, 
        g.group_name, 
        g.owner_id, 
        u.user_name AS owner_name, 
        g.created_at
      FROM groups g
      JOIN users u ON g.owner_id = u.user_id
    `);
    return queryResult;
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    throw new Error("Database query failed");
  }
}

// Fetch specific group details
async function fetchGroupDetails(groupId) {
  try {
    const query = `
      SELECT 
        g.group_name, 
        g.created_at, 
        u.user_id AS admin_id, 
        u.user_name AS admin_name
      FROM Groups g
      JOIN Users u ON g.owner_id = u.user_id
      WHERE g.group_id = $1
    `;
    const result = await pool.query(query, [groupId]);
    return result;
  } catch (error) {
    console.error("Error fetching group details:", error.message);
    throw new Error("Database query failed");
  }
}

// Delete group if the user is the owner
async function deleteGroupFromDb(groupId, ownerId) {
  try {
    const result = await pool.query(
      `SELECT * FROM groups WHERE group_id = $1 AND owner_id = $2`,
      [groupId, ownerId]
    );

    if (result.rows.length > 0) {
      await pool.query(`DELETE FROM groups WHERE group_id = $1`, [groupId]);
    }
    return result.rows.length;
  } catch (error) {
    console.error("Error deleting group from database:", error.message);
    throw new Error("Database query failed");
  }
}

module.exports = {
  createGroupToDb,
  addGroupAdmin,
  getAllGroups,
  fetchGroupDetails,
  deleteGroupFromDb,
};
