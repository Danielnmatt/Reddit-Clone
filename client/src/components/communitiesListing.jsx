import '../stylesheets/Navbar.css'
import '../stylesheets/App.css'
import {useState} from 'react';

//App.js->phreddit.js->main.jsx->communitiesListing.jsx

const CommunitiesListing = (props) => {
    const isLoggedIn = props.allData?.user?.displayName !== "guest" && props.allData?.user?.email !== null;
    const [isHoveringCreateCommunity, setIsHoveringCreateCommunity] = useState(false);

    if(!isLoggedIn){
        return(
            <div id="communities">
                <button id="create-communities-button" className="clickables_group4" type="button" disabled={true} style={{backgroundColor: '#CCCCCC', cursor: "not-allowed"}}>
                    Create New Community
                </button>
                <h1 className='community-text h1-fixer'>Communities</h1>
                <ul className="community-list">
                    {props.allData.communities.map((community) => (
                        <li
                            className="community-list-item clickables_group2"
                            key={community.url}
                            onClick={() => props.handlers.handleOpenCommunity(community.url)}
                            style={{backgroundColor: props.allData.selectedItem === (community.url) ? "#FF5700" : "#E5EBEE"}}
                        >
                            {community.name}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }


    const userCommunities = props.allData.communities.filter((community) =>
        community.members.includes(props.allData?.user?.displayName)
    );

    const otherCommunities = props.allData.communities.filter((community) =>
        !community.members.includes(props.allData?.user?.displayName)
    );

    return(
        <div id="communities">
            <button id="create-communities-button" className="clickables_group4" type="button" onClick={props.handlers.handleCreateCommunities} onMouseOver={() => setIsHoveringCreateCommunity(true)} onMouseOut={() => setIsHoveringCreateCommunity(false)} style={{backgroundColor: ((isHoveringCreateCommunity || props.allData.selectedItem === "create-communities-button" || props.allData.selectedItem === "edit-community-button") ? ("#FF5700") : ("#E5EBEE")), cursor: "pointer"}}>
                {props.allData.selectedItem === "edit-community-button" ? "Edit Community" : "Create New Community"}
            </button>
            <h1 className='community-text h1-fixer'>Joined Communities</h1>
            <ul className="community-list">
            <p style={{margin: "0% -1% 0% 0%", display: ((userCommunities.length === 0) ? "flex" : "none")}}>Join some communities!</p>
                {userCommunities.map((community) => (
                    <li
                        className="community-list-item clickables_group2"
                        key={community.url}
                        onClick={() => props.handlers.handleOpenCommunity(community.url)}
                        style={{backgroundColor: props.allData.selectedItem === (community.url) ? "#FF5700" : "#E5EBEE"}}
                    >
                        {community.name}
                    </li>
                ))}
            </ul>
            <hr style={{width: "100%", margin: "3% 0% 3% 0%"}}/>
            <h1 className='community-text h1-fixer'>Other Communities</h1>
            <ul className="community-list">
                {otherCommunities.map((community) => (
                    <li
                        className="community-list-item clickables_group2"
                        key={community.url}
                        onClick={() => props.handlers.handleOpenCommunity(community.url)}
                        style={{backgroundColor: props.allData.selectedItem === (community.url) ? "#FF5700" : "#E5EBEE"}}
                    >
                        {community.name}
                    </li>
                ))}
            </ul>
        </div>
    )

}

export default CommunitiesListing;