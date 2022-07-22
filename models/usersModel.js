const db = require("../db/connection");

exports.fetchUsers = async () => {
  const res = await db.query(`SELECT * FROM users`);
  return res.rows;
};
