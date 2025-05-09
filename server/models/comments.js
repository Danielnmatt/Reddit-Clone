// Comment Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    commentIDs: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    commentedBy: {
        type: String,
        required: true
    },
    commentedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    votes: {
        type: Number,
        required: true,
        default: 0
    }
})

commentSchema.virtual('url').get(function(){
    return `comments/${this._id}`;
})

commentSchema.set('toJSON', {virtuals: true});
commentSchema.set('toObject', {virtuals: true});

module.exports = mongoose.model('Comment', commentSchema)