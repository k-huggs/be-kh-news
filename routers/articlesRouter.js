const articlesRouter = require("express").Router();
const {
  getArticleByArticleId,
  patchArticleVotesByArticleId,
  getArticles,
  deleteArticleByArticleId,
} = require("../controllers/articlesController");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/commentsController");

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(patchArticleVotesByArticleId)
  .delete(deleteArticleByArticleId);

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
