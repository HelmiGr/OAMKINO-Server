const pool = require("../../config/db");

// Check membership status
const checkMembershipStatusDb = async (groupId, userId) => {
  const result = await pool.query(
    "SELECT * FROM GroupMemberships WHERE group_id = $1 AND user_id = $2",
    [groupId, userId]
  );
  return result.rows[0] || null;
};

// Create a membership request or invitation
const createMembershipRequestDb = async (groupId, userId, role, status) => {
  await pool.query(
    "INSERT INTO GroupMemberships (group_id, user_id, role, status) VALUES ($1, $2, $3, $4)",
    [groupId, userId, role, status]
  );
};

// Remove a user's membership
const removeMembershipDb = async (groupId, userId) => {
  await pool.query(
    "DELETE FROM GroupMemberships WHERE group_id = $1 AND user_id = $2",
    [groupId, userId]
  );
};

// Update membership status and role
const updateMembershipStatusDb = async (groupId, userId, role, status) => {
  const result = await pool.query(
    "UPDATE GroupMemberships SET role = $1, status = $2 WHERE group_id = $3 AND user_id = $4",
    [role, status, groupId, userId]
  );
  return result.rowCount;
};

// Fetch all group members
const fetchGroupMembersDb = async (groupId) => {
  const result = await pool.query(
    `SELECT u.user_id, u.user_name, gm.role
     FROM GroupMemberships gm
     JOIN Users u ON gm.user_id = u.user_id
     WHERE gm.group_id = $1 AND gm.status = 'accepted'`,
    [groupId]
  );
  return result.rows;
};

// Fetch pending join requests
const fetchPendingRequestsDb = async (groupId) => {
  const result = await pool.query(
    `SELECT gm.user_id, gm.role, gm.status, u.user_name
     FROM GroupMemberships gm
     JOIN Users u ON gm.user_id = u.user_id
     WHERE gm.group_id = $1 AND gm.status = 'pending'`,
    [groupId]
  );
  return result.rows;
};

const fetchGroupAdminDb = async (groupId) => {
  try {
    const result = await pool.query(
      `
      SELECT g.group_name, g.created_at, u.user_id AS admin_id, u.user_name AS admin_name
      FROM Groups g
      JOIN Users u ON g.owner_id = u.user_id
      WHERE g.group_id = $1
      `,
      [groupId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching group admin from DB:", err);
    throw new Error("Failed to fetch group admin from DB.");
  }
};

// Fetch user's groups
const fetchUserGroupsDb = async (userId) => {
  const result = await pool.query(
    `SELECT g.group_id, g.group_name, g.created_at, u.user_name AS owner_name, gm.role
     FROM Groups g
     INNER JOIN GroupMemberships gm ON g.group_id = gm.group_id
     INNER JOIN Users u ON g.owner_id = u.user_id
     WHERE gm.user_id = $1
     ORDER BY g.created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Fetch non-members of a group
const fetchNonMembersDb = async (groupId, userId) => {
  const result = await pool.query(
    `SELECT u.user_id, u.user_name
     FROM Users u
     WHERE u.user_id NOT IN (
       SELECT gm.user_id FROM GroupMemberships gm WHERE gm.group_id = $1
     )
     AND u.user_id != $2`,
    [groupId, userId]
  );
  return result.rows;
};

const fetchUserRoleDb = async (groupId, userId) => {
  try {
    const result = await pool.query(
      `
      SELECT role, status
      FROM GroupMemberships
      WHERE group_id = $1 AND user_id = $2
      `,
      [groupId, userId]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching membership details:", err);
    throw new Error("Failed to fetch membership details.");
  }
};

// Fetch invitation details from the database
const fetchUserInvitationDb = async (groupId, userId) => {
  try {
    const result = await pool.query(
      `
      SELECT gm.user_id, u.user_name, g.group_name
      FROM GroupMemberships gm
      JOIN Users u ON gm.user_id = u.user_id
      JOIN Groups g ON gm.group_id = g.group_id
      WHERE gm.user_id = $1 AND gm.group_id = $2 AND gm.status = 'invited'
      `,
      [userId, groupId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    console.error("Error fetching invitation from DB:", err);
    throw new Error("Failed to fetch invitations.");
  }
};

module.exports = {
  checkMembershipStatusDb,
  createMembershipRequestDb,
  removeMembershipDb,
  updateMembershipStatusDb,
  fetchGroupMembersDb,
  fetchPendingRequestsDb,
  fetchGroupAdminDb,
  fetchUserGroupsDb,
  fetchNonMembersDb,
  fetchUserRoleDb,
  fetchUserInvitationDb,
};
