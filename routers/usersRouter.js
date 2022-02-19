const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/usersController")

console.log(router)
usersRouter.get("/users", getUsers)


module.exports.usersRouter