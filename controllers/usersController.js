const {
  fetchUsers,
  fetchUserByUsername,
  checkUsernameExists,
} = require("../models/usersModel");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const [user, check] = await Promise.all([
      fetchUserByUsername(username),
      checkUsernameExists(username),
    ]);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
