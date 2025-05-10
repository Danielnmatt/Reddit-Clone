import '../../stylesheets/Content.css'
import '../../stylesheets/App.css'
import {useEffect, useState} from 'react'
import axios from 'axios'
axios.defaults.withCredentials = true;

//App.js->phreddit.js->main.jsx->content.jsx->contentHeader.jsx
const ContentHeader = (props) => {
    const [displayValue, setDisplayValue] = useState("none")
    const [joinOrLeave, setJoinOrLeave] = useState("");
    const [community, setCommunity] = useState(null);
    const [isProcessingCommunityAction, setIsProcessingCommunityAction] = useState(10);//10 by defualt (on page load), 0 when action is being processed, 1 when all done

    useEffect(() => {
        setCommunity(props.allData?.selectedItem?.replace("communities/", "") || null);
        setDisplayValue(props.allData?.selectedItem?.includes('communities/') && isLoggedIn ? "flex" : "none");
    }, [props.allData?.selectedItem]);

    // useEffect(() => {
    //     if(!props.allData.selectedItem){
    //         return;
    //     }
    //     setDisplayValue(props.allData.selectedItem.includes('communities/') && isLoggedIn ? "flex" : "none")
    // }, [props.allData.selectedItem, joinOrLeave]);
    
    useEffect(() => {
        if(!props.allData.selectedItem){
            return;
        }
        if(props.allData.selectedItem.includes('communities/')){
            axios.get(`http://127.0.0.1:8000/communities/${props.allData.selectedItem.replace('communities/', '')}`)
            .then((res) => {
                setCommunity(res.data[0]);
                if(res.data[0].members.includes(props.allData.user.displayName)){
                    setJoinOrLeave("Leave");
                }
                else{
                    setJoinOrLeave("Join");
                }
            })
        }
    }, [props.allData.selectedItem]);
    
    if(props.visibility === false){
        return null;
    }

    const isLoggedIn = props.allData?.user?.displayName !== "guest" && props.allData?.user?.email !== null;

    const selectedSortingOption = (buttID) => () => {
        props.allUpdaters.setSelectedSortButton(buttID);
    }

    const handleCommunityAction = () => {
        if(isProcessingCommunityAction < 1){
            return;
        }
        setIsProcessingCommunityAction(0);
        if(joinOrLeave === "Join"){
            const updatedCommunity = {members: Array.from(new Set([...community.members, props.allData.user.displayName]))};
            axios.put(`http://127.0.0.1:8000/communities/${props.allData.selectedItem.replace('communities/', '')}`, {updatedCommunity})
            .then(() => {
                setJoinOrLeave("Leave");
                axios.get(`http://127.0.0.1:8000/communities/`)
                .then((res) => {
                    props.allUpdaters.updateCommunities(res.data);
                })
            })
            .finally(() => setIsProcessingCommunityAction(prev => prev + 1))
        }
        else{
            const updatedCommunity = {members: community.members.filter((member) => member !== props.allData.user.displayName)}
            axios.put(`http://127.0.0.1:8000/communities/${props.allData.selectedItem.replace('communities/', '')}`, {updatedCommunity})
            .then(() => {
                setJoinOrLeave("Join");
                axios.get(`http://127.0.0.1:8000/communities/`)
                .then((res) => {
                    props.allUpdaters.updateCommunities(res.data);
                })
            })
            .finally(() => setIsProcessingCommunityAction(prev => prev + 1))
        }
    }

    return (
        <div id="content-header">
            <div id="selected-community-info">
                <h1 id="all-posts-text" className='h1-fixer'>{props.communityHeaderInfo[0]}</h1>
                <h1 id="selected-community-description" className='h1-fixer'>{props.communityHeaderInfo[1]}</h1>
                <h1 id="selected-community-age" className='h1-fixer'>{props.communityHeaderInfo[2]}</h1>
                <h1 id="selected-community-member-count" className='h1-fixer'>{props.communityHeaderInfo[3]}</h1>
                <button id="community-action-button" className="content-buttons clickables_group1" disabled={isProcessingCommunityAction < 1} style={{display: displayValue}} onClick={handleCommunityAction}>{joinOrLeave} community</button>
            </div>
            <div id="content-buttons-div">
                <button className="content-buttons clickables_group1" type="button" id="newest-button" onClick={selectedSortingOption("newest-button")} style={{backgroundColor: props.allData.selectedSortButton === "newest-button" ? "#FF5700" : "#E5EBEE"}}>Newest</button>
                <button className="content-buttons clickables_group1" type="button" id="oldest-button" onClick={selectedSortingOption("oldest-button")} style={{backgroundColor: props.allData.selectedSortButton === "oldest-button" ? "#FF5700" : "#E5EBEE"}}>Oldest</button>
                <button className="content-buttons clickables_group1" type="button" id="active-button" onClick={selectedSortingOption("active-button")} style={{backgroundColor: props.allData.selectedSortButton === "active-button" ? "#FF5700" : "#E5EBEE"}}>Active</button>
            </div>
        </div>
    );
};
export default ContentHeader;