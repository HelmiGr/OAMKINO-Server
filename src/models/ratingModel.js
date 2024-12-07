const pool = require('../../config/db');

// Insert a new rating
const insertRating = async (rating, movie_id, user_id) => {
  try {
    return pool.query(
      `INSERT INTO movie_rating (rating, movie_id, user_id)
       VALUES ($1, $2, $3)
       RETURNING rating, movie_id, user_id`,
      [rating, movie_id, user_id]
    );
  } catch {
    console.error('Error inserting a new rating into db:', error.message);
    throw new Error('Database query failed');
  }
};

// Update an existing rating
const updateRating = async (rating, movie_id, user_id) => {
  try {
    return pool.query(
      `UPDATE movie_rating
       SET rating = $1
       WHERE movie_id = $2 AND user_id = $3
       RETURNING rating, movie_id, user_id`,
      [rating, movie_id, user_id]
    );
  } catch {
    console.error('Error updating a rating in db:', error.message);
    throw new Error('Database query failed');
  }
};

// Check if a user has already rated a movie
const findUserRating = async (movie_id, user_id) => {
  try {
    return pool.query(
      `SELECT * FROM movie_rating WHERE movie_id = $1 AND user_id = $2`,
      [movie_id, user_id]
    );
  } catch {
    console.error('Error finding pervious rating from db:', error.message);
    throw new Error('Database query failed');
  }
};

// Get all ratings for a specific movie
const getAllRatings = async (movie_id) => {
  try {
    return pool.query(
      `SELECT * FROM movie_rating WHERE movie_id = $1`,
      [movie_id]
    );
  } catch {
    console.error('Error fetching movie ratings from db:', error.message);
    throw new Error('Database query failed');
  }
};

// Get the average rating and count for a movie
const getAverageRating = async (movie_id) => {
  try {
    return pool.query(
      `SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS amount_of_ratings 
       FROM movie_rating
       WHERE movie_id = $1`,
      [movie_id]
    );
  } catch {
    console.error('Error getting movie average rating and count:', error.message);
    throw new Error('Database query failed');
  }
};


module.exports = { insertRating, updateRating, findUserRating, getAllRatings, getAverageRating };