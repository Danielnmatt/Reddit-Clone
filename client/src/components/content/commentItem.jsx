import '../../stylesheets/PostView.css'
import '../../stylesheets/SelectedPost.css'
import {timestamp} from '../../functions.js'
import {hyperLink} from '../../functions.js'

//App.js->phreddit.js->main.jsx->content.jsx->selectedPost.jsx->commentItem.jsx
const CommentItem = (props) => {
    return(
        <div className="comment-item" style={{marginLeft: props.marginLeft + '%'}}>
            <p className="comment-info">{`${props.comment.commentedBy}`} | {timestamp(props.comment.commentedDate)}</p>
            <p className="comment-content">{hyperLink(props.comment.content, false)}</p>
            <button className="reply-button" onClick={() => props.allOpeners.openCreateComment(props.comment)}>Reply</button>
        </div>
    )
}

export default CommentItem;