const commentsRouter = require("express").Router();
const {
  deleteCommentByCommentId,
  patchCommentByCommentId,
} = require("../controllers/commentsController");

commentsRouter.delete("/:comment_id", deleteCommentByCommentId);
commentsRouter.patch("/:comment_id", patchCommentByCommentId);

module.exports = commentsRouter;
