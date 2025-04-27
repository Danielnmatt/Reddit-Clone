const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');
const Post = require('../models/posts');

//Get all Comments
router.get('/', async (req, res) =>{
    try{
        const comments = await Comment.find({});
        res.status(200).send(comments);
    } 
    catch(e){
        res.status(500).send({error: "Getting Comments failed."});
    }
});

//Create a Comment
router.post('/', async (req, res) =>{
    try{
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).send(newComment);
    } 
    catch(e){
        res.status(500).send({error: "Creating Comment failed."});
    }
});

//Get Comment by ID
router.get('/:commentID', async (req, res) =>{
    try{
        const comment = await Comment.find({_id: req.params.commentID});
        if(!comment){
            return res.status(404).send({error: "Comment not found."});
        }
        res.send(comment);
    }
    catch(e){
        res.status(500).send({error: "Getting Comment failed."});
    }
});


//Update a Comment
router.put('/:commentID', async (req, res) =>{
    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.params.commentID, req.body, {new: true});
        if(!updatedComment){
            return res.status(404).send({error: "Comment not found."});
        }
        res.send(updatedComment);
    }
    catch(e){
        res.status(500).send({error: "Updating Comment failed."});
    }
});

//Delete a Comment
router.delete('/:commentID', async (req, res) =>{
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentID);
        if(!deletedComment){
            return res.status(404).send({error: "Comment not found."});
        }
        res.send({message: "Comment deleted successfully."});
    } 
    catch(e){
        res.status(500).send({error: "Deleting Comment failed."});
    }
});

//Get Comments by Post ID
router.get('/posts/:postID', async (req, res) =>{
    try{
        const post = await Post.find({_id: req.params.postID});
        const comments = post[0].commentIDs;
        if(!comments){
            return res.status(404).send({error: "Comments associated with post not found."});
        }
        res.send(comments);
    }
    catch(e){
        res.status(500).send({error: "Getting Comment failed."});
    }
});

module.exports = router;