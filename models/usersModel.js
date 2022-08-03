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
  const res = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  return res.rows[0];
};

exports.addUser = async (username, name, avatar_url) => {
  if (!username || !name || !avatar_url) {
    return Promise.reject({
      status: 400,
      msg: "Missing / Invalid Field Submitted",
    });
  }
  const res = await db.query(
    `INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *`,
    [username, name, avatar_url]
  );
  return res.rows[0];
};
