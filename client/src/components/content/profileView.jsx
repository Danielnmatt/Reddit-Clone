import '../../stylesheets/ProfileView.css'
import '../../stylesheets/App.css'
import { useState, useEffect } from 'react';
import { timestamp } from '../../functions';
const ProfileView = (props) => {
    const [selectedViewButton, setSelectedViewButton] = useState("posts-button")
    const [selectedListingTitle, setSelectedListingTitle] = useState("Posts I've made");

    useEffect(() => {
        setSelectedViewButton("posts-button");
        setSelectedListingTitle("Posts I've made");
    }, [props.allData.selectedItem]);

    if(props.allData.selectedItem !== "profile-button"){
        return null;
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

    let userRep = props.allData.user.reputation;
    let reputationText = "";
    let reputationColor = "";

    if(userRep < 50){
        reputationText = "Horrible!";
        reputationColor = "#e3424a";
    }
    else if(userRep >= 50 && userRep < 75){
        reputationText = "Mediocre";
        reputationColor = "#d4e02d";
    }
    else if(userRep >= 75 && userRep <= 100){
        reputationText = "Good";
        reputationColor = "#4dd945";
    }
    else if(userRep > 100 && userRep < 130){
        reputationText = "Great!";
        reputationColor = "#B9F2FF";
    }
    else{
        reputationText = "Excellent!";
        reputationColor = "#D3AF37";
    }

    const myPosts = props.allData.posts.filter(post => post.postedBy === props.allData.user.displayName);
    const myCommunities = props.allData.communities.filter(community => community.creator === props.allData.user.displayName);
    const myComments = props.allData.comments.filter(comment => comment.commentedBy === props.allData.user.displayName);
    
    let postsAndComments = [];
    let commentKeys = [];
    props.allData.posts.forEach(post => {
        let postComments = [];
        let commentIDs = post.commentIDs;
        let somethingWasAdded;

        do {
            somethingWasAdded = false;
            for(let c = 0; c < props.allData.comments.length; c++){
                const comment = props.allData.comments[c];
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

        myComments.forEach(myComment => {
            if(postComments.includes(myComment)){
                postsAndComments.push("I commented \"" + (myComment.content.length <= 20 ? myComment.content : myComment.content.substring(0, 20).trim() + "...") + "\" on the post " + post.title);
                commentKeys.push(myComment.url);
            }
        })
    });

    let keyInd = 0;


    return(
        <>
            <div id="profile-header">
                <div id="top-user-info">
                    <h1 id='user-display-name' className='h1-fixer'>{props.allData.user.displayName}</h1>
                    <h2 className='user-info'>Phreddit user since {timestamp(props.allData.user.accountCreationDate)}</h2>
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
                            <li key={post.url}>{post.title}&nbsp;&nbsp;<button className="edit-button">edit this post</button></li>
                        )
                    })}
                </ul>
                <ul className="item-listing" style={{display: (selectedViewButton === "communities-button" ? "flex" : "none")}}>
                    {myCommunities.map(community => {
                        return (
                            <li key={community.url}>{community.name}&nbsp;&nbsp;<button className="edit-button">edit this community</button></li>
                        )
                    })}
                </ul>
                <ul className="item-listing" style={{display: (selectedViewButton === "comments-button" ? "flex" : "none")}}>
                    {postsAndComments.map(entry => {
                        return (
                            <>
                                <li key={commentKeys[keyInd++]}>{entry}</li>
                                <button className="edit-button" style={{display: "block", width: "12%"}}>edit this comment</button>
                            </>
                        )
                    })}
                </ul>
            </div>
        </>
    );
}
export default ProfileView;