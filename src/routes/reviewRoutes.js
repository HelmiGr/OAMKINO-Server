const express = require("express");
const { authToken } = require("../../config/auth");
const { createReview, fetchMovieReviews, deleteReview } = require("../controllers/reviewController");
const reviewRouter = express.Router();

// POST a new review
reviewRouter.post("/", authToken, createReview);

// GET reviews for a specific movie
reviewRouter.get("/:movie_id", authToken, fetchMovieReviews);

// DELETE a review by ID
reviewRouter.delete("/:review_id", authToken, deleteReview);


module.exports = reviewRouter