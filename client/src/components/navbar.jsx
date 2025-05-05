import '../stylesheets/Navbar.css'
import '../stylesheets/App.css'

//App.js->phreddit.js->main.jsx->navbar.jsx
const Navbar = (props) => {
    const isLoggedIn = props.allData?.user?.displayName !== "guest";
    const handleHomeButton = () => {
        props.allUpdaters.setSearchTerms("");
        props.allUpdaters.updatePosts(props.allData.posts);
        props.allUpdaters.setSelectedSortButton("newest-button");
        props.allOpeners.openHomePage();
        props.allUpdaters.setSelectedItem("home-button");
    }
    
    const handleCreateCommunities = () => {
        props.allOpeners.openCreateCommunity()
        props.allUpdaters.setSelectedItem("create-communities-button");
    }
    
    const handleOpenCommunity = (commURL) => {
        props.allUpdaters.setSearchTerms("");
        props.allUpdaters.setSelectedSortButton("newest-button");
        props.allOpeners.openHomePage();
        props.allUpdaters.setSelectedItem(commURL);
    }

    const userCommunities = props.allData.communities.filter((community) =>
        community.members.includes(props.allData?.user?.displayName)
    );

    const otherCommunities = props.allData.communities.filter((community) =>
        !community.members.includes(props.allData?.user?.displayName)
    );

    const sortedCommunities = userCommunities.concat(otherCommunities);
    
    return (
        <div id="navbar" className="navbar">
            <nav style={{ height: "100%", width: "100%"}}>
                <button id="home-button" type="button" className="clickables_group2" onClick={handleHomeButton} style={{backgroundColor: (props.allData.selectedItem === "home-button") ? "#FF5700" : "#E5EBEE"}}>Home</button>
                <hr id="home-button-hr"/>
                <div id="communities">
                    <h1 id="community-text" className='h1-fixer'>Communities</h1>
                    <button id="create-communities-button" type="button" disabled={!isLoggedIn}style={{backgroundColor: props.allData.selectedItem === "create-communities-button" ? "#FF5700" : "#E5EBEE"}} className="clickables_group2" onClick={handleCreateCommunities}>Create Community</button>
                    <ul id="community-list">
                        {sortedCommunities.map((community) => (
                            <li
                                className="community-list-item clickables_group2"
                                key={community.url}
                                onClick={() => handleOpenCommunity(community.url)}
                                style={{backgroundColor: props.allData.selectedItem === (community.url) ? "#FF5700" : "#E5EBEE"}}
                            >
                                {community.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </div>
    );
    
};

export default Navbar;