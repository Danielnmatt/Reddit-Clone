const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

//Get all Users
router.get('/', usersController.getAllUsers);

//Get User by ID
router.get('/:userID', usersController.getUserByID);

//get user's reputation ONLY by display name
router.get('/reputation/displayName/:displayName', usersController.getUserReputationByDisplayName);//add proctective middleware here or no?

//get user's votes ONLY by display name
router.get('/votes/displayName/:displayName', /*authController.authenticateUser, */usersController.getUserVotesByDisplayName);

//Update a User
router.put('/:userID', authController.authenticateUser, usersController.updateUser);

//Update a user by display name
router.put('/displayName/:displayName', authController.authenticateUser, usersController.updateUserByDisplayName);

//*After CRUD operations*
//Get User by displayName
router.get('/displayName/:displayName', usersController.getUserByDisplayName);

//Get User by email
router.get('/email/:email', usersController.getUserByEmail);

module.exports = router;