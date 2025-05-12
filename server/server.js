// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;

const Comment = require('./models/comments');
const Community = require('./models/communities');
const LinkFlair = require('./models/linkflairs');
const Post = require('./models/posts');

const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    }
));
app.use(express.json());
app.use(cookieParser());

app.use('/comments', require('./routes/comments'));
app.use('/communities', require('./routes/communities'));
app.use('/linkFlairs', require('./routes/linkflairs'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'))

mongoose.connect("mongodb://127.0.0.1:27017/phreddit")
.then(() => {
    const server = app.listen(PORT, () => {console.log(`Server listening on port ${PORT}...`)});
    app.get("/", async (req, res) => {
        try{
            const comments = await Comment.find({});
            const communities = await Community.find({});
            const linkFlairs = await LinkFlair.find({});
            const posts = await Post.find({});
            res.send({comments, communities, linkFlairs, posts});
        }
        catch(err){
            res.status(500).send({error: "Getting data failed."});
        }
    })

    process.on('SIGINT', async () => {
        await mongoose.disconnect();
        console.log("\nServer closed. Database instance disconnected.");
        server.close(() => {
            process.exit();
        })
    })

})

app.get('/port', (req, res) => {
    res.status(200).send(PORT);
});

module.exports = {app}