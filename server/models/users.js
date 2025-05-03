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
})

userSchema.virtual('url').get(function(){
    return `users/${this._id}`;
})

userSchema.set('toJSON', {virtuals: true});
userSchema.set('toObject', {virtuals: true});

module.exports = mongoose.model('User', userSchema)