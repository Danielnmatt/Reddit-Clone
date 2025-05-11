import '../../stylesheets/SelectedPost.css'
import '../../stylesheets/App.css'
import CommentItem from '../content/commentItem.jsx'
import {timestamp, sortComments} from '../../functions.js'
import {useState, useEffect} from 'react'
import {hyperLink} from '../../functions.js'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
axios.defaults.withCredentials = true;

//App.js->phreddit.js->main.jsx->content.jsx->selectedPost.jsx
const SelectedPost = (props) => {
    const [isHoveringUpvote, setIsHoveringUpvote] = useState(false);
    const [isClickedUpvote, setIsClickedUpvote] = useState(false);
    const [isHoveringDownvote, setIsHoveringDownvote] = useState(false);
    const [isClickedDownvote, setIsClickedDownvote] = useState(false);
    const [numVotes, setNumVotes] = useState(props.post?.votes || 0);//no being on this planet can imagine the rage i felt in debugging this
    const [voteText, setVoteText] = useState("0");
    const [isProcessingVote, setIsProcessingVote] = useState(10);//10 on page load, 0 when voting has started, 4 when it's finished (+1 per each axios call)
    const [posterDN, setPosterDN] = useState("");
    const [userCanVote, setUserCanVote] = useState(false);
    const [userDN, setUserDN] = useState("");
    const [userVotes, setUserVotes] = useState([]);
    
    const navigate = useNavigate();
    let posterRepChange = 0;
    const isLoggedIn = props.allData?.user?.displayName !== "guest" && props.allData?.user?.email !== null;
    
    useEffect(() => {
        setUserCanVote(props.allData.user?.reputation >= 50 || false);
        setUserDN(props.allData?.user?.displayName || "");
        setNumVotes(props.post?.votes || 0);
        setPosterDN(props.post?.postedBy || "");
    }, [props.allData.user?.reputation, props.allData?.user?.displayName, props.post?.votes, props.post?.postedBy]);
    
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
    
    useEffect(() => {
        const getVotes = async () => {
            try{
                if(!userDN || !isLoggedIn){
                    return;
                }
                const res1 = await axios.get(`http://127.0.0.1:8000/users/votes/displayName/${userDN}`);
                setUserVotes(res1.data);
            }
            catch(e){
                handlePossibleBadAuthentication(e);
            }
        }
        getVotes();
    }, [props?.post, props.allData?.user?.displayName])// BANANAS
    
    useEffect(() => {
        const userAlreadyUpvoted = userVotes.some(formattedString => formattedString === `posts/${props.post.postID}+`);
        const userAlreadyDownvoted = userVotes.some(formattedString => formattedString === `posts/${props.post.postID}-`);
        
        if(userAlreadyUpvoted){
            setIsClickedUpvote(true);
            setIsClickedDownvote(false);
            setVoteText("+1");
        }
        else if(userAlreadyDownvoted){
            setIsClickedDownvote(true);
            setIsClickedUpvote(false);
            setVoteText("-1");
        }
        else{
            setIsClickedUpvote(false);
            setIsClickedDownvote(false);
            setVoteText("0");
        }
    }, [props.post, userVotes]);
    
    if(props.visibility === false){
        return null;
    }
    
    const handleBothVotes = (newVotes, plusOrMinus) => {
        setNumVotes(newVotes);
        const updatedPost = {votes: newVotes};
        axios.put(`http://127.0.0.1:8000/posts/${props.post.postID}`, updatedPost).catch(e => handlePossibleBadAuthentication(e)).finally(() => setIsProcessingVote(isProcessingVote + 1));
        
        const addendString = `posts/${props.post.postID}${plusOrMinus}`;
        let preexistingEntryIndex = -1;
        for(let i = 0; i < props.allData.user.userVotes.length; i++){
            const curStr = props.allData.user.userVotes[i].substring(0, props.allData.user.userVotes[i].length - 1);
            if(curStr === addendString.substring(0, addendString.length - 1)){
                preexistingEntryIndex = i;
                break;
            }
        }
        if(plusOrMinus === "*"){
            if(preexistingEntryIndex >= 0){
                props.allData.user.userVotes = props.allData.user.userVotes.splice(0, preexistingEntryIndex).concat(props.allData.user.userVotes.splice(preexistingEntryIndex + 1));
            }
        }
        else{
            preexistingEntryIndex === -1 ? props.allData.user.userVotes.push(addendString) : props.allData.user.userVotes[preexistingEntryIndex] = addendString;
        }
        const updatedUser = {userVotes: props.allData.user.userVotes};
        axios.put(`http://127.0.0.1:8000/users/${props.allData.user.id}`, updatedUser).catch(e => handlePossibleBadAuthentication(e)).finally(() => setIsProcessingVote(isProcessingVote + 1));
        axios.get(`http://127.0.0.1:8000/users/reputation/displayName/${posterDN}`)
        .then(res => {
            const updatedPoster = {reputation: res.data + posterRepChange};
            axios.put(`http://127.0.0.1:8000/users/displayName/${posterDN}`, updatedPoster).catch(e => handlePossibleBadAuthentication(e)).finally(() => setIsProcessingVote(isProcessingVote + 1));
        })
        .catch(e => handlePossibleBadAuthentication(e)).finally(() => setIsProcessingVote(isProcessingVote + 1));
    }

    const handleClickUpvote = () => {
        if(isProcessingVote < 4){
            return;
        }
        setIsProcessingVote(0);
        let newVotes;
        if(isClickedUpvote){
            setIsClickedUpvote(false);
            setVoteText("0");
            newVotes = numVotes - 1;
            handleBothVotes(newVotes, "*");
            posterRepChange = -5;
        }
        else if(isClickedDownvote){
            setIsClickedUpvote(true);
            setVoteText("+1");
            newVotes = numVotes + 2;
            handleBothVotes(newVotes, "+");
            posterRepChange = 15;
        }
        else{
            setIsClickedUpvote(true);
            setVoteText("+1");
            newVotes = numVotes + 1;
            handleBothVotes(newVotes, "+");
            posterRepChange = 5;
        }
        setIsClickedDownvote(false);
    }

    const handleClickDownvote = () => {
        if(isProcessingVote < 4){
            return;
        }
        setIsProcessingVote(0);
        let newVotes;
        if(isClickedDownvote){
            setIsClickedDownvote(false);
            setVoteText("0");
            newVotes = numVotes + 1;
            handleBothVotes(newVotes, "*");
            posterRepChange = 10;
        }
        else if(isClickedUpvote){
            setIsClickedDownvote(true);
            setVoteText("-1");
            newVotes = numVotes - 2;
            handleBothVotes(newVotes, "-");
            posterRepChange = -15;
        }
        else{
            setIsClickedDownvote(true);
            setVoteText("-1");
            newVotes = numVotes - 1;
            handleBothVotes(newVotes, "-");
            posterRepChange = -10;
        }
        setIsClickedUpvote(false);
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
                <p id="post-view-engagement" style={{marginBottom: (isLoggedIn ? "0%" : "1%")}}>Views: {`${props.post.views + 1}`}&nbsp;&nbsp;|&nbsp;&nbsp;Comments: {`${props.post.commentCount}`}&nbsp;&nbsp;|&nbsp;&nbsp;Votes: {numVotes}</p>
                
                <div style={{display: (isLoggedIn ? "block" : "none")}}>
                    <button className="reply-button" id="post-view-add-comment" type="button" onClick={() => props.allOpeners.openCreateComment(null)}>Add a comment</button>
                    <button className="vote-button" disabled={isProcessingVote < 4 || !userCanVote} style={{backgroundColor: (((isClickedUpvote || isHoveringUpvote) && userCanVote) ? "#bcc4c4" : "#e5ebee"), cursor: (userCanVote ? "pointer" : "not-allowed")}} title={userCanVote ? "" : "     Your reputation is too low to vote."} onClick={handleClickUpvote} onMouseOver={() => setIsHoveringUpvote(true)} onMouseOut={() => setIsHoveringUpvote(false)}>
                        <svg rpl="" fill={((isClickedUpvote || isHoveringUpvote) && userCanVote) ? "#d93800" : "currentColor"} height="16" icon-name="upvote-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"></path>
                        </svg>
                    </button>
                    <span style={{color: "#747F84", margin: "0px 4px 0px 4px"}}>{voteText}</span>
                    <button className="vote-button" disabled={isProcessingVote < 4 || !userCanVote} style={{backgroundColor: (((isClickedDownvote || isHoveringDownvote) && userCanVote) ? "#bcc4c4" : "#e5ebee"), cursor: (userCanVote ? "pointer" : "not-allowed")}} title={userCanVote ? "" : "     Your reputation is too low to vote."} onClick={handleClickDownvote} onMouseOver={() => setIsHoveringDownvote(true)} onMouseOut={() => setIsHoveringDownvote(false)}>
                        <svg rpl="" fill={((isClickedDownvote || isHoveringDownvote) && userCanVote) ? "#6a5bff" : "currentColor"} height="16" icon-name="downvote-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"></path>
                        </svg>
                    </button>
                </div>
                
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