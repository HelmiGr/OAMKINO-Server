const {
  createGroupToDb,
  addGroupAdmin,
  getAllGroups,
  fetchGroupDetails,
  deleteGroupFromDb,
} = require("../models/groupModel");

// Create group
const createGroup = async (req, res) => {
  const { group_name } = req.body;
  const userId = req.user.user_id;

  try {
    const groupResult = await createGroupToDb(group_name, userId);
    const groupId = groupResult.rows[0].group_id;
    await addGroupAdmin(groupId, userId);

    res.status(201).json({ message: "Group created successfully", groupId });
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ error: "Failed to create group." });
  }
};

// List all groups
const listAllGroups = async (req, res) => {
  try {
    const result = await getAllGroups();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error in listAllGroups:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get specific group details by groupId
const getGroupDetails = async (req, res) => {
  const { groupId } = req.params;
  try {
    const result = await fetchGroupDetails(groupId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Group not found." });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching group details:", err.message);
    res.status(500).json({ error: "Failed to fetch group details." });
  }
};

// Delete group
const deleteGroup = async (req, res) => {
  const { id } = req.params;
  const owner_id = req.user.user_id;

  try {
    const rowsAffected = await deleteGroupFromDb(id, owner_id);

    if (rowsAffected === 0) {
      return res
        .status(404)
        .json({ error: "Group not found or not authorized to delete." });
    }

    res.status(200).json({ message: "Group deleted successfully." });
  } catch (error) {
    console.error("Error in deleteGroup:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createGroup, listAllGroups, getGroupDetails, deleteGroup };
