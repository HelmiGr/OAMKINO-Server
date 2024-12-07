const pool = require('../../config/db');

// Check if the user is already a member or has a pending request
const checkMembershipStatusDb = async (groupId, userId) => {
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
const createJoinRequestDb = async (groupId, userId) => {
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
const removeUserDb = async (groupId, userId) => {
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
const checkMembershipRoleDb = async (groupId, userId) => {
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

// Fetch group members
const fetchGroupMembersDb = async (groupId) => {
  try {
    return await pool.query(
      `SELECT u.user_id, u.email AS user_email, gm.role
       FROM GroupMemberships gm
       JOIN Users u ON gm.user_id = u.user_id
       WHERE gm.group_id = $1 AND gm.status = 'accepted'`,
      [groupId]
    );
  } catch (error) {
    console.error('Error fetching group members:', error.message);
    throw new Error('Database query failed');
  }
};

// Accept membership request
const acceptMembershipRequestDb = async (groupId, userId) => {
  try {
    await pool.query(
      "UPDATE GroupMemberships SET status = 'accepted' WHERE group_id = $1 AND user_id = $2",
      [groupId, userId]
    );
  } catch (error) {
    console.error('Error accepting join request:', error.message);
    throw new Error('Database query failed');
  }
};

// Reject membership request
const rejectMembershipRequestDb = async (groupId, userId) => {
  try {
    await pool.query(
      "UPDATE GroupMemberships SET status = 'rejected' WHERE group_id = $1 AND user_id = $2",
      [groupId, userId]
    );
  } catch (error) {
    console.error('Error rejecting join request:', error.message);
    throw new Error('Database query failed');
  }
};


module.exports = {
  checkMembershipStatusDb,
  createJoinRequestDb,
  removeUserDb,
  checkMembershipRoleDb,
  fetchGroupMembersDb,
  acceptMembershipRequestDb,
  rejectMembershipRequestDb,
};