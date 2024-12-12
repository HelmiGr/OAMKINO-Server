const express = require("express");
const { getAllReviews } = require("../controllers/reviewAllController");
const reviewAllRouter = express.Router();

//get all review
reviewAllRouter.get("/all", getAllReviews);

module.exports = reviewAllRouter;
