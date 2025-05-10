import '../../stylesheets/Posts.css'
import Post from './post.jsx'
import {countComments, sortBy} from '../../functions.js'

//App.js->phreddit.js->main.jsx->content.jsx->posts.jsx
const Posts = (props) => {
    if(props.visibility === false){
        return null;
    }

    
    const isLoggedIn = props.allData?.user?.displayName !== "guest" && props.allData?.user?.email !== null;
    let postsInOrder_joinedComms = [];
    let postsInOrder_joinedComms_COMMENTS = [];
    let postsInOrder_otherComms = [];
    let postsInOrder_otherComms_COMMENTS = [];
    let postsInOrder = [];

    if(isLoggedIn && !props.allData.selectedItem?.includes("communities/")){
        const userCommunities = props.allData.communities.filter((community) => community.members.includes(props.allData?.user?.displayName));
        
        props.itemsToShow.postsToShow.forEach((post) => {
            let commentIDs = post.commentIDs;

            if(userCommunities.some(community => community.postIDs.includes(post.url.replace("posts/", "")))){
                postsInOrder_joinedComms.push(post);
                
                let somethingWasAdded;
                do {
                    somethingWasAdded = false;
                    for(let c = 0; c < props.itemsToShow.commentsToShow.length; c++){
                        const comment = props.itemsToShow.commentsToShow[c];
                        const newCommentID = comment.url.replace("comments/", "");
                        if((!postsInOrder_joinedComms_COMMENTS.includes(comment)) && (commentIDs.includes(newCommentID))){
                            postsInOrder_joinedComms_COMMENTS.push(comment);
                            somethingWasAdded = true;
                        }
                        else if((!postsInOrder_joinedComms_COMMENTS.includes(comment)) && (postsInOrder_joinedComms_COMMENTS.some(parentComment => parentComment.commentIDs.includes(newCommentID)))){
                            postsInOrder_joinedComms_COMMENTS.push(comment);
                            somethingWasAdded = true;
                        }
                    }
                } while (somethingWasAdded);
            }
            else{
                postsInOrder_otherComms.push(post);
                
                let somethingWasAdded;
                do {
                    somethingWasAdded = false;
                    for(let c = 0; c < props.itemsToShow.commentsToShow.length; c++){
                        const comment = props.itemsToShow.commentsToShow[c];
                        const newCommentID = comment.url.replace("comments/", "");
                        if((!postsInOrder_otherComms_COMMENTS.includes(comment)) && (commentIDs.includes(newCommentID))){
                            postsInOrder_otherComms_COMMENTS.push(comment);
                            somethingWasAdded = true;
                        }
                        else if((!postsInOrder_otherComms_COMMENTS.includes(comment)) && (postsInOrder_otherComms_COMMENTS.some(parentComment => parentComment.commentIDs.includes(newCommentID)))){
                            postsInOrder_otherComms_COMMENTS.push(comment);
                            somethingWasAdded = true;
                        }
                    }
                } while (somethingWasAdded);
            }
        });


        switch(props.allData.selectedSortButton){
            case "newest-button":
                postsInOrder_joinedComms = sortBy("newest", postsInOrder_joinedComms, null);
                postsInOrder_otherComms = sortBy("newest", postsInOrder_otherComms, null);
                break;
            case "oldest-button":
                postsInOrder_joinedComms = sortBy("oldest", postsInOrder_joinedComms, null);
                postsInOrder_otherComms = sortBy("oldest", postsInOrder_otherComms, null);
                break;
            case "active-button":
                postsInOrder_joinedComms = sortBy("active", postsInOrder_joinedComms, postsInOrder_joinedComms_COMMENTS);
                postsInOrder_otherComms = sortBy("active", postsInOrder_otherComms, postsInOrder_otherComms_COMMENTS);
                break;
            default:
                break;
        }

        return (
            <div className="posts-div">
                <h2 className="post-separator-headers">Posts from joined communities ({postsInOrder_joinedComms.length})</h2>
                <p style={{margin: "1% 0% 0% 0%", display: ((postsInOrder_joinedComms.length === 0) ? "flex" : "none")}}>{userCommunities.length === 0 ? "Join some communities!" : "No posts from joined communities."}</p>
                {postsInOrder_joinedComms.map((post) => {
                    let commentCount = countComments(post, 0, postsInOrder_joinedComms_COMMENTS);
                    
                    const postData = {
                        postID: post.url.replace('posts/', ''),
                        linkFlairID: post.linkFlairID,
                        title: post.title, 
                        content: post.content, 
                        postedBy: post.postedBy,
                        postedDate: post.postedDate, 
                        commentIDs: post.commentIDs,
                        commentCount: commentCount, 
                        views: post.views,
                        votes: post.votes
                    };
                    
                    return(
                        <Post 
                            allOpeners={props.allOpeners} 
                            allData={props.allData}
                            allUpdaters={props.allUpdaters}
                            key={post.url} 
                            postData={postData}
                        />
                        );
                    
                })
                }
                <hr style={{width: "100%", margin: "4% 0% 4% 0%"}}/>
                <h2 className="post-separator-headers" style={{marginTop: "0%"}}>Posts from other communities ({postsInOrder_otherComms.length})</h2>
                {postsInOrder_otherComms.map((post) => {
                    let commentCount = countComments(post, 0, postsInOrder_otherComms_COMMENTS);
                    const postData = {
                        postID: post.url.replace('posts/', ''),
                        linkFlairID: post.linkFlairID,
                        title: post.title, 
                        content: post.content, 
                        postedBy: post.postedBy,
                        postedDate: post.postedDate, 
                        commentIDs: post.commentIDs,
                        commentCount: commentCount, 
                        views: post.views,
                        votes: post.votes
                    };
                    
                    return(
                        <Post 
                            allOpeners={props.allOpeners} 
                            allData={props.allData}
                            allUpdaters={props.allUpdaters}
                            key={post.url} 
                            postData={postData}
                        />
                        );
                    
                })
                }
            </div>
        );
    }
    else{
        switch(props.allData.selectedSortButton){
            case "newest-button":
                postsInOrder = sortBy("newest", props.itemsToShow.postsToShow, null);
                break;
            case "oldest-button":
                postsInOrder = sortBy("oldest", props.itemsToShow.postsToShow, null);
                break;
            case "active-button":
                postsInOrder = sortBy("active", props.itemsToShow.postsToShow, props.itemsToShow.commentsToShow);
                break;
            default:
                break;
        }

        return (
            <div className="posts-div">
                {postsInOrder.map((post) => {
                    let commentCount = countComments(post, 0, props.allData.comments);
                    const postData = {
                        postID: post.url.replace('posts/', ''),
                        linkFlairID: post.linkFlairID,
                        title: post.title, 
                        content: post.content, 
                        postedBy: post.postedBy,
                        postedDate: post.postedDate, 
                        commentIDs: post.commentIDs,
                        commentCount: commentCount, 
                        views: post.views,
                        votes: post.votes
                    };
                    
                    return(
                        <Post 
                            allOpeners={props.allOpeners} 
                            allData={props.allData}
                            allUpdaters={props.allUpdaters}
                            key={post.url} 
                            postData={postData}
                        />
                        );
                    
                })
                }
            </div>
        );
    }
};

export default Posts;