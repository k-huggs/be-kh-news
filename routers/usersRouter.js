const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  postUser,
} = require("../controllers/usersController");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);
usersRouter.post("/", postUser);

module.exports = usersRouter;
