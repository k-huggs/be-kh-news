const { checkArticleId } = require("../models/articlesModel");
const {
  selectCommentsByArticleId,
  addCommentByArticleId,
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
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  try {
    const username = req.body.username;
    const body = req.body.body;
    const articleId = req.params.article_id;

    const [[newComment], check] = await Promise.all([
      addCommentByArticleId(username, body, articleId),
      checkArticleId(articleId),
    ]);
    console.log(newComment, "<<< controller");
    res.status(201).send({ newComment });
  } catch (err) {
    next(err);
  }
};
