const db = require("../db/connection");

exports.checkCommentsId = async (commentId) => {
  const res = await db.query(`SELECT * FROM comments WHERE comment_id = $1`, [
    commentId,
  ]);
  if (res.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment Id Not Found" });
  }
};

exports.selectCommentsByArticleId = async (articleId) => {
  const res = await db.query(`SELECT * FROM comments WHERE article_id = $1`, [
    articleId,
  ]);

  return res.rows;
};

exports.addCommentByArticleId = async (username, comment, articleId) => {
  if (!username || !comment) {
    return await Promise.reject({
      status: 400,
      msg: "Missing Required Field, Body or Username",
    });
  }

  const res = await db.query(
    `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING author, body, article_id;`,
    [username, comment, articleId]
  );
  if (res.rows.length === 0) {
    Promise.reject({ status: 404, msg: "URL Route Has Not Been Found" });
  }
  return res.rows[0];
};

exports.removeCommentByCommentId = async (commentId) => {
  const numberOfDeletions = await await db.query(
    `DELETE FROM comments WHERE comment_id = $1`,
    [commentId]
  );
  if (numberOfDeletions.rowCount === 0) {
    return Promise.reject({ status: 404, msg: "Comment Not Found" });
  }
};

exports.updateCommentByCommentId = async (commentId, inc_votes = 0) => {
  console.log(inc_votes);
  const res = await db.query(
    `
  UPDATE comments 
  SET votes = votes + $1 
  WHERE comment_id = $2 
  RETURNING *`,
    [inc_votes, commentId]
  );
  return res.rows[0];
};
