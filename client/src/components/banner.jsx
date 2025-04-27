import '../stylesheets/Banner.css'
import '../stylesheets/App.css'
import {useNavigate} from 'react-router-dom'
import {useRef, useEffect} from 'react'
import axios from 'axios'

const Banner = (props) => {
    const searchRef = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(searchRef.current){
            searchRef.current.value = "";
        }
    }, [props.allData.selectedItem]);

    const localClickHelper = () => {
        props.allOpeners.openCreatePost();
        props.allUpdaters.setSelectedItem("new-post-button");
    }
    
    const localClickHelper2 = () => {
        if(props.allData.userID === null){
            navigate('/')
        }
        else{
            props.allUpdaters.setSearchTerms("");
            props.allOpeners.openHomePage();
            props.allUpdaters.setSelectedItem("home-button");
        }
    }

    const handleProfiles = () => {
        if(props.allData.userID !== null){
            //do something related to profiles
            props.allUpdaters.setSelectedItem("profile-button");
        }
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
        .catch((e) =>{
            console.error(e);
        })
    }

    return (
        <div id="banner" className="banner">
            <div id="top-left">
                <button id="reddit-logo-clickable-button">
                    <img id="reddit-logo" src={require("../images/Reddit_logo2.png")} alt="phreddit logo" onClick={deleteDatabase}/>
                </button>
                <h1 id="title" className='h1-fixer' onClick={localClickHelper2}>phreddit</h1>
            </div>
            <search className="search-bar">
                <form id="search-form" onSubmit={(e) => e.preventDefault()}>
                    <input ref={searchRef} type="search" id="search-bar" name="searchbar" placeholder="Search Phreddit..." onKeyDown={acceptSearchQuery}/>
                </form>
            </search>
            <div id="banner-button-container">
                <button id="new-post-button" className="clickables_group2" type="button" onClick={localClickHelper} style={{backgroundColor: props.allData.selectedItem === "new-post-button" ? "#FF5700" : "#E5EBEE"}}>
                    Create New Post
                </button>
                <button id="profile-button" className="clickables_group2" type="button" onClick={handleProfiles} style={{backgroundColor: props.allData.selectedItem === "profile-button" ? "#FF5700" : "#E5EBEE"}}>
                    Profile
                </button>
            </div>
        </div>
    );
};

export default Banner;