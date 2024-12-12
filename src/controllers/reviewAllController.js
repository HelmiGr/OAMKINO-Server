const axios = require("axios");
const { fetchAllReviews } = require("../models/reviewAllModel");

// Create a new review

//H add
const getAllReviews = async (req, res) => {
  try {
    const result = await fetchAllReviews(); // Call the fetch function

    res.status(200).json(result.rows); // Send response
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({
      error: "An error occurred while fetching reviews.",
    });
  }
};

module.exports = {
  getAllReviews,
};
