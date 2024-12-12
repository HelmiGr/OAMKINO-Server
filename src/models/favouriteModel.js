const pool = require("../../config/db");

const addFavorite = async (user_id, movie_id) => {
  try {
    const addFavouriteQuery = `
      INSERT INTO Favorites (user_id, movie_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, movie_id) DO NOTHING;
    `;
    await pool.query(addFavouriteQuery, [user_id, movie_id]);
    return {
      statusCode: 201,
      data: { message: "Movie added to favorites successfully" },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      data: { error: "Failed to add movie to favorites" },
    };
  }
};

const removeFavorite = async (user_id, id) => {
  try {
    const query = `
      DELETE FROM Favorites
      WHERE user_id = $1 AND id = $2;
    `;
    await pool.query(query, [user_id, id]);
    return {
      statusCode: 200,
      data: { message: "Movie removed from favorites successfully" },
    };
  } catch (error) {
    return {
      statusCode: 500,
      data: { error: "Failed to remove movie from favorites" },
    };
  }
};

const getAllFavorites = async (user_id) => {
  try {
    const query = `
      SELECT id, movie_id from Favorites where user_id = $1
    `;
    const { rows } = await pool.query(query, [user_id]);
    return { statusCode: 200, data: { favorites: rows } };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      data: { error: "Failed to retrieve favorite movies" },
    };
  }
};

module.exports = { addFavorite, removeFavorite, getAllFavorites };
