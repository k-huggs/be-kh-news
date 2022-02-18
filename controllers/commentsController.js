const { checkArticleId } = require("../models/articlesModel");
const {
  selectCommentsByArticleId,
  addCommentByArticleId, removeCommentByCommentId
} = require("../models/commentsModel");

exports.getCommentsByArticleId = async (req, res, next) => {
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
    const { username } = req.body;
    const { body } = req.body;
    const articleId = req.params.article_id;
    
    const newComment = await 
      addCommentByArticleId(username, body, articleId)
    res.status(201).send({ newComment });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentByCommentId = async (req, res, next) => {
  try {
    
    const commentId = req.params.comment_id
    
    const deletedComment = await removeCommentByCommentId(commentId)
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}
