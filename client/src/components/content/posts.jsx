import '../../stylesheets/Posts.css'
import Post from './post.jsx'
import {countComments, sortBy} from '../../functions.js'

//App.js->phreddit.js->main.jsx->content.jsx->posts.jsx
const Posts = (props) => {
    if(props.visibility === false){
        return null;
    }
    let postsInOrder = [];
    switch(props.allData.selectedSortButton){
        case "newest-button":
            postsInOrder = sortBy("newest", props.itemsToShow.postsToShow, props.itemsToShow.commentsToShow);
            break;
        case "oldest-button":
            postsInOrder = sortBy("oldest", props.itemsToShow.postsToShow, props.itemsToShow.commentsToShow);
            break;
        case "active-button":
            postsInOrder = sortBy("active", props.itemsToShow.postsToShow, props.itemsToShow.commentsToShow);
            break;
        default:
            break;
    }
    
    return (
        <div id="posts-div">
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
                    views: post.views
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
};

export default Posts;