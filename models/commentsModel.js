const db = require("../db/connection");

exports.selectCommentsByArticleId = async (articleId) => {
  const res = await db.query(`SELECT * FROM comments WHERE article_id = $1`, [
    articleId,
  ]);

  return res.rows;
};

exports.addCommentByArticleId = async (username, comment, articleId) => {
  const res = await db.query(
    `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING author, body, article_id;`,
    [username, comment, articleId]
  );

  return res.rows;
};
