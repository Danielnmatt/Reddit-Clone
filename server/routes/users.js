const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

//Get all Users
router.get('/', usersController.getAllUsers);

//Get User by ID
router.get('/:userID', usersController.getUserByID);

//Update a User
router.put('/:userID', usersController.updateUser);

//*After CRUD operations*
//Get User by displayName
router.get('/displayName/:displayName', usersController.getUserByDisplayName);

//Get User by email
router.get('/email/:email', usersController.getUserByEmail);

module.exports = router;