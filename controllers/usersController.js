const { fetchUsers } = require("../models/usersModel");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (next) {}
};
