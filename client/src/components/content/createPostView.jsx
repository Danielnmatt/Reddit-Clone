import '../../stylesheets/CreatePostView.css'
import '../../stylesheets/App.css'
import {useEffect, useState} from 'react'
import {hyperLink} from '../../functions';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

//App.js->phreddit.js->main.jsx->content.jsx->createPostView.jsx
const CreatePostView = (props) => {
    const [community, setCommunity] = useState("");
    const [title, setTitle] = useState("");
    const [linkFlair, setLinkFlair] = useState("");
    const [customLinkFlair, setCustomLinkFlair] = useState("");
    const [body, setBody] = useState("");
    const [showCustomFlairField, setShowCustomFlairField] = useState(false);
    const [editingPostCommunity, setEditingPostCommunity] = useState(null);
    const navigate = useNavigate();
    const resetInputs = () => {
        setCommunity("");
        setTitle("");
        setLinkFlair("");
        setCustomLinkFlair("");
        setBody("");
    }

    useEffect(() => setShowCustomFlairField(false), [props.allData.selectedItem]);

    useEffect(() => {
        const someFunction = async () => {
            if(props.allData.selectedItem === 'edit-post-button' && props.editingPost){
                setTitle(props.editingPost.title);
                setBody(props.editingPost.content);
                setLinkFlair(props.editingPost.linkFlairID);
                const res2 = await axios.get(`http://127.0.0.1:8000/communities/posts/${props.editingPost.id}`);
                setEditingPostCommunity(res2?.data[0]?.name);
                const getOriginalCommunity = async () => {
                    const res = await axios.get(`http://127.0.0.1:8000/communities/posts/${props.editingPost.id}`);
                    setCommunity(res.data[0].url);
                }
                getOriginalCommunity();
            }
            if(props.allData.selectedItem === 'new-post-button'){
                resetInputs();
            }
        }
        someFunction();

}, [props.allData.selectedItem, props.editingPost])

    if(props.visibility === false){
        return null;
    }

    let happenedAlready = false;
    const handlePossibleBadAuthentication = e => {
        console.error(e);
        if((e.status === 401 || e.status === 403) && !happenedAlready){
            happenedAlready = true;
            alert("Your session is expired or invalidated. You will be redirected.");
            axios.get("http://127.0.0.1:8000/auth/logout").then(res => console.log("logout success")).catch(e => console.log("logout unsuccessful"));
            navigate("/")
        }
    }
    
    const lfChangeHelper = (e) => {
        setLinkFlair(e.target.value);
        e.target.value === "add-custom-flair" ? setShowCustomFlairField(true) : setShowCustomFlairField(false);
    }

    const createNewFlair = async (lfContent) => {
        if(lfContent === ''){
            return '';
        }
        const newLinkFlair = {content: lfContent}
        try{
            const res1 = await axios.post("http://127.0.0.1:8000/linkFlairs", newLinkFlair)
            const flairID = res1.data.url.replace('linkFlairs/', '');

            const res2 = await axios.get(`http://127.0.0.1:8000/linkFlairs/${flairID}`)
            props.allUpdaters.updateLinkFlairs([...props.allData.linkFlairs, res2.data[0]]);
            return res2.data[0];
        }
        catch(e){
            handlePossibleBadAuthentication(e);
        }
    }

    const submitPost = async (e) => {
        e.preventDefault();
        let alertMsg = "";
        
        if(!community){
            alertMsg += "*No Community Selected*\n";
        }
        if(!title){
            alertMsg += "*Title cannot be blank*\n";
        }
        if(!body){
            alertMsg += "*Body cannot be blank*\n";
        }
        if(alertMsg !== ""){
            alert(alertMsg)
        }
        
        let hyperlink = hyperLink(body, false);
        let validHyperLink = true;
        if(hyperlink.length > 1){
            validHyperLink = false;
            if(hyperlink[0].props){
                if((hyperlink[0].props.children !== "") && (hyperlink[0].props.href.startsWith("http://") || hyperlink[0].props.href.startsWith("https://"))){
                    validHyperLink = true;
                }
            }
            else{
                if((hyperlink[1].props.children !== "") && (hyperlink[1].props.href.startsWith("http://") || hyperlink[1].props.href.startsWith("https://"))){
                    validHyperLink = true;
                }
            }
        }
        
        
        let lfhelper = linkFlair;
        if(customLinkFlair.trim() !== '' && linkFlair === 'add-custom-flair'){
            if(props.allData.linkFlairs.some(existingLF => existingLF.content.toLowerCase().trim() === customLinkFlair.toLowerCase().trim())){
                props.allData.linkFlairs.forEach(lf => {
                    lfhelper = (lf.content.toLowerCase().trim() === customLinkFlair.toLowerCase().trim()) ? lf.url.replace("linkFlairs/", "") : lfhelper;
                })
            }
            else{
                lfhelper = await createNewFlair(customLinkFlair);
            }
        }
        
        if(alertMsg === "" && validHyperLink){
            let newPost = {
                title: title,
                content: `${body}`,
                linkFlairID: lfhelper,
                postedBy: props.allData.user.displayName,
                postedDate: new Date(),
                commentIDs: [],
                views: 0,
                votes: 0
            }
            
            if(customLinkFlair.trim() === "" && linkFlair === "add-custom-flair"){
                newPost.linkFlairID = "";
            }
            
            if(newPost.linkFlairID === ''){
                let {linkFlairID, ...newerPost} = newPost;
                newPost = newerPost;
            }
            
            //Save Post to DB
            try{
                if(props.allData.selectedItem === 'edit-post-button'){
                    if(editingPostCommunity.id !== community.replace("communities/", "")){
                        //editingPostCommunity is originalCommunity
                        const res1 = await axios.get(`http://127.0.0.1:8000/communities/posts/${props.editingPost.id}`);
                        const originalCommunity = res1.data[0];
                        const updatedCommunity = {...originalCommunity, postIDs: originalCommunity.postIDs.filter((postID) => postID !== props.editingPost.id)}
                        const res2 = await axios.put(`http://127.0.0.1:8000/communities/${originalCommunity.id}`, updatedCommunity)

                        const res3 = await axios.get(`http://127.0.0.1:8000/communities/${community.replace("communities/", "")}`)
                        const newCommunity = res3.data[0];

                        const updatedNewCommunity = {...newCommunity, postIDs: [...newCommunity.postIDs, props.editingPost.id]}
                        await axios.put(`http://127.0.0.1:8000/communities/${community.replace("communities/", "")}`, updatedNewCommunity)
                        await axios.put(`http://127.0.0.1:8000/posts/${props.editingPost.id}`, {title: title, content: `${body}`, linkFlairID: lfhelper})

                        resetInputs();
                        props.allUpdaters.setSearchTerms("");
                        props.allUpdaters.setSelectedSortButton("newest-button");
                        props.allUpdaters.setSelectedItem("home-button");
                        props.allOpeners.openHomePage();
                    }
                }
                else{
                    const res1 = await axios.post("http://127.0.0.1:8000/posts", newPost);
                    const post = res1.data;
                    const postID = post.url.replace('posts/', '');
    
                    const res2 = await axios.get(`http://127.0.0.1:8000/communities/${community.replace("communities/", "")}`);
                    const postCommunity = res2.data[0];
    
                    await axios.put(`http://127.0.0.1:8000/communities/${community.replace("communities/", "")}`, {postIDs: [...postCommunity.postIDs, postID]});
    
                    const res4 = await axios.get("http://127.0.0.1:8000/communities/");
                    props.allUpdaters.updateCommunities(res4.data);
                    props.allUpdaters.updatePosts([...props.allData.posts, post]);
    
                    resetInputs();
                    props.allUpdaters.setSearchTerms("");
                    props.allUpdaters.setSelectedSortButton("newest-button");
                    props.allUpdaters.setSelectedItem("home-button");
                    props.allOpeners.openHomePage();
                }
            }
            catch (e) {
                handlePossibleBadAuthentication(e);
            }
        }
    }

    let joinedComms = [];
    let otherComms = [];
    props.allData.communities.forEach(community => community.members.includes(props.allData.user.displayName) ? joinedComms.push(community) : otherComms.push(community));
    const allCommunities = joinedComms.concat(otherComms);

    return (
        <div id="create-post-view">
            <h1 id="create-post-view-text" className='h1-fixer'>{props.allData.selectedItem == 'edit-post-button' ? `Editing '${props.editingPost.title}'` : "Create Post"}</h1>
            <form htmlFor="create-post-form" id="create-post-form">
                <div id="create-post-input-div">
                    <div id="select-community-container">
                        <select onChange={(e) => setCommunity(e.target.value)} name="select-community" id="select-community" value={props.allData.selectedItem === 'edit-post-button' ? community : (community || "DEFAULT")} required>
                            <option value="DEFAULT" disabled={props.allData.selectedItem === 'edit-post-button' ? false : true} style={{display: "none"}}>{"Select a Community (required)"}</option>
                            {allCommunities.map((community) => {
                                return <option key={community.url} value={community.url.replace('community/', '')}>{community.name}</option>
                            })}
                        </select>
                    </div>
                    <div id="post-title-container">
                        <label htmlFor="post-title-input" id="post-title-text" name="post-title">Post Title (required, max 100 characters):&nbsp;<span className="red-stars">*</span></label>
                        <input onChange={(e) => setTitle(e.target.value)} type="text" id="post-title-input" className="post-input-field" name="post-title" placeholder="Title..." maxLength="100" required value={title}></input>
                    </div>
                    <div id="add-flair-container">
                        <label htmlFor="add-flair" id="add-flair-text" name="add-flair-text">Add a Flair:</label>
                        <select onChange={(e) => lfChangeHelper(e)} name="add-flair" id="add-flair" value={props.allData.selectedItem === 'edit-post-button' ? linkFlair : ""}>
                            {props.allData.linkFlairs.map((linkFlair) => {
                                return <option key={linkFlair.url} value={linkFlair.url.replace('linkFlairs/', '')}>{linkFlair.content}</option>
                            })}
                            <option value="add-custom-flair" className="allOptions">Add my own flair</option>
                            <option value="" className="allOptions">No Flair</option>
                        </select>
                        <input onChange={(e) => setCustomLinkFlair(e.target.value)} type="text" id="add-custom-flair-field" className="post-input-field" name="add-custom-flair-field" placeholder="Custom Flair..." maxLength="30" style={(showCustomFlairField === true) ? {display: 'flex'} : {display: 'none'}}></input>
                    </div>
                    <div id="post-body-container">
                        <label htmlFor="post-body-input" id="post-body-text" name="post-body">Body (required):&nbsp;<span className="red-stars">*</span></label>
                        <textarea onChange={(e) => setBody(e.target.value)} className="post-input-field" type="text" id="post-body-input" name="post-body" placeholder="Content..." required value={body}></textarea>
                    </div>
                    <button onClick={submitPost} id="submit-post-button" type="submit">{props.allData.selectedItem === 'edit-post-button' ? "Confirm Edit" : "Submit Post"}</button>
                </div>
            </form>

        </div>
    );
};

export default CreatePostView;