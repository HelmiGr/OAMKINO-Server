const {
  checkGroupAccess,
  addMovieToGroup,
  fetchGroupMovies,
} = require("../models/GroupMoviesModel");

const addMovieToGroupController = async (req, res) => {
  const { groupId } = req.params;
  const { movieId } = req.body;
  const userId = req.user.user_id;

  if (!groupId || !movieId) {
    return res.status(400).json({ error: "Group ID or Movie ID is missing." });
  }

  try {
    const groupAccess = await checkGroupAccess(groupId, userId);

    if (groupAccess.length === 0) {
      return res.status(403).json({ error: "Only members can add movies." });
    }

    await addMovieToGroup(groupId, movieId, userId);

    console.log("Movie added successfully:", { groupId, movieId, userId });
    res.status(201).json({ message: "Movie added successfully!" });
  } catch (error) {
    console.error("Error adding movie to group:", error);
    res.status(500).json({ error: "Failed to add movie to group." });
  }
};

const getGroupMoviesController = async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ error: "Group ID is missing." });
  }

  try {
    const groupMovies = await fetchGroupMovies(groupId);

    if (groupMovies.length === 0) {
      return res.status(404).json({ error: "No movies found for this group." });
    }
    res.status(200).json(groupMovies);
  } catch (error) {
    console.error("Error fetching group movies:", error);
    res.status(500).json({ error: "Failed to fetch group movies." });
  }
};

module.exports = {
  addMovieToGroupController,
  getGroupMoviesController,
};
