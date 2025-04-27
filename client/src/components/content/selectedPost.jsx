import '../../stylesheets/SelectedPost.css'
import '../../stylesheets/App.css'
import CommentItem from '../content/commentItem.jsx'
import {timestamp, sortComments} from '../../functions.js'
import React from 'react'
import {hyperLink} from '../../functions.js'

//App.js->phreddit.js->main.jsx->content.jsx->selectedPost.jsx
const SelectedPost = (props) => {
    if(props.visibility === false){
        return null;
    }
    
    let postCommentObjects = [];
    props.allData.comments.forEach((comment) => {
        if(props.post.commentIDs.includes(comment.url.replace('comments/', ''))){
            postCommentObjects.push(comment);
        }
    })
    postCommentObjects = sortComments(postCommentObjects)
    postCommentObjects = postCommentObjects.reverse();

    const loadCommentReplies = (comment, depth) => {
        let commentReplyObjects = [];
        (props.allData.comments).forEach((curr) => {
            if(comment.commentIDs.includes(curr.url.replace('comments/', ''))){
                commentReplyObjects.push(curr);
            }
        })
        commentReplyObjects = sortComments(commentReplyObjects);
        commentReplyObjects = commentReplyObjects.reverse();
        
        return commentReplyObjects.map((reply) => {
            const shift = 2 * (depth + 2);
            return (
                <div key={reply.url}>
                    <CommentItem 
                        post={props.post}
                        comment={reply}
                        allOpeners={props.allOpeners}
                        allData={props.allData}
                        marginLeft={shift}
                    />
                    {loadCommentReplies(reply, depth + 2)}
                </div>
            );
        });
    }

    return (
        <div id="selected-post">
            <div id="post-view-header">
                <p id="post-view-info">{`${props.post.communityText}`}&nbsp;&nbsp;|&nbsp;&nbsp;{`${timestamp(props.post.postedDate)}`}</p>
                <p id="post-view-poster">{`Posted by: ${props.post.postedBy}`}</p>
                <h1 id="post-view-title" className='h1-fixer'>{`${props.post.title}`}</h1>
                <p id="post-view-lf">{`${props.post.linkFlairText ? props.post.linkFlairText : ''}`}</p>
                <p id="post-view-content">{hyperLink(props.post.content, false)}</p>
                <p id="post-view-engagement">Views: {`${props.post.views + 1}`}&nbsp;&nbsp;|&nbsp;&nbsp;Comments: {`${props.post.commentCount}`}</p>
                <button className="reply-button" id="post-view-add-comment" type="button" onClick={() => props.allOpeners.openCreateComment(null)}>Add a comment</button>
            </div>
            <div id="comments">
                {postCommentObjects.map((comment) => {
                    return(
                        <div key={comment.url}>
                            <CommentItem 
                                post={props.post}
                                comment={comment}
                                key={comment.url}
                                allOpeners={props.allOpeners}
                                allData={props.allData}
                                marginLeft={0}
                            />
                            {loadCommentReplies(comment, 0)}
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
};

export default SelectedPost;