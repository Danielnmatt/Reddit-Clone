import '../stylesheets/Navbar.css'
import '../stylesheets/App.css'

//App.js->phreddit.js->main.jsx->navbar.jsx
const Navbar = (props) => {
    const localClickHelper1 = () => {
        props.allUpdaters.setSearchTerms("");
        props.allUpdaters.updatePosts(props.allData.posts);
        props.allUpdaters.setSelectedSortButton("newest-button");
        props.allOpeners.openHomePage();
        props.allUpdaters.setSelectedItem("home-button");
    }
    
    const localClickHelper2 = () => {
        props.allOpeners.openCreateCommunity()
        props.allUpdaters.setSelectedItem("create-communities-button");
    }
    
    const localClickHelper3plus = (commURL) => {
        props.allUpdaters.setSearchTerms("");
        props.allUpdaters.setSelectedSortButton("newest-button");
        props.allOpeners.openHomePage();
        props.allUpdaters.setSelectedItem(commURL);
    }
    
    return (
        <div id="navbar" className="navbar">
            <nav style={{ height: "100%", width: "100%"}}>
                <button id="home-button" type="button" className="clickables_group2" onClick={localClickHelper1} style={{backgroundColor: (props.allData.selectedItem === "home-button") ? "#FF5700" : "#E5EBEE"}}>Home</button>
                <hr id="home-button-hr"/>
                <div id="communities">
                    <h1 id="community-text" className='h1-fixer'>Communities</h1>
                    <button id="create-communities-button" type="button" style={{backgroundColor: props.allData.selectedItem === "create-communities-button" ? "#FF5700" : "#E5EBEE"}} className="clickables_group2" onClick={localClickHelper2}>Create Community</button>
                    <ul id="community-list">
                        {props.allData.communities.map((community) => (
                            <li 
                                className="community-list-item clickables_group2"
                                key={community.url}
                                onClick={() => localClickHelper3plus(community.url)}
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