const articlesRouter = require("express").Router();
const {
  getArticleByArticleId,
  patchArticleVotesByArticleId,
  getArticles,
} = require("../controllers/articlesController");

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(patchArticleVotesByArticleId);

articlesRouter.get("/", getArticles);

module.exports = articlesRouter;
