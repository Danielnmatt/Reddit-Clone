const {MongoClient} = require('mongodb');
const {MongoMemoryServer} = require('mongodb-memory-server');

let mongoServer;
let connection;
let db;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    connection = await MongoClient.connect(mongoServer.getUri());
    db = connection.db('testDB');
});

afterAll(async () => {
    await connection.close();
    await mongoServer.stop();
});

test('Deleting a post and all its comments', async() => {
    const posts = db.collection('posts');
    const comments = db.collection('comments');

    const comment1 = {
        _id: 'comment1',
        commentIDs: ['comment2'],
        content: 'Comment 1'
    };
    const comment2 = {
        _id: 'comment2',
        commentIDs: ['comment3'],
        content: 'Reply to 1'
    };
    const comment3 = {
        _id: 'comment3',
        commentIDs: [],
        content: 'Reply to 2'
    };
    await comments.insertMany([comment1, comment2, comment3]);

    const post1 = {
        _id: 'post1',
        title: 'Test Post',
        commentIDs: [comment1],
        content: 'Test content'
    };
    await posts.insertOne(post1);


    const getAllCommentIDs = async (commentID) => {
        const commentIDs = [];
        const comment = await comments.findOne({ _id: commentID});
        
        if(!comment){
            return commentIDs;
        }
        
        commentIDs.push(comment._id);
        
        for(const commentID of comment.commentIDs){
            const reply = await getAllCommentIDs(commentID);
            commentIDs.push(...reply);
        }
        
        return commentIDs;
    }

    const allCommentIDs = await getAllCommentIDs('comment1');
    
    await posts.deleteOne({_id: 'post1'});
    await comments.deleteMany({ _id: {$in: allCommentIDs}});

    const deletedPost = await posts.findOne({_id: 'post1'});
    expect(deletedPost).toBeNull();

    for(const commentID of allCommentIDs){
        const deletedComment = await comments.findOne({_id: commentID});
        expect(deletedComment).toBeNull();
    }
});