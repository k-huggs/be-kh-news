const {
  selectArticleByArticleId,
  checkArticleId,
  updateVotesByArticleId,
  selectArticles,
} = require("../models/articlesModel");

const { checkTopics } = require("../models/topicsModel");

exports.getArticleByArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;

    const [check, [article]] = await Promise.all([
      checkArticleId(articleId),
      selectArticleByArticleId(articleId),
    ]);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleVotesByArticleId = async (req, res, next) => {
  try {
    const votes = req.body.inc_votes;
    const articleId = req.params.article_id;
    const [check, [article]] = await Promise.all([
      checkArticleId(articleId),
      updateVotesByArticleId(votes, articleId),
    ]);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const sort = req.query.sort;
    const order = req.query.order;
    const topic = req.query.topic;

    const [check, articles] = await Promise.all([
      checkTopics,
      selectArticles(sort, order, topic),
    ]);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};
