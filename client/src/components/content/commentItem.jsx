import '../../stylesheets/SelectedPost.css'
import {timestamp} from '../../functions.js'
import {hyperLink} from '../../functions.js'
import {useState, useEffect} from 'react'
import axios from 'axios'

//App.js->phreddit.js->main.jsx->content.jsx->selectedPost.jsx->commentItem.jsx
const CommentItem = (props) => {
    const [isHoveringUpvote, setIsHoveringUpvote] = useState(false);
    const [isClickedUpvote, setIsClickedUpvote] = useState(false);
    const [isHoveringDownvote, setIsHoveringDownvote] = useState(false);
    const [isClickedDownvote, setIsClickedDownvote] = useState(false);
    const [numVotes, setNumVotes] = useState(props.comment?.votes || 0);//no being on this planet can imagine the rage i felt in debugging this
    const isLoggedIn = props.allData?.user?.displayName !== "guest" && props.allData?.user?.email !== null;
    
    useEffect(() => {
        setNumVotes(props.comment?.votes || 0);
    }, [props.comment?.votes])

    useEffect(() => {
        const userAlreadyUpvoted = props.allData.user?.userVotes?.some(formattedString => formattedString === `comments/${props.comment?.id}+`);
        const userAlreadyDownvoted = props.allData.user?.userVotes?.some(formattedString => formattedString === `comments/${props.comment?.id}-`);
    
        setIsClickedUpvote(userAlreadyUpvoted);
        setIsClickedDownvote(userAlreadyDownvoted);
    }, [props.comment?.id, props.allData.user?.userVotes]);

    const handleClickUpvote = () => {
        let newVotes;
        if(isClickedUpvote){
            setIsClickedUpvote(false);
            newVotes = numVotes - 1;
        }
        else if(isClickedDownvote){
            setIsClickedUpvote(true);
            newVotes = numVotes + 2;
        }
        else{
            setIsClickedUpvote(true);
            newVotes = numVotes + 1;
        }
        setIsClickedDownvote(false);
        setNumVotes(newVotes);
        const updatedComment = {...props.comment, votes: newVotes};
        axios.put(`http://127.0.0.1:8000/comments/${props.comment.url.replace("comments/", "")}`, updatedComment);
        
        const addendString = `comments/${props.comment.id}+`;
        const preexistingEntryIndex = props.allData.user.userVotes.indexOf(addendString.substring(0, addendString.length - 1));
        preexistingEntryIndex === -1 ? props.allData.user.userVotes.push(addendString) : props.allData.user.userVotes[preexistingEntryIndex] = addendString;
        const updatedUser = {userVotes: props.allData.user.userVotes};
        axios.put(`http://127.0.0.1:8000/users/${props.allData.user.id}`, updatedUser);
    }

    const handleClickDownvote = () => {
        let newVotes;
        if(isClickedDownvote){
            setIsClickedDownvote(false);
            newVotes = numVotes + 1;
        }
        else if(isClickedUpvote){
            setIsClickedDownvote(true);
            newVotes = numVotes - 2;
        }
        else{
            setIsClickedDownvote(true);
            newVotes = numVotes - 1;
        }
        setIsClickedUpvote(false);
        setNumVotes(newVotes);
        const updatedComment = {...props.comment, votes: newVotes};
        axios.put(`http://127.0.0.1:8000/comments/${props.comment.url.replace("comments/", "")}`, updatedComment)

        const addendString = `comments/${props.comment.id}-`;
        const preexistingEntryIndex = props.allData.user.userVotes.indexOf(addendString.substring(0, addendString.length - 1));
        preexistingEntryIndex === -1 ? props.allData.user.userVotes.push(addendString) : props.allData.user.userVotes[preexistingEntryIndex] = addendString;
        const updatedUser = {userVotes: props.allData.user.userVotes};
        axios.put(`http://127.0.0.1:8000/users/${props.allData.user.id}`, updatedUser);
    }

    return(
        <div className="comment-item" style={{marginLeft: props.marginLeft + '%'}}>
            <p className="comment-info">{`${props.comment.commentedBy}`} | {timestamp(props.comment.commentedDate)}<span style={{display: (isLoggedIn ? "none" : "inline"), color: "#747F84"}}> | Votes: {numVotes}</span></p>
            <p className="comment-content">{hyperLink(props.comment.content, false)}</p>

            <div style={{display: (isLoggedIn ? "block" : "none")}}>
                <button className="reply-button" onClick={() => props.allOpeners.openCreateComment(props.comment)}>Reply</button>
                <button className="vote-button" style={{backgroundColor: ((isClickedUpvote || isHoveringUpvote) ? "#bcc4c4" : "#e5ebee")}} onClick={handleClickUpvote} onMouseOver={() => setIsHoveringUpvote(true)} onMouseOut={() => setIsHoveringUpvote(false)}>
                    <svg rpl="" fill={(isClickedUpvote || isHoveringUpvote) ? "#d93800" : "currentColor"} height="16" icon-name="upvote-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"></path>
                    </svg>
                </button>
                <span style={{color: "#747F84", margin: "0px 4px 0px 4px"}}>{numVotes}</span>
                <button className="vote-button" style={{backgroundColor: ((isClickedDownvote || isHoveringDownvote) ? "#bcc4c4" : "#e5ebee")}} onClick={handleClickDownvote} onMouseOver={() => setIsHoveringDownvote(true)} onMouseOut={() => setIsHoveringDownvote(false)}>
                    <svg rpl="" fill={(isClickedDownvote || isHoveringDownvote) ? "#6a5bff" : "currentColor"} height="16" icon-name="downvote-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"></path>
                    </svg>
                </button>
            </div>
            
        </div>
    )
}

export default CommentItem;