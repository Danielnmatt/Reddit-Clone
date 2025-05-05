const Community = require('../models/communities');

//Get all communities
const getAllCommunities = async (req, res) =>{
    try{
        const communities = await Community.find({});
        res.status(200).send(communities);
    } 
    catch(e){
        res.status(500).send({error: "Getting communities failed."});
    }
}

//Create a community
const createCommunity = async (req, res) =>{
    try{
        const newCommunity = new Community(req.body);
        await newCommunity.save();
        res.status(201).send(newCommunity);
    } 
    catch(e){
        res.status(500).send({error: "Creating community failed."});
    }
}

//Get community by ID
const getCommunityByID = async (req, res) =>{
    try{
        const community = await Community.find({_id: req.params.communityID});
        if(!community){
            return res.status(404).send({error: "Community not found."});
        }
        res.send(community);
    }
    catch(e){
        res.status(500).send({error: "Getting community failed."});
    }
}

//Update a community
const updateCommunity = async (req, res) =>{
    try {
        const updatedCommunity = await Community.findByIdAndUpdate(req.params.communityID, req.body.updatedCommunity, {new: true});
        if(!updatedCommunity){
            return res.status(404).send({error: "Community not found."});
        }
        res.send(updatedCommunity);
    }
    catch(e){
        res.status(500).send({error: "Updating community failed."});
    }
}

//Delete a community
const deleteCommunity = async (req, res) =>{
    try {
        const deletedCommunity = await Community.findByIdAndDelete(req.params.communityID);
        if(!deletedCommunity){
            return res.status(404).send({error: "Community not found."});
        }
        res.send({message: "Community deleted successfully."});
    } 
    catch(e){
        res.status(500).send({error: "Deleting community failed."});
    }
}

//Get community by postID
const getCommunityByPostID = async (req, res) => {
    try {
        const community = await Community.find({postIDs: req.params.postID});
        if (!community) {
            return res.status(404).send({error: "Community not found."});
        }
        res.send(community);
    } catch (e) {
        res.status(500).send({error: "Getting community by postID failed."});
    }
}

const communitiesController = {getAllCommunities, createCommunity, getCommunityByID, updateCommunity, deleteCommunity, getCommunityByPostID};
module.exports = communitiesController;