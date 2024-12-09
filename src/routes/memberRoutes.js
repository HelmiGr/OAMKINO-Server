const express = require("express");
const { authToken } = require("../../config/auth");
const {
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
} = require("../controllers/memberController");

const memberRouter = express.Router();

//Part: Group Request and Membership Actions:
//Request to Join Group --User requests to join group
memberRouter.post("/:groupId/request", authToken, requestToJoinGroup);

//--Leave Group --User leaves group
memberRouter.post("/:groupId/leave", authToken, leaveGroup);

//--Get Join Requests --Admin can view pending requests
memberRouter.get("/:groupId/member-requests", authToken, getPendingRequests);

//Check Group Invitation --User checks if they've been invited to group
memberRouter.get("/:groupId/member-invitated", authToken, getUserInvitation);

//Accept Join Request --Admin accepts pending join request
memberRouter.post("/:groupId/accept", authToken, acceptMembershipRequest);

//Reject Join Request --Admin rejects pending join request
memberRouter.post("/:groupId/reject", authToken, rejectMembershipRequest);

//Part: Member Management and Role:
//Get User's Role in Group --Get user's role
memberRouter.get("/:groupId/role", authToken, getUserRole);

//Get All Group Members --List all accepted members in group
memberRouter.get("/:groupId/members", authToken, getGroupMembers);

//Remove Member from Group --Admin removes member from group
memberRouter.delete("/:groupId/members/:userId", authToken, leaveGroup);

//Get User's Groups --Get all groups that the user is part
memberRouter.get("/your-groups", authToken, getYourGroups);

//Part: Invitations and Non-Members:
//Invite Member to Group --Admin invites user to group
memberRouter.post("/:groupId/invite", authToken, inviteToGroup);

//Respond to Invitation --User accepts or rejects invitation to group
memberRouter.post("/:groupId/respond", authToken, respondToInvitation);

//Get Non-Members of Group --Fetch users who are not members(admin) of group
memberRouter.get("/:groupId/non-members", authToken, getNonMembers);

module.exports = memberRouter;
