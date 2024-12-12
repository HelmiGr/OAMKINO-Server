const {
  addFavorite,
  removeFavorite,
  getAllFavorites,
} = require("../models/favouriteModel");

const addMovie = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { movie_id } = req.body;
    const response = await addFavorite(user_id, movie_id);
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    console.error("Error adding movie to favorites:", error);
    res.status(500).json({ error: "Failed to add movie to favorites" });
  }
};

const removeMovie = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { id } = req.body;
    const response = await removeFavorite(user_id, id);
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ error: "Failed to remove movie from favorites" });
  }
};

const getFavourites = async (req, res) => {
  try {
    const { user_id } = req.user;
    console.log(user_id);
    const response = await getAllFavorites(user_id);
    res.status(response.statusCode).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve favorite movies" });
  }
};

module.exports = { addMovie, removeMovie, getFavourites };
