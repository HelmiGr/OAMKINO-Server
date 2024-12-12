const express = require("express");
const { authToken } = require("../../config/auth");
const favouriteController = require("../controllers/favouritesController");

const favouriteRouter = express.Router();
favouriteRouter.use(authToken);
console.log("favourite router running");

favouriteRouter.post("/add", favouriteController.addMovie);
favouriteRouter.delete("/remove", favouriteController.removeMovie);
favouriteRouter.get("/", favouriteController.getFavourites);

module.exports = favouriteRouter;
