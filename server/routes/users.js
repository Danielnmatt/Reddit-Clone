const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt')

//Get all Users
router.get('/', async (req, res) =>{
    try{
        const users = await User.find({});
        res.status(200).send(users);
    } 
    catch(e){
        res.status(500).send({error: "Getting Users failed."});
    }
});

//Create a User
router.post('/', async (req, res) =>{
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
});

//Attempt to log-in user
router.post('/comparepassword/:userID', async (req, res) => {
    try{
        const plaintextPassword = req.body.password;
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(plaintextPassword, salt);
        const user = await User.find({_id: req.params.userID});

        console.log(plaintextPassword);
        console.log(passwordHash);
        if(user && user.password === passwordHash){
            res.send(true);
            //res.status(200).json({ message: "Success : CORRECT PASSWORD" });
            return;
        }
        res.send(false);
        //res.status(200).json({ message: "Failure : WRONG PASSWORD" });
        return;
    }
    catch(e){
        res.status(500).send({error: "Logging in User failed."});
        return;
    }
})

//Get User by ID
router.get('/:userID', async (req, res) =>{
    try{
        const user = await User.find({_id: req.params.userID});
        if(!user){
            return res.status(404).send({error: "User not found."});
        }
        res.send(user);
    }
    catch(e){
        res.status(500).send({error: "Getting User failed."});
    }
});

//Get User by email
router.get('/email/:email', async (req, res) =>{
    try{
        const user = await User.find({email: req.params.email});
        if(!user){
            return res.send(null);
            //return res.status(404).send({error: "User not found (no matching email)."});
        }
        res.send(user);
    }
    catch(e){
        res.status(500).send({error: "Getting User failed."});
    }
});

//Get User by displayName
router.get('/displayName/:displayName', async (req, res) =>{
    try{
        const user = await User.find({displayName: req.params.displayName});
        if(!user){
            return res.status(404).send({error: "User not found (not matching displayName)."});
        }
        res.send(user);
    }
    catch(e){
        res.status(500).send({error: "Getting User failed."});
    }
});

//Update a User
router.put('/:userID', async (req, res) =>{
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
});

//Delete a User
router.delete('/:userID', async (req, res) =>{
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
});

module.exports = router;