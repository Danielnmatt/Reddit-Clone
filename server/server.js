// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

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

// const auth = require('./controllers/authController');
// const protectedRoute = require('./routes/protectedRoute');
// app.use(express.json());
// app.use('/auth', userRouter);
// app.use('/protected', protectedRoute);

app.use('/comments', require('./routes/comments'));
app.use('/communities', require('./routes/communities'));
app.use('/linkFlairs', require('./routes/linkflairs'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'))

mongoose.connect("mongodb://127.0.0.1:27017/phreddit")
.then(() => {
    const server = app.listen(8000, () => {console.log("Server listening on port 8000...")});
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

const db = mongoose.connection;
app.delete("/reset_database", async (req, res) => {
    db.dropDatabase();
})