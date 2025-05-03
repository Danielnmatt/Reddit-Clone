const LinkFlair = require('../models/linkflairs');

//Get all LinkFlairs
const getAllLinkFlairs = async (req, res) =>{
    try{
        const linkFlairs = await LinkFlair.find({});
        res.status(200).send(linkFlairs);
    } 
    catch(e){
        res.status(500).send({error: "Getting LinkFlairs failed."});
    }
}

//Create a LinkFlair
const createLinkFlair = async (req, res) =>{
    try{
        const newLinkFlair = new LinkFlair(req.body);
        await newLinkFlair.save();
        res.status(201).send(newLinkFlair);
    } 
    catch(e){
        res.status(500).send({error: "Creating LinkFlair failed."});
    }
}

//Get LinkFlair by ID
const getLinkFlairByID = async (req, res) =>{
    try{
        const linkFlair = await LinkFlair.find({_id: req.params.linkFlairID});
        if(!linkFlair){
            return res.status(404).send({error: "LinkFlair not found."});
        }
        res.send(linkFlair);
    }
    catch(e){
        res.status(500).send({error: "Getting LinkFlair failed."});
    }
}

//Update a LinkFlair
const updateLinkFlair = async (req, res) =>{
    try {
        const updatedLinkFlair = await LinkFlair.findByIdAndUpdate(req.params.linkFlairID, req.body, {new: true});
        if(!updatedLinkFlair){
            return res.status(404).send({error: "LinkFlair not found."});
        }
        res.send(updatedLinkFlair);
    }
    catch(e){
        res.status(500).send({error: "Updating LinkFlair failed."});
    }
}

//Delete a LinkFlair
const deleteLinkFlair = async (req, res) =>{
    try {
        const deletedLinkFlair = await Community.findByIdAndDelete(req.params.linkFlairID);
        if(!deletedLinkFlair){
            return res.status(404).send({error: "LinkFlair not found."});
        }
        res.send({message: "LinkFlair deleted successfully."});
    } 
    catch(e){
        res.status(500).send({error: "Deleting LinkFlair failed."});
    }
}

const linkflairsController = {getAllLinkFlairs, createLinkFlair, getLinkFlairByID, updateLinkFlair, deleteLinkFlair};
module.exports = linkflairsController;