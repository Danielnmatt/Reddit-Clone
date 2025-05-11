import '../../stylesheets/Content.css'
import '../../stylesheets/App.css'
import ContentHeader from './contentHeader.jsx'
import Posts from './posts.jsx'
import SelectedPost from './selectedPost.jsx'
import CreateCommunityView from '../content/createCommunityView.jsx'
import CreatePostView from '../content/createPostView.jsx'
import CreateCommentView from '../content/createCommentView'
import {useState, useEffect} from 'react'
import {timestamp, hyperLink} from '../../functions.js'
import axios from 'axios'
import ProfileView from './profileView.jsx'
axios.defaults.withCredentials = true;

const Content = (props) => {
    const [postsToShow, setPostsToShow] = useState([]);
    const [commentsToShow, setCommentsToShow] = useState([]);
    const [filteredPostArray, setFilteredPostArray] = useState([]);
    const [filteredCommentsArray, setFilteredCommentsArray] = useState([]);
    const [communityHeaderInfo, setCommunityHeaderInfo] = useState(["", "", "", ""]);
    const [editingPost, setEditingPost] = useState(null);
    const [editingCommunity, setEditingCommunity] = useState(null);
    const [editingComment, setEditingComment] = useState(null);

    useEffect(() => {
        const excludedWords = [
            "a", "an", "the", "and", "or", "but", "if", "in",
            "on", "to", "with", "for", "of", "at", "by", "from",
            "up", "down", "about", "into", "over", "after", "before",
            "between", "during", "while", "against", "under",
            "again", "just", "only", "even", "when", "where"
        ];
        const search = props.allData.searchTerms.trim();
        if(search === ""){
            setFilteredPostArray(props.allData.posts);
            setFilteredCommentsArray(props.allData.comments);
            return;
        }
        const parsedInput = search.split(" ").filter(word => (word.length >= 3 && !excludedWords.includes(word.toLowerCase())));
        if(parsedInput.length === 0){
            setFilteredPostArray([]);
            setFilteredCommentsArray([]);
            return;
        }
        for(let i = 0; i < parsedInput.length; i++){
            parsedInput[i] = parsedInput[i].trim().toLowerCase();
        }
        const newFilteredPosts = props.allData.posts.filter(post => {
            const titleMatch = parsedInput.some(word => post.title.toLowerCase().includes(word));
            const contentMatch = parsedInput.some(word => post.content.toLowerCase().includes(word));
            return titleMatch || contentMatch;
        });
        const newFilteredComments = props.allData.comments.filter(comment => 
            parsedInput.some(word => comment.content.toLowerCase().includes(word))
        );

        (props.allData.posts).forEach((post) => {
            if(newFilteredPosts.includes(post)){
                return;
            }

            let commentIDs = post.commentIDs;
			let postComments = [];

			let somethingWasAdded;
			do {
				somethingWasAdded = false;
				for(let c = 0; c < props.allData.comments.length; c++){
					const comment = props.allData.comments[c];
					const newCommentID = comment.url.replace("comments/", "");
					if((!postComments.includes(comment)) && (commentIDs.includes(newCommentID))){
						postComments.push(comment);
						somethingWasAdded = true;
					}
					else if((!postComments.includes(comment)) && (postComments.some(parentComment => parentComment.commentIDs.includes(newCommentID)))){
						postComments.push(comment);
						somethingWasAdded = true;
					}
				}
			} while (somethingWasAdded);
            
            if(postComments.some(comment => newFilteredComments.includes(comment))){
                newFilteredPosts.push(post);
            }
		});

        setFilteredPostArray(newFilteredPosts);
        setFilteredCommentsArray(newFilteredComments);
    }, [props.allData.searchTerms, props.allData.posts, props.allData.comments]);

    useEffect(() => {
        if(props.allData.selectedItem === null){
            setPostsToShow(filteredPostArray);
            setCommentsToShow(filteredCommentsArray);
            setCommunityHeaderInfo([((filteredPostArray.length > 0) ? "Results for: " : "No results found for: ") + ("\"" + props.allData.searchTerms + "\"")]);
        }
        else if(props.allData.selectedItem === "home-button"){
            setPostsToShow(filteredPostArray);
            setCommentsToShow(filteredCommentsArray);
            setCommunityHeaderInfo(["All Posts"]);
        }
        else if(props.allData.selectedItem.includes('communities/')){
            axios.get(`http://127.0.0.1:8000/${props.allData.selectedItem}`)
            .then((res) => {
                const community = res.data[0];
                setCommunityHeaderInfo([
                    community.name, 
                    hyperLink(community.description, false), 
                    "Created " + timestamp(community.startDate) + " by " + community.creator, 
                    community.memberCount + ((community.memberCount > 1 || community.memberCount === 0) ? " members" : " member")
                ]);

                const communityPosts = props.allData.posts.filter(post => community.postIDs.includes(post.url.replace('posts/', '')));//COME BACK TO THIS
                const communityComments = props.allData.comments.filter(comment => 
                    communityPosts.some(post => post.url.replace('posts/', '') === comment.url.replace('comments/', ''))
                );
                setPostsToShow(communityPosts);
                setCommentsToShow(communityComments);
            })
            .catch((e) => {
                console.error(e);
            });
        }
    }, [props.allData.selectedItem, filteredPostArray, filteredCommentsArray, props.allData.communities]);
    
    return (
        <div className="content">
            {/* ContentHeader */}
            <ContentHeader 
                allData={props.allData}
                allUpdaters={props.allUpdaters}
                visibility={props.allPageViews.showHomePage}
                communityHeaderInfo={communityHeaderInfo}
            />
            
            <h1 id="number-post-text" className='h1-fixer' style={{display: (props.allPageViews.showHomePage ? 'flex' : 'none')}}>
                {postsToShow.length === 1 ? postsToShow.length + " post" : postsToShow.length + " posts"}
            </h1>

            {/* Posts */}
            <Posts
                allData={props.allData}
                allUpdaters={props.allUpdaters}
                allOpeners={props.allOpeners}
                visibility={props.allPageViews.showHomePage}
                itemsToShow={{postsToShow, commentsToShow}}
            />

            {/* SelectedPost */}
            <SelectedPost
                allOpeners={props.allOpeners}
                allData={props.allData}
                visibility={props.allPageViews.showSelectedPost}
                post={props.selectedPost}
            />

            {/* CreateCommunityView */}
            <CreateCommunityView 
                allData={props.allData}
                allUpdaters={props.allUpdaters}
                allOpeners={props.allOpeners} 
                visibility={props.allPageViews.showCreateCommunity}
                editingCommunity={editingCommunity}
            />

            {/* CreatePostView */}
            <CreatePostView
                allData={props.allData}
                allUpdaters={props.allUpdaters}
                allOpeners={props.allOpeners}
                visibility={props.allPageViews.showCreatePost}
                editingPost={editingPost}
                defaultValue="Select a Community (required)"
            />

            {/* CreateCommentView */}
            <CreateCommentView 
                allData={props.allData}
                allUpdaters={props.allUpdaters}
                allOpeners={props.allOpeners}
                post={props.selectedPost}
                comment={props.selectedComment}
                visibility={props.allPageViews.showCreateComment} 
                editingComment={editingComment}
            />

            {/* ProfileView */}
            <ProfileView
                allData={props.allData}
                allUpdaters={props.allUpdaters}
                allOpeners={props.allOpeners}
                setEditingPost={setEditingPost}
                setEditingCommunity={setEditingCommunity}
                setEditingComment={setEditingComment}
            />
        </div>
    );
};

export default Content;