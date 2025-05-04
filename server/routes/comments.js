const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

//Get all Comments
router.get('/', commentsController.getAllComments);

//Create a Comment
router.post('/', commentsController.createComment);

//Get Comment by ID
router.get('/:commentID', commentsController.getCommentByID);

//Update a Comment
router.put('/:commentID', commentsController.updateComment);

//Delete a Comment
router.delete('/:commentID', commentsController.deleteComment);

//Get Comments by Post ID
router.get('/posts/:postID', commentsController.getCommentsByPostID);

module.exports = router;