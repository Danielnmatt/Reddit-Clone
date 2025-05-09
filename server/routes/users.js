const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

//Get all Users
router.get('/', usersController.getAllUsers);

//Get User by ID
router.get('/:userID', usersController.getUserByID);

//Update a User
router.put('/:userID', authController.authenticateUser, usersController.updateUser);

//*After CRUD operations*
//Get User by displayName
router.get('/displayName/:displayName', usersController.getUserByDisplayName);

//Get User by email
router.get('/email/:email', usersController.getUserByEmail);

module.exports = router;