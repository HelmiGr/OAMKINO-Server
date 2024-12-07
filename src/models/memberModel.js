const pool = require('../../config/db');

// Check if the user is already a member or has a pending request
const checkMembershipStatus = async (groupId, userId) => {
    try {
      const result = await pool.query(
        "SELECT * FROM GroupMemberships WHERE group_id = $1 AND user_id = $2",
        [groupId, userId]
      );
      return result;
    } catch {
      console.error('Error checking membership status:', error.message);
      throw new Error('Database query failed');
    }
};
  
// Insert a join request into the GroupMemberships table
const createJoinRequest = async (groupId, userId) => {
    try {
      await pool.query(
        "INSERT INTO GroupMemberships (group_id, user_id, role, status) VALUES ($1, $2, $3, $4)",
        [groupId, userId, "member", "pending"]
      );
    } catch {
        console.error('Error creating join req in db:', error.message);
        throw new Error('Database query failed');
    }
};

// Remove a user from a group
const removeUser = async (groupId, userId) => {
    try {
      await pool.query(
        "DELETE FROM GroupMemberships WHERE group_id = $1 AND user_id = $2",
        [groupId, userId]
      );
    } catch {
        console.error('Error removing member from group:', error.message);
        throw new Error('Database query failed');
    }
};
  
// Get member's role in group
const checkMembershipRole = async (groupId, userId) => {
    try {
      const result = await pool.query(
        "SELECT role FROM GroupMemberships WHERE group_id = $1 AND user_id = $2",
        [groupId, userId]
      );
      return result; // empty if no membership
    } catch {
        console.error('Error checking member role in db:', error.message);
        throw new Error('Database query failed');
    }
};
  

module.exports = { checkMembershipStatus, createJoinRequest, removeUser, checkMembershipRole };