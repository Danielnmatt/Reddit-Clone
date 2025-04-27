// LinkFlair Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkFlairSchema = new Schema({
    content: {
        type: String,
        required: true
    }
})

linkFlairSchema.virtual('url').get(function(){
    return `linkFlairs/${this._id}`;
})

linkFlairSchema.set('toJSON', {virtuals: true});
linkFlairSchema.set('toObject', {virtuals: true});


module.exports = mongoose.model('LinkFlair', linkFlairSchema)