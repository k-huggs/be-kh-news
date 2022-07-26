const db = require("../db/connection");

exports.checkUsernameExists = async (username) => {
  const res = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  if (!res.rows.length) {
    return Promise.reject({ status: 404, msg: "Invalid Username" });
  }
};

exports.fetchUsers = async () => {
  const res = await db.query(`SELECT * FROM users`);
  return res.rows;
};

exports.fetchUserByUsername = async (username) => {
  console.log(username);
  const res = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  return res.rows[0];
};
