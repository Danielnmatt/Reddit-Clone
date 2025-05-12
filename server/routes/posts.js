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

//Update a Post NOT FOR VIEWS
router.put('/:postID', authController.authenticateUser, postsController.updatePost);

//update a post FOR VIEWS ONLY
router.put('/view/:postID', postsController.updatePost);

//Delete a Post
router.delete('/:postID', authController.authenticateUser, postsController.deletePost);

//Get all posts by Display Name
router.get('/posts/:displayName', authController.authenticateUser, postsController.getPostsByDisplayName);

module.exports = router;