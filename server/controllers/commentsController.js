const Comment = require('../models/comments');
const Post = require('../models/posts');

//Get all Comments
const getAllComments = async (req, res) =>{
    try{
        const comments = await Comment.find({});
        res.status(200).send(comments);
    } 
    catch(e){
        res.status(500).send({error: "Getting Comments failed."});
    }
}

//Create a Comment
const createComment = async (req, res) =>{
    try{
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).send(newComment);
    } 
    catch(e){
        res.status(500).send({error: "Creating Comment failed."});
    }
}

//Get Comment by ID
const getCommentByID = async (req, res) =>{
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
}

//Update a Comment
const updateComment = async (req, res) =>{
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
}

//Delete a Comment
const deleteComment = async (req, res) =>{
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
}

//Get Comments by Post ID
const getCommentsByPostID = async (req, res) =>{
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
}

const commentController = {getAllComments, createComment, getCommentByID, updateComment, deleteComment, getCommentsByPostID}; 
module.exports = commentController;