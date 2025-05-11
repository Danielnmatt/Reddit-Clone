import '../../stylesheets/ProfileView.css'
import '../../stylesheets/App.css'
import { useState, useEffect } from 'react';
import { timestamp } from '../../functions';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
axios.defaults.withCredentials = true;
const ProfileView = (props) => {
    const [selectedViewButton, setSelectedViewButton] = useState("posts-button")
    const [selectedListingTitle, setSelectedListingTitle] = useState("Posts I've made");
    const [userRep, setUserRep] = useState(props.allData?.user?.reputation || 0);
    const [reputationText, setReputationText] = useState("");
    const [reputationColor, setReputationColor] = useState("");
    const [userDN, setUserDN] = useState(props.allData?.user?.displayName || "");

    const [allPosts, setAllPosts] = useState([]);
    const [allCommunities, setAllCommunities] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [myComments, setMyComments] = useState([]);
    const [postsAndComments, setPostsAndComments] = useState([]);
    const [commentKeys, setCommentKeys] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setSelectedViewButton("posts-button");
        setSelectedListingTitle("Posts I've made");
        setUserDN(props.allData?.user?.displayName || "");
        setUserRep(props.allData?.user?.reputation);
    }, [props.allData.selectedItem, props.allData?.user?.reputation, props.allData?.user?.displayName])
    
    useEffect(() => {
        

        const doStuff = async () => {
            try{
                if(!userDN){
                    return null;
                }
                const res = await axios.get(`http://127.0.0.1:8000/users/reputation/displayName/${userDN}`); 
                setUserRep(res.data);
    
                const res2 = await axios.get(`http://127.0.0.1:8000/posts/posts/${userDN}`);
                setMyPosts(res2.data);
    
                const res2_5 = await axios.get(`http://127.0.0.1:8000/posts`);
                setAllPosts(res2_5.data);
    
                const res3 = await axios.get(`http://127.0.0.1:8000/communities`);
                setAllCommunities(res3.data);
                setMyCommunities(res3.data.filter(community => community.creator === userDN));
    
                const res4 = await axios.get(`http://127.0.0.1:8000/comments`);
                setAllComments(res4.data);
                setMyComments(res4.data.filter(comment => comment.commentedBy === userDN));
    
                if(userRep < 50){
                    setReputationText("Horrible!");
                    setReputationColor("#e3424a");
                }
                else if(userRep >= 50 && userRep < 75){
                    setReputationText("Mediocre");
                    setReputationColor("#d4e02d");
                }
                else if(userRep >= 75 && userRep <= 100){
                    setReputationText("Good");
                    setReputationColor("#4dd945");
                }
                else if(userRep > 100 && userRep < 130){
                    setReputationText("Great!");
                    setReputationColor("#B9F2FF");
                }
                else if(userRep >= 130){
                    setReputationText("Excellent!");
                    setReputationColor("#D3AF37");
                }
            }
            catch(e){
                handlePossibleBadAuthentication(e);
            }
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

                let tmpPostsAndComments = [];
                let tmpCommentKeys = [];
                myComments.forEach(myComment => {
                    if(postComments.includes(myComment)){
                        if(!commentKeys.includes(myComment.url)){
                            tmpPostsAndComments.push(
                            `"${myComment.content.length <= 20 ? myComment.content : myComment.content.substring(0, 20).trim() + "..."}" on the post: ${post.title}`
                        );
                        tmpCommentKeys.push(myComment.url);
                        }
                    }
                });

                setPostsAndComments(prev => [...prev, ...tmpPostsAndComments]);
                setCommentKeys(prev => [...prev, ...tmpCommentKeys]);
            });
        }
        doStuff();

    }, [props.allData.selectedItem, props.allData?.user?.reputation, props.allData?.user?.displayName, selectedViewButton]);
    
    let happenedAlready = false;
    const handlePossibleBadAuthentication = e => {
        console.error(e);
        if((e.status === 401 || e.status === 403) && !happenedAlready){
            happenedAlready = true;
            alert("Your session is expired or invalidated. You will be redirected.");
            axios.get("http://127.0.0.1:8000/auth/logout").then(() => console.log("logout success")).catch(() => console.log("logout unsuccessful"));
            navigate("/")
        }
    }

    const changeListingView = clickedID => {
        setSelectedViewButton(clickedID);

        if(clickedID === "posts-button"){
            setSelectedListingTitle("Posts I've made");
        }
        else if(clickedID === "communities-button"){
            setSelectedListingTitle("Communities I've created");
        }
        else if(clickedID === "comments-button"){
            setSelectedListingTitle("Comments I've made");
        }
    }

    const handleEditCommunity = (commURL) => {
        const commID = commURL.replace("communities/", "");
        props.allOpeners.openCreateCommunity();
        props.allUpdaters.setSelectedItem('edit-community-button')

        const community = allCommunities.filter(comm => comm.url.replace('communities/', '') === commID)
        console.log(community[0]);
        props.setEditingCommunity(community[0]);
    }

    const handleEditPost = (postURL) => {
        const postID = postURL.replace("posts/", "");
        props.allOpeners.openCreatePost();
        props.allUpdaters.setSelectedItem('edit-post-button')

        const post = allPosts.filter(post => post.url.replace('posts/', '') === postID)
        props.setEditingPost(post[0]);
    }

    const handleEditComment = (commentURL) => {
        const commentID = commentURL.replace("comments/", "");
        props.allOpeners.openCreateComment();
        props.allUpdaters.setSelectedItem('edit-comment-button')

        const comment = allComments.filter(comment => comment.url.replace('comments/', '') === commentID)
        props.setEditingComment(comment[0]);
    }


    if(props.allData.selectedItem !== "profile-button"){
        return null;
    }

    return(
        <>
            <div id="profile-header">
                <div id="top-user-info">
                    <h1 id='user-display-name' className='h1-fixer'>{props.allData.user.displayName}</h1>
                    <h2 className='user-info'>Phreddit user since {timestamp(props.allData?.user?.accountCreationDate)}</h2>
                    <h2 className='user-other-info'>My email: <span className="gray-colored-span">{props.allData.user.email}</span></h2>
                    <h2 className='user-other-info'>My reputation: <span className="gray-colored-span">{userRep}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{backgroundColor: reputationColor, borderRadius: "10px"}}>&nbsp;&nbsp;{reputationText}&nbsp;&nbsp;</span></h2>
                </div>
                <div id="content-buttons-div">
                    <button id="posts-button" className="content-buttons clickables_group5" style={{backgroundColor: selectedViewButton === "posts-button" ? "#FF5700" : "#E5EBEE"}} onClick={() => changeListingView("posts-button")}>View my posts</button>
                    <button id="communities-button" className="content-buttons clickables_group5" style={{backgroundColor: selectedViewButton === "communities-button" ? "#FF5700" : "#E5EBEE"}} onClick={() => changeListingView("communities-button")}>View my communities</button>
                    <button id="comments-button" className="content-buttons clickables_group5" style={{backgroundColor: selectedViewButton === "comments-button" ? "#FF5700" : "#E5EBEE", marginRight: "0%"}} onClick={() => changeListingView("comments-button")}>View my comments</button>
                </div>
            </div>
            <div id="profile-body">
                <h1 id="listing-title">{selectedListingTitle}</h1>
                <ul className="item-listing" style={{display: (selectedViewButton === "posts-button" ? "flex" : "none")}}>
                    {myPosts.map(post => {
                        return (
                            <li key={post.url}>{post.title}&nbsp;&nbsp;<button onClick={() => handleEditPost(post.url)} className="edit-button">Edit this post</button></li>
                        )
                    })}
                    <li key="DEFAULT_POST" style={{display: (myPosts.length > 0 ? 'none' : 'list-item')}}>You have written no posts.</li>
                </ul>
                <ul className="item-listing" style={{display: (selectedViewButton === "communities-button" ? "flex" : "none")}}>
                    {myCommunities.map(community => {
                        return (
                            <li key={community.url}>{community.name}&nbsp;&nbsp;<button onClick={() => handleEditCommunity(community.url)} className="edit-button">Edit this community</button></li>
                        )
                    })}
                    <li key="DEFAULT_COMMUNITY" style={{display: (myCommunities.length > 0 ? 'none' : 'list-item')}}>You have created no communities.</li>
                </ul>
                <ul className="item-listing" style={{display: (selectedViewButton === "comments-button" ? "flex" : "none")}}>
                    {postsAndComments.map((entry, i) => (
                        <div key={commentKeys[i]}>
                            <li>{entry}</li>
                            <button className="edit-button" style={{display: "block", width: "12%"}} onClick={() => handleEditComment(commentKeys[i])}>Edit this comment</button>
                        </div>
                    ))}
                    <li key="DEFAULT_COMMENT" style={{display: (myComments.length > 0 ? 'none' : 'list-item')}}>You have written no comments.</li>
                </ul>
            </div>
        </>
    );
}
export default ProfileView;