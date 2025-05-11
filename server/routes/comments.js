const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const authController = require('../controllers/authController');

//Get all Comments
router.get('/', commentsController.getAllComments);

//Create a Comment
router.post('/', authController.authenticateUser, commentsController.createComment);

//Get Comment by ID
router.get('/:commentID', commentsController.getCommentByID);

//Update a Comment
router.put('/:commentID', authController.authenticateUser, commentsController.updateComment);

//Delete a Comment
router.delete('/:commentID', authController.authenticateUser, commentsController.deleteComment);

//Get Comments by Post ID
router.get('/posts/:postID', commentsController.getCommentsByPostID);

module.exports = router;