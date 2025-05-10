import '../../stylesheets/ProfileView.css'
import '../../stylesheets/App.css'
import { useState } from 'react';
import { timestamp } from '../../functions';
const ProfileView = (props) => {
    const [selectedViewButton, setSelectedViewButton] = useState("posts-button")
    const [selectedListingTitle, setSelectedListingTitle] = useState("Posts I've made");
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
    console.log(props.allData.user);
    let userRep = props.allData.user.reputation;
    let reputationText = "";
    let reputationColor = ""

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
            </div>
        </>
    );
}
export default ProfileView;