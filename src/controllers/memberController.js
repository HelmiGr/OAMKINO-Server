const { 
  checkMembershipStatusDb,
  createJoinRequestDb,
  removeUserDb,
  checkMembershipRoleDb,
  fetchGroupMembersDb,
  acceptMembershipRequestDb,
  rejectMembershipRequestDb, 
} = require('../models/memberModel');

// --- For users ---

// Send a request to join a group
const requestToJoinGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.user_id;
    try {
      const existingMembership = await checkMembershipStatusDb(groupId, userId);
      if (existingMembership.rows.length > 0) {
        return res.status(400).json({
          error: "You are already part of this group or have a pending request.",
        });
      }
      await createJoinRequestDb(groupId, userId);
      res.status(200).json({message: "Request to join the group has been successfully sent.",});
    } catch (err) {
      console.error("Error requesting to join group:", err);
      res.status(500).json({
        error:
          "Failed to send request to join the group. Please try again later.",
      });
    }
}

// Leave a group
const leaveGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user.user_id;
  
    try {
      await removeUserDb(groupId, userId)
      res.status(200).json({ message: "Successfully left the group." });
    } catch (error) {
      console.error("Error leaving the group:", error);
      res.status(500).json({ error: "Failed to leave the group." });
    }
}
  

// --- General functions ---

// Check user role and membership status
const checkUserRoleAndStatus = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.user_id;

  try {
    const membership = await checkMembershipRoleDb(groupId, userId);
    if (membership.rows.length === 0) {
      return res.status(200).json({ isMember: false });
    }

    const { role } = membership.rows[0];
    return res.status(200).json({ isMember: true, role });
  } catch (err) {
    console.error('Error checking membership status:', err);
    res.status(500).json({ error: 'Failed to check membership status.' });
  }
};

// Get group members
const getGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const members = await fetchGroupMembersDb(groupId);
    res.status(200).json(members.rows);
  } catch (err) {
    console.error('Failed to fetch group members:', err);
    res.status(500).json({ error: 'Failed to fetch group members.' });
  }
};


// --- For admins ---

// Remove a group member
const removeMember = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    await removeUserDb(groupId, userId);
    res.status(200).json({ message: 'Member successfully removed.' });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ error: 'Failed to remove member.' });
  }
};

// Accept join request
const acceptJoinRequest = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    await acceptMembershipRequestDb(groupId, userId);
    res.status(200).json({ message: 'Request accepted.' });
  } catch (err) {
    console.error('Error accepting join request:', err);
    res.status(500).json({ error: 'Failed to accept join request.' });
  }
};

// Reject join request
const rejectJoinRequest = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    await rejectMembershipRequestDb(groupId, userId);
    res.status(200).json({ message: 'Request rejected.' });
  } catch (err) {
    console.error('Error rejecting join request:', err);
    res.status(500).json({ error: 'Failed to reject join request.' });
  }
};


module.exports = { requestToJoinGroup, leaveGroup, checkUserRoleAndStatus, getGroupMembers, removeMember, acceptJoinRequest, rejectJoinRequest, };