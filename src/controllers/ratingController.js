const { insertRating, updateRating, findUserRating, getAllRatings, getAverageRating } = require('../models/ratingModel');
const axios = require('axios');
const MOVIE_API_BASE_URL = "https://www.finnkino.fi/xml/Schedule/";

// Post or update a rating
const postOrUpdateRating = async (req, res) => {
  try {
    const { rating, movie_id, user_id } = req.body;

    // Check if the movie exists via the movie API
    const movieResponse = await axios.get(`${MOVIE_API_BASE_URL}/${movie_id}`);
    if (!movieResponse.data) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check if the user already rated the movie
    const existingRating = await findUserRating(movie_id, user_id);

    if (existingRating.rows.length === 0) {
      const newRating = await insertRating(rating, movie_id, user_id);
      return res.status(201).json(newRating.rows[0]);
    } else {
      const updatedRating = await updateRating(rating, movie_id, user_id);
      return res.status(200).json(updatedRating.rows[0]);
    }
  } catch (error) {
    console.error("Error processing rating:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all ratings for a specific movie
const getRatingsForMovie = async (req, res) => {
  try {
    const { movie_id } = req.params;

    // Check if the movie exists via the movie API
    const movieResponse = await axios.get(`${MOVIE_API_BASE_URL}/${movie_id}`);
    if (!movieResponse.data) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const ratings = await getAllRatings(movie_id);
    res.status(200).json(ratings.rows);
  } catch (error) {
    console.error("Error fetching ratings:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get the average rating for a specific movie
const getAverageRatingForMovie = async (req, res) => {
  try {
    const { movie_id } = req.params;

    // Check if the movie exists via the movie API
    const movieResponse = await axios.get(`${MOVIE_API_BASE_URL}/${movie_id}`);
    if (!movieResponse.data) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const averageRating = await getAverageRating(movie_id);
    res.status(200).json(averageRating.rows[0]);
  } catch (error) {
    console.error("Error calculating average rating:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { postOrUpdateRating, getRatingsForMovie, getAverageRatingForMovie };