const express = require("express");
const cors = require("cors");
const { authToken } = require("./config/auth.js"); // get the authentication working

// Routers
const userRouter = require("./src/routes/userRoutes.js");
const groupRouter = require("./src/routes/groupRoutes.js"); 
const reviewRouter = require("./src/routes/reviewRoutes.js");
const ratingRouter = require("./src/routes/ratingRoutes.js");
const postRouter = require("./src/routes/postRoutes.js");

const app = express();
const port = process.env.PORT || 3000;

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

app.use("/groups", groupRouter); 

app.use("/reviews", reviewRouter);

app.use("/rating", ratingRouter);

app.use("/forum", postRouter);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});