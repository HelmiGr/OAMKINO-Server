const express = require("express");
const cors = require("cors");
const { authToken } = require("./config/auth.js"); // get the authentication working


// Routers
const userRouter = require("./src/routes/userRoutes.js");
const groupRouter = require("./src/routes/groupRoutes.js");
const memberRouter = require("./src/routes/memberRoutes.js");
// const reviewRouter = require("./src/routes/reviewRoutes.js");
const ratingRouter = require("./src/routes/ratingRoutes.js");
const postRouter = require("./src/routes/postRoutes.js");
const groupMoviesRouter = require("./src/routes/groupMoviesRoutes.js");
const favouriteRouter = require("./src/routes/favouriteRoutes.js");
const editProfileRoutes = require("./src/routes/editProfileRoutes");
const reviewAllRouter = require("./src/routes/reviewAllRoutes.js");
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

//authentication should be working
app.get("/protected", authToken, (req, res) => {
  res.json({
    message: "You have access to this protected route!",
    user: req.user,
  });
});

app.use("/users", userRouter);

app.use("/groups", groupRouter, memberRouter);

// app.use("/reviews", reviewRouter);

app.use("/rating", ratingRouter);

app.use("/forum", postRouter);

app.use("/favorites", favouriteRouter);

app.use("/Customgroup", groupMoviesRouter);

app.use("/reviewsAll", reviewAllRouter);

app.use(editProfileRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
