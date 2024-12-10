const express = require("express");
const { authToken } = require("../../config/auth");

const {
  addMovieToGroupController,
  getGroupMoviesController,
} = require("../controllers/GroupMoviesController");

const groupMoviesRouter = express.Router();

// POST route to add a movie to a group
groupMoviesRouter.post(
  "/:groupId/movies",
  authToken,
  addMovieToGroupController
);

// GET route to fetch movies associated with a group
groupMoviesRouter.get("/:groupId/movies", getGroupMoviesController);

module.exports = groupMoviesRouter;
