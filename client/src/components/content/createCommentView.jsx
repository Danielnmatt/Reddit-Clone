import '../../stylesheets/CreateCommentView.css'
import '../../stylesheets/App.css'
import {useState} from 'react'
import {hyperLink} from '../../functions';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

//App.js->phreddit.js->main.jsx->content.jsx->createCommentView.jsx
const CreateCommentView = (props) => {
    const [body, setBody] = useState("");
    const navigate = useNavigate();
    if(props.visibility === false){
        return null;
    }

    const resetInputs = () => {
        setBody("");
    }
    
    let happenedAlready = false;
    const handlePossibleBadAuthentication = e => {
        console.error(e);
        if((e.status === 401 || e.status === 403) && !happenedAlready){
            happenedAlready = true;
            alert("Your session is expired or invalidated. You will be redirected.");
            axios.get("http://127.0.0.1:8000/auth/logout").then(res => console.log("logout success")).catch(e => console.log("logout unsuccessful"));
            navigate("/")
        }
    }

    const submitComment = async (e) => {
        e.preventDefault();
        let alertMsg = "";

        if(!body){
            alertMsg += "*Body cannot be blank*\n";
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
                commentedBy: props.allData.user.displayName,
                commentedDate: new Date(),
            }

            try{
                const res1 = await axios.post(`http://127.0.0.1:8000/comments`, newComment);
                let newCommentObject = res1.data;

                if(props.comment){
                    await axios.put(`http://127.0.0.1:8000/comments/${props.comment.url.replace('comments/', '')}`, {commentIDs: [...props.comment.commentIDs, newCommentObject.url.replace("comments/", "")]})
                    resetInputs();
                    
                    const res2 = await axios.get(`http://127.0.0.1:8000/comments`)
                    props.allUpdaters.updateComments(res2.data);
                    props.allOpeners.openSelectedPost({...props.post, commentCount: props.post.commentCount + 1});
                }

                else{
                    const res2 = await axios.put(`http://127.0.0.1:8000/posts/${props.post.postID}`, {commentIDs: [...props.post.commentIDs, newCommentObject.url.replace("comments/", "")]});
                    let updatedPostObject = res2.data;
                    resetInputs();
                    
                    const res3 = await axios.get(`http://127.0.0.1:8000/posts/`);
                    props.allUpdaters.updatePosts(res3.data);
                    
                    const res4 = await axios.get(`http://127.0.0.1:8000/comments`);
                    props.allUpdaters.updateComments(res4.data);
                    props.allOpeners.openSelectedPost({...props.post, commentIDs : updatedPostObject.commentIDs, commentCount: props.post.commentCount + 1});
                }
            }
            catch(e){
                handlePossibleBadAuthentication(e);
            }
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
                <button id="submit-comment-button" type="submit" onClick={submitComment}>Submit Comment</button>
            </div>
            </form>
        </div>
    );
};

export default CreateCommentView;