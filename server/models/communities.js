// Community Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postIDs: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
    }],
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    members: [{
        type: String,
        required: true
    }],
    creator: {
        type: String,
        required: true
    }
})

communitySchema.virtual('url').get(function(){
    return `communities/${this._id}`;
})

communitySchema.virtual('memberCount').get(function(){
    return this.members.length;
})

communitySchema.set('toJSON', {virtuals: true});
communitySchema.set('toObject', {virtuals: true});

module.exports = mongoose.model('Community', communitySchema)