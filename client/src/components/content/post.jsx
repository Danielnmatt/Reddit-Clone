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
    const openPost = async() => { 
        const postWithLinkFlairTextAndCommunityText = {
            ...props.postData,
            linkFlairText: linkFlairText,
            communityText: communityText
        }
        props.allOpeners.openSelectedPost(postWithLinkFlairTextAndCommunityText);
        let res1 = await axios.get(`http://127.0.0.1:8000/posts/${props.postData.postID}`)
        const updatedPost = {...res1.data[0], views: res1.data[0].views + 1}
        await axios.put(`http://127.0.0.1:8000/posts/view/${props.postData.postID}`, updatedPost)
        props.allUpdaters.setSelectedItem(null);
    }
    

    useEffect(() => {
        const temp = async () => {
            try{
                const res1 = await axios.get(`http://127.0.0.1:8000/communities/posts/${props.postData.postID}`)
                setCommunityText((res1.data[0])?.name || "");
                const res2 = await axios.get(`http://127.0.0.1:8000/posts/${props.postData.postID}`)
                if(res2.data[0].linkFlairID){
                    const res3 = await axios.get(`http://127.0.0.1:8000/linkFlairs/${res2.data[0].linkFlairID}`)
                    setLinkFlairText(res3.data[0].content)
                }
            }
            catch(e){
                console.error(e);
            }
        }
        temp();
    }, [props.allData.selectedItem])

    return(
        <div className="post" onClick={openPost}>
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