import '../../stylesheets/CreateCommentView.css'
import '../../stylesheets/App.css'
import {useState, useEffect} from 'react'
import {hyperLink} from '../../functions';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {countComments} from '../../functions'
axios.defaults.withCredentials = true;

//App.js->phreddit.js->main.jsx->content.jsx->createCommentView.jsx
const CreateCommentView = (props) => {
    const [body, setBody] = useState("");
    const isLoggedIn = props.allData?.user?.displayName !== "guest" && props.allData?.user?.email !== null;
    const navigate = useNavigate();

    const resetInputs = () => {
        setBody("");
    }

    useEffect(() => {
        if(props.allData.selectedItem === 'edit-comment-button' && props.editingComment){
            setBody(props.editingComment.content);
        }
        if(props.allData.selectedItem !== 'edit-comment-button'){
            resetInputs();
        }
    }, [props.allData.selectedItem, props.editingCommunity])

    if(props.visibility === false){
        return null;
    }
    
    let happenedAlready = false;
    const handlePossibleBadAuthentication = e => {
        console.error(e);
        if((e.status === 401 || e.status === 403) && !happenedAlready && isLoggedIn){
            happenedAlready = true;
            alert("Your session is expired or invalidated. You will be redirected.");
            axios.get("http://127.0.0.1:8000/auth/logout").then(() => console.log("logout success")).catch(() => console.log("logout unsuccessful"));
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
            if(props.allData.selectedItem === "edit-comment-button"){
                const updatedComment = {content: body}
                const res0 = await axios.put(`http://127.0.0.1:8000/comments/${props.editingComment.id}`, updatedComment);

                const res1 = await axios.get(`http://127.0.0.1:8000/posts/`);
                const allPosts = res1.data;

                const res2 = await axios.get(`http://127.0.0.1:8000/comments/`);
                const allComments = res2.data;
                
                let postObject;
                allPosts.forEach(post => {
                    let postComments = [];
                    let commentIDs = post.commentIDs;
                    let somethingWasAdded;
                    
                    do {
                        somethingWasAdded = false;
                        for(let c = 0; c < allComments.length; c++){
                            const comment = allComments[c];
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
                    
                    postComments.forEach((comment) => {
                        if(comment.id === res0.data.id){
                            postObject = post
                        }
                    })
                })
                
                if(!postObject){
                    return;
                }//in some cases this is undefined and the following requests shit the bed

                const res3 = await axios.get(`http://127.0.0.1:8000/communities/posts/${postObject.id}`);
                const community = res3.data[0];

                const res4 = await axios.get(`http://127.0.0.1:8000/linkFlairs/${postObject.linkFlairID}`);
                const linkFlair = res4.data[0]
                const openablePost = {...postObject, postID: postObject.id, commentCount: countComments(postObject, 0, allComments), communityText: community.name, linkFlairText: linkFlair.content}
                props.allUpdaters.setSelectedItem(null);
                props.allOpeners.openSelectedPost(openablePost)
            }
            else{
                try{
                    const res1 = await axios.post(`http://127.0.0.1:8000/comments`, newComment);
                    let newCommentObject = res1.data;
                    
                    if(props.comment){//reply comment
                        await axios.put(`http://127.0.0.1:8000/comments/${props.comment.url.replace('comments/', '')}`, {commentIDs: [...props.comment.commentIDs, newCommentObject.url.replace("comments/", "")]})
                        resetInputs();
                        
                        const res2 = await axios.get(`http://127.0.0.1:8000/comments`)
                        props.allUpdaters.updateComments(res2.data);
                        props.allUpdaters.setSelectedItem(null);
                        props.allOpeners.openSelectedPost({...props.post, commentCount: props.post.commentCount + 1});
                    }
                    else{//direct comment
                        const res2 = await axios.put(`http://127.0.0.1:8000/posts/${props.post.postID}`, {commentIDs: [...props.post.commentIDs, newCommentObject.url.replace("comments/", "")]});
                        let updatedPostObject = res2.data;
                        resetInputs();
                        
                        const res3 = await axios.get(`http://127.0.0.1:8000/posts/`);
                        props.allUpdaters.updatePosts(res3.data);
                        
                        const res4 = await axios.get(`http://127.0.0.1:8000/comments`);
                        props.allUpdaters.updateComments(res4.data);
                        props.allUpdaters.setSelectedItem('home-button');
                        props.allOpeners.openSelectedPost({...props.post, commentIDs : updatedPostObject.commentIDs, commentCount: props.post.commentCount + 1});
                    }
                }
                catch(e){
                    handlePossibleBadAuthentication(e);
                }
            }
        }
    }

    const handleDeleteComment = async (e) => {
        e.preventDefault();

        //finding child comments
        const res0 = await axios.get(`http://127.0.0.1:8000/${props.editingComment.url}`);
        const commentToDelete = res0.data[0];
        
        const res0_5 = await axios.get(`http://127.0.0.1:8000/comments`)
        const allComments = res0_5.data;

        if(commentToDelete.commentIDs && commentToDelete.commentIDs.length >= 0){
            let replyChain = [];
            let commentIDs = commentToDelete.commentIDs;
            let somethingWasAdded;
            do {
                somethingWasAdded = false;
                for(let c = 0; c < allComments.length; c++){
                    const comment = allComments[c];
                    const newCommentID = comment.url.replace("comments/", "");
            
                    if((!replyChain.includes(comment)) && (commentIDs.includes(newCommentID))){
                        replyChain.push(comment);
                        somethingWasAdded = true;
                    }
                    else if((!replyChain.includes(comment)) && (replyChain.some(parentComment => parentComment.commentIDs.includes(newCommentID)))){
                        replyChain.push(comment);
                        somethingWasAdded = true;
                    }
                }
            } while (somethingWasAdded);

            //deleting this comment from its parent commentIDs, if it has a parent
            await axios.delete(`http://127.0.0.1:8000/comments/${commentToDelete.url}`);

            //deleting all comments associated with this comment
            for(const comment of replyChain){
                await axios.delete(`http://127.0.0.1:8000/${comment.url}`);
            }
        }
        //deleting main comment
        await axios.delete(`http://127.0.0.1:8000/${commentToDelete.url}`);

        const res1 = await axios.get("http://127.0.0.1:8000/comments");
        props.allUpdaters.updateComments(res1.data);

        const res2 = await axios.get("http://127.0.0.1:8000/posts");
        props.allUpdaters.updatePosts(res2.data);

        resetInputs();
        props.allUpdaters.setSearchTerms("");
        props.allUpdaters.setSelectedSortButton("newest-button");
        props.allUpdaters.setSelectedItem("home-button");
        props.allOpeners.openHomePage();
    }

    return (
        <div id="create-comment-view">
            <h1 id="create-comment-view-title" className='h1-fixer'>{props.allData.selectedItem === "edit-comment-button" ? `Editing '${props.editingComment.content.substring(0, 10).trim() + "..."}'` : "Add a Comment"}</h1>
            <form htmlFor="create-comment-form" id="create-comment-form">
            <div id="create-comment-input-div">
                <div className="create-comment-input-container" id="create-comment-content-container">
                    <label className="comment-label" htmlFor="create-comment-content">Body(required, max 500 characters):&nbsp;<span className="red-stars">*</span></label>
                    <textarea onChange={(e) => {setBody(e.target.value)}} className="create-comment-input-field" type="text" id="create-comment-content" name="create-comment-content" maxLength="500" placeholder="Content..." value={body} required></textarea>
                </div>
                <div style={{display: "flex", flexDirection: 'row'}}>
                    <button className="handle-comment-button" type="submit" onClick={submitComment}>{props.allData.selectedItem === 'edit-comment-button' ? "Confirm Edit" : "Submit Comment"}</button>
                    <button className="handle-comment-button" onClick={(e) => handleDeleteComment(e)} style={{display: props.allData.selectedItem === 'edit-comment-button' ? 'inline' : 'none'}}>Delete Comment</button>
                </div>
            </div>
            </form>
        </div>
    );
};

export default CreateCommentView;