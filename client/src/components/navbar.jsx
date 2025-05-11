import '../stylesheets/Navbar.css'
import '../stylesheets/App.css'
import CommunitiesListing from './communitiesListing.jsx';

//App.js->phreddit.js->main.jsx->navbar.jsx
const Navbar = (props) => {
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
    
    return (
        <div id="navbar" className="navbar">
            <nav style={{ height: "100%", width: "100%"}}>
                <button id="home-button" type="button" className="clickables_group2" onClick={handleHomeButton} style={{backgroundColor: (props.allData.selectedItem === "home-button") ? "#FF5700" : "#E5EBEE"}}>Home</button>
                <hr id="home-button-hr"/>
                <CommunitiesListing allData={props.allData} handlers={{handleCreateCommunities, handleOpenCommunity}}/>
            </nav>
        </div>
    );
    
};

export default Navbar;