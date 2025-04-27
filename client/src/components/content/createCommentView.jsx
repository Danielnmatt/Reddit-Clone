import '../../stylesheets/CreateCommentView.css'
import '../../stylesheets/App.css'
import {useState} from 'react'
import {hyperLink} from '../../functions';
import axios from 'axios';

//App.js->phreddit.js->main.jsx->content.jsx->createCommentView.jsx
const CreateCommentView = (props) => {
    const [body, setBody] = useState("");
    const [username, setUsername] = useState("");
    if(props.visibility === false){
        return null;
    }

    const resetInputs = () => {
        setBody("");
        setUsername("");
    }

    const submitComment = (e) => {
        e.preventDefault();
        let alertMsg = "";

        if(!body){
            alertMsg += "*Body cannot be blank*\n";
        }
        if(!username){
            alertMsg += "*Username cannot be blank*\n";
        }
        if(alertMsg !== ""){
            alert(alertMsg)
        }

        let hyperlink = hyperLink(body, false);
        let validHyperLink = true;
        if(hyperlink.length > 1){
            validHyperLink = false;
            if(hyperlink[0].props){
                if((hyperlink[0].props.children !== "") && (hyperlink[0].props.href.startsWith("http://") || hyperlink[0].props.href.startsWith("https://"))){
                    validHyperLink = true;
                }
            }
            else{
                if((hyperlink[1].props.children !== "") && (hyperlink[1].props.href.startsWith("http://") || hyperlink[1].props.href.startsWith("https://"))){
                    validHyperLink = true;
                }
            }
        }

        if(alertMsg === "" && validHyperLink){
            const newComment =
            {
                content: `${body}`,
                commentIDs: [],
                commentedBy: `${username}`,
                commentedDate: new Date(),
            }

            axios.post(`http://127.0.0.1:8000/comments`, newComment)
            .then((res) => {
                let newCommentObject = res.data;
                if(!props.comment){ 
                    axios.put(`http://127.0.0.1:8000/posts/${props.post.postID}`, {commentIDs: [...props.post.commentIDs, newCommentObject.url.replace("comments/", "")]})
                    .then((res) => {
                        let updatedPostObject = res.data;
                        resetInputs();
                        //Get all posts and update state
                        axios.get(`http://127.0.0.1:8000/posts/`)
                        .then((res) => {
                            props.allUpdaters.updatePosts(res.data);
                            // Update comments state
                            axios.get(`http://127.0.0.1:8000/comments`)
                            .then((res) => {
                                props.allUpdaters.updateComments(res.data);
                                props.allOpeners.openSelectedPost({...props.post, commentIDs : updatedPostObject.commentIDs, commentCount: props.post.commentCount + 1});
                            })
                            .catch((e) => {
                                console.error(e)
                            })
                        })
                        .catch((e) => {
                            console.error(e)
                        })
                    })
                    .catch((e) => {
                        console.error(e)
                    })
                }
                else{
                    axios.put(`http://127.0.0.1:8000/comments/${props.comment.url.replace('comments/', '')}`, {commentIDs: [...props.comment.commentIDs, newCommentObject.url.replace("comments/", "")]})
                    .then((res) => {
                        resetInputs();
                        axios.get(`http://127.0.0.1:8000/comments`)
                            .then((res) => {
                                props.allUpdaters.updateComments(res.data);
                                props.allOpeners.openSelectedPost({...props.post, commentCount: props.post.commentCount + 1});
                            })
                            .catch((e) => {
                                console.error(e)
                            })
                    })
                    .catch((e) => {
                        console.error(e)
                    })
                }
            })
            .catch((e) => {
                console.error(e)
            })
        }
    }
    
    return (
        <div id="create-comment-view">
            <h1 id="create-comment-view-title" className='h1-fixer'>Add a Comment</h1>
            <form htmlFor="create-comment-form" id="create-comment-form">
            <div id="create-comment-input-div">
                <div className="create-comment-input-container" id="create-comment-content-container">
                    <label className="comment-label" htmlFor="create-comment-content">Body(required, max 500 characters):&nbsp;<span className="red-stars">*</span></label>
                    <textarea onChange={(e) => {setBody(e.target.value)}} className="create-comment-input-field" type="text" id="create-comment-content" name="create-comment-content" maxLength="500" placeholder="Content..." required></textarea>
                </div>
                <div className="create-comment-input-container" id="create-comment-username-container">
                    <label className="comment-label" htmlFor="creator-username">Creator Username (required):&nbsp;<span className="red-stars">*</span></label>
                    <input onChange={(e) => {setUsername(e.target.value)}} className="create-comment-input-field" type="text" id="create-comment-username" name="creator-username" maxLength="25" placeholder="Username..." required></input>
                </div>
                <button id="submit-comment-button" type="submit" onClick={submitComment}>Submit Comment</button>
            </div>
            </form>
        </div>
    );
};

export default CreateCommentView;