const commentsRouter = require("express").Router();
const { deleteCommentByCommentId } = require("../controllers/commentsController")

commentsRouter.delete("/:comment_id", deleteCommentByCommentId)

module.exports = commentsRouter;