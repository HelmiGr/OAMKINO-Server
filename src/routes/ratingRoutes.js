const express = require("express");
const { authToken } = require("../../config/auth");
const { postOrUpdateRating, getRatingsForMovie, getAverageRatingForMovie } = require("../controllers/ratingController");
const ratingRouter = express.Router();

// POST or update a rating
ratingRouter.post("/", authToken, postOrUpdateRating);

// GET all ratings for a specific movie
ratingRouter.get("/:movie_id", authToken, getRatingsForMovie);

// GET the average rating for a specific movie
ratingRouter.get("/average/:movie_id", authToken, getAverageRatingForMovie);


module.exports = ratingRouter;