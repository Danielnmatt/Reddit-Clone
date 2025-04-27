const express = require('express');
const router = express.Router();
const Post = require('../models/posts');

//Get all Posts
router.get('/', async (req, res) =>{
    try{
        const posts = await Post.find({});
        res.status(200).send(posts);
    } 
    catch(e){
        res.status(500).send({error: "Getting Posts failed."});
    }
});

//Create a Post
router.post('/', async (req, res) =>{
    try{
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).send(newPost);
    } 
    catch(e){
        res.status(500).send({error: "Creating Post failed."});
    }
});

//Get Post by ID
router.get('/:postID', async (req, res) =>{
    try{
        const post = await Post.find({_id: req.params.postID});
        if(!post){
            return res.status(404).send({error: "Post not found."});
        }
        res.send(post);
    }
    catch(e){
        res.status(500).send({error: "Getting Post failed."});
    }
});

//Update a Post
router.put('/:postID', async (req, res) =>{
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postID, req.body, {new: true});
        if(!updatedPost){
            return res.status(404).send({error: "Post not found."});
        }
        res.send(updatedPost);
    }
    catch(e){
        res.status(500).send({error: "Updating Post failed."});
    }
});

//Delete a Post
router.delete('/:postID', async (req, res) =>{
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postID);
        if(!deletedPost){
            return res.status(404).send({error: "Post not found."});
        }
        res.send({message: "Post deleted successfully."});
    } 
    catch(e){
        res.status(500).send({error: "Deleting Post failed."});
    }
});

module.exports = router;