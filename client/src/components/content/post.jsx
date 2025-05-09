import '../../stylesheets/Posts.css'
import '../../stylesheets/App.css'
import {timestamp, hyperLink} from '../../functions.js'
import {useEffect, useState} from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

//App.js->phreddit.js->main.jsx->content.jsx->posts.jsx->post.jsx
const Post = (props) => {
    const [communityText, setCommunityText] = useState("");
    const [linkFlairText, setLinkFlairText] = useState("");
    const localClickHelper = () => { 
        const postWithLinkFlairTextAndCommunityText = {
            ...props.postData,
            linkFlairText: linkFlairText,
            communityText: communityText
        }
        props.allOpeners.openSelectedPost(postWithLinkFlairTextAndCommunityText);
        const {commentCount, postID, ...post} = props.postData;
        const updatedPost = {...post, views: props.postData.views += 1};
        axios.put(`http://127.0.0.1:8000/posts/${props.postData.postID}`, updatedPost)
        .then((res) => {
            axios.get(`http://127.0.0.1:8000/posts/`)
            .then((res) => {
                props.allUpdaters.updatePosts([...res.data]);
                props.allUpdaters.setSelectedItem(null);
            })
            .catch((e) => {
                console.error(e);
            })
        })
        .catch((e) => {
            console.error(e);
        })
    }

    useEffect(() => {
        let result;
        axios.get(`http://127.0.0.1:8000/communities/posts/${props.postData.postID}`)
        .then((res) => {
            result = (res.data[0]).name;
            setCommunityText(result);
            if(props.postData.linkFlairID){
                if(props.postData.linkFlairID !== ''){
                    axios.get(`http://127.0.0.1:8000/linkFlairs/${props.postData.linkFlairID}`)
                    .then((res) => {
                        setLinkFlairText(res.data[0].content);
                    })
                    .catch((e) => {
                        console.error(e);
                    })
                }
            }
        })
        .catch((e) => {
            console.error(e);
        })
    }, [props.allData.selectedItem])

    return(
        <div className="post" onClick={localClickHelper}>
            <div className="post-banner-div">
                <h1 className="post-info h1-fixer">{props.allData.selectedItem ? (props.allData.selectedItem.includes("communities/") ? '' : communityText + ' | ') : communityText + ' | '}{props.postData.postedBy} | {timestamp(props.postData.postedDate)}</h1>
                <h1 className="post-title h1-fixer">{props.postData.title}</h1>
            </div>
            <div className="post-body-div">
                <h2 className="post-link-flair">{linkFlairText}</h2>
                <p className="post-text">{hyperLink(((props.postData.content.substring(0, (props.postData.content.length >= 80 ? 80 : props.postData.content.length))) + (props.postData.content.length > 80 ? '...' : '')), true)}</p>
            </div>
            <div className="post-footer-div">
                <p className="post-footer">Views: {props.postData.views} | Comments: {props.postData.commentCount} | Votes: {props.postData.votes}</p>
            </div>
        </div>
    );
}
export default Post;