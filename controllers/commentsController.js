const { checkArticleId } = require("../models/articlesModel");
const {
  selectCommentsByArticleId,
  postCommentByArticleId,
} = require("../models/commentsModel");

exports.getCommentsByReviewId = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;

    const [comments, check] = await Promise.all([
      selectCommentsByArticleId(articleId),
      checkArticleId(articleId),
    ]);

    res.status(200).send({ comments });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  const username = req.body.username;
  const comment = req.body.comment;
  const articleId = req.params.article_id;

  const [newComment, check] = Promise.all([
    checkArticleId(articleId),
    addCommentByArticleId(username, comment, articleId),
  ]);
  res.status(201).send({ newComment });
};
