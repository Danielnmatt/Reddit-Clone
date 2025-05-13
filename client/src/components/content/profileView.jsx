import '../../stylesheets/ProfileView.css'
import '../../stylesheets/App.css'
import { useState, useEffect } from 'react';
import { timestamp } from '../../functions';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
axios.defaults.withCredentials = true;

const ProfileView = (props) => {
    const isAdmin = props.allData?.user?.role === "admin";
    const [adminViewingUser, setAdminViewingUser] = useState(false);
    const [selectedViewButton, setSelectedViewButton] = useState("posts-button")
    const [selectedListingTitle, setSelectedListingTitle] = useState("Posts I've made");
    const [userRep, setUserRep] = useState(props.allData?.user?.reputation || 0);
    const [reputationText, setReputationText] = useState("");
    const [reputationColor, setReputationColor] = useState("");
    const [userDN, setUserDN] = useState(props.allData?.user?.displayName || "");
    const [userEmail, setUserEmail] = useState(props.allData?.user?.email);
    const [accountCreationDate, setAccountCreationDate] = useState(props.allData?.user?.accountCreationDate);

    const [allProfiles, setAllProfiles] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [allCommunities, setAllCommunities] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [myComments, setMyComments] = useState([]);
    const [postsAndComments, setPostsAndComments] = useState([]);
    const [commentKeys, setCommentKeys] = useState([]);

    
    const navigate = useNavigate();

    const isLoggedIn = props.allData?.user?.displayName !== "guest" && props.allData?.user?.email !== null;
    

    useEffect(() => {
        setSelectedViewButton((isAdmin && !adminViewingUser) ? "profiles-button" : "posts-button");
        setSelectedListingTitle((isAdmin && !adminViewingUser) ? "User Profiles" : "Posts I've made");
        setUserDN(props.allData?.user?.displayName || "");
        setUserEmail(props.allData.user?.email)
        setUserRep(props.allData?.user?.reputation);
    }, [props.allData.selectedItem, props.allData?.user?.reputation, props.allData?.user?.displayName])
    
    useEffect(() => {
        const doStuff = async () => {
            try{
                if(!userDN || !isLoggedIn){
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

                if(res.data < 50){
                    setReputationText("Horrible!");
                    setReputationColor("#e3424a");
                }
                else if(res.data >= 50 && res.data < 75){
                    setReputationText("Mediocre");
                    setReputationColor("#d4e02d");
                }
                else if(res.data >= 75 && res.data <= 100){
                    setReputationText("Good");
                    setReputationColor("#4dd945");
                }
                else if(res.data > 100 && res.data < 130){
                    setReputationText("Great!");
                    setReputationColor("#B9F2FF");
                }
                else if(res.data >= 130){
                    setReputationText("Excellent!");
                    setReputationColor("#D3AF37");
                }
            }
            catch(e){
                handlePossibleBadAuthentication(e);
            }

            let allPostsAndComments = [];
            let allCommentKeys = [];

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
                    if(myComments.length === 0){
                        setPostsAndComments([]);
                        setCommentKeys([]);
                    }

                myComments.forEach(myComment => {
                    if(postComments.includes(myComment)){
                        if(!allCommentKeys.includes(myComment.url)){
                            allPostsAndComments.push(
                                `"${myComment.content.length <= 20 ? myComment.content : myComment.content.substring(0, 20).trim() + "..."}" on the post: ${post.title}`
                            );
                            allCommentKeys.push(myComment.url);
                        }
                    }
                });
            });

            if(myComments.length === 0){
                setPostsAndComments([]);
                setCommentKeys([]);
            }
            else{
                setPostsAndComments(allPostsAndComments);
                setCommentKeys(allCommentKeys);
            }

            if(isAdmin){
                try{
                    const res1 = await axios.get(`http://127.0.0.1:8000/users/`);
                    setAllProfiles(res1.data)
                    
                    const res0 = await axios.get(`http://127.0.0.1:8000/users/displayName/${userDN}`)
                    setUserEmail(res0.data[0].email);
                    setAccountCreationDate(res0.data[0].accountCreationDate);
                    //display name, email address, and reputation of a user with a phreddit account
                }
                catch(e){
                    handlePossibleBadAuthentication(e);
                }
            }
        }
        doStuff();

    }, [props.allData.selectedItem, props.allData?.user?.reputation, props.allData?.user?.displayName, selectedViewButton, userDN]);
    
    useEffect(() => {
        const temp = async() => {
            try{
                const res = await axios.get(`http://127.0.0.1:8000/users/role/${props.allData?.user?.id}`)
                if(props.allData.selectedItem === 'profile-button' && res.data === "admin"){
                    setSelectedViewButton('profiles-button');
                    changeListingView("profiles-button")
                    setAdminViewingUser(false);
                }
            }
            catch(e){
                console.error(e)
            }
        }
        temp()
    }, [props.allData.selectedItem])
    let happenedAlready = false;
    const handlePossibleBadAuthentication = e => {
        console.error(e);
        if((e.status === 401 || e.status === 403) && !happenedAlready && isLoggedIn){
            happenedAlready = true;
            alert("Your session is expired or invalidated, or you are trying to do actions not permitted for your role. You will be redirected.");
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
        else if(clickedID === "profiles-button"){
            setSelectedListingTitle("User Profiles");
        }
    }

    const handleEditCommunity = (commURL) => {
        const commID = commURL.replace("communities/", "");
        props.allOpeners.openCreateCommunity();
        props.allUpdaters.setSelectedItem('edit-community-button')

        const community = allCommunities.filter(comm => comm.url.replace('communities/', '') === commID)
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

    const handleSetUser = (profileDN) => {
        setUserDN(profileDN);
        setAdminViewingUser(true);
        setSelectedViewButton("posts-button");
        setSelectedListingTitle("Posts I've Made")
    };

    if(props.allData.selectedItem !== "profile-button"){
        return null;
    }
    
    const handleDeleteProfile = async (profileURL) => {
        let resp = window.confirm("Are you sure you want to delete this user? This involves deleting all communities, posts, and comments associated with the user.");
        if(!resp){
            return;
        }

        const res0 = await axios.get(`http://127.0.0.1:8000/${profileURL}`);
        const userToDelete = res0.data[0];

        const res1 = await axios.get(`http://127.0.0.1:8000/communities`);
        const userCommunities = res1.data.filter(community => community.creator === userToDelete.displayName);

        let res2 = await axios.get("http://127.0.0.1:8000/comments");
        let allComments = res2.data;

        //deleting user's communities
        const deleteCommunities = async () => {
            for(const curCommunity of userCommunities){
                const associatedPostIDs = curCommunity.postIDs;
                const associatedPosts = [];
    
                for(const postID of associatedPostIDs){
                    let res0_5 = await axios.get(`http://127.0.0.1:8000/posts/${postID}`);
                    associatedPosts.push(res0_5.data[0]);
                }
    
                for(const post of associatedPosts){
                    let postComments = [];
                    let commentIDs = post.commentIDs;
                    
                    if(commentIDs && commentIDs.length > 0){
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
                
                        //deleting all comments associated with this post
                        for(const comment of postComments){
                            await axios.delete(`http://127.0.0.1:8000/${comment.url}`);
                        }
                    }
                    //delete post itself
                    await axios.delete(`http://127.0.0.1:8000/${post.url}`);
                }
    
                //deleting community
                await axios.delete(`http://127.0.0.1:8000/${curCommunity.url}`);
            }
        }
        //deleteCommunities();


        const deletePosts = async () => {
            const res1_5 = await axios.get(`http://127.0.0.1:8000/posts/posts/${userToDelete.displayName}`);
            const userPosts = []//res1_5.data;

            res2 = await axios.get("http://127.0.0.1:8000/comments");
            allComments = res2.data;//updating comments

            for(const post of userPosts){
                //getting all comments associated with this post
                let postComments = [];
    
                const commentIDs = post.commentIDs;
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
    
                //deleting all comments associated with this post
                for(const comment of postComments){
                    await axios.delete(`http://127.0.0.1:8000/${comment.url}`);
                }
    
                //delete post itself
                await axios.delete(`http://127.0.0.1:8000/${post.url}`);
            }
        }
        //deletePosts();

        

        const deleteComments = async () => {
            const res2_5 = await axios.get(`http://127.0.0.1:8000/comments/displayName/${userToDelete.displayName}`);
            const userComments = res2_5.data;

            res2 = await axios.get("http://127.0.0.1:8000/comments");
            allComments = res2.data;//updating comments

            for(const commentToDelete of userComments){
                //finding child comments
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
            }
        }
        //deleteComments();

        const deleteUser = async () => {
            await axios.delete(`http://127.0.0.1:8000/${userToDelete.url}`);
        }

        try{
            await deleteCommunities();
            await deletePosts();
            await deleteComments();
            await deleteUser();
        }
        catch(e){
            handlePossibleBadAuthentication(e);
        }

        

        //updates
        const res3 = await axios.get("http://127.0.0.1:8000/comments");
        props.allUpdaters.updateComments(res3.data);
        const res4 = await axios.get("http://127.0.0.1:8000/posts");
        props.allUpdaters.updatePosts(res4.data);
        const res5 = await axios.get("http://127.0.0.1:8000/communities");
        props.allUpdaters.updateCommunities(res5.data)

        props.allUpdaters.setSearchTerms("");
        props.allUpdaters.setSelectedSortButton("newest-button");
        props.allUpdaters.setSelectedItem("home-button");
        props.allOpeners.openHomePage();
    }

    return(
        <>
            <div id="profile-header">
                <div id="top-user-info">
                    <h1 id='user-display-name' className='h1-fixer'>{userDN}</h1>
                    <h2 className='user-info'>Phreddit user since {timestamp(accountCreationDate)}</h2>
                    <h2 className='user-other-info'>My email: <span className="gray-colored-span">{userEmail}</span></h2>
                    <h2 className='user-other-info'>My reputation: <span className="gray-colored-span">{userRep}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{backgroundColor: reputationColor, borderRadius: "10px"}}>&nbsp;&nbsp;{reputationText}&nbsp;&nbsp;</span></h2>
                </div>
                <div id="content-buttons-div">
                    <button id="profiles-button" className="content-buttons clickables_group5" style={{backgroundColor: selectedViewButton === "profiles-button" ? "#FF5700" : "#E5EBEE", display: (isAdmin && !adminViewingUser) ? "flex" : "none"}} onClick={() => changeListingView("profiles-button")}>View Profiles</button>
                    <button id="posts-button" className="content-buttons clickables_group5" style={{backgroundColor: selectedViewButton === "posts-button" ? "#FF5700" : "#E5EBEE"}} onClick={() => changeListingView("posts-button")}>View my posts</button>
                    <button id="communities-button" className="content-buttons clickables_group5" style={{backgroundColor: selectedViewButton === "communities-button" ? "#FF5700" : "#E5EBEE"}} onClick={() => changeListingView("communities-button")}>View my communities</button>
                    <button id="comments-button" className="content-buttons clickables_group5" style={{backgroundColor: selectedViewButton === "comments-button" ? "#FF5700" : "#E5EBEE", marginRight: "0%"}} onClick={() => changeListingView("comments-button")}>View my comments</button>
                </div>
            </div>
            <div id="profile-body">
                <h1 id="listing-title">{selectedListingTitle}</h1>
                <ul className="item-listing" style={{display: (selectedViewButton === "profiles-button" ? "flex" : "none")}}>
                    {allProfiles.map(profile => {
                        if(profile.role === "admin"){
                            return null;
                        }
                        return (
                            <li key={profile.url}>{profile.displayName}, {profile.email}, {profile.reputation}&nbsp;&nbsp;<button onClick={() => handleSetUser(profile.displayName)} className="edit-button">View this profile</button>&nbsp;&nbsp;<button onClick={() => handleDeleteProfile(profile.url)} className="edit-button">Delete this profile</button></li>
                        )
                    })}
                    <li key="DEFAULT_USER" style={{display: (allProfiles.length > 0 ? 'none' : 'list-item')}}>No users</li>
                </ul>
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