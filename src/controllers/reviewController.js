const axios = require("axios");
const { insertReview, getReviewsByMovieId, deleteReviewById } = require("../models/reviewModel");
const MOVIE_API_BASE_URL = "https://www.finnkino.fi/xml/Schedule/";

// Create a new review
const createReview = async (req, res) => {
  try {
    const { review, movie_id, user_id, movie_name } = req.body;

    const newReview = await insertReview(review, movie_id, user_id, movie_name);

    res.status(200).send(newReview.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Fetch reviews for a specific movie
const fetchMovieReviews = async (req, res) => {
  try {
    const { movie_id } = req.params;

    // Check if the movie exists via the movie API
    const movieResponse = await axios.get(`${MOVIE_API_BASE_URL}/${movie_id}`);
    if (!movieResponse.data) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Fetch reviews for the movie
    const reviews = await getReviewsByMovieId(movie_id);

    res.status(200).json(reviews.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    const deletedReview = await deleteReviewById(review_id);

    if (deletedReview.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({
      message: "Review deleted successfully",
      deletedReview: deletedReview.rows[0],
    });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { createReview, fetchMovieReviews, deleteReview };