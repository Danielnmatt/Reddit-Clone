import '../stylesheets/Banner.css'
import '../stylesheets/App.css'
import {useNavigate} from 'react-router-dom'
import {useRef, useEffect, useState} from 'react'
import axios from 'axios'
axios.defaults.withCredentials = true;

const Banner = (props) => {
    const isLoggedIn = props.allData?.user?.displayName !== "guest" && props.allData?.user?.email !== null;
    const [isHoveringCreatePost, setIsHoveringCreatePost] = useState(false);
    const [isHoveringProfile, setIsHoveringProfile] = useState(false);
    const [isHoveringLogout, setIsHoveringLogout] = useState(false);

    const searchRef = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(searchRef.current){
            searchRef.current.value = "";
        }
    }, [props.allData.selectedItem]);

    const handleCreatePost = () => {
        props.allOpeners.openCreatePost();
        props.allUpdaters.setSelectedItem("new-post-button");
    }
    
    const handlePhredditLogo = () => {
        if(!isLoggedIn){
            navigate('/');
        }
        else{
            props.allUpdaters.setSearchTerms("");
            props.allOpeners.openHomePage();
            props.allUpdaters.setSelectedItem("home-button");
        }
    }

    const handleProfiles = () => {
        if(isLoggedIn){
            //do something related to profiles
            console.log("Profile button clicked: ", props.allData.user)
            alert(props.allData.user.displayName)
            props.allUpdaters.setSelectedItem("profile-button");
        }
    }

    const handleLogout = () => {
        //props.allUpdaters.setSelectedItem("logout-button");
        axios.get('http://127.0.0.1:8000/auth/logout', {withCredentials: true})
        navigate('/');
    }
    
    const acceptSearchQuery = (e) => {
        if(e.key !== "Enter" || e.target.value.trim() === ""){
            return;
        }
        props.allOpeners.openHomePage();
        props.allUpdaters.setSelectedItem(null);
        props.allUpdaters.setSelectedSortButton("newest-button");
        props.allUpdaters.setSearchTerms(e.target.value.toLowerCase().trim());
    }

    //temptemptemptemp
    const deleteDatabase = () =>{
        axios.delete('http://127.0.0.1:8000/reset_database')
        .then((res) => {
            console.log("Dropped database");
        })
        .catch((e) => {
            console.error(e);
        })
    }

    return (
        <div id="banner" className="banner">
            <div id="top-left">
                <button id="reddit-logo-clickable-button">
                    {/*BANANAS : CHANGE TO HANDLE PHREDDIT THING*/}
                    <img id="reddit-logo" src={require("../images/Reddit_logo2.png")} alt="phreddit logo" onClick={deleteDatabase}/>
                </button>
                <h1 id="title" className='h1-fixer' onClick={handlePhredditLogo}>phreddit</h1>
            </div>
            <search className="search-bar">
                <form id="search-form" onSubmit={(e) => e.preventDefault()}>
                    <input ref={searchRef} type="search" id="search-bar" name="searchbar" placeholder="Search Phreddit..." onKeyDown={acceptSearchQuery}/>
                </form>
            </search>
            <div id="banner-button-container">
                <button id="new-post-button" className="clickables_group4" type="button" onClick={handleCreatePost} disabled={!isLoggedIn} onMouseOver={() => setIsHoveringCreatePost(true)} onMouseOut={() => setIsHoveringCreatePost(false)} style={{backgroundColor: isLoggedIn ? ((isHoveringCreatePost || props.allData.selectedItem === "new-post-button") ? ("#FF5700") : ("#E5EBEE")) : ('#CCCCCC'), cursor: isLoggedIn ? "pointer" : "not-allowed"}}>
                    Create New Post
                </button>
                <button id="profile-button" className="clickables_group4" type="button" onClick={handleProfiles} disabled={!isLoggedIn} onMouseOver={() => setIsHoveringProfile(true)} onMouseOut={() => setIsHoveringProfile(false)} style={{backgroundColor: isLoggedIn ? ((isHoveringProfile || props.allData.selectedItem === "profile-button") ? ("#FF5700") : ("#E5EBEE")) : ('#CCCCCC'), cursor: isLoggedIn ? "pointer" : "not-allowed"}}>
                    {isLoggedIn ? props.allData?.user?.displayName : "Guest"}
                </button>
                <button id="logout-button" className="clickables_group4" type="button" onClick={handleLogout} disabled={!isLoggedIn} onMouseOver={() => setIsHoveringLogout(true)} onMouseOut={() => setIsHoveringLogout(false)} style={{display: isLoggedIn ? "inline-block" : "none", backgroundColor: ((isHoveringLogout) ? ("#FF5700") : ("#E5EBEE"))}}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Banner;