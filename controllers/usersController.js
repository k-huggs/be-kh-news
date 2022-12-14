const {
  fetchUsers,
  fetchUserByUsername,
  checkUsernameExists,
  addUser,
} = require('../models/usersModel');

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

exports.postUser = async (req, res, next) => {
  try {
    const { username, name, avatar_url } = req.body;
    const newUser = await addUser(username, name, avatar_url);
    res.status(201).send({ newUser });
  } catch (err) {
    next(err);
  }
};
