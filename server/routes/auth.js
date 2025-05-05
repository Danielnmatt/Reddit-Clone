const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//Register User
router.post('/register', authController.registerUser);

//Login User
router.post('/login', authController.loginUser);

//Logout User
router.get('/logout', authController.logoutUser);

//Get User Profile
router.get('/profile', authController.getUserProfile);

//Guest User
router.get('/guest', authController.guestUser);
module.exports = router;