// Users Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    reputation: {
        type: Number,
        required: true,
        default: 100
    },
    userVotes: {
        type: [String],
        default: []
    },
    accountCreationDate: {
        type: Date,
        default: Date.now
    },
    //this is an array of strings which is used to remember which posts the user has voted on, so they cant vote again
    //it takes the form ["posts/aaeeebdbcbdbeeeee+", "posts/aaeedddbffcdbeee-"] to indicate that the user has voted on two posts, upvote on the first and downvote on the second. the array grows as the user votes on more posts and it can shrink it the user removes their votes
    role: {
        type: String,
        required: true,
        default: "user"
    }
})

userSchema.virtual('url').get(function(){
    return `users/${this._id}`;
})

userSchema.set('toJSON', {virtuals: true});
userSchema.set('toObject', {virtuals: true});

module.exports = mongoose.model('User', userSchema)