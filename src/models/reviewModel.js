const pool = require('../../config/db');

// Insert a new review
const insertReview = async (review, movie_id, user_id, movie_name) => {
  return pool.query(
    `INSERT INTO movie_reviews (review, movie_id, user_id, movie_name)
     VALUES ($1, $2, $3, $4)
     RETURNING review, movie_id, user_id, movie_name`,
    [review, movie_id, user_id, movie_name]
  );
};

// Fetch all reviews for a specific movie
const getReviewsByMovieId = async (movie_id) => {
  return pool.query(
    `SELECT movie_reviews.*, Users.username
     FROM movie_reviews
     INNER JOIN Users ON movie_reviews.user_id = Users.user_id
     WHERE movie_reviews.movie_id = $1
     ORDER BY movie_reviews.timestamp DESC`,
    [movie_id]
  );
};

// Delete a review by ID
const deleteReviewById = async (review_id) => {
  return pool.query(
    `DELETE FROM movie_reviews WHERE review_id = $1 RETURNING *`,
    [review_id]
  );
};


module.exports = { insertReview, getReviewsByMovieId, deleteReviewById };