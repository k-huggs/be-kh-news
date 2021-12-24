const db = require("../connection");
const format = require("pg-format");
const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables - topic -> user -> article -> comment
  await db.query(`DROP TABLE IF EXISTS comments`);
  await db.query(`DROP TABLE IF EXISTS articles`);
  await db.query(`DROP TABLE IF EXISTS users`);
  await db.query(`DROP TABLE IF EXISTS topics`);

  await db.query(`CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY, 
    description TEXT NOT NULL);`);

  await db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    avatar_url VARCHAR NOT NULL,
    name VARCHAR NOT NULL);`);

  await db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      body TEXT NOT NULL,
      VOTES INT DEFAULT 0,
      topic VARCHAR(50) REFERENCES topics(slug) ON DELETE CASCADE,
      author VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE,
      created_at DATE DEFAULT CURRENT_TIMESTAMP
    );`);

  await db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE,
      article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
      votes INT DEFAULT 0,
      created_at DATE DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
    );`);

  // 2. insert data
  const formattedTopicData = topicData.map((topic) => {
    return [topic.slug, topic.description];
  });
  const topicQueryStr = format(
    `INSERT INTO topics (slug, description) VALUES %L RETURNING *;`,
    formattedTopicData
  );

  await db.query(topicQueryStr);

  const formattedUserData = userData.map((user) => {
    return [user.username, user.avatar_url, user.name];
  });
  const userQueryStr = format(
    `INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *;`,
    formattedUserData
  );

  await db.query(userQueryStr);

  const formattedArticleData = articleData.map((article) => {
    return [
      article.title,
      article.body,
      article.votes,
      article.topic,
      article.author,
      article.created_at,
    ];
  });

  const articleQueryStr = format(
    `INSERT INTO articles (title, body, votes, topic, author, created_at) VALUES %L RETURNING *;`,
    formattedArticleData
  );

  await db.query(articleQueryStr);

  const formattedCommentData = commentData.map((comment) => {
    return [
      comment.author,
      comment.article_id,
      comment.votes,
      comment.created_at,
      comment.body,
    ];
  });

  const commentQueryStr = format(
    `INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L RETURNING *;`,
    formattedCommentData
  );

  await db.query(commentQueryStr);
};

module.exports = seed;
