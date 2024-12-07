const express = require('express');
const { authToken } = require('../../config/auth');
const { requestToJoinGroup, leaveGroup, checkUserRoleAndStatus } = require('../controllers/memberController');
const memberRouter = express.Router();;

// --- For users ---

// POST req joining a group
memberRouter.post('/:groupId/request', authToken, requestToJoinGroup);

// POST leave a group
memberRouter.post('/:groupId/leave', authToken, leaveGroup);


// --- General functions ---

// GET get membership role and status
memberRouter.get('/:groupId/membership', authToken, checkUserRoleAndStatus);

// GET get group members
memberRouter.get('/:groupId/members', authToken, getGroupMembers);


// --- For admins ---

// DELETE remove a group member
memberRouter.delete('/:groupId/members/:userId', authToken, removeMember);

// POST accept join req
memberRouter.post('/:groupId/accept', authToken, acceptJoinRequest);

// POST reject join req
memberRouter.post('/:groupId/reject', authToken, rejectJoinRequest);


module.exports = memberRouter;