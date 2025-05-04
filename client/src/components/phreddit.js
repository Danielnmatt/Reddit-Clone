//get rid of temptemptemptemp at the end
//COME BACK TO ALERTS
//length restriction on account details ??
//notice : search for `BANANAS` for points to take note of
//Check wrong password/email error messages
import {useState, useEffect} from 'react';
import axios from 'axios';
import Banner from './banner.jsx'
import Main from './main.jsx'
import {sortBy} from '../functions.js';
import {useContext} from 'react';
import {UserContext} from '../userContext.jsx'

export default function Phreddit(props) {
    const {user} = useContext(UserContext);
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/")
        .then(async (res) => {
            setCommunities(res.data.communities);
            setLinkFlairs(res.data.linkFlairs);
            setPosts(sortBy('newest', res.data.posts));
            setComments(res.data.comments);
        })
        .catch((e) => {
            console.error(e);
        });
    }, []);

    const [communities, setCommunities] = useState([]);
    const [linkFlairs, setLinkFlairs] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [selectedItem, setSelectedItem] = useState("home-button");
    const [selectedSortButton, setSelectedSortButton] = useState("newest-button");
    const [searchTerms, setSearchTerms] = useState("");
    
    const [showHomePage, setShowHomePage] = useState(true);
    const [showSelectedPost, setShowSelectedPost] = useState(false);
    const [selectedPostData, setSelectedPostData] = useState(null);
    const [selectedCommentData, setSelectedCommentData] = useState(null);
    const [showCreateCommunity, setShowCreateCommunity] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showCreateComment, setShowCreateComment] = useState(false);
    
    let allVisibilityOff = () => {
        setShowHomePage(false);
        setShowSelectedPost(false);
        setShowCreateCommunity(false);
        setShowCreatePost(false);
        setShowCreateComment(false);
    };
    
    let openHomePage = () => {
        allVisibilityOff();
        setSearchTerms("");
        setShowHomePage(true);
    };

    let openSelectedPost = (post) => {
        allVisibilityOff();
        setSelectedPostData(post);
        setShowSelectedPost(true);
    };

    let openCreateCommunity = () => {
        allVisibilityOff();
        setShowCreateCommunity(true);
    };

    let openCreatePost = () => {
        allVisibilityOff();
        setShowCreatePost(true);
    };

    let openCreateComment = (comment) => {
        allVisibilityOff();
        setSelectedCommentData(comment);
        setShowCreateComment(true);
    };

    const updateCommunities = (communities) => {
        setCommunities(communities);
    }
    const updateLinkFlairs = (linkFlairs) => {
        setLinkFlairs(linkFlairs);
    }
    const updatePosts = (posts) => {
        setPosts(posts);
    }
    const updateComments = (comments) => {
        setComments(comments);
    }

    const allData = {communities, linkFlairs, posts, comments, selectedItem, selectedSortButton, searchTerms, user: user};
    const allUpdaters = {updateCommunities, updateLinkFlairs, updatePosts, updateComments, setSelectedSortButton, setSelectedItem, setSearchTerms /*setUser: props.user.setUser*/};
    const allOpeners = {openHomePage, openSelectedPost, openCreateCommunity, openCreatePost, openCreateComment};
    const allPageViews = {showHomePage, showSelectedPost, showCreateCommunity, showCreatePost, showCreateComment};

    return (
        <div>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Reddit+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet"/>
            
            <Banner 
                allOpeners={allOpeners}
                allData={allData}
                allUpdaters={allUpdaters}
            />

            <Main 
                allData={allData} 
                allUpdaters={allUpdaters}
                selectedPost={selectedPostData}
                selectedComment={selectedCommentData}
                allOpeners={allOpeners} 
                allPageViews={allPageViews}
            />
        </div>
    );
}