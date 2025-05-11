const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController')
const authController = require('../controllers/authController');

//Get all Posts
router.get('/', postsController.getAllPosts);

//Create a Post
router.post('/', authController.authenticateUser, postsController.createPost);

//Get Post by ID
router.get('/:postID', postsController.getPostByID);

//Update a Post
router.put('/:postID', authController.authenticateUser, postsController.updatePost);

//Delete a Post
router.delete('/:postID', postsController.deletePost);

//Get all posts by Display Name
router.get('/posts/:displayName', authController.authenticateUser, postsController.getPostsByDisplayName);

module.exports = router;