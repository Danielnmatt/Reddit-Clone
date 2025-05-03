// Post Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    linkFlairID: {
        type: Schema.Types.ObjectId,
        ref: 'LinkFlair',
    },
    postedBy: {
        type: String,
        required: true
    },
    postedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    commentIDs: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    views: {
        type: Number,
        required: true,
        default: 0
    }
})

postSchema.virtual('url').get(function(){
    return `posts/${this._id}`;
})

postSchema.set('toJSON', {virtuals: true});
postSchema.set('toObject', {virtuals: true});

module.exports = mongoose.model('Post', postSchema)