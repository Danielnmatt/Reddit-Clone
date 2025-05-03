const express = require('express');
const router = express.Router();
const linkflairsController = require('../controllers/linkflairsController');

//Get all LinkFlairs
router.get('/', linkflairsController.getAllLinkFlairs);

//Create a LinkFlair
router.post('/', linkflairsController.createLinkFlair);

//Get LinkFlair by ID
router.get('/:linkFlairID', linkflairsController.getLinkFlairByID);

//Update a LinkFlair
router.put('/:linkFlairID', linkflairsController.updateLinkFlair);

//Delete a LinkFlair
router.delete('/:linkFlairID', linkflairsController.deleteLinkFlair);

module.exports = router;