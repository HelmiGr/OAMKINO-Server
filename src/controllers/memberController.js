const {
  checkMembershipStatusDb,
  createMembershipRequestDb,
  removeMembershipDb,
  updateMembershipStatusDb,
  fetchGroupMembersDb,
  fetchPendingRequestsDb,
  fetchUserGroupsDb,
  fetchNonMembersDb,
  fetchUserRoleDb,
  fetchUserInvitationDb,
} = require("../models/memberModel");

// Request to join a group
const requestToJoinGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.user_id;

  try {
    const existingMembership = await checkMembershipStatusDb(groupId, userId);

    if (existingMembership) {
      return res.status(400).json({
        error: "You are already part of this group or have a pending request.",
      });
    }

    await createMembershipRequestDb(groupId, userId, "pending", "pending");
    res
      .status(200)
      .json({ message: "Request to join the group has been sent." });
  } catch (err) {
    console.error("Error requesting to join group:", err);
    res
      .status(500)
      .json({ error: "Failed to send request to join the group." });
  }
};

// Leave a group
const leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.user_id;

  try {
    await removeMembershipDb(groupId, userId);
    res.status(200).json({ message: "Successfully left the group." });
  } catch (err) {
    console.error("Error leaving group:", err);
    res.status(500).json({ error: "Failed to leave the group." });
  }
};

// Accept a membership request
const acceptMembershipRequest = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const result = await updateMembershipStatusDb(
      groupId,
      userId,
      "member",
      "accepted"
    );

    if (result === 0) {
      return res
        .status(404)
        .json({ error: "Membership not found or already processed." });
    }

    res
      .status(200)
      .json({ message: "Request accepted and role updated to member." });
  } catch (err) {
    console.error("Error accepting join request:", err);
    res.status(500).json({ error: "Failed to accept join request." });
  }
};

// Reject a membership request
const rejectMembershipRequest = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    await removeMembershipDb(groupId, userId);
    res
      .status(200)
      .json({ message: "Request rejected. User is not a member." });
  } catch (err) {
    console.error("Error rejecting join request:", err);
    res.status(500).json({ error: "Failed to reject join request." });
  }
};

// Fetch all group members
const getGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const members = await fetchGroupMembersDb(groupId);
    res.status(200).json(members);
  } catch (err) {
    console.error("Error fetching group members:", err);
    res.status(500).json({ error: "Failed to fetch group members." });
  }
};

// Fetch pending join requests
const getPendingRequests = async (req, res) => {
  const { groupId } = req.params;

  try {
    const requests = await fetchPendingRequestsDb(groupId);
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching join requests:", err);
    res.status(500).json({ error: "Failed to fetch join requests." });
  }
};

const getYourGroups = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const groups = await fetchUserGroupsDb(userId);

    if (groups.length === 0) {
      return res.status(200).json({ groups: [] });
    }
    return res.status(200).json({ groups });
  } catch (err) {
    console.error("Error fetching user's groups:", err);
    return res.status(500).json({ error: "Failed to fetch user's groups." });
  }
};

// Invite a user to a group
const inviteToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const existingMembership = await checkMembershipStatusDb(groupId, userId);

    if (existingMembership) {
      return res.status(400).json({
        error: "User is already a member or has a pending invitation.",
      });
    }

    await createMembershipRequestDb(groupId, userId, "pending", "invited");
    res.status(200).json({ message: "Invitation sent successfully." });
  } catch (err) {
    console.error("Error inviting member:", err);
    res.status(500).json({ error: "Failed to send invitation." });
  }
};

// Respond to an invitation
const respondToInvitation = async (req, res) => {
  const { groupId } = req.params;
  const { response } = req.body; // "accept" or "reject"
  const userId = req.user.user_id;

  try {
    const membership = await checkMembershipStatusDb(groupId, userId);

    if (!membership || membership.status !== "invited") {
      return res.status(400).json({ error: "No pending invitation found." });
    }

    if (response === "accept") {
      await updateMembershipStatusDb(groupId, userId, "member", "accepted");
      return res.status(200).json({ message: "You have joined the group." });
    } else if (response === "reject") {
      await removeMembershipDb(groupId, userId);
      return res
        .status(200)
        .json({ message: "You have rejected the invitation." });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid response. Use 'accept' or 'reject'." });
    }
  } catch (err) {
    console.error("Error responding to invitation:", err);
    res.status(500).json({ error: "Failed to respond to the invitation." });
  }
};

// Fetch non-members of a group
const getNonMembers = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.user_id;

  try {
    const nonMembers = await fetchNonMembersDb(groupId, userId);
    res.status(200).json(nonMembers);
  } catch (err) {
    console.error("Error fetching non-members:", err);
    res.status(500).json({ error: "Failed to fetch non-members." });
  }
};

// Fetch a user's role in a group
const getUserRole = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.user_id;

  try {
    const membership = await fetchUserRoleDb(groupId, userId);

    if (!membership) {
      return res.status(200).json({ isMember: false, isInvited: false });
    }

    const { role, status } = membership;
    return res.status(200).json({
      isMember: status === "accepted",
      isInvited: status === "invited",
      role,
    });
  } catch (err) {
    console.error("Error fetching user role:", err);
    return res.status(500).json({ error: "Failed to fetch user role." });
  }
};

// Function to fetch the invitation for a user in a group
const getUserInvitation = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.user_id;
  try {
    const invitation = await fetchUserInvitationDb(groupId, userId);

    if (!invitation) {
      return res.status(404).json({ error: "No invitation found." });
    }
    return res.status(200).json(invitation);
  } catch (err) {
    console.error("Error fetching invitations:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch invitations. Please try again later." });
  }
};

module.exports = {
  requestToJoinGroup,
  leaveGroup,
  acceptMembershipRequest,
  rejectMembershipRequest,
  getGroupMembers,
  getPendingRequests,
  inviteToGroup,
  respondToInvitation,
  getNonMembers,
  getUserRole,
  getYourGroups,
  getUserInvitation,
};
