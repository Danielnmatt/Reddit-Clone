const User = require('../models/users');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
require('dotenv').config();

//Get all Users
const getAllUsers = async (req, res) =>{
    try{
        const users = await User.find({});
        res.status(200).send(users);
    } 
    catch(e){
        res.status(500).send({error: "Getting Users failed."});
    }
}

//Get User by ID
const getUserByID = async (req, res) =>{
    try{
        const user = await User.find({_id: req.params.userID});
        if(!user){
            return res.status(404).send({error: "User not found."});
        }
        res.send(user);
    }
    catch(e){
        res.status(500).send({error: "Getting User failed. GETUSERBYID"});
    }
}

//get User's reputation by displayName
const getUserReputationByDisplayName = async (req, res) =>{
    try{
        const user = await User.findOne({displayName: req.params.displayName})
        if(!user){
            return res.status(404).send({error: "User not found."});
        }
        res.send(user.reputation);
    }
    catch(e){
        res.status(500).send({error: "Getting User failed"});
    }
}

//get User's votes by displayName
const getUserVotesByDisplayName = async (req, res) => {
    try{
        const user = await User.findOne({displayName: req.params.displayName})
        if(!user){
            return res.status(404).send({error: "User not found."});
        }
        res.send(user.userVotes);
    }
    catch(e){
        res.status(500).send({error: "Getting User failed"});
    }
}

//Update a User
const updateUser = async (req, res) =>{
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userID, req.body, {new: true});
        if(!updatedUser){
            return res.status(404).send({error: "User not found."});
        }
        res.send(updatedUser);
    }
    catch(e){
        res.status(500).send({error: "Updating User failed."});
    }
}

//Update a User (by display name)
const updateUserByDisplayName = async (req, res) =>{
    try {
        const updatedUser = await User.findOneAndUpdate({displayName: req.params.displayName}, req.body, {new: true})
        if(!updatedUser){
            return res.status(404).send({error: "User not found."});
        }
        res.send(updatedUser); //probably bad security practice to send the entire user back
        //res.status(200).send("Successfully updated user");
    }
    catch(e){
        res.status(500).send({error: "Updating User failed."});
    }
}

//*After CRUD operations*

//Get User by displayName
const getUserByDisplayName = async (req, res) =>{
    try{
        const user = await User.find({
            displayName: { 
                $regex: `^${req.params.displayName}$`, 
                $options: 'i' 
            }
        });
        if(!user){
            return res.status(404).send({error: "User not found (not matching displayName)."});
        }
        res.send(user);
    }
    catch(e){
        res.status(500).send({error: "Getting User failed. DISPLAYNAME"});
    }
}

//Get User by email
const getUserByEmail = async (req, res) =>{
    try{
        const user = await User.find({email: req.params.email});
        if(!user){
            return res.send(null);
            //return res.status(404).send({error: "User not found (no matching email)."});
        }
        res.send(user);
    }
    catch(e){
        res.status(500).send({error: "Getting User failed. EMAIL"});
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userID);
        if(!deletedUser){
            return res.status(404).send({error: "User not found."});
        }
        res.send({message: "User deleted successfully."});
    } 
    catch(e){
        res.status(500).send({error: "Deleting User failed."});
    }
}

const usersController = {getAllUsers, getUserByID, updateUser, getUserByDisplayName, getUserByEmail, updateUserByDisplayName, getUserReputationByDisplayName, getUserVotesByDisplayName, deleteUser};
module.exports = usersController;