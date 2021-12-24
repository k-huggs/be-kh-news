const db = require("../db/connection");

exports.checkTopics = async (topic) => {
  const res = await db.query(`SELECT * FROM topics WHERE slug = $1`, [topic]);
  if (res.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "Topic Not Found",
    });
  }
};

exports.selectTopics = async () => {
  const res = await db.query(`SELECT * FROM topics`);

  return res.rows;
};
