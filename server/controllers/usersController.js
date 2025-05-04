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

//Create a User
const createUser = async (req, res) =>{
    try{
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        let userInfo = req.body;
        userInfo.password = passwordHash;
        const newUser = new User(userInfo);
        await newUser.save();
        res.status(201).send(newUser);
    } 
    catch(e){
        res.status(500).send({error: "Creating User failed."});
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

//Delete a User
const deleteUser = async (req, res) =>{
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


//*After CRUD operations*

//Get User by displayName
const getUserByDisplayName = async (req, res) =>{
    try{
        const user = await User.find({"displayName" : { $regex : new RegExp(req.params.displayName, "i")}});
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

//Login
const loginUser = async (req, res) => {
    try{
        const email = req.body.email;
        const plaintextPassword = req.body.password;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).send({error: "Incorrect email or password"});
        }
        
        const isMatch = await bcrypt.compare(plaintextPassword, user.password);
        if(!isMatch){
            return res.status(404).send({error: "Incorrect email or password"});
        }
        
        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET);
        return res.cookie("token", token, {
            httpOnly: true, secure: true, sameSite: "None"}).status(200).json({
                success: true,
                user: {
                    displayName: user.displayName,
                    email: user.email
                }
            })
    }
    catch(e){
        return res.status(400).send({error: "Logging in User failed."});
    }
}

/*

const axios = require('axios');

async function loginAndGetProfile() {
try {
    const loginResponse = await axios.post('https://example.com/login', { login data });
    const setCookieHeader = loginResponse.headers['set-cookie'];

    // Store the cookie (e.g., in a variable or database)
    const cookie = setCookieHeader;

    // Subsequent request
    const profileResponse = await axios.get('https://example.com/profile', {
    headers: {
        Cookie: cookie
    }
    });
    console.log(profileResponse);
} catch (error) {
    console.error(error);
}
}

loginAndGetProfile();


*/

const getProfile = (req, res) => {
    const {token} = req.cookies;
    if(token){
        const verdict = jwt.verify(token, process.env.JWT_SECRET);
        res.json(verdict.userID);
        return;
    }
    else{
        res.json(null);
        return;
    }
}

const guestUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });

    /*
    
    
    res.cookie("token", token, {
            httpOnly: true, secure: true, sameSite: "None"}).status(200).json({
                success: true,
                user: {
                    displayName: user.displayName,
                    email: user.email
                }
            })
    
    */

    return res.status(200).json({success: true, user: {displayName: "guest", email: "null"}});
}

const usersController = {getAllUsers, createUser, getUserByID, updateUser, deleteUser, getUserByDisplayName, getUserByEmail, loginUser, getProfile, guestUser};
module.exports = usersController;