const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController')

//Get all Posts
router.get('/', postsController.getAllPosts);

//Create a Post
router.post('/', postsController.createPost);

//Get Post by ID
router.get('/:postID', postsController.getPostByID);

//Update a Post
router.put('/:postID', postsController.updatePost);

//Delete a Post
router.delete('/:postID', postsController.createPost);

module.exports = router;