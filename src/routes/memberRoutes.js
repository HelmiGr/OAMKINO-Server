const express = require("express");
const { authToken } = require("../../config/auth");
const {
  requestToJoinGroup,
  leaveGroup,
  // getMembershipStatus,
  acceptMembershipRequest,
  rejectMembershipRequest,
  getGroupMembers,
  getPendingRequests,
  // getGroupAdmin,
  // getUserGroups,
  inviteToGroup,
  respondToInvitation,
  getNonMembers,
  getUserRole,
  getYourGroups,
  getUserInvitation,
} = require("../controllers/memberController");

const memberRouter = express.Router();

memberRouter.post("/:groupId/request", authToken, requestToJoinGroup);
memberRouter.post("/:groupId/leave", authToken, leaveGroup);
// memberRouter.get("/:groupId/membership", authToken, getMembershipStatus);
memberRouter.post("/:groupId/accept", authToken, acceptMembershipRequest);
memberRouter.post("/:groupId/reject", authToken, rejectMembershipRequest);
memberRouter.get("/:groupId/members", authToken, getGroupMembers);
memberRouter.get("/:groupId/member-requests", authToken, getPendingRequests);
memberRouter.get("/:groupId/member-invitated", authToken, getUserInvitation);
// memberRouter.get("/:groupId/details", authToken, getGroupAdmin);
memberRouter.get("/your-groups", authToken, getYourGroups);
memberRouter.post("/:groupId/invite", authToken, inviteToGroup);
memberRouter.post("/:groupId/respond", authToken, respondToInvitation);
memberRouter.get("/:groupId/non-members", authToken, getNonMembers);
memberRouter.get("/:groupId/role", authToken, getUserRole);
memberRouter.delete("/:groupId/members/:userId", authToken, leaveGroup);

module.exports = memberRouter;
