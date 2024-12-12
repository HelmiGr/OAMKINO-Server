const pool = require("../../config/db");

//Hadd
const fetchAllReviews = async () => {
  const result = await pool.query(
    `SELECT r.review_id, r.review, r.timestamp, r.movie_name, u.email AS reviewer_email
     FROM movie_reviews r
     JOIN users u ON r.user_id = u.user_id;`
  );
  return result;
};

module.exports = {
  fetchAllReviews,
};
