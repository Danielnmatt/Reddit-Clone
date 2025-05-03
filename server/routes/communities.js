const express = require('express');
const router = express.Router();
const communitiesController = require('../controllers/communitiesController');

//Get all communities
router.get('/', communitiesController.getAllCommunities);

//Create a community
router.post('/', communitiesController.createCommunity);

//Get community by ID
router.get('/:communityID', communitiesController.getCommunityByID);

//Update a community
router.put('/:communityID', communitiesController.updateCommunity);

//Delete a community
router.delete('/:communityID', communitiesController.deleteCommunity);

//Get community by postID
router.get('/posts/:postID', communitiesController.getCommunityByPostID);

module.exports = router;