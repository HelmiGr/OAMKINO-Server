const express = require("express");
const { authToken } = require("../../config/auth");
const {
  createGroup,
  listAllGroups,
  getGroupDetails,
  deleteGroup,
} = require("../controllers/groupController");
const groupRouter = express.Router();

// POST to create a group
groupRouter.post("/", authToken, createGroup);

// GET to get groups
groupRouter.get("/all", listAllGroups);

// GET to get details of a group
groupRouter.get("/all/:groupId", getGroupDetails);

// DELETE to delete a group
groupRouter.delete("/delete/:id", authToken, deleteGroup);

module.exports = groupRouter;
