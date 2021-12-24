const db = require("../db/connection");
const format = require("pg-format");

exports.checkArticleId = async (articleId) => {
  const res = await db.query(`SELECT * FROM articles WHERE article_id = $1`, [
    articleId,
  ]);
  if (res.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "Article Id Not Found",
    });
  }
};

exports.selectArticleByArticleId = async (articleId) => {
  const res = await db.query(
    `SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
    [articleId]
  );
  return res.rows;
};

exports.updateVotesByArticleId = async (votes = 0, articleId) => {
  const res = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
    [votes, articleId]
  );
  return res.rows;
};

exports.selectArticles = async (sort = "created_at", order = "DESC", topic) => {
  if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid Order Query" });
  }

  if (
    ![
      "title",
      "topic",
      "author",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort.toLowerCase())
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Query" });
  }

  let queryStr = `SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    queryStr += ` WHERE topic = %L`;
  }

  if (order) {
    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort} ${order};`;
  }

  const res = await db.query(format(queryStr, topic));
  console.log(res.rows);
  return res.rows;
};
