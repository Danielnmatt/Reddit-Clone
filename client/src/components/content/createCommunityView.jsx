import '../../stylesheets/CreateCommunityView.css'
import '../../stylesheets/App.css'
import {useState, useEffect} from 'react'
import {hyperLink} from '../../functions';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
axios.defaults.withCredentials = true;

//App.js->phreddit.js->main.jsx->content.jsx->createCommunityView.jsx
const CreateCommunityView = (props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const isLoggedIn = props.allData?.user?.displayName !== "guest" && props.allData?.user?.email !== null;
    const navigate = useNavigate();

    const resetInputs = () => {
        setName("");
        setDescription("");
    }

    useEffect(() => {
        if(props.allData.selectedItem === 'edit-community-button' && props.editingCommunity){
            setName(props.editingCommunity.name);
            setDescription(props.editingCommunity.description);
        }
        if(props.allData.selectedItem === 'create-communities-button'){
            resetInputs();
        }
    }, [props.allData.selectedItem, props.editingCommunity])

    if(props.visibility === false){
        return null;
    }


    let happenedAlready = false;
    const handlePossibleBadAuthentication = e => {
        console.error(e);
        if((e.status === 401 || e.status === 403) && !happenedAlready && isLoggedIn){
            happenedAlready = true;
            alert("Your session is expired or invalidated. You will be redirected.");
            axios.get("http://127.0.0.1:8000/auth/logout").then(() => console.log("logout success")).catch(() => console.log("logout unsuccessful"));
            navigate("/")
        }
    }

    const engenderCommunity = async (e) => {
        e.preventDefault();
        let alertMsg = "";

        if(!name){
            alertMsg += "*Name cannot be blank*\n";
        }

        const res = await axios.get("http://127.0.0.1:8000/communities");
        const allCommunities = res.data;
        
        if(props.allData.selectedItem === 'edit-community-button'){
            allCommunities.forEach((comm) => {
                (comm.name.toLowerCase().trim() === name.toLowerCase().trim() && name !== props.editingCommunity.name) ? alertMsg += "*Community already exists*" : alertMsg += ""
            });
        }
        else{
            (allCommunities).forEach((comm) => {(comm.name.toLowerCase().trim() === name.toLowerCase().trim()) ? alertMsg += "*Community already exists*" : alertMsg += ""});
        }
        if(!description){
            alertMsg += "*Description cannot be blank*\n";
        }

        if(alertMsg !== ""){
            alert(alertMsg)
        }
        
        let hyperlink = hyperLink(description, false);
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

        if(alertMsg === "" && validHyperLink){
            const newCommunity =
            {
                name: `${name}`,
                description: `${description}`,
                postIDs: [],
                startDate: new Date(),
                members: [props.allData.user.displayName],
                creator: props.allData.user.displayName
            }
            resetInputs();
            if(props.allData.selectedItem === 'edit-community-button'){
                const updatedCommunity = {name: `${name}`, description: `${description}`}
                await axios.put(`http://127.0.0.1:8000/communities/${props.editingCommunity.id}`, updatedCommunity)
                const res1 = await axios.get(`http://127.0.0.1:8000/communities/${props.editingCommunity.id}`)
                const res2 = await axios.get("http://127.0.0.1:8000/communities")
                props.allUpdaters.updateCommunities(res2.data)
                props.allUpdaters.setSelectedItem(res1.data[0].url);
            }
            else{
                try{
                    await axios.post("http://127.0.0.1:8000/communities", newCommunity)
                    const res1 = await axios.get("http://127.0.0.1:8000/communities")
                    props.allUpdaters.updateCommunities(res1.data)
                    props.allUpdaters.setSelectedItem(res1.data[res1.data.length - 1].url);
                }
                catch(e){
                    handlePossibleBadAuthentication(e)
                }
            }
            
            props.allOpeners.openHomePage();
        }
    }

    const handleDeleteCommunity = async (e) => {
        e.preventDefault();

        let resp = window.confirm("Are you sure you want to delete this community? This involves deleting all posts and comments associated with the community.");
        if(!resp){
            return;
        }

        const res0 = await axios.get(`http://127.0.0.1:8000/${props.editingCommunity.url}`);
        const associatedPostIDs = res0.data[0].postIDs;
        
        const associatedPosts = [];
        for(const postID of associatedPostIDs){
            let res0_5 = await axios.get(`http://127.0.0.1:8000/posts/${postID}`);
            associatedPosts.push(res0_5.data[0]);
        }

        const res1 = await axios.get("http://127.0.0.1:8000/comments");
        const allComments = res1.data;

        for(const post of associatedPosts){
            let postComments = [];
            let commentIDs = post.commentIDs;
            
            if(commentIDs && commentIDs.length > 0){
                let somethingWasAdded;
                do {
                    somethingWasAdded = false;
                    for(let c = 0; c < allComments.length; c++){
                        const comment = allComments[c];
                        const newCommentID = comment.url.replace("comments/", "");
                        if((!postComments.includes(comment)) && (commentIDs.includes(newCommentID))){
                            postComments.push(comment);
                            somethingWasAdded = true;
                        }
                        else if((!postComments.includes(comment)) && (postComments.some(parentComment => parentComment.commentIDs.includes(newCommentID)))){
                            postComments.push(comment);
                            somethingWasAdded = true;
                        }
                    }
                } while (somethingWasAdded);
        
                //deleting all comments associated with this post
                for(const comment of postComments){
                    await axios.delete(`http://127.0.0.1:8000/${comment.url}`);
                }
            }
            //delete post itself
            await axios.delete(`http://127.0.0.1:8000/${post.url}`);
        }

        //deleting community
        await axios.delete(`http://127.0.0.1:8000/${res0.data[0].url}`);

        //updates
        const res3 = await axios.get("http://127.0.0.1:8000/comments");
        props.allUpdaters.updateComments(res3.data);
        const res4 = await axios.get("http://127.0.0.1:8000/posts");
        props.allUpdaters.updatePosts(res4.data);
        const res5 = await axios.get("http://127.0.0.1:8000/communities");
        props.allUpdaters.updateCommunities(res5.data)

        resetInputs();
        props.allUpdaters.setSearchTerms("");
        props.allUpdaters.setSelectedSortButton("newest-button");
        props.allUpdaters.setSelectedItem("home-button");
        props.allOpeners.openHomePage();
    }

    return(
        <div id="create-community-view">
            <h1 id="create-community-view-title" className='h1-fixer'>{props.allData.selectedItem === "edit-community-button" ? `Editing '${props.editingCommunity.name}'` : "Create a New Community"}</h1>
            <form htmlFor="create-community-name" id="create-community-form">
                <div id="create-community-input-div">
                    <div className="community-input-container" id="community-name-container">
                        <label className="community-label" htmlFor="community-name">Community Name (required, max 100 characters):&nbsp;<span className="red-stars">*</span></label>
                        <input onChange={(e) => setName(e.target.value)} className="community-input-field" type="text" id="community-name" name="community-name" maxLength="100" placeholder="Community Name..." value={name} required />
                    </div>
                    <div className="community-input-container" id="community-description-container">
                        <label className="community-label" htmlFor="community-description">Community Description (required, max 500 characters):&nbsp;<span className="red-stars">*</span></label>
                        <textarea onChange={(e) => setDescription(e.target.value)} className="community-input-field" type="text" id="community-description" name="community-description" maxLength="500" placeholder="Description..." value={description} required></textarea>
                    </div>
                    <div style={{display: "flex", flexDirection: 'row'}}>
                        <button className="handle-community-button" type="submit" onClick={engenderCommunity}>{props.allData.selectedItem === 'edit-community-button' ? "Confirm Edit" : "Engender Community"}</button>
                        <button className="handle-community-button" onClick={(e) => handleDeleteCommunity(e)} style={{display: props.allData.selectedItem === 'edit-community-button' ? 'inline' : 'none'}}>Delete Community</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateCommunityView;