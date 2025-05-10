const User = require('../models/users');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
require('dotenv').config();

//Register User
const registerUser = async (req, res) => {
    const {token} = req.cookies;
    if(token){
        const verdict = jwt.verify(token, process.env.JWT_SECRET);
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: '/'
        });
    }
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
            res.status(500).send({error: "Register User failed."});
        }
}

//Login User
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
                    email: user.email,
                    id: user._id,
                    userVotes: user.userVotes,
                    reputation: user.reputation
                }
            })
    }
    catch(e){
        return res.status(400).send({error: "Logging in User failed."});
    }
}

//Logout User
const logoutUser = async (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: '/'
        });
        return res.status(200).json({success: true});
    }
    catch(e){
        return res.status(500).send({error: "Logging out User failed."});
    }
}

//Get User Profile
const getUserProfile = (req, res) => {
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

//Guest User
const guestUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: '/'
    });
    return res.status(200).json({success: true, user: {displayName: "guest", email: "null"}});
}

//authenticating logged user before important action
const authenticateUser = (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({ error: 'Not authenticated' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.userID;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};


const authController = {registerUser, loginUser, logoutUser, getUserProfile, guestUser, authenticateUser};
module.exports = authController;